import { ClientSession } from "mongoose";
import TranscriptionModel from "../models/TranscriptionModel";
import { setTimeout } from "timers/promises";
import util from "../utils/commanUtil";

const MAX_RETRIES = Number(process.env.MAX_RETRIES) || 1;

/**
 * Handles the transcription workflow:
 *  - Downloads the audio from a given URL.
 *  - Simulates transcription.
 *  - Stores the result in MongoDB within a transaction session.
 *
 * Retries on failure up to MAX_RETRIES times.
 *
 * @param {ClientSession} session - The MongoDB transaction session.
 * @param {string} audioUrl - The URL of the audio to transcribe.
 * @returns {Promise<{ id: string }>} - The saved transcription record.
 * @throws {Error} - If all retry attempts fail.
 */
 async function handleTranscription(session: ClientSession, audioUrl: string): Promise<{ id: string }> {

   let retryAttempts = 0;
   let lastError: Error | null = null;

   while (retryAttempts < +MAX_RETRIES) {
     try {
       // 1. Simulate audio download
       const audioBuffer = await mockDownloadAudio(audioUrl);

       // 2. Simulate transcription process
       const transcriptText = await mockTranscriptOperation(audioBuffer);

       // 3. Save to MongoDB
       const transcriptionRecord = {
         audioUrl,
         transcript: transcriptText,
         createdAt: new Date(),
       };

       const [createdDoc] = await TranscriptionModel.create(
         [transcriptionRecord],
         { session }
       );
       return { id: createdDoc._id.toString() };
     } catch (error) {
       lastError = error as Error;
       retryAttempts++;
       console.warn(`Attempt ${retryAttempts} failed: ${lastError.message}`);
     }
   }

   console.error(`All ${MAX_RETRIES} attempts failed for ${audioUrl}`);
   throw lastError || util.customError("Transcription failed after retries", 503);
 }

async function mockTranscriptOperation(audioBuffer: Buffer): Promise<string> {
  await setTimeout(Math.random() * 200 + 100); // 100-300ms delay

  if (Math.random() < 0.05) {
    throw util.customError("Audio processing failed - poor audio quality", 422);
  }

  return "This is the transcribed text from the audio file. It contains the spoken words from the recording.";
}


async function mockDownloadAudio(url: string): Promise<Buffer> {
  await setTimeout(Math.random() * 200 + 100); // 100-300ms delay

  if (Math.random() < 0.05) {
    throw util.customError(`Failed to download audio from ${url}`, 404);
  }

  return Buffer.from(`mock-audio-data-from-${url}`);
}



export default { handleTranscription};