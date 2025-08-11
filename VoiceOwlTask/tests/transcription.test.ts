import { expect } from "chai";
import { describe, it } from "mocha";
import sinon from "sinon";
import { Request, Response } from "express";
import { ClientSession, ObjectId, Types } from "mongoose";
import transcriptionController from "../src/controllers/transcriptionController";
import transcriptionService from "../src/services/transcriptionService";
import util from "../src/utils/commanUtil";
import TranscriptionModel from "../src/models/TranscriptionModel";

describe("Transcription Flow", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mongoSession: Partial<ClientSession>;
  let sendResponseStub: sinon.SinonStub;

  beforeEach(() => {
    mongoSession = { startTransaction: sinon.stub(), commitTransaction: sinon.stub(), abortTransaction: sinon.stub(), endSession: sinon.stub() };
    sendResponseStub = sinon.stub();

    req = {
      body: { audioUrl: "http://mock-audio.com/file.mp3" },
      mongoSession: {} as ClientSession,
    } as unknown as Request;

    res = {
      statusCode: 200,
      on: sinon.stub().callsFake((_event, cb) => cb()), // simulate res.on("finish")
    } as any;

    sinon.stub(util, "sendResponse").callsFake(sendResponseStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Controller: createTranscription", () => {
    it("should return 200 and success message when transcription succeeds", async () => {
      const fakeResult = { id: "abc123" };
      sinon.stub(transcriptionService, "handleTranscription").resolves(fakeResult);

      await transcriptionController.createTranscription(req as Request, res as Response, () => {});

      expect(sendResponseStub.calledWith(res, 200, "Transcription created successfully", fakeResult)).to.be.true;
    });

    it("should return 400 if audioUrl is missing", async () => {
      req.body = {}; // remove audioUrl

      await transcriptionController.createTranscription(req as Request, res as Response, () => {});

      expect(sendResponseStub.calledWith(res, 400, "Audio Url is required")).to.be.true;
    });

    it("should return error message if service throws", async () => {
      sinon.stub(transcriptionService, "handleTranscription").rejects(util.customError("Service failed", 500));

      await transcriptionController.createTranscription(req as Request, res as Response, () => {});

      expect(sendResponseStub.calledWith(res, 500, "Service failed")).to.be.true;
    });
  });

  describe("Service: handleTranscription", () => {
    let createStub: sinon.SinonStub;

    beforeEach(() => {
      createStub = sinon.stub(TranscriptionModel, "create");
    });

    it("should save transcription and return id", async () => {
      createStub.resolves([{ _id: "mock-id-123" }]);

      const result = await transcriptionService.handleTranscription(mongoSession as ClientSession, "http://mock-audio.com/file.mp3");

      expect(result).to.deep.equal({ id: "mock-id-123" });
      expect(createStub.calledOnce).to.be.true;
    });

    it("should retry on failure and eventually throw error", async () => {
        const newRecordId = new Types.ObjectId();
        // Stub DB to succeed if reached
        createStub.resolves([{ _id: newRecordId } as any]);

        try {
          await transcriptionService.handleTranscription( mongoSession as ClientSession,  "http://corrupted-audio.com/file.mp3" );
          throw new Error("Should have thrown");
        } catch (err: any) {
          expect(err.message).to.equal("Download failed");
        }
      });
  });
});
