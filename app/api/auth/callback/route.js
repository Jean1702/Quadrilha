import { NextResponse } from 'next/server';
import { CreateClient } from '../../../../lib/supabase/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const supabase = await CreateClient();

  if (!code) {
    return NextResponse.json({ error: 'Código não fornecido' }, { status: 400 });
  }

  try {
    const response = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      // CORREÇÃO 1: Trocado JSON.stringify por new URLSearchParams
      body: new URLSearchParams({
        client_id: process.env.MP_CLIENT_ID,
        client_secret: process.env.MP_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://iffood.shop/api/auth/callback',
      }),
    });

    const data = await response.json();

    // Se o Mercado Pago devolver um erro (ex: invalid_grant), forçamos a cair no catch
    if (data.error) {
      throw new Error(`Erro MP: ${data.message || data.error}`);
    }

    const tokenDoVendedor = data.access_token;
    const idDoVendedorNoMP = data.user_id;
    console.log(tokenDoVendedor)
    console.log(idDoVendedorNoMP)
    // CORREÇÃO 2: 'idturma' agora está entre aspas
    const { error: ErrorToken } = await supabase
      .from('admin')
      .update({ acess_token: tokenDoVendedor, idvendedor: idDoVendedorNoMP })
      .eq('idturma', state);
    
    if (ErrorToken) {
        console.error('Erro ao salvar no Supabase:', ErrorToken);
        return NextResponse.redirect(new URL('/', request.url));
    }
    
    console.log(`Sucesso! Barraca ${state} vinculada. MP ID: ${idDoVendedorNoMP}`);

    return NextResponse.redirect(new URL('/', request.url));

  } catch (error) {
    // Melhoramos o console para te mostrar a fofoca inteira do erro!
    console.error('Erro no fluxo OAuth:', error.message || error);
    return NextResponse.redirect(new URL('/admin', request.url));
  }
}