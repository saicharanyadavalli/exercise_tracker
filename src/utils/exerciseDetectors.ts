
// Exercise detection logic using pose landmarks
const calculateAngle = (a: any, b: any, c: any) => {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return angle;
};

const calculateDistance = (point1: any, point2: any) => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

class ExerciseDetector {
  protected state: string;
  protected repCount: number;
  protected lastStateChange: number;
  protected minFramesBetweenReps: number;
  protected frameCount: number;

  constructor() {
    this.state = 'up';
    this.repCount = 0;
    this.lastStateChange = 0;
    this.minFramesBetweenReps = 15; // Increased for better accuracy
    this.frameCount = 0;
  }

  reset() {
    this.state = 'up';
    this.repCount = 0;
    this.lastStateChange = 0;
    this.frameCount = 0;
  }

  detect(landmarks: any): { repCompleted: boolean; feedback: string } {
    return { repCompleted: false, feedback: 'Not implemented' };
  }
}

class PushUpDetector extends ExerciseDetector {
  private consecutiveDownFrames: number = 0;
  private consecutiveUpFrames: number = 0;
  private requiredConsecutiveFrames: number = 8;

  reset() {
    super.reset();
    this.consecutiveDownFrames = 0;
    this.consecutiveUpFrames = 0;
  }

  detect(landmarks: any) {
    if (!landmarks) return { repCompleted: false, feedback: 'Position yourself in camera view' };
    
    this.frameCount++;
    
    // Key points for push-ups
    const leftShoulder = landmarks[11];
    const leftElbow = landmarks[13];
    const leftWrist = landmarks[15];
    const rightShoulder = landmarks[12];
    const rightElbow = landmarks[14];
    const rightWrist = landmarks[16];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    if (!leftShoulder || !leftElbow || !leftWrist || !rightShoulder || !rightElbow || !rightWrist || !leftHip || !rightHip) {
      return { repCompleted: false, feedback: 'Position yourself fully in camera view' };
    }

    // Calculate elbow angles
    const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    const avgElbowAngle = (leftElbowAngle + rightElbowAngle) / 2;

    // Check body alignment (prevent cheating)
    const shoulderMidpoint = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 };
    const hipMidpoint = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 };
    const bodyAngle = Math.abs(Math.atan2(hipMidpoint.y - shoulderMidpoint.y, hipMidpoint.x - shoulderMidpoint.x) * 180 / Math.PI);
    const isBodyStraight = bodyAngle < 20 || bodyAngle > 160;

    let repCompleted = false;
    let feedback = 'Get in push-up position';

    if (!isBodyStraight) {
      return { repCompleted: false, feedback: 'Keep your body straight - no sagging or piking' };
    }

    // Improved state detection with consecutive frame counting
    if (avgElbowAngle < 90) {
      this.consecutiveDownFrames++;
      this.consecutiveUpFrames = 0;
    } else if (avgElbowAngle > 160) {
      this.consecutiveUpFrames++;
      this.consecutiveDownFrames = 0;
    } else {
      // Reset counters if in middle range
      this.consecutiveDownFrames = Math.max(0, this.consecutiveDownFrames - 1);
      this.consecutiveUpFrames = Math.max(0, this.consecutiveUpFrames - 1);
    }

    // State transitions with improved accuracy
    if (this.state === 'up' && this.consecutiveDownFrames >= this.requiredConsecutiveFrames) {
      if (this.frameCount - this.lastStateChange > this.minFramesBetweenReps) {
        this.state = 'down';
        this.lastStateChange = this.frameCount;
        feedback = 'Good - going down!';
      }
    } else if (this.state === 'down' && this.consecutiveUpFrames >= this.requiredConsecutiveFrames) {
      if (this.frameCount - this.lastStateChange > this.minFramesBetweenReps) {
        this.state = 'up';
        this.lastStateChange = this.frameCount;
        repCompleted = true;
        feedback = 'Excellent push-up!';
      }
    } else if (this.state === 'down' && avgElbowAngle > 90 && avgElbowAngle < 160) {
      feedback = 'Push up to complete the rep';
    } else if (this.state === 'up' && avgElbowAngle < 160 && avgElbowAngle > 90) {
      feedback = 'Lower down more - get chest closer to ground';
    } else if (this.state === 'up') {
      feedback = 'Ready - lower down to start push-up';
    }

    return { repCompleted, feedback };
  }
}

class SquatDetector extends ExerciseDetector {
  private consecutiveDownFrames: number = 0;
  private consecutiveUpFrames: number = 0;
  private requiredConsecutiveFrames: number = 8;

