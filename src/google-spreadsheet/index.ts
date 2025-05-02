import { google } from 'googleapis';
import { type JWT } from 'google-auth-library';

export type GoogleSpreadsheetConnector = {
  read: (id: string, sheet: string, range: string) => Promise<string[][]>;
  write: (
    id: string,
    sheet: string,
    range: string,
    values: unknown[][],
  ) => Promise<void>;
};

export type GoogleCredential = {
  credential: {
    client_email: string;
    private_key: string;
  };
};

/**
 * Read data from a Google Spreadsheet
 *
 * @param auth - Google auth object
 * @param id
 * @param sheet
 * @param range
 */
async function read(
  auth: JWT,
  spreadsheetId: string,
  sheet: string,
  range: string,
) {
  const sheetInstance = google.sheets({
    auth,
    version: 'v4',
  });
  const result = await sheetInstance.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheet}!${range}`,
  });
  const values: string[][] = (result.data.values ?? []) as string[][];
  return values;
}

// eslint-disable-next-line max-params
async function write(
  auth: JWT,
  spreadsheetId: string,
  sheet: string,
  range: string,
  values: unknown[][],
) {
  const sheetInstance = google.sheets({
    auth,
    version: 'v4',
  });
  await sheetInstance.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheet}!${range}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values,
    },
  });
}

export function googleSpreadsheet(
  googleCredential: GoogleCredential,
): GoogleSpreadsheetConnector {
  const auth = new google.auth.JWT(
    googleCredential.credential.client_email,
    undefined,
    googleCredential.credential.private_key.replaceAll('\\n', '\n'),
    'https://www.googleapis.com/auth/spreadsheets',
  );
  return {
    read: read.bind(null, auth),
    write: write.bind(null, auth),
  } satisfies GoogleSpreadsheetConnector;
}
