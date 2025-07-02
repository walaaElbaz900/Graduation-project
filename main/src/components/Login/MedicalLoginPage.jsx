import React, { useState } from "react";
import { FaUserMd, FaLock, FaGoogle, FaFacebookF } from "react-icons/fa";
import { MdLocalHospital } from "react-icons/md";
import "./MedicalLoginPage.css";
import medicalBg from "../../assets/images/2.jpg";
import Logo from "../../assets/images/brain-21.svg";

const MedicalLoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    userType: "patient",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        setSuccess("Login successful!");
        
        // Store token in localStorage if "Remember Me" is checked
        if (formData.rememberMe) {
          localStorage.setItem("authToken", data.token);
        } else {
          // Store in sessionStorage for session-only storage
          sessionStorage.setItem("authToken", data.token);
        }

        
        window.location.href = "/home"; // Uncomment and modify as needed
        
        console.log("Login successful:", data);
      } else {
        // Handle different error cases
        if (data.validationResult) {
          // Validation errors
          const validationErrors = data.validationResult.map(err => err.message).join(", ");
          setError(`Validation Error: ${validationErrors}`);
        } else {
          // Other errors (invalid credentials, etc.)
          setError(data.message || "Login failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mlp-login-container">
      <div className="mlp-login-wrapper">
        <div className="mlp-login-image">
          <img src={medicalBg} alt="Healthcare Professional" />
          <div className="mlp-image-overlay">
            <h2>Trusted Healthcare Solutions</h2>
            <p>Providing quality care through innovative technology</p>
          </div>
        </div>

        <div className="mlp-login-box">
          <div className="mlp-logo">
            <img src={Logo} alt="" />
            <h1>Brain Tumor</h1>
            <h3>Welcome to Healthcare Portal</h3>
          </div>

          <div className="mlp-user-type-toggle">
            <button
              className={`mlp-type-btn  ${
                formData.userType === "patient" ? "mlp-active" : ""
              }`}
              onClick={() => setFormData({ ...formData, userType: "patient" })}
            ></button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mlp-error-message" style={{
              color: "#dc3545",
              backgroundColor: "#f8d7da",
              border: "1px solid #f5c6cb",
              borderRadius: "4px",
              padding: "10px",
              marginBottom: "15px",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mlp-success-message" style={{
              color: "#155724",
              backgroundColor: "#d4edda",
              border: "1px solid #c3e6cb",
              borderRadius: "4px",
              padding: "10px",
              marginBottom: "15px",
              fontSize: "14px"
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mlp-form-group">
              <label>Email Address</label>
              <div className="mlp-input-group">
                <FaUserMd className="mlp-input-icon" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder={
                    formData.userType === "patient"
                      ? "Enter your email"
                      : "Enter your medical email"
                  }
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mlp-form-group">
              <label>
                Password
                <a
                  href="/forgot-password"
                  className="mlp-forgot-link"
                  style={{}}
                >
                  Forgot your password?
                </a>
              </label>
              <div className="mlp-input-group">
                <FaLock className="mlp-input-icon" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mlp-remember-me">
              <input
                id="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData({ ...formData, rememberMe: e.target.checked })
                }
                className="mlp-remember-checkbox"
                disabled={loading}
              />
              <label htmlFor="rememberMe" className="mlp-remember-label">
                Keep me signed in
              </label>
            </div>

            <button 
              type="submit" 
              className="mlp-login-button"
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Signing In..." : "Access Portal"}
            </button>
          </form>

          <div className="mlp-signup-link">
            {formData.userType === "patient" ? (
              <>
                New patient? <a href="registration">Register here</a>
              </>
            ) : (
              <>
                Healthcare provider?{" "}
                <a href="/registration?userType=doctor">
                  Apply for credentials
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalLoginPage;