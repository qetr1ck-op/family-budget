import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (_: VercelRequest, response: VercelResponse) => {
  response.redirect(301, '/api/health-check');
};
