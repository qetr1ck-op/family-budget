import { logService } from './../../services/log.service';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { googleSheet } from '../../services/google-sheet.service';
import { monoParserService } from '../../services/mono-parser.service';

export default async (request: VercelRequest, response: VercelResponse) => {
  logService.log(`Incoming request`);
  logService.log(`Method: ${request.method}`);
  logService.log(`Payload: ${JSON.stringify(request.body, null, 2)}`);

  try {
    await googleSheet.auth();

    const transaction = monoParserService.toTransaction(request.body.data.statementItem);

    logService.log(`Publish data:`);
    logService.log(transaction);

    await googleSheet.sheet.addRow(transaction);

    response.status(200).send('Ok');
  } catch (error) {
    logService.log(`Error handling request:`);
    logService.log(error);

    response.status(500).send(error.toString());
  }
};
