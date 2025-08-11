import { Response } from "express";

/**
 * Generic API response sender
 *
 * @param res - Express Response object
 * @param statusCode - HTTP status code (e.g., 200, 404, 500)
 * @param message - Description message
 * @param data - Optional payload or error object
 */
async function sendResponse(
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) {
  const isSuccess = statusCode >= 200 && statusCode < 300;
  statusCode = !isSuccess && !statusCode ? 500 : statusCode;
  message = !isSuccess && !message ? "An unexpected error occurred" : message;

  const response = {
    status: isSuccess ? "SUCCESS" : "ERROR",
    message,
    data,
  };

  return res.status(statusCode).json(response);
}

/**
 * Creates a custom error with attached HTTP status code
 *
 * @param message - Error message
 * @param statusCode - HTTP status code (e.g., 400, 404, 500)
 * @returns Error object with statusCode
 */
export function customError(message: string, statusCode: number) {
  return Object.assign(new Error(message), { statusCode });
}

export default { sendResponse, customError};
