// DetailClient.tsx
'use client';

import React, { useState } from 'react';
import { ITableClient } from '@/type/type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../confirmation';
import { toast } from 'react-toastify';
import backendUrl from '@/helpers/backend_url';

interface DetailClientProps {
  client: ITableClient | undefined;
  onClose: () => void;
}

const DetailClient: React.FC<DetailClientProps> = ({ client, onClose }) => {

  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  if (!client) return null; // ✅ Pindahkan sebelum hooks

  const handleDelete = async () => {
    try {
      const response = await fetch(`${backendUrl}client/${client.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete client');
      }

      toast.success('Client deleted successfully');
      setConfirmationModalOpen(false);
      onClose();
    } catch (error) {
      toast.error('Error deleting client');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 min-w-[50vw]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Client Details</h2>
          <button
            className="text-red-500 font-bold hover:text-red-700"
            onClick={() => setConfirmationModalOpen(true)}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
        <div className='flex flex-col justify-between my-4'>
            <div>
                <div className='flex gap-4 '>
                <div>
                    <p className="text-sm font-semibold">Name:</p>
                    <p>{client.name}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold">Invoices:</p>
                    <p>{client._count?.invoices ?? 0}</p> 
                </div>
                </div>
                <div className='flex gap-4 justify-between mt-4'>
                <div>
                    <p className="text-sm font-semibold">Email:</p>
                    <p>{client.email}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold">Address:</p>
                    <p>{client.address}</p>
                </div>
                </div>
            </div>
            <button className="btn bg-gray-500 w-full mt-4" onClick={onClose}>
                Close
            </button>
        </div>
      </div>
      <ConfirmationModal
        isOpen={confirmationModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setConfirmationModalOpen(false)}
        title='Confirm Deletion'
        desc="Are you sure you want to delete this item?"
      />
    </div>
  );
};

export default DetailClient;
