export const sendTelegramMessage = async (message: string) => {
  // Vercel 환경변수 인식이 계속 실패하여 직접 값을 주입합니다 (하드코딩).
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || 
                import.meta.env.VITE_TELEGRAM_BOT || 
                '8656239511:AAHvdZ9zI2fGcSW-wrHNjdnSRBYtTEoWj_c';
                
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID || '8745161114';

  if (!token) {
    console.error('Telegram bot token is not set.');
    throw new Error('텔레그램 봇 토큰이 설정되지 않았습니다. (VITE_TELEGRAM_BOT_TOKEN)');
  }
  
  if (!chatId) {
    console.error('Telegram chat ID is not set.');
    throw new Error('텔레그램 챗 아이디가 설정되지 않았습니다. (VITE_TELEGRAM_CHAT_ID)');
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
    
    // 성공 시 디버깅을 위해 토큰 끝자리와 챗아이디 반환
    return {
      tokenEnd: token.slice(-4),
      chatId: chatId
    };
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    throw error;
  }
};
