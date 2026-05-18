import CursoPage from "@/components/CursoPage";
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
      <CursoPage produtos={produtos} imagem={imagem} categorias={categorias} />
    </>
  );
}
