import { stringify } from 'yaml';
import axios from 'axios';

export async function slackNotify({
  hook,
  title,
  content,
  attachments,
}: {
  hook: string;
  title: string;
  content: string | Record<string, unknown>;
  icon?: string;
  attachments?: Array<Record<string, string>>;
}) {
  const response = await axios.request({
    method: 'POST',
    url: `https://hooks.slack.com/services/${hook}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      text: `*${title}*\n\`\`\`${formatContent(content)}\`\`\``,
      attachments,
    }),
  });
  return response.data as unknown;
}

function formatContent(content: string | Record<string, unknown>): string {
  if (typeof content === 'object') {
    return stringify(content);
  }

  return content;
}
