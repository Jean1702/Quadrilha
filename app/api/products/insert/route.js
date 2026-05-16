import { NextResponse } from "next/server";
import { CreateClient } from "@/lib/supabase/server";

export async function POST(req) {
  const supabase = await CreateClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const formData = await req.formData();
    const name = formData.get("name");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const description = formData.get("description");
    const categories = formData.getAll("categories"); 
    const images = formData.getAll("image"); 
    const idturma = formData.get("idturma"); 
  

    const { data: produto, error: prodError } = await supabase
      .from("produtos")
      .insert({
        nome: name,
        preco: parseFloat(price),
        estoque: parseInt(stock),
        descricao: description,
        idturma: idturma,
      })
      .select("idproduto")
      .single();

    if (prodError) throw prodError;
    const productId = produto.idproduto;

    const imageLinks = [];
    for (const image of images) {
      const fileName = `${Date.now()}-${image.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("produtos_adm") 
        .upload(fileName, image);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from("produtos_adm")
          .getPublicUrl(fileName);
        
        imageLinks.push({ idproduto: productId, url_imagem: publicUrl, nome: fileName });
      }
    }


    if (imageLinks.length > 0) {
      const { error: imgError } = await supabase.from("imagens").insert(imageLinks);
      if (imgError) {
        console.error("Erro ao inserir imagens:", imgError);
      }
    }

   if (categories.length > 0) {
      let parsedCategories = [];
      
      categories.forEach(cat => {
        if (typeof cat === 'string' && (cat.includes(',') || cat.includes('['))) {
          try {
            const arr = JSON.parse(cat);
            if (Array.isArray(arr)) parsedCategories.push(...arr);
          } catch (e) {
            parsedCategories.push(...cat.split(','));
          }
        } else {
          parsedCategories.push(cat);
        }
      });

      const catData = parsedCategories
        .map(catId => parseInt(catId))
        .filter(catId => !isNaN(catId)) 
        .map(catId => ({
          idproduto: productId,
          idcategoria: catId
        }));

      if (catData.length > 0) {
        const { error: catError } = await supabase.from("categoria_produto").insert(catData);
        if (catError) {
          console.error("Erro ao inserir categorias:", catError);
        }
      }
    }

    return NextResponse.json({ message: "Sucesso!", id: productId }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}