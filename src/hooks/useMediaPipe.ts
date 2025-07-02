
import { useState, useEffect, useRef } from 'react';

export const useMediaPipe = (videoElement, isActive) => {
  const [poses, setPoses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const poseRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const initMediaPipe = async () => {
      try {
        setIsLoading(true);
        console.log('Starting MediaPipe initialization...');
        
        // Try alternative MediaPipe loading approach
        const mediapipeScript = document.createElement('script');
        mediapipeScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js';
        mediapipeScript.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          mediapipeScript.onload = resolve;
          mediapipeScript.onerror = reject;
          document.head.appendChild(mediapipeScript);
        });

        const cameraUtilsScript = document.createElement('script');
        cameraUtilsScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
        cameraUtilsScript.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          cameraUtilsScript.onload = resolve;
          cameraUtilsScript.onerror = reject;
          document.head.appendChild(cameraUtilsScript);
        });

        // Access MediaPipe from global scope
        const { Pose } = window;
        const { Camera } = window;

        if (!Pose || !Camera) {
          throw new Error('MediaPipe libraries failed to load');
        }

        console.log('MediaPipe libraries loaded successfully');

        const pose = new Pose({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
          }
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        pose.onResults((results) => {
          console.log('Pose detection results:', results);
          if (results.poseLandmarks) {
            setPoses([{
              landmarks: results.poseLandmarks
            }]);
          } else {
            setPoses([]);
          }
        });

        poseRef.current = pose;
        console.log('MediaPipe pose initialized successfully');
        setIsLoading(false);

        // Start camera if video element is ready
        if (videoElement && isActive && videoElement.readyState >= 2) {
          console.log('Starting camera...');
          const camera = new Camera(videoElement, {
            onFrame: async () => {
              if (poseRef.current && videoElement.readyState >= 2) {
                try {
                  await poseRef.current.send({ image: videoElement });
                } catch (err) {
                  console.error('Error sending frame to MediaPipe:', err);
                }
              }
            },
            width: 640,
            height: 480
          });
          
          cameraRef.current = camera;
          await camera.start();
          console.log('Camera started successfully');
        }

      } catch (err) {
        console.error('MediaPipe initialization error:', err);
        setError('Failed to load AI model. Please refresh and try again.');
        setIsLoading(false);
      }
    };

    if (isActive && videoElement) {
      initMediaPipe();
    }

    return () => {
      if (cameraRef.current) {
        try {
          cameraRef.current.stop();
        } catch (err) {
          console.error('Error stopping camera:', err);
        }
      }
    };
  }, [videoElement, isActive]);

  return { poses, isLoading, error };
};
