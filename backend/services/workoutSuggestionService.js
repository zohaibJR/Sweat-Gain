import Workout from '../models/Workout.js';

const BALANCED_FOCUS_GROUPS = ['Chest', 'Back', 'Legs', 'Arms'];

const DEFAULT_BEGINNER_PLAN = {
  title: "Today's Workout Plan",
  focus: 'Full Body',
  exercises: [
    'Bodyweight Squats - 3 sets x 12 reps',
    'Push-Ups - 3 sets x 8 reps',
    'Bent-Over Dumbbell Rows - 3 sets x 10 reps',
    'Glute Bridges - 3 sets x 12 reps',
  ],
  note: 'No previous workouts found, so here is a balanced beginner-friendly full body plan.',
};

const BEGINNER_LIBRARY = {
  Chest: [
    'Push-Ups - 3 sets x 8 reps',
    'Dumbbell Bench Press - 3 sets x 10 reps',
    'Incline Dumbbell Press - 3 sets x 10 reps',
    'Chest Fly - 2 sets x 12 reps',
  ],
  Back: [
    'Lat Pulldown - 3 sets x 10 reps',
    'Seated Cable Row - 3 sets x 10 reps',
    'Single-Arm Dumbbell Row - 3 sets x 10 reps',
    'Back Extension - 2 sets x 12 reps',
  ],
  Legs: [
    'Goblet Squats - 3 sets x 10 reps',
    'Reverse Lunges - 3 sets x 10 reps',
    'Leg Press - 3 sets x 10 reps',
    'Romanian Deadlifts - 2 sets x 10 reps',
  ],
  Arms: [
    'Dumbbell Bicep Curls - 3 sets x 12 reps',
    'Triceps Pushdowns - 3 sets x 12 reps',
    'Hammer Curls - 2 sets x 12 reps',
    'Overhead Triceps Extension - 2 sets x 12 reps',
  ],
};

function normaliseMuscleGroup(muscle = '') {
  const value = muscle.trim().toLowerCase();

  if (['chest', 'pecs', 'pectorals'].includes(value)) return 'Chest';
  if (['back', 'lats', 'upper back', 'lower back'].includes(value)) return 'Back';
  if (['legs', 'quads', 'quadriceps', 'hamstrings', 'glutes', 'calves'].includes(value)) return 'Legs';
  if (['arms', 'biceps', 'triceps', 'forearms'].includes(value)) return 'Arms';

  return '';
}

function getLastWorkoutMuscle(workouts) {
  const latestDate = workouts[0]?.date;
  if (!latestDate) return null;

  const sameDayWorkouts = workouts.filter(
    (workout) => new Date(workout.date).toDateString() === new Date(latestDate).toDateString()
  );

  return normaliseMuscleGroup(sameDayWorkouts[0]?.muscle || '') || null;
}

function getBalancedFocus(workouts, lastWorkoutMuscle) {
  const counts = BALANCED_FOCUS_GROUPS.reduce((acc, group) => {
    acc[group] = 0;
    return acc;
  }, {});

  workouts.forEach((workout) => {
    const group = normaliseMuscleGroup(workout.muscle);
    if (group && counts[group] !== undefined) {
      counts[group] += 1;
    }
  });

  const candidates = BALANCED_FOCUS_GROUPS.filter((group) => group !== lastWorkoutMuscle);
  candidates.sort((a, b) => counts[a] - counts[b] || BALANCED_FOCUS_GROUPS.indexOf(a) - BALANCED_FOCUS_GROUPS.indexOf(b));

  return candidates[0] || 'Legs';
}

function buildFallbackPlan({ focus, lastWorkoutMuscle }) {
  return {
    title: "Today's Workout Plan",
    focus,
    exercises: BEGINNER_LIBRARY[focus] || BEGINNER_LIBRARY.Legs,
    note: lastWorkoutMuscle
      ? `You trained ${lastWorkoutMuscle.toLowerCase()} last time, so today focuses on ${focus.toLowerCase()}.`
      : `This beginner-friendly ${focus.toLowerCase()} plan keeps your training balanced.`,
  };
}

function parseModelJson(content) {
  if (!content) return null;

  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function sanitisePlan(plan, fallbackPlan) {
  if (!plan || typeof plan !== 'object') {
    return fallbackPlan;
  }

  const exercises = Array.isArray(plan.exercises)
    ? plan.exercises.filter((exercise) => typeof exercise === 'string' && exercise.trim()).slice(0, 5)
    : [];

  if (!plan.title || !plan.focus || exercises.length < 3 || !plan.note) {
    return fallbackPlan;
  }

  return {
    title: String(plan.title),
    focus: String(plan.focus),
    exercises,
    note: String(plan.note),
  };
}

async function generateWithOpenAI({ focus, lastWorkoutMuscle, workouts, fallbackPlan }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return fallbackPlan;
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

  const prompt = [
    'You are a fitness assistant that returns only strict JSON.',
    'Create a beginner-friendly workout plan with 3 to 5 exercises.',
    `Recommended focus: ${focus}.`,
    `Avoid the last workout muscle group: ${lastWorkoutMuscle || 'none'}.`,
    `Recent workout history JSON: ${JSON.stringify(workouts)}.`,
    'Return this exact shape:',
    '{"title":"Today\'s Workout Plan","focus":"Legs","exercises":["Squats - 3 sets x 10 reps"],"note":"You trained chest last time, so today is legs."}',
    'Do not include markdown fences or any text outside the JSON object.',
  ].join('\n');

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: prompt,
      temperature: 0.7,
      max_output_tokens: 300,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const rawOutput =
    data.output_text ||
    data.output?.flatMap((item) => item.content || []).map((item) => item.text || '').join('') ||
    '';

  const parsed = parseModelJson(rawOutput);
  return sanitisePlan(parsed, fallbackPlan);
}

export async function getWorkoutSuggestionForUser(userId) {
  const workouts = await Workout.find({ userId })
    .sort({ date: -1, createdAt: -1 })
    .limit(20)
    .lean();

  if (workouts.length === 0) {
    return DEFAULT_BEGINNER_PLAN;
  }

  const lastWorkoutMuscle = getLastWorkoutMuscle(workouts);
  const focus = getBalancedFocus(workouts, lastWorkoutMuscle);
  const fallbackPlan = buildFallbackPlan({ focus, lastWorkoutMuscle });

  try {
    return await generateWithOpenAI({
      focus,
      lastWorkoutMuscle,
      workouts: workouts.map((workout) => ({
        date: workout.date,
        exercise: workout.exercise,
        muscle: workout.muscle,
        sets: workout.sets,
        reps: workout.reps,
      })),
      fallbackPlan,
    });
  } catch (error) {
    console.error('generateWithOpenAI error:', error.message);
    return fallbackPlan;
  }
}

export { DEFAULT_BEGINNER_PLAN };
