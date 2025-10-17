import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer } from '../server/_core/index';

let serverInstance: any = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!serverInstance) {
    serverInstance = await createServer();
  }
  
  return serverInstance(req, res);
}

