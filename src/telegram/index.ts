import axios from 'axios';
import FormData from 'form-data';
import { createReadStream } from 'fs';

export function telegramConnector(token: string) {
  return {
    sendTelegramMessage: sendTelegramMessage.bind(null, token),
    uploadTelegramFile: uploadTelegramFile.bind(null, token),
  };
}

function uploadTelegramFile(
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
    .then((res) => res.data);
}

function sendTelegramMessage(
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
        chat_id: chatId,
        parse_mode: parseMode,
        text: text,
      }),
    })
    .then((res) => res.data);
}
