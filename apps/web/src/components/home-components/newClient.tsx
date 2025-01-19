import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

interface NewClientProps {
  onClose: () => void;
}

const NewClient = ({ onClose }: NewClientProps) => {
  const token = localStorage.getItem("token"); // Ambil token dari localStorage
  const userId = localStorage.getItem("userId"); // Ambil userId dari localStorage
  const backendUrl = "http://localhost:8000/api/client/";

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      email: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),
      address: Yup.string().required("Address is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Contact info is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          backendUrl,
          {
            userId: userId, // Gunakan userId dari localStorage
            name: values.name,
            address: values.address,
            email: values.email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          toast.success("Client added successfully!")
          resetForm(); // Reset form fields after successful submission
          onClose(); // Close the modal
        }
      } catch (error: any) {
        alert("Failed to add client. Please try again.");
        console.error(error);
      }
    },
  });

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg">Add New Client</h3>
        <form onSubmit={formik.handleSubmit}>
          {/* Name Field */}
          <div className="form-control mb-4">
            <label className="label font-bold">Name</label>
            <input
              type="text"
              name="name"
              className={`input input-bordered ${
                formik.touched.name && formik.errors.name ? "input-error" : ""
              }`}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Client Name"
            />
            {formik.touched.name && formik.errors.name && (
              <span className="text-error text-sm">{formik.errors.name}</span>
            )}
          </div>

          {/* Address Field */}
          <div className="form-control mb-4">
            <label className="label font-bold">Address</label>
            <input
              type="text"
              name="address"
              className={`input input-bordered ${
                formik.touched.address && formik.errors.address ? "input-error" : ""
              }`}
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Address"
            />
            {formik.touched.address && formik.errors.address && (
              <span className="text-error text-sm">{formik.errors.address}</span>
            )}
          </div>

          {/* Contact Info Field */}
          <div className="form-control mb-4">
            <label className="label font-bold">Email</label>
            <input
              type="email"
              name="email"
              className={`input input-bordered ${
                formik.touched.email && formik.errors.email ? "input-error" : ""
              }`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Email or Contact Info"
            />
            {formik.touched.email && formik.errors.email && (
              <span className="text-error text-sm">{formik.errors.email}</span>
            )}
          </div>

          {/* Actions */}
          <div className="modal-action">
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

export default NewClient;
