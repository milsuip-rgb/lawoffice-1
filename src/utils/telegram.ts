export const sendTelegramMessage = async (message: string) => {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || import.meta.env.VITE_TELEGRAM_BOT;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID || '8745161114';

  if (!token) {
    console.warn('Telegram Bot Token is missing. Notification skipped.');
    return false;
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
      throw new Error(`Telegram API error: ${errorData.description || response.statusText}`);
    }
    return true;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    throw error;
  }
};
