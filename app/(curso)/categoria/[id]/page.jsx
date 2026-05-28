import CategoriaPage from "@/components/CategoriasPage"
import { CreateClient } from "@/lib/supabase/server.ts"

export default async function Curso({ params }) {

  const supabase = await CreateClient()

  const produtos = await supabase.from('produtos')
    .select('*')
    .eq("isActivy", true);

  const imagem = await supabase.from('imagens')
    .select('*');

  const categorias = await supabase.from('categoria')
    .select('*');

  const categoria_produto = await supabase.from('categoria_produto')
    .select('*');

    const turmas = await supabase.from('turma')
    .select('*');

    

  return (
    <>
      <CategoriaPage produtos={produtos} imagem={imagem} categorias={categorias} turmas={turmas} categoria_produto={categoria_produto} />
    </>
  );
}
