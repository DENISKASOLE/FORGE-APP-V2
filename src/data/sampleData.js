// Placeholder content shown until the Supabase schema (see supabase/schema.sql) is
// provisioned and the functions in src/data/*.js are pointed at real tables.

export const client = {
  name: 'Marcus',
  fullName: 'Marcus Reid',
  week: 8,
  program: 'Hypertrophy Block II',
  daysActive: 54,
  coach: { name: 'Coach Denis', online: true },
}

export const habitRings = [
  { key: 'workout', label: 'Workout', value: 1, target: 1, unit: '/1', color: 'var(--ember)' },
  { key: 'nutrition', label: 'Nutrition', value: 92, target: 100, unit: '%', color: 'var(--sage)' },
  { key: 'steps', label: 'Steps', value: 7.2, target: 10, unit: 'k', color: 'var(--court)' },
  { key: 'water', label: 'Water', value: 2.1, target: 3, unit: 'L', color: 'var(--violet)' },
]

export const todayWorkout = {
  id: 'day-a',
  name: 'Upper A — Push',
  week: 8,
  exerciseCount: 6,
  done: false,
}

export const learnTips = [
  { id: 't1', tag: 'Nutrition', title: 'Why protein timing matters less than you think', color: 'sage' },
  { id: 't2', tag: 'Recovery', title: 'Sleep debt and next-day performance', color: 'violet' },
  { id: 't3', tag: 'Training', title: 'Progressive overload without adding weight', color: 'ember' },
  { id: 't4', tag: 'Mindset', title: 'Consistency beats intensity, every time', color: 'court' },
]

export const learnArticles = [
  ...learnTips,
  { id: 't5', tag: 'Nutrition', title: 'Building a meal you will actually stick to', color: 'sage' },
  { id: 't6', tag: 'Training', title: 'The case for deload weeks', color: 'ember' },
  { id: 't7', tag: 'Mindset', title: 'Tracking progress beyond the scale', color: 'violet' },
]

// Shape matches exactly what Supabase returns for the real nested
// programs -> program_days -> program_exercises -> exercises/exercise_swaps
// query (see src/data/programs.js), so the Train UI needs no special-casing
// between this fallback and real data.
export const trainingProgram = {
  id: 'sample-program',
  name: 'Hypertrophy Block II',
  notes: null,
  program_days: [
    {
      id: 'day-a',
      day_label: 'Day A — Push',
      sort_order: 0,
      program_exercises: [
        {
          id: 'pe-1',
          block_label: 'Block 1',
          sets: 3,
          reps: 8,
          sort_order: 0,
          exercises: { id: 'ex-bench', name: 'Barbell Bench Press', muscle_group: 'Chest' },
          exercise_swaps: [
            { id: 'swap-1', exercises: { id: 'ex-db-bench', name: 'Dumbbell Bench Press', muscle_group: 'Chest' } },
          ],
        },
        {
          id: 'pe-2',
          block_label: 'Block 2 — Superset',
          sets: 3,
          reps: 10,
          sort_order: 1,
          exercises: { id: 'ex-incline-db', name: 'Incline DB Press', muscle_group: 'Chest' },
          exercise_swaps: [],
        },
        {
          id: 'pe-3',
          block_label: 'Block 2 — Superset',
          sets: 3,
          reps: 15,
          sort_order: 2,
          exercises: { id: 'ex-lateral-raise', name: 'Lateral Raise', muscle_group: 'Shoulders' },
          exercise_swaps: [],
        },
        {
          id: 'pe-4',
          block_label: 'Block 3',
          sets: 3,
          reps: 12,
          sort_order: 3,
          exercises: { id: 'ex-pushdown', name: 'Cable Triceps Pushdown', muscle_group: 'Triceps' },
          exercise_swaps: [],
        },
      ],
    },
    {
      id: 'day-b',
      day_label: 'Day B — Pull',
      sort_order: 1,
      program_exercises: [
        {
          id: 'pe-5',
          block_label: 'Block 1',
          sets: 3,
          reps: 5,
          sort_order: 0,
          exercises: { id: 'ex-deadlift', name: 'Deadlift', muscle_group: 'Lower Back' },
          exercise_swaps: [],
        },
      ],
    },
    {
      id: 'day-c',
      day_label: 'Day C — Legs',
      sort_order: 2,
      program_exercises: [
        {
          id: 'pe-6',
          block_label: 'Block 1',
          sets: 3,
          reps: 6,
          sort_order: 0,
          exercises: { id: 'ex-squat', name: 'Back Squat', muscle_group: 'Quadriceps' },
          exercise_swaps: [
            { id: 'swap-2', exercises: { id: 'ex-front-squat', name: 'Front Squat', muscle_group: 'Quadriceps' } },
          ],
        },
      ],
    },
  ],
}

