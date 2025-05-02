import { createReadStream } from 'node:fs';
import axios from 'axios';
import FormData from 'form-data';

export function telegramConnector(token: string) {
  return {
    sendTelegramMessage: sendTelegramMessage.bind(null, token),
    uploadTelegramFile: uploadTelegramFile.bind(null, token),
  };
}

async function uploadTelegramFile(
  token: string,
  {
    file,
    chatId,
    caption,
  }: {
    chatId: string;
    caption: string;
    file: string;
  },
) {
  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('photo', createReadStream(file));
  formData.append('caption', caption);
  return axios
    .post(`https://api.telegram.org/bot${token}/sendPhoto`, formData, {
      headers: formData.getHeaders(),
    })
    .then((response) => response.data as unknown);
}

async function sendTelegramMessage(
  token: string,
  {
    chatId,
    text,
    parseMode = 'Markdown',
  }: {
    parseMode?: 'Markdown' | 'HTML';
    chatId: string;
    text: string;
  },
) {
  return axios
    .request({
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://api.telegram.org/bot${token}/sendMessage`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        chat_id: chatId,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        parse_mode: parseMode,
        text,
      }),
    })
    .then((response) => response.data as unknown);
}
