// NOTE: 
// I created a separate component file for the skeleton simply because 
// I wanted to improve the separation of concerns and keep the PanicHistory
// component lean and clean.

// This component is used to display a skeleton of the panic history 
// while the panic history is being fetched from the API
const PanicHistorySkeleton = () => {
  return (
    <div className="history-container overflow-hidden max-w-full box-border w-[300px] min-h-[300px]">
      <ul className="divide-y divide-neutral-200 w-full max-w-full box-border">
        {[...Array(10)].map((_, i) => (
          <li key={i} className="py-3 sm:py-4 w-full max-w-full box-border">
            <div className="flex items-center justify-between px-2 py-4">
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 bg-neutral-200 rounded-full mr-2 animate-pulse"></div>
                <div className="h-4 bg-neutral-200 rounded w-24 animate-pulse"></div>
              </div>
              <div className="h-3 bg-neutral-200 rounded w-20 animate-pulse"></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PanicHistorySkeleton;
