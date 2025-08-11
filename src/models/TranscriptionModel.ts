import mongoose from "mongoose";

const TranscriptionSchema = new mongoose.Schema({
  audioUrl: String,
  transcript: String,
  createdAt: { type: Date, default: Date.now }
});

const Transcription = mongoose.model("Transcription", TranscriptionSchema);

export default Transcription;
