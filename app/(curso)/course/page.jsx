import CursoPage from "../../../components/CursoPage";
import {CreateClient} from "@/lib/supabase/server.ts"
export default async function Curso() {

  const supabase = await CreateClient()

  const categoria = await supabase.from('produtos')
    .select('*')

    const imagem = await supabase.from('imagens')
    .select('*')


  return (
    <>
      <CursoPage categoria={categoria} imagem={imagem}/>
    </>
  );
}
