import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title:string,
  desc:string
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  desc
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-slate-200">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{desc}</p>
        <div className="modal-action">
          <button
            className="px-4 py-2 btn-primary text-white rounded-lg hover:bg-emerald-700 bg-emerald-500 "
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-400 text-white"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
