import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import backendUrl from "@/helpers/backend_url";

const InvoiceItemsForm = ({
  invoiceId,
  isOpen,
  onClose,
}: {
  invoiceId: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const token = localStorage.getItem("token");

  // Fetch products
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios
      .get(`${backendUrl}product/${userId}/userId`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [token]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      invoiceItems: [
        {
          productId: "",
          quantity: 1,
          price: 0,
        },
      ],
    },
    validationSchema: Yup.object({
      invoiceItems: Yup.array().of(
        Yup.object().shape({
          productId: Yup.string().required("Product is required"),
          quantity: Yup.number()
            .min(1, "Quantity must be at least 1")
            .required("Quantity is required"),
          price: Yup.number()
            .min(0, "Price cannot be negative")
            .required("Price is required"),
        })
      ),
    }),
    onSubmit: (values) => {
      const payload = {
        invoiceItems: values.invoiceItems.map((item) => ({
          ...item,
          invoiceId, // Add invoiceId to each item
        })),
      };

      axios
      .post(`${backendUrl}invoice-items/bulk`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Response:", response.data);
        toast.success("Invoice items submitted successfully!", {
          onClose: () => {
            location.reload(); //
          },
        });
        onClose(); // Close modal on success
      })
      .catch((error) => {
        console.error("Error submitting invoice items:", error);
        toast.error("Failed to submit invoice items. Please try again.");
      });
    
    },
  });

  useEffect(() => {
    const updatedInvoiceItems = formik.values.invoiceItems.map((item) => {
      const selectedProduct = products.find(
        (product) => product.id === item.productId
      );
      return {
        ...item,
        price: selectedProduct ? selectedProduct.price * item.quantity : 0,
      };
    });

    if (JSON.stringify(updatedInvoiceItems) !== JSON.stringify(formik.values.invoiceItems)) {
      formik.setFieldValue("invoiceItems", updatedInvoiceItems);
    }
  }, [formik.values.invoiceItems, products]);

  if (!isOpen) return null;

  return (
      <div className="modal modal-open">
        <div className="modal-box w-11/12 max-w-5xl">
         <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Invoice Items</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 text-xl"
          >
            X
          </button>
        </div>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <FieldArray
              name="invoiceItems"
              render={(arrayHelpers) => (
                <>
                  {formik.values.invoiceItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 items-center">
                      <div>
                        <label className="block font-bold mb-1">Product</label>
                        <select
                          name={`invoiceItems[${index}].productId`}
                          value={item.productId}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="input input-bordered w-full"
                        >
                          <option value="" disabled>
                            Select Product
                          </option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                        {formik.touched.invoiceItems?.[index]?.productId &&
                          formik.errors.invoiceItems?.[index] &&
                          typeof formik.errors.invoiceItems[index] === "object" && (
                            <span className="text-error text-sm">
                              {
                                (formik.errors.invoiceItems[index] as {
                                  productId?: string;
                                }).productId
                              }
                            </span>
                          )}
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Quantity</label>
                        <input
                          type="number"
                          name={`invoiceItems[${index}].quantity`}
                          value={item.quantity}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="input input-bordered w-full"
                        />
                        {formik.touched.invoiceItems?.[index]?.quantity &&
                          formik.errors.invoiceItems?.[index] &&
                          typeof formik.errors.invoiceItems[index] === "object" && (
                            <span className="text-error text-sm">
                              {
                                (formik.errors.invoiceItems[index] as {
                                  quantity?: string;
                                }).quantity
                              }
                            </span>
                          )}
                      </div>

                      {/* Price & remove */}
                      <div>
                        <label className="block font-bold mb-1">Price</label>
                        <div className="flex">
                        <input
                          type="number"
                          name={`invoiceItems[${index}].price`}
                          value={item.price}
                          disabled
                          className="input input-bordered w-full bg-gray-200 cursor-not-allowed"
                        />
                          <button
                          type="button"
                          onClick={() => arrayHelpers.remove(index)}
                          className="items-baseline ml-4 font-bold"
                        >
                          X
                        </button>
                        </div>
                      </div>

                      {/* Remove Item */}
                     
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      arrayHelpers.push({ productId: "", quantity: 1, price: 0 })
                    }
                    className="btn bg-slate-700 mt-4"
                  >
                    Add Row
                  </button>
                </>
              )}
            />

            <button type="submit" className="btn btn-success w-full">
              Submit Invoice Items
            </button>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
};

export default InvoiceItemsForm;
