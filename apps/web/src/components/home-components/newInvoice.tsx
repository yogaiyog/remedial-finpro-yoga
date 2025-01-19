'use client'
import { useState } from "react";
import FormInvoice from "./formInvoice";
import InvoiceItemsForm from "./formInvoiceItem";

const NewInvoiceButton = () => {
  const [isRecurring, setIsRecurring] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceItemModalOpen, setIsInvoiceItemOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string>("");

  return (
    <div className="fixed bottom-20 left-20">
      <div className="dropdown dropdown-hover">
        <div tabIndex={0} role="button" className="btn m-1 text-xl">
          Create Invoice
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu menu-horizontal bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <button
              onClick={() => {
                setIsRecurring(false);
                setIsModalOpen(true);
              }}
            >
              One-Time Invoice
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setIsRecurring(true);
                setIsModalOpen(true);
              }}
            >
              Recurring Invoice
            </button>
          </li>
        </ul>
      </div>

      {/* Modal for Creating Invoice */}
      {isModalOpen && (
        <FormInvoice
          isRecurring={isRecurring}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(newInvoiceId) => {
            setInvoiceId(newInvoiceId); // Set invoiceId with the newly created ID
            setIsInvoiceItemOpen(true); // Open Invoice Item Modal
            setIsModalOpen(false); // Close FormInvoice modal
          }}
        />
      )}

      {/* Modal for Adding Invoice Items */}
      {isInvoiceItemModalOpen && (
        <InvoiceItemsForm
          invoiceId={invoiceId} // Pass invoiceId to InvoiceItemsForm
          isOpen={isInvoiceItemModalOpen} // Modal visibility state
          onClose={() => setIsInvoiceItemOpen(false)} // Close modal handler
        />
      )}
    </div>
  );
};

export default NewInvoiceButton;
