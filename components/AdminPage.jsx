"use client";

import { useState, useEffect } from "react";
import AdminHeaderPage from "@/components/AdminHeaderPage";
import ConfirmationModal from "@/components/ConfirmationModal";
import { CreateClient } from "@/lib/supabase/client";
import { Upload } from 'lucide-react';
import { reload } from "next/navigation";
export default function AdminPage({ adminData, produtos }) {
  const supabase = CreateClient();

  const [produtosatual, setProdutos] = useState(produtos || []);
  const [selectedImages, setSelectedImages] = useState([]);
  const [storeOpen, setStoreOpen] = useState(adminData.turma?.is_active || false);
  const [superadm, setSuperadm] = useState(adminData.is_superadmin)

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    categories: [],
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    productId: null,
    isLoading: false
  });

  useEffect(() => {
    if (!adminData) return;

    const configProdutos = {
      event: '*',
      schema: 'public',
      table: 'produtos',
    };

    if (!adminData.is_superadmin && adminData.idturma) {
      configProdutos.filter = `idturma=eq.${adminData.idturma}`;
    }

    const channel = supabase
      .channel('tempo_real')

      .on(
        'postgres_changes',
        configProdutos,
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProdutos((listaAntiga) => [...listaAntiga, { ...payload.new, imagens: [] }]);
          }
          else if (payload.eventType === 'DELETE') {
            setProdutos((listaAntiga) =>
              listaAntiga.filter((item) => item.idproduto !== payload.old.idproduto)
            );
          }
          else if (payload.eventType === 'UPDATE') {
            setProdutos((listaAntiga) =>
              listaAntiga.map((item) =>
                item.idproduto === payload.new.idproduto ? { ...item, ...payload.new } : item
              )
            );
          }
        }
      )

      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'imagens' },
        (payload) => {
          setProdutos((listaAntiga) =>
            listaAntiga.map((produto) => {
              if (produto.idproduto === payload.new.idproduto) {
                return {
                  ...produto,
                  imagens: produto.imagens ? [...produto.imagens, payload.new] : [payload.new]
                };
              }
              return produto;
            })
          );
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [adminData]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 3) {
      return;
    }
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setSelectedImages([...selectedImages, ...newImages]);
  };

  const mudarestadodaloja = async (isOpen) => {
    try {
      const response = await fetch(`/api/turma/update/is_active?id=${adminData.idturma}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ is_active: isOpen })
      });

      if (response.ok) {
        setStoreOpen(isOpen);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalState({ 
      isOpen: true, 
      type: 'add', 
      isLoading: false 
    });
  };

  const confirmAddProduct = async () => {
    setModalState(prev => ({ ...prev, isLoading: true }));
    
    const formData = new FormData();

    formData.append("idturma", adminData.idturma); 
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("stock", newProduct.stock);
    formData.append("description", newProduct.description);
    
    newProduct.categories.forEach(cat => formData.append("categories", cat));
    
    selectedImages.forEach(img => formData.append("image", img.file));
    
    try {
      const response = await fetch("/api/products/insert", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setNewProduct({
          name: "",
          price: "",
          stock: "",
          description: "",
          categories: [] 
        });

        setSelectedImages([]);
        setModalState({ isOpen: false, type: null, isLoading: false });
        
      } else {
        console.error("Erro na API ao salvar");
        alert("Erro ao salvar produto");
        setModalState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao enviar formulário");
      setModalState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const removeProduct = async (id) => { 
    setModalState({ 
      isOpen: true, 
      type: 'delete', 
      productId: id,
      isLoading: false 
    });
  };

  const confirmRemoveProduct = async () => {
    setModalState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await fetch(`/api/products/delete?id=${modalState.productId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProdutos((prev) => prev.filter((p) => p.idproduto !== modalState.productId));
        setModalState({ isOpen: false, type: null, productId: null, isLoading: false });
      } else {
        const error = await response.json();
        alert(`Erro ao deletar: ${error.message}`);
        setModalState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
      setModalState(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  const updatePrice = async (id, newPrice) => {  
    try {
      const response = await fetch(`/api/products/update/preco?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ preco: parseFloat(newPrice) })
      });
      if (response.ok) {
        setProdutos((listaAntiga) => 
          listaAntiga.map((p) => (p.idproduto === id ? { ...p, preco: parseFloat(newPrice) } : p))
        );
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    }
  };

  const updateStock = async (id, newStock) => {
    try {
      const response = await fetch(`/api/products/update/estoque?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ estoque: parseInt(newStock) })
      });
      if (response.ok) {
        setProdutos((listaAntiga) => 
          listaAntiga.map((p) => (p.idproduto === id ? { ...p, estoque: parseInt(newStock) } : p))
        );
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    }
  };

  return (
    <div className="min-h-screen pb-28">
      <AdminHeaderPage nometurma={adminData.turma.nomecurso} anoturma={adminData.turma.ano} logo={adminData.turma.logo} />
      <div className="h-40"></div>
      <div className="max-w-3xl mx-auto w-full px-4">


        {/* Status da Loja */}
        <div className="bg-(--surface) p-6 rounded-[20px] shadow-lg mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-4">Painel da Loja</h1>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${storeOpen ? "bg-[#026A4C]" : "bg-[#D95032]"}`} />
              <span className={`text-sm font-medium ${storeOpen ? "text-[#026A4C]" : "text-[#D95032]"}`}>
                {storeOpen ? "Loja Aberta" : "Loja Fechada"}
              </span>
            </div>
            
            <div className="flex items-center">
              <button onClick={() => mudarestadodaloja(true)} className={`px-6 py-2 rounded-l-md font-medium transition ${storeOpen ? "bg-[#026A4C] text-white" : "bg-[#026A4C] text-white opacity-50"}`}>Abrir</button>
              <button onClick={() => mudarestadodaloja(false)} className={`px-6 py-2 rounded-r-md font-medium transition ${!storeOpen ? "bg-[#D95032] text-white" : "bg-[#D95032] text-white opacity-50"}`}>Fechar</button>
            </div>
          </div>
        }


        {/* Formulário de Cadastro */}
        <form onSubmit={handleSubmit} className="bg-(--surface) p-6 rounded-[24px] shadow-xl mb-6 border border-white/10">
          <h2 className="text-xl font-bold mb-6 text-center">Cadastrar Novo Produto</h2>
          <div className="flex flex-col gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider">Nome do Produto</label>
              <input
                className="w-full px-4 py-3.5 rounded-2xl bg-(--bg) outline-none focus:ring-2 focus:ring-[#D97016] shadow-inner"
                placeholder="Ex: Pastel de Frango"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider">Descrição</label>
              <textarea
                rows="3"
                className="w-full p-4 rounded-2xl bg-(--bg) outline-none focus:ring-2 focus:ring-[#D97016] shadow-inner resize-none"
                placeholder="Detalhes..."
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider">Preço (R$)</label>
                <input
                  type="number"
                  className="w-full p-3.5 rounded-2xl bg-(--bg) outline-none focus:ring-2 focus:ring-[#D97016] shadow-inner"
                  placeholder="0.00"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider">Estoque</label>
                <input
                  type="number"
                  className="w-full p-3.5 rounded-2xl bg-(--bg) outline-none focus:ring-2 focus:ring-[#D97016] shadow-inner"
                  placeholder="Qtd"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                />
              </div>
            </div>

            {/* Categorias */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">Categorias</label>
              <div className="bg-(--bg) p-3 rounded-2xl shadow-inner flex flex-wrap gap-2">
                {[
                  { id: 5, nome: 'Bebidas' },
                  { id: 6, nome: 'Caldos' },
                  { id: 7, nome: 'Combo' },
                  { id: 4, nome: 'Doces' },
                  { id: 3, nome: 'Jantinha' },
                  { id: 2, nome: 'Lanche' },
                  { id: 1, nome: 'Salgados' }
                ].map((cat) => {
                  const isSelected = newProduct.categories?.includes(cat.id);

                  return (
                    <label key={cat.id} className={`grow sm:grow-0 flex items-center justify-center px-4 py-2 rounded-xl cursor-pointer transition-all border ${isSelected ? 'bg-[#D97016] border-[#D97016] text-white' : 'bg-(--surface) border-white/5 text-gray-400'}`}>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={isSelected}
                        onChange={(e) => {
                          const categories = newProduct.categories || [];
                          setNewProduct({ 
                            ...newProduct, 
                            categories: e.target.checked 
                              ? [...categories, cat.id] 
                              : categories.filter(c => c !== cat.id) 
                          });
                        }}
                      />
                      <span className="text-sm font-medium">{cat.nome}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Imagens */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 text-center block">Imagens ({selectedImages.length}/3)</label>
              <div className="bg-(--bg) p-4 rounded-2xl shadow-inner border-2 border-dashed border-white/10">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {selectedImages.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-white/10">
                      <img src={img.preview} className="w-full h-full object-cover" />
                      <button onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-[10px]">✕</button>
                    </div>
                  ))}
                </div>
                <label className="flex flex-col items-center justify-center py-4 bg-(--surface) rounded-xl cursor-pointer hover:bg-[#D97016]/10 transition-all">
                  <span className="text-2xl"><Upload /></span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </div>
          </div>
          <button type="submit" className="mt-8 w-full bg-[#D97016] hover:bg-[#D98025] active:scale-[0.97] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[2px] transition-all shadow-lg">
            Cadastrar Produto
          </button>
        </form>

        {/* Listagem de Produtos */}
        <h2 className="text-xl font-semibold mb-4">Produtos</h2>
        {produtosatual.length === 0 ? <p>Nenhum produto cadastrado</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {produtosatual.map((product) => (
              <div key={product.idproduto} className="bg-(--surface) rounded-[20px] p-4 shadow-lg">
                {product.imagens?.[0] && <img src={product.imagens[0].url_imagem} className="w-full h-40 object-cover rounded-2xl mb-3" />}
                <h3 className="text-lg font-semibold mb-1">{product.nome}</h3>
                <p className="text-[#026A4C] font-semibold">R$ {Number(product.preco).toFixed(2)}</p>
                <p className="text-sm opacity-60 mb-3">Estoque: {product.estoque || "0"} un</p>
                <div className="flex flex-col gap-2 mb-3">
                  <input type="number" placeholder="Novo preço" className="w-full p-2 rounded-full border bg-(--bg) text-sm" onBlur={(e) => updatePrice(product.idproduto, e.target.value)} />
                  <input type="number" placeholder="Estoque" className="w-full p-2 rounded-full border bg-(--bg) text-sm" onBlur={(e) => updateStock(product.idproduto, e.target.value)} />
                </div>
                <button onClick={() => removeProduct(product.idproduto)} className="w-full bg-[#D95032] text-white py-2 rounded-full font-medium">Remover</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        title={modalState.type === 'add' ? 'Adicionar Novo Produto' : 'Remover Produto'}
        message={
          modalState.type === 'add' 
            ? `Tem certeza que deseja adicionar o produto "${newProduct.name}"?`
            : 'Tem certeza que deseja remover este produto? Esta ação não pode ser desfeita.'
        }
        actionType={modalState.type}
        onConfirm={modalState.type === 'add' ? confirmAddProduct : confirmRemoveProduct}
        onCancel={() => setModalState({ isOpen: false, type: null, productId: null, isLoading: false })}
        isLoading={modalState.isLoading}
      />
    </div>
  );
}