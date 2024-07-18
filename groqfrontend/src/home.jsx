import { useState } from "react";
import axios from "axios";
import "./home.css";

function Home() {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [version, setVersion] = useState("");
  const [healthStatus, setHealthStatus] = useState("");

  const handleChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = () => {
    axios
      .post("http://localhost:3000/chat", null, {
        params: {
          prompt: prompt,
        },
      })
      .then((response) => {
        const newMessage = { prompt: prompt, response: response.data };
        setChatHistory([...chatHistory, newMessage]);
        setPrompt(""); // Clear input field
      })
      .catch((error) => {
        console.error("Error sending prompt to server:", error);
      });
  };

  const fetchVersion = () => {
    axios
      .get("http://localhost:3000/version.json")
      .then((response) => {
        setVersion(response.data.version);
      })
      .catch((error) => {
        console.error("Error fetching version:", error);
      });
  };

  const fetchHealthStatus = () => {
    axios
      .get("http://localhost:3000/healthcheck")
      .then((response) => {
        setHealthStatus("Status: OK");
      })
      .catch((error) => {
        setHealthStatus(`Status: ERROR - ${error.response.data.error}`);
        console.error("Error fetching health status:", error);
      });
  };

  return (
    <div className="container">
      <div className="chat-box">
        {chatHistory.map((message, index) => (
          <div key={index} className="message">
            <div className="user-prompt">{message.prompt}</div>
            <div
              className="bot-response"
              dangerouslySetInnerHTML={{ __html: message.response }}
            ></div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          className="input-field"
          type="text"
          value={prompt}
          onChange={handleChange}
          placeholder="Enter Your Prompt"
        />
        <button className="button" onClick={handleSubmit}>
          Send
        </button>
      </div>
      <div className="info-container">
        <button className="button" onClick={fetchVersion}>
          Get Version
        </button>
        {version && <div className="version-info">Version: {version}</div>}
        <button className="button" onClick={fetchHealthStatus}>
          Check Health
        </button>
        {healthStatus && (
          <div className="health-status">{healthStatus}</div>
        )}
      </div>
    </div>
  );
}

export default Home;
