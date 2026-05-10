"use client";

import { useState } from "react";
import AdminHeaderPage from "@/components/AdminHeaderPage";

export default function AdminPage() {
  const [storeOpen, setStoreOpen] = useState(true);
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Pão Francês",
      price: "0.75",
      stock: "150",
      image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      name: "Croissant",
      price: "5.50",
      stock: "30",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      name: "Bolo de Chocolate",
      price: "45.00",
      stock: "8",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    },
  ]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
  });

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    setProducts([...products, { ...newProduct, id: Date.now() }]);
    setNewProduct({ name: "", price: "", stock: "", image: "" });
  };

  const removeProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const updatePrice = (id, newPrice) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, price: newPrice } : p))
    );
  };

  const updateStock = (id, newStock) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
    );
  };

  return (
    <div className="min-h-screen pb-24">
       <AdminHeaderPage/>
     <div className="h-32"></div>
      <div className="max-w-3xl mx-auto w-full">

        {/* Header Card */}
        <div className="bg-[var(--surface)] p-6 rounded-[20px] shadow-lg mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-4">
            Painel da Loja
          </h1>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  storeOpen ? "bg-[#026A4C]" : "bg-[#D95032]"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  storeOpen ? "text-[#026A4C]" : "text-[#D95032]"
                }`}
              >
                {storeOpen ? "Loja Aberta" : "Loja Fechada"}
              </span>
            </div>

            <div className="flex items-center gap-0">
              <button
                onClick={() => setStoreOpen(true)}
                className={`px-6 py-2 rounded-l-md font-medium transition duration-300 shadow-md ${
                  storeOpen
                    ? "bg-[#026A4C] text-white"
                    : "bg-[#026A4C] text-white opacity-50 hover:opacity-70"
                }`}
              >
                Abrir Loja
              </button>
              <button
                onClick={() => setStoreOpen(false)}
                className={`px-6 py-2 rounded-r-md font-medium transition duration-300 shadow-md ${
                  !storeOpen
                    ? "bg-[#D95032] text-white"
                    : "bg-[#D95032] text-white opacity-50 hover:opacity-70"
                }`}
              >
                Fechar Loja
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-[var(--surface)] p-6 rounded-[20px] shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 tracking-tight">
            Adicionar Produto
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className="p-3 rounded-full border bg-[var(--bg)] border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm"
              placeholder="Nome do produto"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <input
              className="p-3 rounded-full border bg-[var(--bg)] border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm"
              type="number"
              placeholder="Preço"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <input
              className="p-3 rounded-full border bg-[var(--bg)] border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm"
              type="number"
              placeholder="Estoque"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock: e.target.value })
              }
            />
            <input
              className="p-3 rounded-full border bg-[var(--bg)] border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm"
              placeholder="URL da imagem"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
            />
          </div>

          <button
            onClick={addProduct}
            className="mt-4 bg-[#D97016] hover:bg-[#D98025] active:scale-95 text-white px-6 py-2 rounded-full font-semibold transition duration-300 shadow-md"
          >
            + Adicionar Produto
          </button>
        </div>

        {/* Produtos */}
        <div>
          <h2 className="text-xl font-semibold mb-4 tracking-tight">
            Produtos
          </h2>

          {products.length === 0 && (
            <p>Nenhum produto cadastrado</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-[var(--surface)] rounded-[20px] p-4 shadow-lg hover:shadow-xl transition duration-300"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-2xl mb-3"
                  />
                )}

                <h3 className="text-lg font-semibold mb-1">{product.name}</h3>

                <p className="text-[#026A4C] font-semibold">
                  R$ {product.price}
                </p>
                <p className="text-sm opacity-60 mb-3">
                  Estoque: {product.stock || "0"} unidades
                </p>

                <div className="flex flex-col gap-2 mb-3">
                  <input
                    type="number"
                    placeholder="Novo preço"
                    className="w-full p-2 rounded-full border bg-[var(--bg)] border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm text-sm"
                    onBlur={(e) => updatePrice(product.id, e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Estoque"
                    className="w-full p-2 rounded-full border bg-[var(--bg)] border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm text-sm"
                    onBlur={(e) => updateStock(product.id, e.target.value)}
                  />
                </div>

                <button
                  onClick={() => removeProduct(product.id)}
                  className="w-full bg-[#D95032] hover:bg-[#E05A3F] active:scale-95 text-white py-2 rounded-full font-medium transition duration-300 shadow-md"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
