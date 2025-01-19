import { Invoice, InvoiceStatus } from '@/type/type';  // Pastikan enum InvoiceStatus diimpor
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const InvoiceStatusUpdate: React.FC<{ invoice: Invoice, onClose: () => void }> = ({ invoice, onClose }) => {
  const [status, setStatus] = useState<InvoiceStatus>(invoice.status as InvoiceStatus);  // Tipe status sesuai dengan enum InvoiceStatus

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('Token not found');
      return;
    }

    const updatedInvoice = {
      ...invoice,
      status: newStatus,  
    };
    
    const url = `http://localhost:8000/api/invoice/${invoice.id}`;
    const data = {
      ...updatedInvoice,
      dueDate: updatedInvoice.dueDate,
      recurringSchedule: updatedInvoice.recurringSchedule,
      recurringEndDate: updatedInvoice.recurringEndDate,
    };
    
    try {
      const response = await axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
          onClose();  // Close modal
            toast.success("Invoice status updated successfully!", {
            onClose: () => {location.reload()}});
      } else {
        console.log('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-xl font-bold">Update Invoice Status</h3>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as InvoiceStatus)} 
          className="w-full my-6 p-2 border rounded"
        >
          {Object.values(InvoiceStatus).map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption.charAt(0).toUpperCase() + statusOption.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button className="btn bg-slate-500 text-white" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary text-white" onClick={() => handleStatusChange(status)}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceStatusUpdate;
