import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
  const [msg, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
        setMessage(data.msg || "Nothing received :( ");
        navigate("/dasboard");
      } else {
        setMessage(data.msg || "Oh no! Login has failed...");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An error occurred, try again later! <3");
    }
  };

  return (
    <div className="bg-green-100 text-grey p-4 items-center">
      <div className="bg-orange-200/80 border-orange-900 rounded-3xl w-[800px]  p-40 shadow-xl items-center relative">
        <div className="text-[50px] absolute inset-x-0 top-4">LOGIN</div>
        <div>
          <label className="text-[30px]"> Username: </label>
          <input
            className="border border-lime-100 rounded px-10 mt-4 py-1 flex-1"
            placeholder="Enter your username"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="text-[30px]"> Password: </label>
          <input
            className="border border-lime-100 rounded px-10 mt-4 py-1 flex-1"
            placeholder="Enter your password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="absolute bottom-10 right-10 px-10 py-4 bg-green-100 hover:bg-green-400 text-grey rounded-xl"
          onClick={handleLogin}
        >
          Next
        </button>

        <Link to="/register" className="mt-6 text-lime-800">
          Not a member yet? Register!
        </Link>
        {msg && <div className="text-center text-red-600 "> {msg} </div>}
      </div>
    </div>
  );
}

export default Login;
