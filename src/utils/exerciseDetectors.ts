
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
    this.minFramesBetweenReps = 10;
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
  detect(landmarks: any) {
    if (!landmarks) return { repCompleted: false, feedback: 'No pose detected' };
    
    this.frameCount++;
    
    // Key points for push-ups
    const leftShoulder = landmarks[11];
    const leftElbow = landmarks[13];
    const leftWrist = landmarks[15];
    const rightShoulder = landmarks[12];
    const rightElbow = landmarks[14];
    const rightWrist = landmarks[16];

    if (!leftShoulder || !leftElbow || !leftWrist || !rightShoulder || !rightElbow || !rightWrist) {
      return { repCompleted: false, feedback: 'Position yourself in camera view' };
    }

    // Calculate elbow angles
    const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    const avgElbowAngle = (leftElbowAngle + rightElbowAngle) / 2;

    let repCompleted = false;
    let feedback = 'Good form!';

    // State machine for push-up detection
    if (this.state === 'up' && avgElbowAngle < 90) {
      if (this.frameCount - this.lastStateChange > this.minFramesBetweenReps) {
        this.state = 'down';
        this.lastStateChange = this.frameCount;
        feedback = 'Going down - good!';
      }
    } else if (this.state === 'down' && avgElbowAngle > 160) {
      if (this.frameCount - this.lastStateChange > this.minFramesBetweenReps) {
        this.state = 'up';
        this.lastStateChange = this.frameCount;
        repCompleted = true;
        feedback = 'Rep completed!';
      }
    } else if (this.state === 'down') {
      feedback = 'Push up to complete rep';
    } else if (avgElbowAngle < 160 && avgElbowAngle > 90) {
      feedback = 'Lower down more';
    }

    return { repCompleted, feedback };
  }
}

class SquatDetector extends ExerciseDetector {
  detect(landmarks: any) {
    if (!landmarks) return { repCompleted: false, feedback: 'No pose detected' };
    
    this.frameCount++;
    
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];
    const rightHip = landmarks[24];
    const rightKnee = landmarks[26];
    const rightAnkle = landmarks[28];

    if (!leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle) {
      return { repCompleted: false, feedback: 'Stand facing the camera' };
    }

    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

    let repCompleted = false;
    let feedback = 'Stand ready';

    if (this.state === 'up' && avgKneeAngle < 120) {
      if (this.frameCount - this.lastStateChange > this.minFramesBetweenReps) {
        this.state = 'down';
        this.lastStateChange = this.frameCount;
        feedback = 'Squatting down';
      }
    } else if (this.state === 'down' && avgKneeAngle > 160) {
      if (this.frameCount - this.lastStateChange > this.minFramesBetweenReps) {
        this.state = 'up';
        this.lastStateChange = this.frameCount;
        repCompleted = true;
        feedback = 'Great squat!';
      }
    } else if (this.state === 'down') {
      feedback = 'Stand up to complete';
    } else if (avgKneeAngle < 160) {
      feedback = 'Go lower';
    }

    return { repCompleted, feedback };
  }
}

class PlankDetector extends ExerciseDetector {
  private startTime: number | null;
  private isHolding: boolean;

  constructor() {
    super();
    this.startTime = null;
    this.isHolding = false;
  }

  detect(landmarks: any) {
    if (!landmarks) return { repCompleted: false, feedback: 'No pose detected' };
    
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
      return { repCompleted: false, feedback: 'Get in plank position' };
    }

    // Check if body is straight (plank position)
    const shoulderMidpoint = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2
    };
    const hipMidpoint = {
      x: (leftHip.x + rightHip.x) / 2,
      y: (leftHip.y + rightHip.y) / 2
    };

    const bodyAngle = Math.abs(Math.atan2(hipMidpoint.y - shoulderMidpoint.y, hipMidpoint.x - shoulderMidpoint.x) * 180 / Math.PI);
    const isGoodPlank = bodyAngle < 15 || bodyAngle > 165; // Body should be relatively straight

    if (isGoodPlank) {
      if (!this.isHolding) {
        this.isHolding = true;
        this.startTime = Date.now();
      }
      return { repCompleted: false, feedback: 'Hold that plank!' };
    } else {
      this.isHolding = false;
      this.startTime = null;
      return { repCompleted: false, feedback: 'Straighten your body' };
    }
  }
}

