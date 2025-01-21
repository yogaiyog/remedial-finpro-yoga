'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NewProduct from "./newProduct";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/";

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserID(storedUserId);

    if (!storedUserId) {
      router.push("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      try {
        const response = await fetch(`${backendUrl}product/${userID}/userId`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
        localStorage.clear();
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    if (userID) {
      fetchProducts();
    }
  }, [userID, backendUrl, router]);


  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
        {loading ? (
          <div className="skeleton h-16 w-full"></div>
        ) : (
          <div className="collapse bg-base-200">
            <input type="checkbox" defaultChecked />
            <div className="collapse-title text-xl font-medium">MY PRODUCTS</div>
            <div className="collapse-content">
              <div className="overflow-x-auto">
                {!products.length ? (
                  <div className="text-center">
                    <p className="text-sm text-slate-500">
                      No products found. Start adding your first product now!
                    </p>
                    <button
                      className="btn btn-circle btn-outline w-auto mt-2 px-4"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Add New Product
                    </button>
                  </div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price (idr)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr key={product.id}>
                          <th>{index + 1}</th>
                          <td>{product.name}</td>
                          <td>{product.description}</td>
                          <td>{`${product.price.toFixed(2)}`}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={4}>
                          <button
                            className="btn btn-circle btn-outline w-auto mt-2 px-4"
                            onClick={() => setIsModalOpen(true)}
                          >
                            Add New Product
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

      {isModalOpen && (
        <NewProduct onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};



export default ProductTable;