export const nutritionTargets = {
  kcalTarget: 2600,
  kcalConsumed: 1840,
  protein: { target: 190, consumed: 138, color: 'var(--court)' },
  carbs: { target: 280, consumed: 210, color: 'var(--amber)' },
  fat: { target: 80, consumed: 52, color: 'var(--violet)' },
  adherence: 92,
  streak: 12,
}

export const meals = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    emoji: '🍳',
    time: '7:30 AM',
    items: [
      { id: 'f1', emoji: '🥚', name: 'Whole Eggs', serving: '3 eggs', kcal: 234, protein: 19, carbs: 2, fat: 16 },
      { id: 'f2', emoji: '🍞', name: 'Sourdough Toast', serving: '2 slices', kcal: 180, protein: 6, carbs: 34, fat: 2 },
    ],
  },
  {
    id: 'lunch',
    name: 'Lunch',
    emoji: '🥗',
    time: '12:45 PM',
    items: [
      { id: 'f3', emoji: '🍗', name: 'Grilled Chicken Breast', serving: '200g', kcal: 330, protein: 62, carbs: 0, fat: 8 },
      { id: 'f4', emoji: '🍚', name: 'Jasmine Rice', serving: '1.5 cups', kcal: 300, protein: 6, carbs: 66, fat: 1 },
    ],
  },
  {
    id: 'dinner',
    name: 'Dinner',
    emoji: '🍽️',
    time: '7:00 PM',
    items: [],
  },
  {
    id: 'snacks',
    name: 'Snacks',
    emoji: '🍎',
    time: 'All day',
    items: [
      { id: 'f5', emoji: '🍫', name: 'Protein Bar', serving: '1 bar', kcal: 210, protein: 20, carbs: 22, fat: 7 },
    ],
  },
]

export const foodLibrary = [
  { id: 'lib1', emoji: '🥑', name: 'Avocado', serving: '1/2 fruit', kcal: 120, protein: 1, carbs: 6, fat: 11 },
  { id: 'lib2', emoji: '🍌', name: 'Banana', serving: '1 medium', kcal: 105, protein: 1, carbs: 27, fat: 0 },
  { id: 'lib3', emoji: '🥛', name: 'Whey Protein', serving: '1 scoop', kcal: 120, protein: 24, carbs: 3, fat: 1 },
  { id: 'lib4', emoji: '🥜', name: 'Almonds', serving: '30g', kcal: 174, protein: 6, carbs: 6, fat: 15 },
  { id: 'lib5', emoji: '🍠', name: 'Sweet Potato', serving: '200g', kcal: 172, protein: 3, carbs: 40, fat: 0 },
]

export const savedMeals = [
  { id: 'sm1', name: 'Post-Workout Shake', kcal: 420, protein: 42, carbs: 48, fat: 6 },
  { id: 'sm2', name: 'Meal Prep Chicken Bowl', kcal: 610, protein: 55, carbs: 62, fat: 14 },
  { id: 'sm3', name: 'Overnight Oats', kcal: 380, protein: 18, carbs: 54, fat: 10 },
  { id: 'sm4', name: 'Steak & Veg', kcal: 540, protein: 48, carbs: 20, fat: 26 },
]

