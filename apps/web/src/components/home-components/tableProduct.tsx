'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NewProduct from "./newProduct";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
        setLoading(true);
        const response = await fetch(`${backendUrl}product/${userID}/userId?page=${currentPage}&limit=5`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
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
  }, [userID, backendUrl, router, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleNextPage = (page: number) => {
    setCurrentPage(page)
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {loading ? (
        <div className="skeleton h-16 w-full"></div>
      ) : (
        <div className="collapse collapse-open bg-slate-300 min-h-[50vh] shadow-md shadow-emerald-900">
          <div className="collapse-title text-xl font-medium flex justify-between items-baseline">
            <h1>MY PRODUCTS</h1>
            <button className="btn btn-outline w-auto mt-2 btn-success"
                onClick={() => setIsModalOpen(true)}>
              <FontAwesomeIcon icon={faCirclePlus} />
            </button> 
          </div>
          <div className="collapse-content flex flex-col justify-between">
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
                        <th>{(currentPage - 1) * 5 + index + 1}</th>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{`${product.price.toFixed(2)}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {/* Pagination Controls */}
              
            <div className="join w-full flex justify-center">
                <button 
                  className="join-item btn" 
                  onClick={() => handleNextPage(currentPage - 1)}
                  disabled={currentPage === 1}>
                    «
                </button>            
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`join-item btn h-full ${currentPage === index + 1 && 'bg-slate-500'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                <button className="join-item btn"
                  onClick={() => handleNextPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >»
                </button>
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
