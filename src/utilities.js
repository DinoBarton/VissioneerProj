// only for the posenet
import * as posenet from "@tensorflow-models/posenet";
// only for the posenet

// Points for fingers
const fingerJoints = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
};

// Drawing function
export const drawHand = (predictions, ctx) => {
    // Check if we have predictions
    if (predictions.length > 0) {
        // Loop through each prediction (each hand)
        predictions.forEach((prediction) => {
            // Grab landmarks
            const landmarks = prediction.landmarks;

            // Loop through fingers
            for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
                let finger = Object.keys(fingerJoints)[j];
                // Loop through pairs of joints
                for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
                    // Get pairs of joints
                    const firstJointIndex = fingerJoints[finger][k];
                    const secondJointIndex = fingerJoints[finger][k + 1];

                    // Draw path
                    ctx.beginPath();
                    ctx.moveTo(
                        landmarks[firstJointIndex][0],
                        landmarks[firstJointIndex][1]
                    );
                    ctx.lineTo(
                        landmarks[secondJointIndex][0],
                        landmarks[secondJointIndex][1]
                    );
                    ctx.strokeStyle = "cyan";
                    ctx.lineWidth = 4;
                    ctx.stroke();
                }
            }

            // Draw lines between joints 5, 9, 13, and 18
            const specialJoints = [5, 9, 13, 17];
            for (let i = 0; i < specialJoints.length - 1; i++) {
                const firstJointIndex = specialJoints[i];
                const secondJointIndex = specialJoints[i + 1];

                ctx.beginPath();
                ctx.moveTo(
                    landmarks[firstJointIndex][0],
                    landmarks[firstJointIndex][1]
                );
                ctx.lineTo(
                    landmarks[secondJointIndex][0],
                    landmarks[secondJointIndex][1]
                );
                ctx.strokeStyle = "cyan"; // Use a different color for these lines
                ctx.lineWidth = 4;
                ctx.stroke();
            }

            // Draw circles at each joint
            landmarks.forEach(([x, y]) => {
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 2 * Math.PI); // Small circle with radius 5
                ctx.fillStyle = "cyan";
                ctx.fill();
            });
        });
    }
};

// this is for the posenet the import at the top is for this too!

/**
 * Draws the detected pose keypoints and skeleton on the canvas.
 * @param {Object} pose - The pose object returned by PoseNet.
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 */
export const drawPose = (pose, ctx) => {
  if (pose && pose.keypoints) {
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw keypoints
    pose.keypoints.forEach((keypoint) => {
      if (keypoint.score > 0.5) {
        const { x, y } = keypoint.position;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      }
    });

    // Draw skeleton
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(pose.keypoints, 0.5);
    adjacentKeyPoints.forEach(([from, to]) => {
      ctx.beginPath();
      ctx.moveTo(from.position.x, from.position.y);
      ctx.lineTo(to.position.x, to.position.y);
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }
};
