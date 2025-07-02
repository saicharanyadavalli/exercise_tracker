
import { useState, useEffect, useRef } from 'react';

export const useMediaPipe = (videoElement, isActive) => {
  const [poses, setPoses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const poseRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const initMediaPipe = async () => {
      try {
        setIsLoading(true);
        
        // Import MediaPipe Pose
        const { Pose } = await import('@mediapipe/pose');
        const { Camera } = await import('@mediapipe/camera_utils');

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
          if (results.poseLandmarks) {
            setPoses([{
              landmarks: results.poseLandmarks
            }]);
          } else {
            setPoses([]);
          }
        });

        poseRef.current = pose;
        setIsLoading(false);

        if (videoElement && isActive) {
          const camera = new Camera(videoElement, {
            onFrame: async () => {
              if (poseRef.current && videoElement.readyState >= 2) {
                await poseRef.current.send({ image: videoElement });
              }
            },
            width: 640,
            height: 480
          });
          camera.start();
        }

      } catch (err) {
        console.error('MediaPipe initialization error:', err);
        setError('Failed to load AI model. Please refresh and try again.');
        setIsLoading(false);
      }
    };

    if (isActive) {
      initMediaPipe();
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [videoElement, isActive]);

  return { poses, isLoading, error };
};
