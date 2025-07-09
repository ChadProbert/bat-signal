import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../utils/errorMessages.ts";
import AuthContext from "../auth/AuthContext.ts";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axios from "../api/axios.ts";
import bat from "../assets/bat.svg";
import "./Login.css";

// This regex pattern ensures the email has:
// - a single @ symbol
// - at least 1 character before and after @
// - at least 1 . in the domain part
// - no whitespace allowed
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { token, expiresAt, saveToken } = useContext(AuthContext)!;

  // Redirect to dashboard if user is already authenticated AND the token is still valid
  if (token && expiresAt && Date.now() < expiresAt) {
    return <Navigate to="/dashboard" replace />;
  }

  // Attempts to log the user in with the provided email and password
  // If successful, stores the token and redirects to the dashboard
  // If unsuccessful, displays an error message from the API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Ensures the email and password fields are not empty
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    // Ensures the email is in a valid format
    if (!emailRegex.test(email)) {
      setError("Email address is not valid.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/login", { email, password });
      const token = response.data.data.api_access_token;
      const expiresIn = response.data.data.expires_in || 3600; // Defaults to 1 hour if not provided by the backend
      saveToken(token, expiresIn); // Saves the token and expiry time to AuthContext
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img alt="Bat Signal logo" src={bat} className="mx-auto h-50 w-auto" />
        <h2 className="mt-5 text-center text-2xl font-bold tracking-tight text-black">
          Login to Bat Signal
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-black"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                autoComplete="email"
                className="block w-full bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-neutral-300 placeholder:text-neutral-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                placeholder="example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-black"
              >
                Password
              </label>
            </div>
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="block w-full bg-white px-3 py-1.5 pr-10 text-base text-black outline-1 -outline-offset-1 outline-gray-300 placeholder:text-neutral-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500 hover:text-black"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-center text-sm">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              {isLoading ? "Logging in..." : "Login →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

// References:
// Tailwind Template — https://tailwindcss.com/plus/ui-blocks/application-ui/forms/sign-in-forms
// Bat SVG icon — https://simpleicons.org/icons/bat.svg
