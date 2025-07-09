import axios from "axios";

/**
 * Provides a user-friendly fallback error message to the user if 
 * the API does not return a message for the failed API request.
 * 
 * @param error - The error object caught from an API request
 * @returns A user-friendly error message string
 * 
 * @example
 * try {
 *   await axios.post('/login', { email, password });
 * } catch (err) {
 *   setError(getApiErrorMessage(err));
 * }
 */
export const getApiErrorMessage = (error: unknown): string => {
  // Check if it is a network error
  if (!axios.isAxiosError(error)) {
    return "Network error — please check your connection.";
  }

  const statusCode = error.response?.status;
  const apiErrorMessage = error.response?.data?.message

  switch (statusCode) {
    case 400: // Bad Request — the payload didn't pass validation checks
      return apiErrorMessage ?? "Validation failed — please check your input.";
    case 401: // Unauthorised — incorrect login details / missing token
      return apiErrorMessage ?? "Unauthorised — please log in again.";
    case 403: // Forbidden — logged in but not given access to the resource
      return apiErrorMessage ?? "Forbidden — you don't have access to this resource.";
    case 404: // Not Found — the resource doesn't exist
      return apiErrorMessage ?? "404 — Not Found.";
    case 429: // Too Many Requests — too many requests in a short amount of time
      return apiErrorMessage ?? "Too many requests — Please wait a moment before trying again.";
    default: // Server Error — 500, 502, timeouts, etc.
      return apiErrorMessage ?? "Something went wrong — please try again.";
  }
};
