import CategoriaPage from "../../../../components/CategoriasPage"
import { CreateClient } from "@/lib/supabase/server.ts"

export default async function Curso({params}) {

  const supabase = await CreateClient()

  const produtos = await supabase.from('produtos')
    .select('*')

  const imagem = await supabase.from('imagens')
    .select('*')

  const categorias = await supabase.from('categoria')
    .select('*')

  return (
    <>
      <CategoriaPage produtos={produtos} imagem={imagem} categorias={categorias} />
    </>
  );
}