class SitUpDetector extends ExerciseDetector {
  detect(landmarks: any) {
    if (!landmarks) return { repCompleted: false, feedback: 'No pose detected' };
    
    this.frameCount++;
    
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
      return { repCompleted: false, feedback: 'Lie down to start' };
    }

    const shoulderMidpoint = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2
    };
    const hipMidpoint = {
      x: (leftHip.x + rightHip.x) / 2,
      y: (leftHip.y + rightHip.y) / 2
    };

    const bodyAngle = Math.atan2(shoulderMidpoint.y - hipMidpoint.y, shoulderMidpoint.x - hipMidpoint.x) * 180 / Math.PI;
    const isUp = Math.abs(bodyAngle) < 30;

    let repCompleted = false;
    let feedback = 'Lie down to start';

    if (this.state === 'down' && isUp) {
      if (this.frameCount - this.lastStateChange > this.minFramesBetweenReps) {
        this.state = 'up';
        this.lastStateChange = this.frameCount;
        feedback = 'Sit up complete!';
      }
    } else if (this.state === 'up' && !isUp) {
      if (this.frameCount - this.lastStateChange > this.minFramesBetweenReps) {
        this.state = 'down';
        this.lastStateChange = this.frameCount;
        repCompleted = true;
        feedback = 'Good! Now sit up again';
      }
    } else if (this.state === 'up') {
      feedback = 'Lower back down';
    } else {
      feedback = 'Sit up!';
    }

    return { repCompleted, feedback };
  }
}

class LungeDetector extends ExerciseDetector {
  detect(landmarks: any) {
    if (!landmarks) return { repCompleted: false, feedback: 'No pose detected' };
    
    this.frameCount++;
    
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];
    const rightHip = landmarks[24];
    const rightKnee = landmarks[26];
    const rightAnkle = landmarks[28];

    if (!leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle) {
      return { repCompleted: false, feedback: 'Stand in view' };
    }

    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    
    // Detect if one leg is significantly more bent (lunging)
    const angleDiff = Math.abs(leftKneeAngle - rightKneeAngle);
    const minKneeAngle = Math.min(leftKneeAngle, rightKneeAngle);
    const isLunging = angleDiff > 30 && minKneeAngle < 120;

    let repCompleted = false;
    let feedback = 'Stand ready';

    if (this.state === 'up' && isLunging) {
      if (this.frameCount - this.lastStateChange > this.minFramesBetweenReps) {
        this.state = 'down';
        this.lastStateChange = this.frameCount;
        feedback = 'Good lunge depth!';
      }
    } else if (this.state === 'down' && !isLunging) {
      if (this.frameCount - this.lastStateChange > this.minFramesBetweenReps) {
        this.state = 'up';
        this.lastStateChange = this.frameCount;
        repCompleted = true;
        feedback = 'Lunge completed!';
      }
    } else if (this.state === 'down') {
      feedback = 'Return to standing';
    } else {
      feedback = 'Step into lunge position';
    }

    return { repCompleted, feedback };
  }
}

class JumpingJackDetector extends ExerciseDetector {
  constructor() {
    super();
    this.state = 'closed';
  }

  detect(landmarks: any) {
    if (!landmarks) return { repCompleted: false, feedback: 'No pose detected' };
    
    this.frameCount++;
    
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    if (!leftWrist || !rightWrist || !leftAnkle || !rightAnkle || !leftShoulder || !rightShoulder) {
      return { repCompleted: false, feedback: 'Stand in full view' };
    }

    // Check if arms are up (hands above shoulders)
    const armsUp = leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;
    
    // Check if feet are apart
    const feetDistance = calculateDistance(leftAnkle, rightAnkle);
    const feetApart = feetDistance > 0.3; // Threshold for feet being apart

    const isJumpingPosition = armsUp && feetApart;

    let repCompleted = false;
    let feedback = 'Stand ready';

    if (this.state === 'closed' && isJumpingPosition) {
      if (this.frameCount - this.lastStateChange > 5) { // Shorter delay for jumping jacks
        this.state = 'open';
        this.lastStateChange = this.frameCount;
        feedback = 'Arms up, feet apart!';
      }
    } else if (this.state === 'open' && !isJumpingPosition) {
      if (this.frameCount - this.lastStateChange > 5) {
        this.state = 'closed';
        this.lastStateChange = this.frameCount;
        repCompleted = true;
        feedback = 'Jumping jack completed!';
      }
    } else if (this.state === 'open') {
      feedback = 'Jump back to center';
    } else {
      feedback = 'Jump with arms up!';
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
