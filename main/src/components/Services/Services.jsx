import React, { useState } from "react";
import "../Services/Services.css";
import Tesseract from "tesseract.js";

const Services = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      classifyImage(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const classifyImage = (file) => {
  setLoading(true);
  setResult("");

  const formData = new FormData();
  formData.append("file", file);

  fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        setResult(`Error: ${data.error}`);
      } else {
        setResult(
          `Prediction: ${data.class.toUpperCase()} (Confidence: ${(data.confidence * 100).toFixed(2)}%)`
        );
      }
    })
    .catch((err) => {
      console.error("Prediction error:", err);
      setResult("Prediction failed. Please try again.");
    })
    .finally(() => {
      setLoading(false);
    });
};


  return (
    <div className="container">
      <div className="services-container">
        <div className="services-card">
          <h3 className="services-title">Upload and Process Image</h3>

          {/* منطقة السحب والإفلات */}
          <div
            className="services-drag-drop"
            onDrop={handleImageDrop}
            onDragOver={handleDragOver}
          >
            {image ? (
              <p>Image uploaded! Drop a new one to replace it.</p>
            ) : (
              <p>Drag & Drop your image here or click to upload</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImage(URL.createObjectURL(file));
                  classifyImage(file);
                }
              }}
              className="services-input"
            />
          </div>

          {/* عرض الصورة */}
          {image && (
            <div className="services-image-container">
              <img
                src={image}
                alt="Uploaded Preview"
                className="services-image"
              />
            </div>
          )}

          {/* عرض النص المستخرج */}
          {loading ? (
            <div className="services-result-container">
              <p className="services-loading-text">
                Processing... Please wait.
              </p>
            </div>
          ) : (
            result && (
              <div className="services-result-container">
                <h4>Prediction Results:</h4>
                <p>{result}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