  reset() {
    super.reset();
    this.consecutiveDownFrames = 0;
    this.consecutiveUpFrames = 0;
  }

  detect(landmarks: any) {
    if (!landmarks) return { repCompleted: false, feedback: 'Stand facing the camera' };
    
    this.frameCount++;
    
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];
    const rightHip = landmarks[24];
    const rightKnee = landmarks[26];
    const rightAnkle = landmarks[28];

    if (!leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle) {
      return { repCompleted: false, feedback: 'Position your full body in camera view' };
    }

    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

    // Check feet position (should be roughly shoulder-width apart)
    const feetDistance = calculateDistance(leftAnkle, rightAnkle);
    const isGoodStance = feetDistance > 0.15 && feetDistance < 0.4;

    let repCompleted = false;
    let feedback = 'Stand ready';

    if (!isGoodStance) {
      return { repCompleted: false, feedback: 'Position feet shoulder-width apart' };
    }

    // Improved squat detection
    if (avgKneeAngle < 120) {
      this.consecutiveDownFrames++;
      this.consecutiveUpFrames = 0;
    } else if (avgKneeAngle > 160) {
      this.consecutiveUpFrames++;
      this.consecutiveDownFrames = 0;
    } else {
      this.consecutiveDownFrames = Math.max(0, this.consecutiveDownFrames - 1);
      this.consecutiveUpFrames = Math.max(0, this.consecutiveUpFrames - 1);
    }

    if (this.state === 'up' && this.consecutiveDownFrames >= this.requiredConsecutiveFrames) {
      if (this.frameCount - this.lastStateChange > this.minFramesBetweenReps) {
        this.state = 'down';
        this.lastStateChange = this.frameCount;
        feedback = avgKneeAngle < 100 ? 'Perfect depth!' : 'Good - keep going down';
      }
    } else if (this.state === 'down' && this.consecutiveUpFrames >= this.requiredConsecutiveFrames) {
      if (this.frameCount - this.lastStateChange > this.minFramesBetweenReps) {
        this.state = 'up';
        this.lastStateChange = this.frameCount;
        repCompleted = true;
        feedback = 'Excellent squat!';
      }
    } else if (this.state === 'down') {
      feedback = 'Drive through heels to stand up';
    } else if (avgKneeAngle < 160 && avgKneeAngle > 120) {
      feedback = 'Squat deeper - thighs parallel to floor';
    } else {
      feedback = 'Ready - squat down';
    }

    return { repCompleted, feedback };
  }
}

class PlankDetector extends ExerciseDetector {
  private startTime: number | null;
  private isHolding: boolean;
  private holdDuration: number;

  constructor() {
    super();
    this.startTime = null;
    this.isHolding = false;
    this.holdDuration = 0;
  }

  reset() {
    super.reset();
    this.startTime = null;
    this.isHolding = false;
    this.holdDuration = 0;
  }

  detect(landmarks: any) {
    if (!landmarks) return { repCompleted: false, feedback: 'Get in plank position' };
    
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
      return { repCompleted: false, feedback: 'Position yourself in plank position' };
    }

    // Check if in plank position (body straight)
    const shoulderMidpoint = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2
    };
    const hipMidpoint = {
      x: (leftHip.x + rightHip.x) / 2,
      y: (leftHip.y + rightHip.y) / 2
    };

    const bodyAngle = Math.abs(Math.atan2(hipMidpoint.y - shoulderMidpoint.y, hipMidpoint.x - shoulderMidpoint.x) * 180 / Math.PI);
    const isGoodPlank = bodyAngle < 15 || bodyAngle > 165;

    // Check if elbows are properly positioned (for forearm plank)
    const elbowsVisible = leftElbow && rightElbow;
    const properElbowPosition = !elbowsVisible || 
      (leftElbow.y > leftShoulder.y && rightElbow.y > rightShoulder.y);

    if (isGoodPlank && properElbowPosition) {
      if (!this.isHolding) {
        this.isHolding = true;
        this.startTime = Date.now();
      }
      this.holdDuration = this.startTime ? (Date.now() - this.startTime) / 1000 : 0;
      
      if (this.holdDuration > 30) {
        return { repCompleted: false, feedback: `Amazing hold! ${this.holdDuration.toFixed(1)}s` };
      } else if (this.holdDuration > 10) {
        return { repCompleted: false, feedback: `Great form! Hold ${this.holdDuration.toFixed(1)}s` };
      } else {
        return { repCompleted: false, feedback: `Perfect plank! ${this.holdDuration.toFixed(1)}s` };
      }
    } else {
      this.isHolding = false;
      this.startTime = null;
      this.holdDuration = 0;
      
      if (!isGoodPlank) {
        return { repCompleted: false, feedback: 'Keep your body straight - no sagging or piking' };
      } else {
        return { repCompleted: false, feedback: 'Position elbows under shoulders' };
      }
    }
  }
}

