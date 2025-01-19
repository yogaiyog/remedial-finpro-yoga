'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Invoice, InvoiceDetailProps, InvoiceItem, Product } from "@/type/type";
import { toast } from "react-toastify";
import ConfirmationModal from "../confirmation";
import InvoiceItemsForm from "./formInvoiceItem";
import InvoiceStatusUpdate from "./invoiceStatusUpdate";

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoice, onClose }) => {
  const [productMap, setProductMap] = useState<{ [key: string]: string }>({});
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [formItemsModalOpen, setFormItemsModalOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [statusUpdateModal, setStatusUpdateModal] = useState<boolean>(false);

  useEffect(() => {
    if (!invoice) return;

    setInvoiceItems(invoice.invoiceItems); // Set initial invoice items

    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.error("Token or userId is missing.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/api/product/${userId}/userId`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const products = response.data as Product[];
        const productMap = products.reduce((map, product) => {
          map[product.id] = product.name;
          return map;
        }, {} as { [key: string]: string });

        setProductMap(productMap);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [invoice]);

  const handleDelete = async () => {
    if (!selectedItemId) return;

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token is missing.");
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/invoice-items/${selectedItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInvoiceItems((prevItems) => prevItems.filter((item) => item.id !== selectedItemId));
      toast.success(`Item deleted successfully.`);
      setSelectedItemId(null);
      setConfirmationModalOpen(false);
    } catch (error) {
      console.error("Failed to delete item", error);
      toast.error("Failed to delete item.");
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
  const totalPrice = invoiceItems.reduce((sum, item) => sum + item.price , 0);

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-5xl">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✖
        </button>
        <div className="flex justify-between">
            <h3 className="text-xl font-bold mb-4">Invoice Details</h3>
            <div className="flex gap-2 mr-4">
                <strong>Invoice ID:</strong> <p>{invoice.id}</p>
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
                <th>Due Date:</th> <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <th>Status:</th>
                <td>{invoice.status} <button className="text-blue-500 hover:underline ml-4" onClick={openStatusUpdateModal}>Edit</button></td>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems.map((item) => (
                <tr key={item.id}>
                  <td>{productMap[item.productId] || "Loading..."}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toFixed(2)}</td>
                  <td>
                    <button className="text-red-500 hover:underline" onClick={() => openConfirmationModal(item.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td></td><td></td><td></td>
                <td><button className="text-blue-500" onClick={() => openFormItemsModal(invoice.id)}>+ Add Item</button></td>
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
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <ConfirmationModal
        isOpen={confirmationModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setConfirmationModalOpen(false)}
      />
      {formItemsModalOpen && <InvoiceItemsForm invoiceId={invoiceId} isOpen={true} onClose={() => setFormItemsModalOpen(false)} />}
      {statusUpdateModal && <InvoiceStatusUpdate invoice={invoice} onClose={() => setStatusUpdateModal(false)} />}
    </div>
  );
};

export default InvoiceDetail;
