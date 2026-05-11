import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../api/auth";
import "../../styles/auth.css";

const AuthPage = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isLogin) {
        const res = await loginUser(form);

        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        if (res.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

      } else {
        await registerUser(form);
        setMessage("Registration successful. Check your email to verify.");
        setIsLogin(true);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {message && <p className="auth-message">{message}</p>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                name="first_name"
                placeholder="First name"
                onChange={handleChange}
                required
              />

              <input
                name="last_name"
                placeholder="Last name"
                onChange={handleChange}
                required
              />

              <input
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
                required
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

          {!isLogin && (
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm password"
              onChange={handleChange}
              required
            />
          )}

          <button type="submit" className="auth-btn">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <button
          className="auth-switch"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
        >
          {isLogin ? "Create account" : "Already have an account?"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;