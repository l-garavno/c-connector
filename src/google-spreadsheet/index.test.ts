import { expect, describe, test, beforeEach } from 'vitest';
import { GoogleCredential, GoogleSpreadsheetConnector } from './index';
import { googleSpreadsheet } from '../index';

describe('google-spreadsheet', () => {
  let gsConnector: GoogleSpreadsheetConnector;
  const sheetId = '1y9cUHYtSsbseUVV0-pdSsnXDtN97j31LBPJVDJ8qJWA';
  const sheetName = 'test-library';

  beforeEach(() => {
    const credential: GoogleCredential = {
      credential: {
        client_email: process.env.VITE_ENV_GOOGLE_CONNECTOR_CLIENT_EMAIL || '',
        private_key:
          process.env.VITE_ENV_GOOGLE_CONNECTOR_CLIENT_PRIVATE_KEY || '',
      },
    };
    gsConnector = googleSpreadsheet(credential);
  });

  test('should read data from a google spreadsheet', async () => {
    const range = 'A1:C6';
    const result = await gsConnector.read(sheetId, sheetName, range);
    expect(result).toMatchInlineSnapshot(`
      [
        [
          "DATE TIME (UTC)",
          "BTC OI",
          "ETH OI",
        ],
        [
          "2025-04-10 0:00",
          "12,148",
          "4,056",
        ],
        [
          "2025-04-10 0:10",
          "12,121",
          "4,069",
        ],
        [
          "2025-04-10 0:20",
          "12,119",
          "4,069",
        ],
        [
          "2025-04-10 0:30",
          "12,119",
          "4,069",
        ],
        [
          "2025-04-10 0:40",
          "12,106",
          "4,044",
        ],
      ]
    `);
  });

  test('should write data to a google spreadsheet', async () => {
    const range = 'E2:F3';
    const date = new Date().toLocaleString();
    const values = [
      ['Run at', date],
      ['Run by', 'Google Sheets Connector'],
    ];
    await gsConnector.write(sheetId, sheetName, range, values);
    const result = await gsConnector.read(sheetId, sheetName, range);
    expect(result).toMatchInlineSnapshot(`
      [
        [
          "Run at",
          "${date}",
        ],
        [
          "Run by",
          "Google Sheets Connector",
        ],
      ]
    `);
  });
});
