'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NewClient from "./newClient";
import backendUrl from "@/helpers/backend_url";

interface Client {
  id: string;
  name: string;
  address: string;
  email: string;
}

const ClientTable = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserID(storedUserId);

    if (!storedUserId) {
      router.push("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      try {
        const response = await fetch(`${backendUrl}client/${userID}/userId`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data: Client[] = await response.json();
        setClients(data);
      } catch (err: any) {
        setError(err.message);
        router.push("/auth/login");
        localStorage.clear
      } finally {
        setLoading(false);
      }
    };

    if (userID) {
      fetchClients(); 
    }
  }, [userID, router]);


  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <> {loading? <div className="skeleton h-16 w-full"></div> :
    <div className="collapse bg-base-200">
       <input type="checkbox" className="z-10"/>
      <div className="collapse-title text-xl font-medium">MY CLIENTS</div>
      <div className="collapse-content">
        <div className="overflow-x-auto">
          {!clients.length ? 
          <div className="text-center">
            <p className="text-sm text-slate-500">No clients found. Start adding your first client now!</p>
            <button className="btn btn-circle btn-outline w-auto mt-2 px-4 z-50"
                onClick={() => setIsModalOpen(true)}> Add New Client</button>
          </div> :
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name / Company Name</th>
                <th>Address</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              
              {clients.map((client, index) => (
                <tr key={client.id}>
                  <th>{index + 1}</th>
                  <td>{client.name}</td>
                  <td>{client.address}</td>
                  <td>{client.email}</td>
                </tr>
              ))}
              <tr>
                <th></th>
                <td></td>
                <td></td>
                <td className="btn btn-circle btn-outline w-auto mt-2"
                onClick={() => setIsModalOpen(true)}>
                  Add new Client
                </td>
              </tr>
            </tbody>
          </table> }
        </div>
      </div>
    </div> }

    {isModalOpen && (
        <NewClient onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default ClientTable;
