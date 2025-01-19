'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InvoiceDetail from "./invoiceDetail";

interface InvoiceItem {
  id: string;
  invoiceId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

interface Client {
  id: string;
  name: string;
  address: string;
  contactInfo: string;
  createdAt: string;
  updatedAt: string;
}

interface Invoice {
  id: string;
  userId: string;
  clientId: string;
  dueDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  client: Client;
  invoiceItems: InvoiceItem[];
}

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null); // Mengganti `SelectedTnvoice`
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/";

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserID(storedUserId);

    if (!storedUserId) {
      router.push("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchInvoices = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      try {
        const response = await fetch(`${backendUrl}invoice/${userID}/userId`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data: Invoice[] = await response.json();
        setInvoices(data);
      } catch (err: any) {
        setError(err.message);
        localStorage.clear();
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    if (userID) {
      fetchInvoices();
    }
  }, [userID, backendUrl, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="collapse bg-base-200">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">MY INVOICES</div>
        <div className="collapse-content">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client Name</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Total Items</th>
                  <th>Total Price (idr)</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => {
                  const totalItems = invoice.invoiceItems.reduce((sum, item) => sum + item.quantity, 0);
                  const totalPrice = invoice.invoiceItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                  return (
                    <tr
                      key={invoice.id}
                      className="hover:bg-slate-800 cursor-pointer"
                      onClick={() => {
                        setSelectedInvoice(invoice)
                        setIsModalOpen(true)
                      }} 
                    >
                      <th>{index + 1}</th>
                      <td>{invoice.client.name}</td>
                      <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                      <td>{invoice.status}</td>
                      <td>{totalItems}</td>
                      <td>{totalPrice.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <InvoiceDetail invoice={selectedInvoice} onClose={()=>{setIsModalOpen(false)}} />
      )}
    </>
  );
};



export default InvoiceTable;