export const weightHistory = [
  82.4, 82.1, 81.8, 81.6, 81.2, 80.9, 80.6, 80.2, 80.0,
]

export const personalRecords = [
  { id: 'pr1', lift: 'Bench Press', best: '100kg × 1', recent: '95kg × 3', trend: 'up' },
  { id: 'pr2', lift: 'Back Squat', best: '140kg × 1', recent: '130kg × 3', trend: 'up' },
  { id: 'pr3', lift: 'Deadlift', best: '180kg × 1', recent: '170kg × 2', trend: 'flat' },
]

export const measurements = [
  { id: 'm1', label: 'Chest', current: 104, previous: 102 },
  { id: 'm2', label: 'Waist', current: 84, previous: 86 },
  { id: 'm3', label: 'Hips', current: 98, previous: 98 },
  { id: 'm4', label: 'Arm', current: 38, previous: 37 },
]

export const payments = {
  next: { date: '2026-09-01', amount: '500 AED', method: 'PayPal' },
  history: [
    { id: 'p1', date: '2026-08-01', amount: '500 AED', status: 'paid' },
    { id: 'p2', date: '2026-07-01', amount: '500 AED', status: 'paid' },
    { id: 'p3', date: '2026-06-01', amount: '500 AED', status: 'paid' },
  ],
}

export const messages = [
  { id: 'msg1', from: 'coach', text: 'Great session yesterday — bench is moving well.', time: '9:12 AM' },
  { id: 'msg2', from: 'client', text: 'Thanks! Felt strong on the last set.', time: '9:20 AM' },
  { id: 'msg3', from: 'coach', text: 'Push for +2.5kg today if reps feel easy.', time: '9:21 AM' },
]

// --- Coach-side sample data ---

export const coachProfile = {
  name: 'Coach Denis',
  email: 'kendenisdubai@gmail.com',
  role: 'Head Coach',
  activeClients: 24,
  monthRevenue: '5K AED',
  needsAttention: 3,
}

export const coachClients = [
  {
    id: 'c1',
    name: 'Marcus Reid',
    status: 'On track',
    tone: 'sage',
    compliance: 92,
    week: 'Week 8 of 12',
    nextPayment: '2026-09-01',
    activity: ['done', 'done', 'done', 'done', 'miss', 'done', 'pending'],
  },
  {
    id: 'c2',
    name: 'Saif Al-Rashid',
    status: 'Check-in due',
    tone: 'ember',
    compliance: 78,
    week: 'Week 5 of 12',
    nextPayment: '2026-08-28',
    activity: ['done', 'done', 'miss', 'done', 'done', 'pending', 'pending'],
  },
  {
    id: 'c3',
    name: 'Priya Nair',
    status: 'No workout 4d',
    tone: 'red',
    compliance: 54,
    week: 'Week 3 of 8',
    nextPayment: '2026-08-24',
    activity: ['done', 'miss', 'miss', 'miss', 'miss', 'pending', 'pending'],
    attention: true,
  },
  {
    id: 'c4',
    name: 'Elena Kovacs',
    status: 'Payment overdue',
    tone: 'red',
    compliance: 88,
    week: 'Week 10 of 12',
    nextPayment: '2026-08-15',
    activity: ['done', 'done', 'done', 'done', 'done', 'done', 'pending'],
    attention: true,
  },
  {
    id: 'c5',
    name: 'Tom Whitfield',
    status: 'On track',
    tone: 'sage',
    compliance: 95,
    week: 'Week 2 of 12',
    nextPayment: '2026-09-05',
    activity: ['done', 'done', 'done', 'done', 'done', 'pending', 'pending'],
  },
]

