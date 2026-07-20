import { NextResponse } from 'next/server';
import { sendWhatsAppNotification } from '@/lib/whatsapp';

export async function POST(request: Request) {
  try {
    const { to, message } = await request.json();
    
    if (!to || !message) {
      return NextResponse.json({ error: 'Faltan parámetros (to, message)' }, { status: 400 });
    }

    const result = await sendWhatsAppNotification(to, message);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('WhatsApp Endpoint Error:', error);
    return NextResponse.json({ error: 'Fallo al enviar notificación' }, { status: 500 });
  }
}
