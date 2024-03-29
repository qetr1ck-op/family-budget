import LogRocket from 'logrocket';

import { logService } from './../../services/log.service';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { googleSheet } from '../../services/google-sheet.service';
import { monoParserService, MonoTransactionRequest } from '../../services/mono-parser.service';

// TODO: as part fo log service
LogRocket.init('p7a5ke/family-budget');

export default async (request: VercelRequest, response: VercelResponse) => {
  const payload: MonoTransactionRequest = request.body;

  logService.log(`Incoming request`);
  logService.log(`Method: ${request.method}`);
  logService.log(`Payload: ${JSON.stringify(payload, null, 2)}`);

  try {
    if (monoParserService.isIncomingTransaction(payload.data.statementItem)) {
      logService.log(`Skip incoming transaction`);

      response.status(200).send('Ok');

      return;
    }
    await googleSheet.auth();

    const transaction = monoParserService.parseTransaction(payload.data.statementItem);

    logService.log(`Publish data:`);
    logService.log(transaction);

    await googleSheet.sheet.addRow(transaction);

    response.status(200).send('Ok');
  } catch (error: any) {
    logService.log(`Error handling request:`);
    logService.log(error);

    response.status(500).send(error.toString());
  }
};
