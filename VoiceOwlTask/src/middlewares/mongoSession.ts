import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

async function injectMongoSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("Starting MongoDB session");
  const session = await mongoose.startSession();
  session.startTransaction();
  req.mongoSession = session;
  console.log("MongoDB transaction started");

  res.on("finish", async () => {
    if (res.statusCode < 400) {
      await session.commitTransaction();
      console.log("Transaction committed successfully");
    } else {
      await session.abortTransaction();
      console.log("Transaction aborted");
    }
    session.endSession();
    console.log("MongoDB session ended");
  });

  next();
}

export default injectMongoSession;
