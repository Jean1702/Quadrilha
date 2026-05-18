import CursoPage from "../../../../components/CursoPage";
import { CreateClient } from "@/lib/supabase/server.ts"
export default async function Curso() {

  const supabase = await CreateClient()

  const produtos = await supabase.from('produtos')
    .select('*')

  const imagem = await supabase.from('imagens')
    .select('*')

  const categorias = await supabase.from('categoria')
    .select('*')

    const turmas = await supabase.from('turma')
    .select('*')

    const categoria_produto = await supabase.from('categoria_produto')
    .select('*')

  return (
    <>
      <CursoPage produtos={produtos} imagem={imagem} categorias={categorias} turmas={turmas} categoria_produto={categoria_produto}/>
    </>
  );
}
