'use client'

import React from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Tipe untuk nilai formulir
interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

const Register: React.FC = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/'

  const router = useRouter()
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    fullName: Yup.string().required("Full name is required"),
  });

  const handleSubmit = async (values: RegisterFormValues, { setSubmitting, resetForm }: any) => {
    try {
      const response = await axios.post(
        `${backendUrl}user/register`,
        values
      );
      toast.success("Registration successful!")
      resetForm();
      router.push('/auth/login')
    } catch (error: any) {
      toast.success( error.response?.data?.message || "An error occurred during registration.")
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
  <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
    <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
      Register your account
    </h1>

    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        fullName: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-900 dark:text-white">
              Username
            </label>
            <Field
              name="username"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm"
            />
            <ErrorMessage
              name="username"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <Field
              name="email"
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white">
              Password
            </label>
            <Field
              name="password"
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 dark:text-white">
              Full Name
            </label>
            <Field
              name="fullName"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm"
            />
            <ErrorMessage
              name="fullName"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </div>

          <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
            Already have an account?{" "}
            <a href="#" className="font-medium text-blue-600 hover:underline dark:text-blue-500" onClick={()=>{router.push('/auth/login')}}>
              Sign in
            </a>
          </p>

        </Form>
      )}
    </Formik>
  </div>
</div>

  );
};

export default Register;
