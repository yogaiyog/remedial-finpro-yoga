'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NewClient from "./newClient";

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
        const response = await fetch(`http://localhost:8000/api/client/${userID}/userId`, {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
    <div className="collapse bg-base-200">
       <input type="checkbox" className="z-10"/>
      <div className="collapse-title text-xl font-medium">MY CLIENTS</div>
      <div className="collapse-content">
        <div className="overflow-x-auto">
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
          </table>
        </div>
      </div>
    </div>

    {isModalOpen && (
        <NewClient onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default ClientTable;
