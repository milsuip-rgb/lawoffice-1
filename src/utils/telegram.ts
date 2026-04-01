export const sendTelegramMessage = async (message: string) => {
  // 1. Vercel 환경변수 시도
  // 2. AI Studio 환경변수 시도
  // 3. 최후의 수단: 하드코딩된 토큰 (디버깅용)
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || 
                import.meta.env.VITE_TELEGRAM_BOT || 
                '8656239511:AAHvdZ9zl2fGcSW-wrHNjdnSRBYtTEoWj_c';
                
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID || '8745161114';

  if (!token) {
    console.error('Telegram bot token is not set.');
    throw new Error('텔레그램 봇 토큰이 설정되지 않았습니다. (VITE_TELEGRAM_BOT_TOKEN)');
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error:', errorData);
      throw new Error(`텔레그램 전송 실패: ${errorData.description || response.statusText}`);
    }
    return true;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    throw error;
  }
};
