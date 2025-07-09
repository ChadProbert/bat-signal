import { useEffect, useState } from "react";
import { getPanicHistory, cancelPanic } from "../api/panicService";
import type { PanicResponse } from "../api/panicService";
import { getApiErrorMessage } from "../utils/errorMessages";
import PanicHistorySkeleton from "./PanicHistorySkeleton";
import "./PanicHistory.css";

const PanicHistory = () => {
  const [history, setHistory] = useState<PanicResponse[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null); // Tracks which panic alert is opened
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [cancelError, setCancelError] = useState<Record<string, string>>({});

  // Gets the panic history from the API, sorts by newest first, and limits to 10 most recent
  const fetchHistory = async () => {
    try {
      const data = await getPanicHistory();
      // Sort by created_at in descending order (newest first)
      const sortedData = [...(data || [])].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);
      setHistory(sortedData);
      setError("");
    } catch (err) {
      setError(getApiErrorMessage(err));
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCancelPanic = async (panicId: number) => {
    setIsCancelling(prev => ({ ...prev, [panicId]: true }));
    setCancelError(prev => ({ ...prev, [panicId]: "" }));

    try {
      await cancelPanic(panicId);
      await fetchHistory(); // Refresh the history to show the updated panic status
    } catch (err) {
      setCancelError(prev => ({ ...prev, [panicId]: getApiErrorMessage(err) }));
    } finally {
      setIsCancelling(prev => ({ ...prev, [panicId]: false }));
    }
  };

  // Sets the panic status icon based on the status number returned from the API
  const setPanicStatusIcon = (status: number) => {
    switch (status) {
      case 1: // In Progress
        return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-red-500 animate-ping mr-2">
        <path fillRule="evenodd" d="M5.636 4.575a.75.75 0 0 1 0 1.061 9 9 0 0 0 0 12.728.75.75 0 1 1-1.06 1.06c-4.101-4.1-4.101-10.748 0-14.849a.75.75 0 0 1 1.06 0Zm12.728 0a.75.75 0 0 1 1.06 0c4.101 4.1 4.101 10.75 0 14.85a.75.75 0 1 1-1.06-1.061 9 9 0 0 0 0-12.728.75.75 0 0 1 0-1.06ZM7.757 6.697a.75.75 0 0 1 0 1.06 6 6 0 0 0 0 8.486.75.75 0 0 1-1.06 1.06 7.5 7.5 0 0 1 0-10.606.75.75 0 0 1 1.06 0Zm8.486 0a.75.75 0 0 1 1.06 0 7.5 7.5 0 0 1 0 10.606.75.75 0 0 1-1.06-1.06 6 6 0 0 0 0-8.486.75.75 0 0 1 0-1.06ZM9.879 8.818a.75.75 0 0 1 0 1.06 3 3 0 0 0 0 4.243.75.75 0 1 1-1.061 1.061 4.5 4.5 0 0 1 0-6.364.75.75 0 0 1 1.06 0Zm4.242 0a.75.75 0 0 1 1.061 0 4.5 4.5 0 0 1 0 6.364.75.75 0 0 1-1.06-1.06 3 3 0 0 0 0-4.243.75.75 0 0 1 0-1.061ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
          </svg>
      ;
      case 2: // Cancelled
        return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-green-500 mr-2">
        <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
          </svg>
      ;
      case 3: // Resolved — Not really used, but added for scalability
        return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-green-500 mr-2">
        <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
          </svg>
      ;
      default: // Unknown — A panic status was not returned from the API
        return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-neutral-600 mr-2">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
          </svg>
    }
  };

  // Formats the date string returned from the API
  const formatDate = (dateString: string) => {
    const date = new Date(dateString).toLocaleString().split(",")[0];
    const time = new Date(dateString).toLocaleString().split(",")[1].substring(1, 6);
    const today = new Date().toLocaleString().split(",")[0];
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleString().split(",")[0];

    // If the data is today's date, display "Today" and the time
    if (date === today) {
      return "Today, " + time;
    }

    // If the date is yesterday's date, display "Yesterday" and the time
    if (date === yesterday) {
      return "Yesterday, " + time;
    }

    return date + ", " + time;
  };

  if (isLoading) {
    return <PanicHistorySkeleton />;
  }

  if (error) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm text-red-600 sm:text-base">{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-sm text-neutral-500 sm:text-base">
          No panic history found
        </p>
      </div>
    );
  }

  // Toggles the details of a panic alert
  const toggleDetails = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="history-container overflow-hidden max-w-full box-border w-[300px]">
      <ul className="divide-y divide-neutral-200 w-full max-w-full box-border">
        {history.map((panic) => (
          <li
            key={panic.id}
            className="py-3 sm:py-4 w-full max-w-full box-border"
          >
            <div
              className="flex items-center justify-between cursor-pointer px-2 py-4"
              onClick={() => toggleDetails(panic.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {setPanicStatusIcon(panic.status.id)}
                </div>
                <span className="text-sm font-medium text-black capitalize">
                  {panic.panic_type}
                </span>
              </div>
              <span className="text-sm text-neutral-600 whitespace-nowrap">
                {formatDate(panic.created_at)}
              </span>
            </div>
            {expandedId === panic.id && (
              <div className="mt-2 overflow-hidden w-full max-w-full box-border">
                <div className="px-3 py-2 text-sm text-neutral-600 bg-neutral-100 border border-neutral-200 w-full max-w-full box-border flex flex-col break-words overflow-x-hidden">
                  <div className="mb-4">
                    <p className="font-semibold">Location:</p>
                    <p>
                      {parseFloat(panic.latitude).toFixed(6)}, {parseFloat(panic.longitude).toFixed(6)}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="font-semibold">Status:</p>
                    <p>{panic.status.name}</p>
                  </div>

                  <div className="mb-4">
                    <p className="font-semibold">Details:</p>
                    <p>
                      {panic.details || "No details provided"}
                    </p>
                  </div>

                  {panic.status.id === 1 && (
                    <div className="mt-2 flex justify-end">
                      <div className="flex flex-col items-end gap-2">
                        {cancelError[panic.id] && (
                          <p className="text-xs text-red-600 text-right">
                            {cancelError[panic.id]}
                          </p>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();  // Prevents toggleDetails() from being called (event bubbling)
                            handleCancelPanic(panic.id);
                          }}
                          disabled={isCancelling[panic.id]}
                          className={`w-[150px] h-[40px] py-1.5 text-sm font-medium ${
                            isCancelling[panic.id]
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-white text-black border border-neutral-300 font-normal"
                          }`}
                        >
                          {isCancelling[panic.id] ? "Cancelling..." : "Cancel Alert"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PanicHistory;
