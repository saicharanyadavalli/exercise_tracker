
export interface ExerciseInstruction {
  name: string;
  setup: string[];
  execution: string[];
  tips: string[];
  commonMistakes: string[];
}

export const exerciseInstructions: Record<string, ExerciseInstruction> = {
  pushups: {
    name: "Push-ups",
    setup: [
      "Start in a plank position with hands slightly wider than shoulder-width",
      "Keep your body straight from head to heels",
      "Place hands flat on the floor, fingers pointing forward",
      "Engage your core and keep your head in neutral position"
    ],
    execution: [
      "Lower your body by bending your elbows until chest nearly touches the floor",
      "Keep your elbows at about 45-degree angle to your body",
      "Push back up to starting position with control",
      "Maintain straight body line throughout the movement"
    ],
    tips: [
      "Keep your core tight to prevent sagging hips",
      "Breathe in on the way down, exhale on the way up",
      "Focus on controlled movement rather than speed",
      "Keep your head aligned with your spine"
    ],
    commonMistakes: [
      "Letting hips sag or pike up",
      "Not going down far enough",
      "Flaring elbows too wide",
      "Moving too fast without control"
    ]
  },
  
  squats: {
    name: "Squats",
    setup: [
      "Stand with feet shoulder-width apart",
      "Point toes slightly outward",
      "Keep your chest up and shoulders back",
      "Engage your core and keep arms at your sides or crossed"
    ],
    execution: [
      "Lower your body by pushing hips back and bending knees",
      "Keep your chest up and knees tracking over toes",
      "Descend until thighs are parallel to floor (or as low as comfortable)",
      "Drive through heels to return to starting position"
    ],
    tips: [
      "Keep your weight on your heels, not toes",
      "Don't let knees cave inward",
      "Maintain neutral spine throughout",
      "Think of sitting back into an invisible chair"
    ],
    commonMistakes: [
      "Knees caving inward",
      "Not going deep enough",
      "Leaning too far forward",
      "Rising up on toes"
    ]
  },

  planks: {
    name: "Planks",
    setup: [
      "Start in push-up position or on forearms",
      "Keep your body in straight line from head to heels",
      "Engage your core muscles",
      "Keep your head in neutral position looking down"
    ],
    execution: [
      "Hold the position while maintaining proper form",
      "Breathe normally, don't hold your breath",
      "Keep your hips level, not sagging or piked",
      "Maintain the position for the desired duration"
    ],
    tips: [
      "Focus on quality over duration",
      "Squeeze your glutes to help maintain position",
      "Keep shoulders directly over elbows/hands",
      "Start with shorter holds and build up time"
    ],
    commonMistakes: [
      "Letting hips sag down",
      "Piking hips up too high",
      "Holding breath",
      "Dropping head or looking up"
    ]
  },

  situps: {
    name: "Sit-ups",
    setup: [
      "Lie on your back with knees bent, feet flat on floor",
      "Place hands behind head or crossed over chest",
      "Keep your feet planted firmly",
      "Engage your core before starting"
    ],
    execution: [
      "Curl your upper body up by contracting your abs",
      "Lift shoulder blades off the ground first",
      "Continue until sitting upright",
      "Lower back down with control to starting position"
    ],
    tips: [
      "Focus on using abs, not pulling with arms",
      "Keep chin off chest to avoid neck strain",
      "Control the movement both up and down",
      "Breathe out as you sit up, in as you lower"
    ],
    commonMistakes: [
      "Pulling on neck with hands",
      "Using momentum instead of muscle control",
      "Not engaging core properly",
      "Bouncing off the floor"
    ]
  },

  lunges: {
    name: "Lunges",
    setup: [
      "Stand tall with feet hip-width apart",
      "Keep your core engaged and chest up",
      "Take a large step forward with one leg",
      "Keep hands on hips or at sides for balance"
    ],
    execution: [
      "Lower your body until both knees form 90-degree angles",
      "Keep front knee over ankle, not pushed forward",
      "Lower back knee toward the ground",
      "Push through front heel to return to starting position"
    ],
    tips: [
      "Keep most of your weight on front leg",
      "Don't let front knee extend past toes",
      "Keep torso upright throughout movement",
      "Step far enough forward for proper form"
    ],
    commonMistakes: [
      "Taking too small of a step",
      "Leaning forward excessively",
      "Letting front knee drift inward",
      "Not lowering back knee enough"
    ]
  },

  jumpingjacks: {
    name: "Jumping Jacks",
    setup: [
      "Stand upright with feet together",
      "Keep arms at your sides",
      "Engage your core",
      "Keep knees slightly bent and ready to move"
    ],
    execution: [
      "Jump feet apart to shoulder-width while raising arms overhead",
      "Land softly on balls of feet",
      "Jump feet back together while lowering arms to sides",
      "Maintain rhythm and control throughout"
    ],
    tips: [
      "Land softly to reduce impact on joints",
      "Keep core engaged throughout",
      "Maintain steady breathing rhythm",
      "Focus on coordinating arms and legs"
    ],
    commonMistakes: [
      "Landing too hard on heels",
      "Not fully extending arms overhead",
      "Moving too fast and losing coordination",
      "Not engaging core for stability"
    ]
  }
};
