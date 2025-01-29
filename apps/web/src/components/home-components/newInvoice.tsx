'use client'
import { useState } from "react";
import FormInvoice from "./formInvoice";
import InvoiceItemsForm from "./formInvoiceItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const NewInvoiceButton = () => {
  const [isRecurring, setIsRecurring] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceItemModalOpen, setIsInvoiceItemOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string>("");

  return (
    <div className="m-auto">
      <div>
        <div className="dropdown dropdown-hover">
          <div tabIndex={0} role="button" className="btn bg-slate-500 hover:bg-slate-700 shadow-md border-none text-white m-1 text-xl">
            Create Invoice
            <FontAwesomeIcon icon={faPlusCircle}/>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu menu-horizontal bg-slate-500 rounded-box z-[1] w-44 p-2 shadow text-white"
          >
            <li>
              <button className="hover:bg-slate-700 w-full"
                onClick={() => {
                  setIsRecurring(false);
                  setIsModalOpen(true);
                }}
              >
                One-Time Invoice
              </button>
            </li>
            <li>
              <button className="hover:bg-slate-700 w-full"
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
