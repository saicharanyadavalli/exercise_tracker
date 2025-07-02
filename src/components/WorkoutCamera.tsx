
import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Camera, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMediaPipe } from '@/hooks/useMediaPipe';
import { exerciseDetectors } from '@/utils/exerciseDetectors';

const WorkoutCamera = ({ exercise, onStop }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [reps, setReps] = useState(0);
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState('Get Ready!');
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  
  const { poses, isLoading, error: mediaPipeError } = useMediaPipe(videoRef.current, isActive);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640, 
            height: 480,
            facingMode: 'user'
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsActive(true);
            setStatus('Ready to start!');
          };
        }
      } catch (err) {
        setError('Camera access denied. Please allow camera access to use this feature.');
        console.error('Camera error:', err);
      }
    };

    initCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (poses && poses.length > 0 && isActive) {
      const detector = exerciseDetectors[exercise.id];
      if (detector) {
        const result = detector.detect(poses[0].landmarks);
        
        if (result.repCompleted) {
          setReps(prev => prev + 1);
        }
        
        setStatus(result.feedback);
        
        // Draw pose overlay
        drawPoseOverlay(poses[0].landmarks);
      }
    }
  }, [poses, exercise.id, isActive]);

  const drawPoseOverlay = (landmarks) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw pose connections
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    
    const connections = [
      [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Arms
      [11, 23], [12, 24], [23, 24], // Torso
      [23, 25], [24, 26], [25, 27], [26, 28], // Legs
      [27, 29], [28, 30], [29, 31], [30, 32] // Feet
    ];
    
    connections.forEach(([start, end]) => {
      const startPoint = landmarks[start];
      const endPoint = landmarks[end];
      
      if (startPoint && endPoint && startPoint.visibility > 0.5 && endPoint.visibility > 0.5) {
        ctx.beginPath();
        ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height);
        ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height);
        ctx.stroke();
      }
    });
    
    // Draw key points
    ctx.fillStyle = '#ff6b6b';
    landmarks.forEach((landmark, index) => {
      if (landmark.visibility > 0.5) {
        ctx.beginPath();
        ctx.arc(
          landmark.x * canvas.width,
          landmark.y * canvas.height,
          4,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error || mediaPipeError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Camera Error</h3>
          <p className="text-slate-300 mb-6">{error || mediaPipeError}</p>
          <Button onClick={onStop} className="bg-gradient-to-r from-red-500 to-pink-500">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="flex items-center justify-between">
          <Button 
            onClick={onStop}
            variant="ghost"
            className="bg-black/20 backdrop-blur-md text-white hover:bg-black/30 rounded-full p-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">{exercise.name}</h2>
          </div>
          <div className="w-12"></div>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative w-full h-screen flex items-center justify-center">
        <div className="relative max-w-4xl w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover rounded-2xl transform scale-x-[-1]"
            style={{ filter: 'brightness(0.9)' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none transform scale-x-[-1]"
          />
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white">Loading AI Model...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-6 left-6 right-6 z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Reps/Timer */}
          <Card className="bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">
              {exercise.id === 'planks' ? formatTime(duration) : reps}
            </div>
            <div className="text-slate-300 text-sm">
              {exercise.id === 'planks' ? 'Hold Time' : 'Reps'}
            </div>
          </Card>

          {/* Status */}
          <Card className="bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center md:col-span-1">
            <div className="text-lg font-semibold text-white mb-1">{status}</div>
            <div className="text-slate-300 text-sm">Form Status</div>
          </Card>

          {/* Duration */}
          <Card className="bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{formatTime(duration)}</div>
            <div className="text-slate-300 text-sm">Duration</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCamera;
