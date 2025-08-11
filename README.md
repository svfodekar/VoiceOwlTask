# ⚙ VoiceOwl Backend

A Node.js + TypeScript backend for handling audio transcription requests using **Express** and **MongoDB**.  
Follows a service–controller pattern with JWT authentication and per-request MongoDB transactions.

---
<img width="762" height="526" alt="Screenshot 2025-08-12 at 1 33 25 AM" src="https://github.com/user-attachments/assets/6e1e127b-99cc-43cf-a6aa-937a3664e3e8" />

---



## ⚙ How It Works

1. **JWT Authentication (`middlewares/auth`)**  
   All `/api` routes are protected by `jwtAuth`. Only valid tokens allow access *(Mock only)*.

2. **MongoDB Transaction Session (`middlewares/mongoSession`)**  
   Every request starts a MongoDB transaction, which is committed or rolled back based on the response status code.

3. **Transcription Workflow (`services/transcriptionService`)**  
   - Simulates downloading an audio file from the provided URL.
   - Simulates transcribing the audio.
   - Saves the transcription result into MongoDB within the active transaction.
   - Retries failed attempts up to `MAX_RETRIES` (configurable via `.env`).

4. **Error Handling & Responses (`utils/commanUtil`)**  
   Provides a consistent API response structure with success/error status, message, and optional data.

---

## ⚙ Assumptions Made

- **Authentication**: JWT middleware is expected to verify tokens and attach user context 
- **Audio URL Validity**: The provided `audioUrl` is assumed to be publicly accessible or retrievable.
- **Mock Implementation**: Transcription, download processes, and JWT authentication flow are simulated for testing; no actual services are integrated.
- **MongoDB Connection**: Connection string and IP whitelisting are handled externally via **MongoDB Atlas**.

---
## ⚙ Immediate Improvements
- Payload validation using **Joi** before processing requests.  
- CORS config to only allow whitelisted origins from `.env`.  
- Replace `console.log` with **Winston** for leveled logging & timestamps.  
- Implement global error handler middleware for cleaner error responses.  
- Ensure `jwtAuth` middleware skips public endpoints like `/auth/login`.  
- Add unit tests for middlewares as well.  
- Use key vaults (AWS Secrets Manager / Azure Key Vault) instead of `.env` for secrets.  
- Add request body size limits with `express.json({ limit: "2mb" })` to prevent abuse.  
- Enable `helmet` middleware for setting secure HTTP headers.  
- Sanitize user inputs to prevent NoSQL injection (e.g., using `express-mongo-sanitize`).  
- Add rate limiting (e.g., `express-rate-limit`) to protect against brute-force attacks.  
- Standardize API responses across all controllers.
- Use **JSDoc** in route files to auto-generate Swagger API docs.  
---

## ⚙ Installation & Setup

---

- **Environment Variables**  
  Create a `.env` file in the root directory with the following values:  
  ```env
  PORT=3000
  MONGO_URI=mongodb+srv://<username>:<password>@cluster-url/dbname
  JWT_SECRET=your_jwt_secret
  MAX_RETRIES=3
  ```

---

- **Install Dependencies**  
  ```bash
  npm install
  ```

- **Start Development Server**  
  ```bash
  npm run dev
  ```

- **Run Unit Tests**  
  ```bash
  npm run test
  ```

- **Build for Production**  
  ```bash
  npm run build
  ```

- **Run Production Build**  
  ```bash
  npm start
  ```

## ⚙ API Information

**POST - ``` /api/transaction```** 
  Creates a new transaction in the system.

####  Payload Example
```json
{
    "audioUrl" : "www.test-url.com/abc/mp3"
}
```
####  Response Example
```json
{
    "status": "SUCCESS",
    "message": "Transcription created successfully",
    "data": {
        "id": "6899b8c5242430d5b5d88bca"
    }
}
```

---
## ⚙ Data Storage in Database
<img width="966" height="329" alt="Screenshot 2025-08-12 at 2 01 44 AM" src="https://github.com/user-attachments/assets/96f5942d-f8c5-40ba-af1e-e11583b91989" />