class SitUpDetector extends ExerciseDetector {
  private consecutiveUpFrames: number = 0;
  private consecutiveDownFrames: number = 0;
  private requiredConsecutiveFrames: number = 10;

  reset() {
    super.reset();
    this.state = 'down'; // Start lying down for sit-ups
    this.consecutiveUpFrames = 0;
    this.consecutiveDownFrames = 0;
  }

  detect(landmarks: any) {
    if (!landmarks) return { repCompleted: false, feedback: 'Lie down to start sit-ups' };
    
    this.frameCount++;
    
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const nose = landmarks[0];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !nose) {
      return { repCompleted: false, feedback: 'Position yourself fully in camera view' };
    }

    const shoulderMidpoint = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2
    };
    const hipMidpoint = {
      x: (leftHip.x + rightHip.x) / 2,
      y: (leftHip.y + rightHip.y) / 2
    };

    // Calculate torso angle relative to horizontal
    const torsoAngle = Math.atan2(shoulderMidpoint.y - hipMidpoint.y, shoulderMidpoint.x - hipMidpoint.x) * 180 / Math.PI;
    const isUp = Math.abs(torsoAngle) < 45; // More forgiving angle for sitting up
    const isDown = Math.abs(torsoAngle) > 70; // Lying down

    let repCompleted = false;
    let feedback = 'Lie down to start';

    // Count consecutive frames in each position
    if (isUp) {
      this.consecutiveUpFrames++;
      this.consecutiveDownFrames = 0;
    } else if (isDown) {
      this.consecutiveDownFrames++;
      this.consecutiveUpFrames = 0;
    } else {
      // In transition, reduce counters gradually
      this.consecutiveUpFrames = Math.max(0, this.consecutiveUpFrames - 1);
      this.consecutiveDownFrames = Math.max(0, this.consecutiveDownFrames - 1);
    }

    if (this.state === 'down' && this.consecutiveUpFrames >= this.requiredConsecutiveFrames) {
      if (this.frameCount - this.lastStateChange > this.minFramesBetweenReps) {
        this.state = 'up';
        this.lastStateChange = this.frameCount;
        feedback = 'Great sit-up! Now lower back down';
      }
    } else if (this.state === 'up' && this.consecutiveDownFrames >= this.requiredConsecutiveFrames) {
      if (this.frameCount - this.lastStateChange > this.minFramesBetweenReps) {
        this.state = 'down';
        this.lastStateChange = this.frameCount;
        repCompleted = true;
        feedback = 'Perfect! Sit up again';
      }
    } else if (this.state === 'up' && !isDown) {
      feedback = 'Lower back down with control';
    } else if (this.state === 'down' && !isUp) {
      feedback = 'Sit up using your core muscles';
    } else {
      feedback = 'Good form - keep going!';
    }

    return { repCompleted, feedback };
  }
}

class LungeDetector extends ExerciseDetector {
  private consecutiveLungeFrames: number = 0;
  private consecutiveStandFrames: number = 0;
  private requiredConsecutiveFrames: number = 10;

  reset() {
    super.reset();
    this.consecutiveLungeFrames = 0;
    this.consecutiveStandFrames = 0;
  }

  detect(landmarks: any) {
    if (!landmarks) return { repCompleted: false, feedback: 'Stand in view for lunges' };
    
    this.frameCount++;
    
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];
    const rightHip = landmarks[24];
    const rightKnee = landmarks[26];
    const rightAnkle = landmarks[28];

    if (!leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle) {
      return { repCompleted: false, feedback: 'Position your full body in camera view' };
    }

    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    
    // Detect if one leg is significantly more bent (lunging)
    const angleDiff = Math.abs(leftKneeAngle - rightKneeAngle);
    const minKneeAngle = Math.min(leftKneeAngle, rightKneeAngle);
    const isLunging = angleDiff > 40 && minKneeAngle < 110; // More strict detection
    const isStanding = angleDiff < 25 && leftKneeAngle > 150 && rightKneeAngle > 150;

    let repCompleted = false;
    let feedback = 'Stand ready for lunges';

    // Count consecutive frames
    if (isLunging) {
      this.consecutiveLungeFrames++;
      this.consecutiveStandFrames = 0;
    } else if (isStanding) {
      this.consecutiveStandFrames++;
      this.consecutiveLungeFrames = 0;
    } else {
      this.consecutiveLungeFrames = Math.max(0, this.consecutiveLungeFrames - 1);
      this.consecutiveStandFrames = Math.max(0, this.consecutiveStandFrames - 1);
    }

