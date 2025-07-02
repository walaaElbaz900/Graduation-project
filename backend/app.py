from flask import Flask, request, jsonify
import numpy as np
from PIL import Image
import tensorflow as tf
from flask_cors import CORS  # Allow frontend to access backend

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from React frontend

# Load the trained model
MODEL_PATH = "../backend/brain_tumor_detection_Xception.keras"
model = tf.keras.models.load_model(MODEL_PATH)

# Define class labels (ensure they match the model training order)
CLASS_NAMES = ["glioma", "meningioma", "pituitary", "notumor"]


def preprocess_image(image):
    """Preprocess image for model prediction."""
    try:
        image = image.resize((299, 299))  # Ensure correct size
        image = np.array(image) / 255.0  # Normalize pixel values
        if image.shape[-1] != 3:
            return None, "Invalid image shape (expected RGB)"
        image = np.expand_dims(image, axis=0)  # Add batch dimension
        return image, None
    except Exception as e:
        return None, f"Image processing error: {str(e)}"


@app.route("/predict", methods=["POST"])
def predict():
    """Handle image classification requests."""
    if "file" not in request.files:
        return jsonify({"error": "No file provided"})

    file = request.files["file"]
    try:
        image = Image.open(file.stream).convert("RGB")  # Convert to RGB
    except Exception as e:
        return jsonify({"error": f"Failed to open image: {str(e)}"})

    processed_image, error = preprocess_image(image)
    if error:
        return jsonify({"error": error})

    try:
        prediction = model.predict(processed_image)
        predicted_class = CLASS_NAMES[np.argmax(prediction)]
        confidence = float(np.max(prediction))
        return jsonify({"class": predicted_class, "confidence": confidence})
    except Exception as e:
        return jsonify({"error": f"Prediction error: {str(e)}"})


if __name__ == "__main__":
    app.run(debug=True)
