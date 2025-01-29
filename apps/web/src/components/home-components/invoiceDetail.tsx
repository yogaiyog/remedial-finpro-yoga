'use client';

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Invoice, InvoiceDetailProps, InvoiceItem, Product } from '@/type/type';
import { toast } from 'react-toastify';
import ConfirmationModal from '../confirmation';
import html2pdf from 'html2pdf.js';
import InvoiceItemsForm from './formInvoiceItem';
import InvoiceStatusUpdate from './invoiceStatusUpdate';
import SendInvoiceButton from './sendInvoice';
import backendUrl from '@/helpers/backend_url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPencil } from '@fortawesome/free-solid-svg-icons';

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoice, onClose }) => {
  const [productMap, setProductMap] = useState<{ [key: string]: string }>({});
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [formItemsModalOpen, setFormItemsModalOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [statusUpdateModal, setStatusUpdateModal] = useState<boolean>(false);
  const slideref = useRef<HTMLDivElement | null>(null);

  async function handlePdf() {
    if (!slideref.current) {
      console.error('Slide reference not found.');
      return;
    }
    if (!invoice) return;

    const options = {
      margin: 0.5,
      filename: `invoice-${invoice.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf()
      .set(options)
      .from(slideref.current)
      .save()
      .catch((error: any) => {
        console.error('Error generating PDF:', error);
        toast.error('Failed to generate PDF.');
      });
  }

  useEffect(() => {
    if (!invoice) return;

    setInvoiceItems(invoice.invoiceItems); // Set initial invoice items

    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        console.error('Token or userId is missing.');
        return;
      }

      try {
        const response = await axios.get(
          `${backendUrl}product/${userId}/userId`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const products = response.data.products as Product[];
        const productMap = products.reduce(
          (map, product) => {
            map[product.id] = product.name;
            return map;
          },
          {} as { [key: string]: string },
        );

        setProductMap(productMap);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [invoice]);

  const handleDelete = async () => {
    if (!selectedItemId) return;

    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token is missing.');
      return;
    }

    try {
      await axios.delete(`${backendUrl}invoice-items/${selectedItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInvoiceItems((prevItems) =>
        prevItems.filter((item) => item.id !== selectedItemId),
      );
      toast.success(`Item deleted successfully.`);
      setSelectedItemId(null);
      setConfirmationModalOpen(false);
    } catch (error) {
      console.error('Failed to delete item', error);
      toast.error('Failed to delete item.');
    }
  };

  const openConfirmationModal = (itemId: string) => {
    setSelectedItemId(itemId);
    setConfirmationModalOpen(true);
  };

  const openFormItemsModal = (invoiceId: string) => {
    setInvoiceId(invoiceId);
    setFormItemsModalOpen(true);
  };

  const openStatusUpdateModal = () => {
    setStatusUpdateModal(true);
  };

  if (!invoice) return null;

  const totalItems = invoiceItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = invoiceItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="modal modal-open">
      <div ref={slideref} className="modal-box w-11/12 max-w-5xl bg-white">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✖
        </button>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold mb-4">Invoice</h3>
          <div className="flex gap-2 mr-4 items-center">
            <strong className="text-xs">Invoice ID:</strong>{' '}
            <p className="text-xs">{invoice.id}</p>
            <button
              className="ml-4"
              onClick={handlePdf}
              data-html2canvas-ignore
            >
              <FontAwesomeIcon icon={faDownload} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-compact w-full">
            <tbody>
              <tr>
                <th>Client Name:</th> <td>{invoice.client.name}</td>
              </tr>
              <tr>
                <th>Client Address:</th> <td>{invoice.client.address}</td>
              </tr>
              <tr>
                <th>Email:</th> <td>{invoice.client.email}</td>
              </tr>
              <tr>
                <th>Due Date:</th>{' '}
                <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <th>Status:</th>
                <td
                  className={`font-bold ${invoice.status === 'PENDING' ? 'text-yellow-500' : invoice.status === 'PAID' ? 'text-green-500' : 'text-red-500'}`}
                >
                  {invoice.status}{' '}
                  <button
                    className="text-blue-500 hover:underline ml-4 font-medium"
                    onClick={openStatusUpdateModal}
                    data-html2canvas-ignore
                  >
                    Edit <FontAwesomeIcon icon={faPencil} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <hr className="my-4" />
        <h4 className="text-lg font-semibold mb-2">Items</h4>
        <div className="overflow-x-auto">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price (IDR)</th>
                <th data-html2canvas-ignore>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems.map((item) => (
                <tr key={item.id}>
                  <td>{productMap[item.productId] || 'Loading...'}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toFixed(2)}</td>
                  <td data-html2canvas-ignore>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => openConfirmationModal(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              <tr data-html2canvas-ignore>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <button
                    className="text-blue-500"
                    onClick={() => openFormItemsModal(invoice.id)}
                  >
                    + Add Item
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <hr className="my-4" />
        <div className="text-right mr-16">
          <p>
            <strong>Total Items:</strong> {totalItems}
          </p>
          <p className="pt-2">
            <strong>Total Price:</strong> IDR {totalPrice.toFixed(2)}
          </p>
        </div>
        <div className="flex justify-between pr-16 mt-4">
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            data-html2canvas-ignore
            onClick={onClose}
          >
            Close
          </button>

          <div data-html2canvas-ignore>
            <SendInvoiceButton
              clientEmail={invoice.client.email}
              InvoiceId={invoice.id}
            />
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={confirmationModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setConfirmationModalOpen(false)}
        title="Confirm Deletion"
        desc="Are you sure you want to delete this item?"
      />
      {formItemsModalOpen && (
        <InvoiceItemsForm
          invoiceId={invoiceId}
          isOpen={true}
          onClose={() => setFormItemsModalOpen(false)}
        />
      )}
      {statusUpdateModal && (
        <InvoiceStatusUpdate
          invoice={invoice}
          onClose={() => setStatusUpdateModal(false)}
        />
      )}
    </div>
  );
};

export default InvoiceDetail;