    if (this.state === 'up' && this.consecutiveLungeFrames >= this.requiredConsecutiveFrames) {
      if (this.frameCount - this.lastStateChange > this.minFramesBetweenReps) {
        this.state = 'down';
        this.lastStateChange = this.frameCount;
        feedback = minKneeAngle < 90 ? 'Perfect lunge depth!' : 'Good - go deeper';
      }
    } else if (this.state === 'down' && this.consecutiveStandFrames >= this.requiredConsecutiveFrames) {
      if (this.frameCount - this.lastStateChange > this.minFramesBetweenReps) {
        this.state = 'up';
        this.lastStateChange = this.frameCount;
        repCompleted = true;
        feedback = 'Excellent lunge! Step into next one';
      }
    } else if (this.state === 'down') {
      feedback = 'Push through front heel to return';
    } else if (angleDiff > 15 && !isLunging) {
      feedback = 'Lunge deeper - 90 degree angles';
    } else {
      feedback = 'Step forward into lunge position';
    }

    return { repCompleted, feedback };
  }
}

class JumpingJackDetector extends ExerciseDetector {
  private consecutiveOpenFrames: number = 0;
  private consecutiveClosedFrames: number = 0;
  private requiredConsecutiveFrames: number = 5; // Faster movement

  constructor() {
    super();
    this.state = 'closed';
    this.minFramesBetweenReps = 8; // Faster transitions for jumping jacks
  }

  reset() {
    super.reset();
    this.state = 'closed';
    this.consecutiveOpenFrames = 0;
    this.consecutiveClosedFrames = 0;
  }

  detect(landmarks: any) {
    if (!landmarks) return { repCompleted: false, feedback: 'Stand in full view for jumping jacks' };
    
    this.frameCount++;
    
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    if (!leftWrist || !rightWrist || !leftAnkle || !rightAnkle || !leftShoulder || !rightShoulder) {
      return { repCompleted: false, feedback: 'Position your full body in camera view' };
    }

    // Check if arms are up (hands above shoulders)
    const armsUp = leftWrist.y < leftShoulder.y - 0.1 && rightWrist.y < rightShoulder.y - 0.1;
    
    // Check if feet are apart
    const feetDistance = calculateDistance(leftAnkle, rightAnkle);
    const shoulderDistance = calculateDistance(leftShoulder, rightShoulder);
    const feetApart = feetDistance > shoulderDistance * 1.5; // More dynamic threshold

    const isJumpingPosition = armsUp && feetApart;
    const isClosedPosition = !armsUp && !feetApart;

    let repCompleted = false;
    let feedback = 'Stand ready';

    // Count consecutive frames
    if (isJumpingPosition) {
      this.consecutiveOpenFrames++;
      this.consecutiveClosedFrames = 0;
    } else if (isClosedPosition) {
      this.consecutiveClosedFrames++;
      this.consecutiveOpenFrames = 0;
    } else {
      // In transition
      this.consecutiveOpenFrames = Math.max(0, this.consecutiveOpenFrames - 1);
      this.consecutiveClosedFrames = Math.max(0, this.consecutiveClosedFrames - 1);
    }

    if (this.state === 'closed' && this.consecutiveOpenFrames >= this.requiredConsecutiveFrames) {
      if (this.frameCount - this.lastStateChange > this.minFramesBetweenReps) {
        this.state = 'open';
        this.lastStateChange = this.frameCount;
        feedback = 'Arms up, feet apart - perfect!';
      }
    } else if (this.state === 'open' && this.consecutiveClosedFrames >= this.requiredConsecutiveFrames) {
      if (this.frameCount - this.lastStateChange > this.minFramesBetweenReps) {
        this.state = 'closed';
        this.lastStateChange = this.frameCount;
        repCompleted = true;
        feedback = 'Great jumping jack!';
      }
    } else if (this.state === 'open') {
      feedback = 'Jump feet together, arms down';
    } else if (!armsUp && feetApart) {
      feedback = 'Raise your arms overhead';
    } else if (armsUp && !feetApart) {
      feedback = 'Jump feet apart';
    } else {
      feedback = 'Jump with arms up and feet apart!';
    }

    return { repCompleted, feedback };
  }
}

// Initialize detectors for each exercise
export const exerciseDetectors = {
  pushups: new PushUpDetector(),
  squats: new SquatDetector(),
  planks: new PlankDetector(),
  situps: new SitUpDetector(),
  lunges: new LungeDetector(),
  jumpingjacks: new JumpingJackDetector()
};
