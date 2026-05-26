import HomePage from '@/components/HomePage';
import { CreateClient } from "@/lib/supabase/server"
export default async function Home() {

  const supabase = await CreateClient()

  const categorias = await supabase.from('categoria')
  .select('*')

  const { data: turmas, error: turmaError } = await supabase
    .from('turma')
    .select(`
      *,
      resumoprodutos(*)  
    `)
    .order('ano', { ascending: false })    
    .order('nomecurso', { ascending: false })
    .eq('is_active', true);
  
  if(turmaError) {
    console.error("Erro ao buscar turmas:", turmaError);
  }
  return (
    <>
    <HomePage categorias={categorias} turmas={turmas}/>
    </>
  );
}
