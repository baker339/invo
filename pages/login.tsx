import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import useSafePush from "@/hooks/useSafePush";

const LoginPage = () => {
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { safePush } = useSafePush();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      safePush("/"); // Redirect to the home page after login
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-neutral mb-6">
          Invo Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-neutral mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-lightNeutral rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-neutral mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-lightNeutral rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded hover:bg-accentDark transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={loginWithGoogle}
            className="w-full bg-accentDark text-white p-3 rounded hover:bg-accentLight transition duration-300"
          >
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
