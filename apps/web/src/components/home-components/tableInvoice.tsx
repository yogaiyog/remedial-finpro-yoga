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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <>
      {invoices.length > 0 && (
        <div className="collapse collapse-open bg-slate-300 shadow-md shadow-emerald-900 min-h-[50vh]">
          <div className="collapse-title text-xl font-bold">MY INVOICES</div>
          <div className="collapse-content">
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
                        className="hover:bg-slate-800 cursor-pointer"
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
            <div className="join w-full flex justify-center">
              <button 
                className="join-item btn" 
                onClick={handlePrevPage}
                disabled={currentPage === 1}>
                  «
              </button>
              <button className="join-item btn bg-transparent border-none"> Page {currentPage} of {totalPages}</button>
              <button className="join-item btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >»
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <InvoiceDetail invoice={selectedInvoice} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default InvoiceTable;
