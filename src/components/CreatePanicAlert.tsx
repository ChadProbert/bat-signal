import { useState } from "react";
import { createPanic, type CreatePanicRequest } from "../api/panicService";
import { getApiErrorMessage } from "../utils/errorMessages";
import { MapPinIcon } from "@heroicons/react/24/outline";

const PANIC_TYPES = [
  { value: "robbery", label: "Bank Robbery" },
  { value: "assault", label: "Assault" },
  { value: "murder", label: "Murder" },
  { value: "mugging", label: "Mugging" },
  { value: "arson", label: "Arson" },
  { value: "explosion", label: "Explosion" },
  { value: "burglary", label: "Burglary" },
  { value: "other", label: "Other" },
];

interface CreatePanicAlertProps {
  onPanicCreated: () => void;
}

interface FormData {
  latitude: string;
  longitude: string;
  panic_type: string;
  details: string;
}

const CreatePanicAlert = ({ onPanicCreated }: CreatePanicAlertProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    latitude: "",
    longitude: "",
    panic_type: PANIC_TYPES[0].value,
    details: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.latitude || !formData.longitude) {
      setError("Please provide location coordinates.");
      return;
    }

    const latitude = parseFloat(formData.latitude);
    const longitude = parseFloat(formData.longitude);

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      setError("Latitude must be a number between -90 and 90.");
      return;
    }
    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      setError("Longitude must be a number between -180 and 180.");
      return;
    }

    if (formData.details.length > 200) {
      setError("Details must be less than 200 characters.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const panicData: CreatePanicRequest = {
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        panic_type: formData.panic_type,
        details: formData.details,
      };

      await createPanic(panicData);
      onPanicCreated(); // Triggers a re-render of the PanicHistory component
      
      setFormData({
        latitude: "",
        longitude: "",
        panic_type: PANIC_TYPES[0].value,
        details: "",
      });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-4 items-center">
          <div>
            <label
              htmlFor="latitude"
              className="block text-sm font-medium text-black"
            >
              Latitude:
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon className="h-5 w-5 text-neutral-500" />
              </div>
              <input
                type="number"
                step="any"
                name="latitude"
                id="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                className="block w-full bg-white px-3 py-1.5 pl-10 text-base text-black outline-1 -outline-offset-1 outline-neutral-300 placeholder:text-neutral-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                placeholder="e.g. 40.7128"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="longitude"
              className="block text-sm font-medium text-black"
            >
              Longitude:
            </label>
            <div className="mt-1 relative shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon className="h-5 w-5 text-neutral-500" />
              </div>
              <input
                type="number"
                step="any"
                name="longitude"
                id="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                className="block w-full bg-white px-3 py-1.5 pl-10 text-base text-black outline-1 -outline-offset-1 outline-neutral-300 placeholder:text-neutral-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                placeholder="e.g. -74.0060"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <label
            htmlFor="panic_type"
            className="block text-sm font-medium text-black mb-1"
          >
            Emergency Type:
          </label>
          <select
            id="panic_type"
            name="panic_type"
            value={formData.panic_type}
            onChange={handleInputChange}
            className="block w-half bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-neutral-300 placeholder:text-neutral-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
          >
            {PANIC_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8 mb-8">
          <label
            htmlFor="details"
            className="block text-sm font-medium text-black"
          >
            Incident Details:
          </label>
          <div className="mt-1">
            <textarea
              rows={3}
              name="details"
              id="details"
              value={formData.details}
              onChange={handleInputChange}
              maxLength={200}
              className="block w-full bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-neutral-300 placeholder:text-neutral-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6 min-h-[100px]"
              placeholder="Please provide details about the emergency..."
            />
            <p className="mt-1 text-right text-xs text-neutral-500">
              {formData.details.length}/200
            </p>
          </div>
        </div>

        {error && (
          <div>
            <p className="text-red-600 text-center text-sm">{error}</p>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`flex w-full justify-center bg-black px-3 py-3 text-sm font-semibold text-white shadow-xs hover:bg-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending Alert...
              </>
            ) : (
              <>Send →</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePanicAlert;
