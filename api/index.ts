import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async (request: VercelRequest, response: VercelResponse) => {
  try {
    const { name = 'World' } = request.query;

    const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      private_key: process.env.GOOGLE_PRIVATE_KEY!,
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    await sheet.addRow({
      id: 'ZuHWzqkKGVo=1',
      time: '1627747443',
      description: 'Покупка щастя123',
      amount: '-10000',
    });

    response.status(200).send(`Health ${name}!`);
  } catch (error) {
    response.status(500).send(error);
  }
};
