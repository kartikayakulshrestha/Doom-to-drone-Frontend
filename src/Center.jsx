import React, { useState, useEffect } from "react";
import { Stage, Layer, Text as KonvaText } from "react-konva";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Center = () => {
  const [scrollY, setScrollY] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let da = { email: email, password: password };

      if (validateEmail(email)) {
        let res = await axios.post("https://doom-to-drone-backend.vercel.app/login", da, {
          withCredentials: true,
        });
        if (res.data.message == "success") {
          navigate("/imageselection");
        }
      } else {
        alert("Error Wrong Email");
      }
    } catch (err) {
      console.log("errror on login", err);
    }
  };
  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Stage width={window.innerWidth} height={700}>
          <Layer>
            <KonvaText
              text="DOOM to DRONE"
              fontSize={100}
              fontFamily="Arial"
              fill="white"
              x={300}
              y={300}
              draggable
            />
            <KonvaText
              text="Transforming your reality"
              fontSize={20}
              fontFamily="Arial"
              fill="white"
              x={500}
              y={280}
              draggable
            />
          </Layer>
        </Stage>
      </div>
      <div
        className={`transition-opacity duration-1000 ${
          scrollY > 200 ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-3xl font-bold mb-6">Login To Proceed</h2>
          <form
            className="bg-gray-700 p-6 rounded shadow-md animate-fade-in-up"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                className="w-full p-2 rounded bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
                className="w-full p-2 rounded bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full p-2 mt-4 bg-gray-900 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Center;
