import React, { useState } from "react";
import axios from "axios";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
import "./glass.css";
import config from "../config";

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const schema = Joi.object({
    name: Joi.string().min(4).max(20).required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: passwordComplexity().required(),
    gender: Joi.string().valid("male", "female", "non-binary").required(),
  });

  const validateField = (name, value) => {
    const fieldSchema = schema.extract(name); 
    const { error } = fieldSchema.validate(value);
    return error ? error.message : "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Dynamically validate the field
    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = schema.validate(formData, { abortEarly: false });
    if (error) {
      const validationErrors = {};
      for (let item of error.details) {
        validationErrors[item.path[0]] = item.message;
      }
      setErrors(validationErrors);
      setErrorMessage("");
      setLoading(false);
      return;
    }
    setErrorMessage("");

    const displaySuccessMessage = (message) => {
      setSuccessMessage(message);
    };

    try {
      const response = await axios.post(`${config.lyric}/api/users/`, formData);
      if (response.status === 201) {
        console.log("Registration successful:", response.data.message);
        setFormData({
          name: "",
          email: "",
          password: "",
          gender: "",
        });
        displaySuccessMessage("User registered successfully!");
      } else {
        console.error("Registration failed:", response.data.message);
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      );
      setErrorMessage(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-container">
      <style>
        {`#form{
          left:500px;
          top:100px;}
        `}
      </style>
      <div id="form-ui">
        <form onSubmit={handleSubmit} id="form">
          <div id="form-body">
            <div id="welcome-lines">
              <div id="welcome-line-1">Lyric_Loom</div>
              <div id="welcome-line-2">Welcome!</div>
            </div>
            <div id="input-area">
              <div className="form-inp">
                <input
                  placeholder="Name"
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <div className="error">{errors.name}</div>}
              </div>
              <div className="form-inp">
                <input
                  placeholder="Email Address"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <div className="error">{errors.email}</div>}
              </div>
              <div className="form-inp">
                <input
                  placeholder="Password"
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && (
                  <div className="error">{errors.password}</div>
                )}
              </div>

              <div className="form-inp">
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-Binary</option>
                </select>
                {errors.gender && <div className="error">{errors.gender}</div>}
              </div>
            </div>

            {loading ? (
              <div id="submit-button-cvr">
                <button id="submit-button">Registering...</button>
              </div>
            ) : (
              <div id="submit-button-cvr">
                <button id="submit-button" type="submit">
                  Register
                </button>
              </div>
            )}

            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;
