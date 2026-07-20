import { MercadoPagoConfig, Payment } from 'mercadopago';

// Configuración del cliente de Mercado Pago
// Asegúrate de que MP_ACCESS_TOKEN esté definido en .env.local
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || 'APP_USR-mock-token-for-dev' 
});

export const payment = new Payment(client);
