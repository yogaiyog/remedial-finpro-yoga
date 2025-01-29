'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NewClient from "./newClient";
import backendUrl from "@/helpers/backend_url";
import { ITableClient } from "@/type/type";
import {faFileInvoice, faHammer, faUser, faUserPlus} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DetailClient from "./detailClient";

const ClientTable = () => {
  const [clients, setClients] = useState<ITableClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDetailClient , setModalDetaliClient] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const [selectedClient, setSelectedClient] = useState<ITableClient>()
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserID(storedUserId);

    if (!storedUserId) {
      router.push("/auth/login");
    }
  }, [router]);

  const fetchClients = async (page: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}client/${userID}/userId?page=${page}&limit=10`, {
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
      setClients(data.clients);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message);
      router.push("/auth/login");
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userID) {
      fetchClients(currentPage);
    }
  }, [userID, currentPage, router]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleNextPage = (page: number) => {
    setCurrentPage(page)
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {loading ? (
        <div className="skeleton h-16 w-full"></div>
      ) : (
        <div className="collapse-open collapse bg-slate-300 shadow-md shadow-emerald-900 h-full">
          <div className="collapse-title  text-xl font-medium flex justify-between items-baseline">
            <h1 className="font-bold">CLIENTS</h1>
            <button className="btn border-emerald-500 hover:bg-emerald-700 w-auto mt-2 text-emerald-700 hover:text-white"
                onClick={() => setIsModalOpen(true)}>
                  <FontAwesomeIcon icon={faUserPlus} />
              </button> 
          </div>
          <div className="collapse-content flex flex-col justify-between">
            <div className="overflow-x-auto w-full">
              {!clients.length ? (
                <div className="text-center">
                  <p className="text-sm text-slate-500">
                    No clients found. Start adding your first client!
                  </p>
                </div>
              ) : (
                <>
                  <table className="table">
                    <tbody>
                    {clients.map((client, index) => (
                      <tr
                        key={client.id}
                        className="text-sm cursor-pointer hover:bg-slate-200"
                        onClick={() => {
                          setSelectedClient(client);
                          setModalDetaliClient(true);
                        }}
                      >
                        <td className="flex gap-2 items-center">
                          <FontAwesomeIcon icon={faUser} />
                          {client.name}
                        </td>
                        <td>
                          <FontAwesomeIcon icon={faFileInvoice} />
                          <span className="mx-2"></span>
                          {client._count.invoices}
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>    
                </>
              )}
            </div>
            {clients.length &&
            <div className="join w-full flex justify-center ">
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
          </div>
        </div>
      )}
      {modalDetailClient && (
        <DetailClient
          onClose={() => setModalDetaliClient(false)}
          client={selectedClient}
        />
      )}
      {isModalOpen && <NewClient onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default ClientTable;
