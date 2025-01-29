import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import backendUrl from "@/helpers/backend_url";

const FormInvoice = ({
  isRecurring,
  onClose,
  onSuccess,
}: {
  isRecurring: boolean;
  onClose: () => void;
  onSuccess: (invoiceId: string) => void;
}) => {
  const [clients, setClients] = useState<any[]>([]);
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userId && token) {
      setIsLoading(true);
      axios
        .get(`${backendUrl}client/${userId}/userId?page=1&limit=100000`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const clientData = response.data?.clients || [];
          setClients(clientData);
          setFilteredClients(clientData);
        })
        .catch((error) => {
          console.error("Error fetching clients:", error);
          toast.error("Failed to fetch clients. Please try again later.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [userId, token]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredClients(
      clients.filter((client) =>
        client.name.toLowerCase().includes(term)
      )
    );
  };

  // Formik setup
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
      const payload = isRecurring
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

      axios
        .post(`${backendUrl}invoice/`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          toast.success("Invoice submitted successfully!");
          onSuccess(response.data.id);
          onClose();
        })
        .catch((error) => {
          console.error("Error submitting invoice:", error);
          toast.error("Failed to submit invoice. Please try again.");
        });
    },
  });

  return (
    <div className="modal modal-open bg-white">
      <div className="modal-box w-8/12 max-w-5xl bg-white">
        <h3 className="font-bold text-lg">
          {isRecurring ? "Recurring Invoice" : "One-Time Invoice"}
        </h3>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Client Dropdown */}
          <div className="form-control">
            <label className="label font-bold">Client</label>
            <div className="flex w-full">
              <select
                name="clientId"
                className="input input-bordered w-3/4  text-white bg-stone-500"
                value={formik.values.clientId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
              >
                <option value="" disabled>
                  {isLoading ? "Loading clients..." : "Select Client"}
                </option>
                {filteredClients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search client"
                className="input input-bordered mb-2 w-1/4  text-white bg-stone-500"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            {formik.touched.clientId && formik.errors.clientId && (
              <span className="text-error text-sm">{formik.errors.clientId}</span>
            )}
          </div>

          {/* Other Fields */}
          <div className="form-control">
            <label className="label font-bold">Due Date</label>
            <input
              type="date"
              name="dueDate"
              className="input input-bordered text-white bg-stone-500"
              value={formik.values.dueDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.dueDate && formik.errors.dueDate && (
              <span className="text-error text-sm">{formik.errors.dueDate}</span>
            )}
          </div>

          {isRecurring && (
            <>
              <div className="form-control">
                <label className="label font-bold">Recurring Schedule</label>
                <select
                  name="recurringSchedule"
                  className="input input-bordered bg-stone-500 text-black"
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
                  className="input input-bordered bg-stone-500 text-black"
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

          <div className="modal-action">
            <button type="submit" className="btn bg-emerald-500 hover:bg-emerald-700 hover:text-black text-white" disabled={isLoading}>
              Submit
            </button>
            <button type="button" className="btn bg-slate-500 hover:bg-rslate700 hover:text-black text-white" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormInvoice;
