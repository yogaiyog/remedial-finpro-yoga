'use client'

import { useState } from "react"
import ConfirmationModal from "../confirmation"
import axios from "axios"
import { toast } from "react-toastify"
import backendUrl from "@/helpers/backend_url"

const SendInvoiceButton = ({ InvoiceId, clientEmail }: { InvoiceId: string, clientEmail: string }) => {
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)

    async function handleConfirm() {
        const token = localStorage.getItem("token");
        axios.post(
            `${backendUrl}mail/invoice/${InvoiceId}?email=${encodeURIComponent(clientEmail)}`, // Menambahkan query parameter email
            {}, // Body kosong karena kita hanya perlu mengirim data melalui URL
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        .then((response) => {
            toast.success(response.data.message || "Invoice sent successfully!", {
                onClose: () => {
                  location.reload(); //
                },
              });
        })
        .catch((error) => {
            console.error("Error sending invoice:", error);
            toast.error("Failed to send the invoice.");
        });
    }

    return (
        <>
            <button className="btn btn-primary" onClick={() => setConfirmationModalOpen(true)}>
                Send to Client
            </button>
            <ConfirmationModal
                isOpen={confirmationModalOpen}
                onConfirm={handleConfirm}
                onCancel={() => setConfirmationModalOpen(false)}
                title="Confirm Send Email"
                desc="Are you sure want to send this Invoice to Client Email?"
            />
        </>
    )
}

export default SendInvoiceButton
