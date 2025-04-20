import React, { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";
import { drawPose } from "./utilities"; // Import the utility function
import "./App.css";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runPoseNet = async () => {
    const net = await posenet.load();
    console.log("PoseNet model loaded.");
    // Loop and detect poses
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

      // Make pose detections
      const pose = await net.estimateSinglePose(video, {
        flipHorizontal: false,
      });

      // Draw pose on canvas using the utility function
      drawPose(pose, canvasRef.current.getContext("2d"));
    }
  };

  useEffect(() => {
    runPoseNet();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
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