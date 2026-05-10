import HomePage from '@/components/HomePage';
import {CreateClient} from "@/lib/supabase/server.ts"
export default async function Home() {

  const supabase = await CreateClient()

  const categorias = await supabase.from('categoria')
  .select('*')

  return (
    <>
    <HomePage categorias={categorias}/>
    </>
  );
}
