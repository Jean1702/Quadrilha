import { NextResponse } from 'next/server';
import { CreateClient } from '../../../../lib/supabase/server';
export async function GET(request) {
  // 1. Pega os parâmetros que o Mercado Pago mandou na URL
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');   // Código temporário de autorização
  const state = searchParams.get('state'); // O ID da barraca que você enviou lá no botão
  const supabase = await CreateClient()

  if (!code) {
    return NextResponse.json({ error: 'Código não fornecido' }, { status: 400 });
  }

  try {
    // 2. Fazemos o "POST" para trocar o código pelo Access Token do vendedor
    const response = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.MP_CLIENT_ID,         // Seu Client ID (do .env)
        client_secret: process.env.MP_CLIENT_SECRET, // Seu Client Secret (do .env)
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://iffood.shop/api/auth/callback', // Mesma URL cadastrada
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.message || 'Erro ao gerar token');
    }

    // 3. Aqui está o pote de ouro!
    const tokenDoVendedor = data.access_token;
    const idDoVendedorNoMP = data.user_id;

    const {error: ErrorToken} = supabase
    .from('admin')
    .update({acess_token: tokenDoVendedor, idvendedor: idDoVendedorNoMP})
    .eq(idturma, state)
    if(ErrorToken){
        console.log(ErrorToken)
        return NextResponse.redirect(new URL('/', request.url));
    }
    console.log(`Sucesso! Barraca ${state} vinculada. MP ID: ${idDoVendedorNoMP}`);

    // 5. Redireciona o usuário de volta para a página de sucesso no seu painel
    return NextResponse.redirect(new URL('/', request.url));

  } catch (error) {
    console.error('Erro no fluxo OAuth:', error);
    return NextResponse.redirect(new URL('/admin', request.url));
  }
}