import { useNavigate } from "react-router-dom";
import bat from "../assets/bat.svg";

// This page is displayed when a user navigates to a route that does not exist 
const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center">
      <img src={bat} alt="Bat Signal logo" width={100}/>
      <h1 className="text-3xl font-bold m-5">404 Not Found</h1>
      <button onClick={() => navigate("/")} className="bg-black text-white px-3 py-1.5  hover:bg-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
      ← Go back to safety
      </button>
    </div>  
  );
};

export default NotFound;