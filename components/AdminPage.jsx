"use client";

import { useState } from "react";

export default function AdminPage() {
  const [storeOpen, setStoreOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return;

    setProducts([...products, { ...newProduct, id: Date.now() }]);
    setNewProduct({ name: "", price: "", image: "" });
  };

  const removeProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const updatePrice = (id, newPrice) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, price: newPrice } : p))
    );
  };

  return (
    <div className="min-h-screen bg-[#DFD0AF] p-6 text-[#514442]">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-[#514442] text-white p-6 rounded-3xl shadow-lg mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
            🛍️ Painel da Loja
          </h1>

          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-1 text-sm font-medium rounded-full transition-colors duration-300 ${
                storeOpen ? "bg-[#026A4C]" : "bg-[#D95032]"
              }`}
            >
              {storeOpen ? "Loja Aberta" : "Loja Fechada"}
            </span>

            <button
              onClick={() => setStoreOpen(!storeOpen)}
              className="bg-[#D97016] hover:bg-[#D98025] active:scale-95 px-5 py-2 rounded-full font-medium transition duration-300 shadow-md"
            >
              {storeOpen ? "Fechar Loja" : "Abrir Loja"}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-6 rounded-3xl shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 tracking-tight">
            Adicionar Produto
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              className="p-3 rounded-full border border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm"
              placeholder="Nome do produto"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />

            <input
              className="p-3 rounded-full border border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm"
              type="number"
              placeholder="Preço"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />

            <input
              className="p-3 rounded-full border border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm"
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
            <p className="text-[#514442]/70 rounded-lg">
              Nenhum produto cadastrado
            </p>
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-4 shadow-md hover:shadow-xl transition duration-300 border border-[#DFD0AF]"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-2xl mb-3"
                  />
                )}

                <h3 className="text-lg font-semibold mb-1">
                  {product.name}
                </h3>

                <p className="text-[#026A4C] font-semibold mb-3">
                  R$ {product.price}
                </p>

                <input
                  type="number"
                  placeholder="Novo preço"
                  className="w-full p-2 rounded-full border border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none mb-3 transition duration-300 shadow-sm"
                  onBlur={(e) =>
                    updatePrice(product.id, e.target.value)
                  }
                />

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