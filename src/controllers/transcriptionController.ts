import { Request, Response, NextFunction } from "express";
import { ClientSession } from "mongoose";
import transcriptionService from "../services/transcriptionService";
import util from "../utils/commanUtil";

/**
 * Controller to handle transcription creation
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction for error handling
 * @returns Sends a JSON response with success or error message
 */
async function createTranscription(req: Request, res: Response, next: NextFunction) {
  try {
    const audioUrl = req.body?.audioUrl;
    const mongoSession = req.mongoSession as ClientSession;
    
    if (!audioUrl) throw util.customError("Audio Url is required", 400);

    const result = await transcriptionService.handleTranscription(mongoSession, audioUrl);

    console.log("Transcription created successfully :", result);
    
    return util.sendResponse(res, 200, "Transcription created successfully", result);
    
  } catch (err) {
    return util.sendResponse(res, (err as any).statusCode, (err as any).message);
  }
}

export default{ createTranscription };

