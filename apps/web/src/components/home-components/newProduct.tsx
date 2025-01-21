import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import backendUrl from "@/helpers/backend_url";

interface NewProductProps {
  onClose: () => void;
}

const NewProduct = ({ onClose }: NewProductProps) => {
  const token = localStorage.getItem("token"); // Ambil token dari localStorage
  const userId = localStorage.getItem("userId"); // Ambil userId dari localStorage
  const backendUrls = `${backendUrl}product`;

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),
      description: Yup.string().required("Description is required"),
      price: Yup.number()
        .typeError("Price must be a number")
        .min(1, "Price must be at least 1")
        .required("Price is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          backendUrls,
          {
            userId: userId, // User ID dari localStorage
            name: values.name,
            description: values.description,
            price: Number(values.price),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Token dari localStorage
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          toast.success("Product added successfully!", {
            onClose: () => location.reload()
        })
          resetForm(); // Reset form setelah berhasil
          onClose(); // Tutup modal
        }
      } catch (error: any) {
        alert("Failed to add product. Please try again.");
        console.error(error);
      }
    },
  });

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg">Add New Product</h3>
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
              placeholder="Enter Product Name"
            />
            {formik.touched.name && formik.errors.name && (
              <span className="text-error text-sm">{formik.errors.name}</span>
            )}
          </div>

          {/* Description Field */}
          <div className="form-control mb-4">
            <label className="label font-bold">Description</label>
            <textarea
              name="description"
              className={`textarea textarea-bordered ${
                formik.touched.description && formik.errors.description
                  ? "textarea-error"
                  : ""
              }`}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Product Description"
            />
            {formik.touched.description && formik.errors.description && (
              <span className="text-error text-sm">
                {formik.errors.description}
              </span>
            )}
          </div>

          {/* Price Field */}
          <div className="form-control mb-4">
            <label className="label font-bold">Price (IDR)</label>
            <input
              type="text"
              name="price"
              className={`input input-bordered ${
                formik.touched.price && formik.errors.price ? "input-error" : ""
              }`}
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Product Price"
            />
            {formik.touched.price && formik.errors.price && (
              <span className="text-error text-sm">{formik.errors.price}</span>
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

export default NewProduct;
