import { GoogleSpreadsheet } from 'google-spreadsheet';

class GoogleSheet {
  doc: GoogleSpreadsheet;

  constructor() {
    this.doc = new GoogleSpreadsheet(process.env.SHEET_ID);
  }

  async auth() {
    await this.doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      private_key: process.env.GOOGLE_PRIVATE_KEY!,
    });

    await this.doc.loadInfo();
  }

  get sheet() {
    return this.doc.sheetsByIndex[0];
  }
}

export const googleSheet = new GoogleSheet();
