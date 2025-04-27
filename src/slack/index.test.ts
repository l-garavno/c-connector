import { describe, expect, test } from 'vitest';
import { slackNotify } from '../index';

describe('slack', () => {
  test('should send a message to a slack channel', async () => {
    const response = await slackNotify({
      hook: process.env.VITE_ENV_SLACK_HOOK || '',
      title: 'C-Notifier API Test',
      content:
        'From: C-Notifier anonymous tester (new version)\nMessage: The C-Notifier API is working well. You can now use it to send Slack notifications',
      attachments: [
        {
          author_name: 'Anonymous Tester that you know who',
        },
      ],
    });
    expect(response).toBeDefined();
  });
});
