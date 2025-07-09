import axios from "./axios.ts";

// The structure of the response from the API
export interface PanicResponse {
  id: number;
  status: {
    id: number;
    name: string;
  };
  panic_type: string;
  latitude: string;
  longitude: string;
  details: string;
  created_at: string;
}

// The structure of the request to the API
export interface CreatePanicRequest {
  latitude: number;
  longitude: number;
  panic_type: string;
  details: string;
}

/**
 * Sends a request to the API to create a new panic alert
 * @param panicData The data for the new panic alert
 * @returns The updated array of panic alerts
 */
export const createPanic = async (panicData: CreatePanicRequest): Promise<PanicResponse> => {
  const response = await axios.post<{ data: PanicResponse }>("/panic/send", panicData);
  return response.data.data;
};

/**
 * Sends a request to the API to cancel a panic alert
 * @param panicId The ID of the panic alert to cancel
 * @returns The updated array of panic alerts
 */
export const cancelPanic = async (panicId: number): Promise<PanicResponse> => {
  // Formats the request body to match the API's expected format
  const formatRequestBody = {
    panic_id: panicId
  };
  const response = await axios.post<{ data: PanicResponse }>("/panic/cancel/", formatRequestBody);
  return response.data.data;
};

/**
 * Sends a request to the API to get the history of panic alerts
 * @returns An array of previously created panic alerts
 */
export const getPanicHistory = async (): Promise<PanicResponse[]> => {
    const response = await axios.get<{ data: { panics: PanicResponse[] } }>("/panic/history");
    return response.data.data.panics;
};
