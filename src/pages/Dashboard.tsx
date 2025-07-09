import { useState, useContext } from "react";
import CreatePanicAlert from "../components/CreatePanicAlert";
import PanicHistory from "../components/PanicHistory";
import AuthContext from "../auth/AuthContext";
import bat from "../assets/bat.svg";
import "./Dashboard.css";

const Dashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { clearToken } = useContext(AuthContext)!;

  // Triggers a re-render of the PanicHistory component when a new panic alert is created
  const handlePanicCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col px-6 py-12 lg:px-8 bg-white dashboard">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="text-center">
          <img
            alt="Bat Signal logo"
            src={bat}
            className="mx-auto h-32 w-auto"
          />
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-black">
            Bat Signal
          </h1>
          <div className="mt-4 flex justify-center">
            <button
              onClick={clearToken}
              className="mt-2 px-6 py-2 bg-white text-black border border-neutral-300"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="dashboard-content mt-5">
          <section className="panic-alert-section bg-white p-6 border border-neutral-300 mb-6 sm:mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-black mb-6">
                Send Panic Alert
              </h2>
              <CreatePanicAlert onPanicCreated={handlePanicCreated} />
            </div>
          </section>

          <section className="panic-history-section bg-white p-6 border border-neutral-300">
            <h2 className="text-2xl font-bold text-black mb-6">
              Panic History{" "}
              <span className="text-neutral-500">(10 Most Recent)</span>
            </h2>
            <PanicHistory key={refreshTrigger} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
