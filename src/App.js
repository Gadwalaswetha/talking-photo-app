import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [photo, setPhoto] = useState(null);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en");
  const [videoUrl, setVideoUrl] = useState("");
  const [avatarDescription, setAvatarDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const generateTalkingAvatar = async () => {
    if (!photo || !text) {
      alert("Please upload a photo and enter text.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("text", text);
    formData.append("language", language);

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/talking-avatar", formData);
      setVideoUrl(response.data.videoUrl);
      setSuccessMessage("Talking Avatar generated successfully!");
      setErrorMessage("");
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("Error generating talking avatar. Please try again.");
      console.error("Error generating talking avatar", error);
    } finally {
      setLoading(false);
    }
  };
  const generateTextAvatar = async () => {
    if (!avatarDescription) {
      alert("Please enter a description.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/generate-avatar", {
        description: avatarDescription,
      });
      setAvatarUrl(response.data.avatarUrl);
      setSuccessMessage("Avatar generated successfully!");
      setErrorMessage("");
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("Error generating avatar. Please try again.");
      console.error("Error generating avatar", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Talking Photo & AI Avatar App</h1>
      <div className="card talking-photo-card">
        <h2>Talking Photo</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <textarea
          placeholder="Enter text for speech..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <select onChange={(e) => setLanguage(e.target.value)} value={language}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
        <button onClick={generateTalkingAvatar} disabled={loading}>
          {loading ? "Generating..." : "Generate Talking Avatar"}
        </button>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {videoUrl && <video src={videoUrl} controls />}
      </div>
      <div className="card text-avatar-card">
        <h2>Text-to-Avatar</h2>
        <textarea
          placeholder="Describe the avatar..."
          value={avatarDescription}
          onChange={(e) => setAvatarDescription(e.target.value)}
        />
        <button onClick={generateTextAvatar} disabled={loading}>
          {loading ? "Generating..." : "Generate Avatar"}
        </button>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {avatarUrl && <img src={avatarUrl} alt="Generated Avatar" />}
      </div>
    </div>
  );
}

export default App;
