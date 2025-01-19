import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

const FormInvoice = ({
  isRecurring,
  onClose,
  onSuccess,
}: {
  isRecurring: boolean;
  onClose: () => void;
  onSuccess: (invoiceId: string) => void; 
}) => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

useEffect(() => {
  if (userId && token) {
    axios
      .get(`http://localhost:8000/api/client/${userId}/userId`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setClients(response.data);
        setFilteredClients(response.data);
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
      });
  }
}, [userId, token]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredClients(
      clients.filter((client: any) =>
        client.name.toLowerCase().includes(term)
      )
    );
  };

  const formik = useFormik({
    initialValues: {
      userId: userId || "",
      clientId: "",
      dueDate: "",
      status: "PENDING",
      recurringSchedule: "",
      recurringEndDate: "",
    },
    validationSchema: Yup.object({
      userId: Yup.string().required("User ID is required"),
      clientId: Yup.string().required("Client is required"),
      dueDate: Yup.string().required("Due Date is required"),
      recurringSchedule: isRecurring
        ? Yup.string().required("Recurring Schedule is required")
        : Yup.string().notRequired(),
      recurringEndDate: isRecurring
        ? Yup.string().required("Recurring End Date is required")
        : Yup.string().notRequired(),
    }),
    onSubmit: (values) => {
      const output = isRecurring
        ? {
            ...values,
            recurringSchedule: values.recurringSchedule,
            recurringEndDate: values.recurringEndDate,
          }
        : {
            userId: values.userId,
            clientId: values.clientId,
            dueDate: values.dueDate,
            status: values.status,
          };
    
      const token = localStorage.getItem("token"); 
    
      axios
        .post("http://localhost:8000/api/invoice/", output, {
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("Response:", response.data);
          toast.success("Invoice submitted successfully!");
          onSuccess(response.data.id)
          onClose(); 
        })
        .catch((error) => {
          console.error("Error submitting invoice:", error);
          alert("Failed to submit invoice. Please try again.");
        });
    },
  });

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 w-5xl">
        <h3 className="font-bold text-lg">
          {isRecurring ? "Recurring Invoice" : "One-Time Invoice"}
        </h3>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* User ID */}
          <div className="form-control hidden">
            <label className="label font-bold">User ID</label>
            <input
              type="text"
              name="userId"
              className="input input-bordered"
              value={formik.values.userId}
              disabled
            />
          </div>

          {/* Client Name */}
          <div className="form-control">
            <label className="label font-bold">Client</label>
            <div className="flex w-full">
                <select name="clientId" className="input input-bordered w-1/2" value={formik.values.clientId} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                <option value="" disabled>
                    Select Client
                </option>
                {filteredClients.map((client: any) => (
                    <option key={client.id} value={client.id}>
                    {client.name}
                    </option>
                ))}
                </select>
                <input type="text" placeholder="Search client" className="input input-bordered mb-2" value={searchTerm} onChange={handleSearch}/>
            </div>
            {formik.touched.clientId && formik.errors.clientId && (
              <span className="text-error text-sm">
                {formik.errors.clientId}
              </span>
            )}
          </div>

          {/* Due Date */}
          <div className="form-control">
            <label className="label font-bold">Due Date</label>
            <input
              type="date"
              name="dueDate"
              className="input input-bordered"
              value={formik.values.dueDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.dueDate && formik.errors.dueDate && (
              <span className="text-error text-sm">{formik.errors.dueDate}</span>
            )}
          </div>

          {/* Recurring Invoice */}
          {isRecurring && (
            <>
              <div className="form-control">
                <label className="label font-bold">Recurring Schedule</label>
                <select
                  name="recurringSchedule"
                  className="input input-bordered"
                  value={formik.values.recurringSchedule}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" disabled>
                    Select Schedule
                  </option>
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
                {formik.touched.recurringSchedule &&
                  formik.errors.recurringSchedule && (
                    <span className="text-error text-sm">
                      {formik.errors.recurringSchedule}
                    </span>
                  )}
              </div>

              <div className="form-control">
                <label className="label font-bold">Recurring End Date</label>
                <input
                  type="date"
                  name="recurringEndDate"
                  className="input input-bordered"
                  value={formik.values.recurringEndDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.recurringEndDate &&
                  formik.errors.recurringEndDate && (
                    <span className="text-error text-sm">
                      {formik.errors.recurringEndDate}
                    </span>
                  )}
              </div>
            </>
          )}

          {/* Actions */}
          <div className="modal-action z-50">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormInvoice;
