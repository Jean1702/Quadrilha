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
      await supabase.from("imagens").insert(imageLinks);
    }

    if (categories.length > 0) {
      const catData = categories.map(catId => ({
        idproduto: productId,
        idcategoria: catId
      }));
      await supabase.from("categoria_produto").insert(catData);
    }

    return NextResponse.json({ message: "Sucesso!" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}