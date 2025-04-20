import React, { useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "./App.css";
import { drawHand } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    // Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
  
      // Set video and canvas dimensions
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
  
      // Make detections
      const hands = await net.estimateHands(video);
  
      // Get canvas context
      const ctx = canvasRef.current.getContext("2d");
  
      // Clear the canvas before drawing
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  
      // Draw each detected hand
      drawHand(hands, ctx);
    }
  };

  runHandpose();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 8,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
