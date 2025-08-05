import React, { useState } from 'react';
import "./Auth.css";
import axios from "axios";
import { authURL } from '../../local.setting';
import { Toaster } from "react-hot-toast";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/auth';


const Auth = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Added state for toggling password visibility
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth()

  const validateInputs = () => {
    if (!userName || !password) {
      toast.error("Please fill in all fields.");
      return false;
    }
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const { data } = await axios.post(`${authURL}/v1/auth/signup`, {
        userName,
        password
      })

      if (data.success) {
        setAuth({
          user: data.user,
          token: data.token
        })
        localStorage.setItem("auth", JSON.stringify(data));
        toast.success(data.message);
        navigate("/chat");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("An error occurred during sign-up. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const { data } = await axios.post(`${authURL}/v1/auth/login`, {
        userName,
        password
      })

      if (data.success) {
        setAuth({
          user: data.user,
          token: data.token
        })
        localStorage.setItem("auth", JSON.stringify(data));
        toast.success(data.message);
        navigate("/chat");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("An error occurred during login. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="loginForm">
        <div className="container">

          <form>
            <h3 className="form-title">We Chat</h3>

            <div className="form-group">
              <label htmlFor="exampleInputEmail1">UserName</label> {/* Updated label */}
              <input
                type="text" // Changed type to text for username
                className="form-control"
                id="exampleInputEmail1"
                name="userName"
                onChange={(e) => setUserName(e.target.value)}
                aria-describedby="usernameHelp"
                placeholder="Enter username" // Updated placeholder
                disabled={loading} // Disable input while loading
              />
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputPassword">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"} // Toggle input type
                  className="form-control"
                  id="exampleInputPassword"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={loading} // Disable input while loading
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#6a11cb"
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="form-button">
              <button
                type="submit"
                className="btn"
                onClick={handleSignUp}
                disabled={loading} // Disable button while loading
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
              <button
                type="submit"
                className="btn"
                onClick={handleLogin}
                disabled={loading} // Disable button while loading
              >
                {loading ? "Logging In..." : "Login"}
              </button>
            </div>


          </form>
        </div>
      </div>
      <Toaster />
    </>
  )
}

export default Auth