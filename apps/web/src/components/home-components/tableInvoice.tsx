'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InvoiceDetail from "./invoiceDetail";
import { Iinvoice } from "@/type/type";

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState<Iinvoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Iinvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

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
        setLoading(true);
        const response = await fetch(`${backendUrl}invoice/${userID}/userId?page=${currentPage}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setInvoices(data.invoices);
        setTotalPages(data.totalPages);
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
  }, [userID, backendUrl, currentPage, router]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleNextPage = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <>
   
        <div className="collapse collapse-open bg-slate-300 shadow-md shadow-emerald-900 min-h-[50vh]">
          <div className="collapse-title text-xl font-bold text-center">MY INVOICES</div>
          {invoices.length > 0 ? 
          <div className="collapse-content flex flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Client Name</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Total Items</th>
                    <th>Total Price (idr)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, index) => {
                    const totalItems = invoice.invoiceItems.reduce((sum, item) => sum + item.quantity, 0);
                    const totalPrice = invoice.invoiceItems.reduce((sum, item) => sum + item.price, 0);
                    return (
                      <tr
                        key={invoice.id}
                        className="hover:bg-slate-100 cursor-pointer"
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setIsModalOpen(true);
                        }}
                      >
                        <th className="border-b border-slate-700">{index + 1 + (currentPage - 1) * invoices.length}</th>
                        <td className="border-b border-slate-700">{invoice.client.name || "N/A"}</td>
                        <td className="border-b border-slate-700">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                        <td className="border-b border-slate-700">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                        <td className="border-b border-slate-700">{invoice.status}</td>
                        <td className="border-b border-slate-700">{totalItems}</td>
                        <td className="border-b border-slate-700">{totalPrice.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {invoices.length &&
              <div className="join w-full flex justify-center">
                  <button 
                    className="join-item btn border-none" 
                    onClick={() => handleNextPage(currentPage - 1)}
                    disabled={currentPage === 1}>
                      «
                  </button>            
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`join-item btn border-none h-full ${currentPage === index + 1 && 'bg-slate-400 rounded'}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  <button className="join-item btn border-none"
                    onClick={() => handleNextPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >»
                  </button>
              </div>
            }
          </div> : <div className="text-center flex flex-col justify-center text-gray-500">No invoice to display</div>
            }
            
        </div>
    
      {isModalOpen && (
        <InvoiceDetail invoice={selectedInvoice} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default InvoiceTable;
