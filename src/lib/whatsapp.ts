export async function sendWhatsAppNotification(to: string, message: string) {
  const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID || 'MOCK_PHONE_ID';
  const WHATSAPP_API_URL = `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`;
  const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || 'mock-whatsapp-token';

  try {
    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
      })
    });

    if (!response.ok) {
      console.warn('⚠️ [Mock Fallback] Token de WhatsApp inválido o no configurado.');
      console.log(`💬 [WhatsApp Mock] Mensaje interceptado para ${to}:\n"${message}"`);
      return { success: true, mock: true };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error enviando WhatsApp:', error);
    console.log(`💬 [WhatsApp Mock] Mensaje interceptado (por error) para ${to}:\n"${message}"`);
    return { success: true, mock: true };
  }
}
