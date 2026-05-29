export default function ConfigurarPagamento({idAdmin}) {
  const clientId =  process.env.MP_CLIENT_ID; // Substitua pelo seu Client ID real
  const redirectUri = encodeURIComponent("https://iffood.shop/api/auth/callback");
  const idBarraca = idAdmin; // ID que você deu para a barraca no seu banco
  
  const linkMercadoPago = `https://auth.mercadopago.com/authorization?client_id=${clientId}&response_type=code&platform_id=mp&state=${idBarraca}&redirect_uri=${redirectUri}`;

  return (
    <div className="p-8">
      <h2>Vincule sua conta para receber os pagamentos</h2>
      <p>Clique no botão abaixo para autorizar nosso sistema a realizar o split.</p>
      
      <a 
        href={linkMercadoPago}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 inline-block mt-4"
      >
        Conectar meu Mercado Pago
      </a>
    </div>
  );
}