export const coachCheckins = [
  {
    id: 'ci1',
    clientId: 'c2',
    clientName: 'Saif Al-Rashid',
    week: 5,
    date: '2026-08-21',
    weight: 80.0,
    energy: 7,
    nutrition: 88,
    photos: 3,
    status: 'pending',
  },
  {
    id: 'ci2',
    clientId: 'c5',
    clientName: 'Tom Whitfield',
    week: 2,
    date: '2026-08-20',
    weight: 91.2,
    energy: 8,
    nutrition: 95,
    photos: 3,
    status: 'pending',
  },
  {
    id: 'ci3',
    clientId: 'c1',
    clientName: 'Marcus Reid',
    week: 7,
    date: '2026-08-14',
    weight: 80.6,
    energy: 8,
    nutrition: 92,
    photos: 3,
    status: 'reviewed',
  },
]

export const coachAlerts = [
  {
    id: 'a1',
    type: 'payment-overdue',
    clientId: 'c4',
    clientName: 'Elena Kovacs',
    detail: '500 AED · 7 days overdue',
    severity: 'red',
  },
  {
    id: 'a2',
    type: 'food-gap',
    clientId: 'c3',
    clientName: 'Priya Nair',
    detail: '4 days since last food log',
    severity: 'amber',
  },
  {
    id: 'a3',
    type: 'workout-gap',
    clientId: 'c3',
    clientName: 'Priya Nair',
    detail: '4 days since last workout',
    severity: 'ember',
  },
  {
    id: 'a4',
    type: 'payment-due',
    clientId: 'c2',
    clientName: 'Saif Al-Rashid',
    detail: '500 AED · due in 7 days',
    severity: 'sage',
  },
  {
    id: 'a5',
    type: 'birthday',
    clientId: 'c5',
    clientName: 'Tom Whitfield',
    detail: 'Turns 29 on Aug 30',
    severity: 'violet',
  },
]

export const coachTools = [
  { id: 'templates', label: 'Workout Templates', tone: 'ember' },
  { id: 'library', label: 'Exercise Library', tone: 'sage' },
  { id: 'learn', label: 'Learn', tone: 'violet' },
  { id: 'payments', label: 'Payments', tone: 'amber' },
  { id: 'intake', label: 'Intake Forms', tone: 'court' },
  { id: 'checkins', label: 'Check-ins', tone: 'ember', badge: 3 },
]

// Shown only if the exercises table can't be reached yet (e.g. before
// supabase/exercises.sql + exercises_seed.sql have been run).
export const exerciseLibrarySample = [
  {
    id: 'sample-1',
    name: 'Barbell Bench Press',
    muscle_group: 'Chest',
    equipment: 'Barbell',
    instructions: 'Lie on a flat bench, lower the bar to your chest, then press it back up to full lockout.',
    media_url: null,
    is_custom: false,
  },
  {
    id: 'sample-2',
    name: 'Back Squat',
    muscle_group: 'Quadriceps',
    equipment: 'Barbell',
    instructions: 'Bar on your upper back, squat down until thighs are parallel to the floor, then drive back up.',
    media_url: null,
    is_custom: false,
  },
  {
    id: 'sample-3',
    name: 'Deadlift',
    muscle_group: 'Lower Back',
    equipment: 'Barbell',
    instructions: 'Hinge at the hips, grip the bar, and stand up tall while keeping it close to your body.',
    media_url: null,
    is_custom: false,
  },
  {
    id: 'sample-4',
    name: 'Pull-Up',
    muscle_group: 'Lats',
    equipment: 'Bodyweight',
    instructions: 'Hang from a bar with an overhand grip and pull your chin above the bar.',
    media_url: null,
    is_custom: false,
  },
  {
    id: 'sample-5',
    name: 'Dumbbell Shoulder Press',
    muscle_group: 'Shoulders',
    equipment: 'Dumbbell',
    instructions: 'Press the dumbbells overhead from shoulder height until your arms are fully extended.',
    media_url: null,
    is_custom: false,
  },
  {
    id: 'sample-6',
    name: 'Plank',
    muscle_group: 'Abdominals',
    equipment: 'Bodyweight',
    instructions: 'Hold a straight line from head to heels, supported on your forearms and toes.',
    media_url: null,
    is_custom: false,
  },
]
