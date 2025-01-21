'use client'

import React from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { LoginFormValues } from "@/type/type";
import backendUrl from "@/helpers/backend_url";


const Login: React.FC = () => {
  const router = useRouter()
  
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  // Fungsi untuk menangani pengiriman formulir
  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const response = await axios.post(
        `${backendUrl}user/login`,
        values
      );
      toast.success("Login successful!")
      console.log(response)
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("userId", response.data.userId)
      router.push('/home')
    } catch (error: any) {
      alert(
        error.response?.data?.message || "An error occurred during login."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Sign in to your account
      </h1>
  
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
  
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">
                Your email
              </label>
              <Field
                name="email"
                type="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm"
                placeholder="name@company.com"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>
  
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <Field
                name="password"
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>
  
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {isSubmitting ? "Logging in..." : "Sign in"}
              </button>
            </div>
  
            <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
              Don’t have an account yet?{" "}
              <a href="#" className="font-medium text-blue-600 hover:underline dark:text-blue-500" onClick={()=>{router.push("/auth/register")}}>
                Sign up
              </a>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  </div>
  
  );
};

export default Login;
