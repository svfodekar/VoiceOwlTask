import { ClientSession } from 'mongoose';

declare global {
  declare namespace Express {
    export  interface Request {
      mongoSession?: ClientSession;
    }
  }
}

export {};
