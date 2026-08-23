// Field config for the intake wizard -- one entry per column in
// supabase/intake.sql. Drives both the wizard's step rendering
// (src/features/intake/IntakeStep.jsx) and the coach's read-only
// response view (src/features/coach-tools/IntakeResponse.jsx), so the
// two can never drift out of sync with each other.
//
// type: 'text' | 'textarea' | 'date' | 'number' | 'select' | 'boolean' | 'checkbox'
export const INTAKE_SECTIONS = [
  {
    title: 'About You',
    fields: [
      { key: 'full_name', label: 'Full name', type: 'text' },
      { key: 'date_of_birth', label: 'Date of birth', type: 'date' },
      { key: 'gender', label: 'Gender', type: 'select', options: ['Female', 'Male', 'Other'] },
      { key: 'phone', label: 'Phone / WhatsApp', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'city_timezone', label: 'City / timezone', type: 'text' },
      { key: 'height', label: 'Height', type: 'text' },
      { key: 'current_weight', label: 'Current weight', type: 'text' },
      { key: 'occupation', label: 'Occupation (active or desk-based?)', type: 'text' },
    ],
  },
  {
    title: 'Your Goals',
    fields: [
      {
        key: 'primary_goal',
        label: 'Primary goal',
        type: 'select',
        options: ['Fat loss', 'Muscle gain', 'Strength', 'General fitness', 'Sport-specific', 'Other'],
      },
      { key: 'change_one_thing', label: 'If you could change one thing about your body or fitness, what would it be?', type: 'textarea' },
      { key: 'target_outcome', label: 'Target outcome (be specific -- e.g. "lose 8kg", "bench 100kg")', type: 'text' },
      { key: 'ideal_timeline', label: 'Ideal timeline', type: 'text' },
      { key: 'tried_before', label: 'Have you tried to reach this goal before? What happened?', type: 'textarea' },
      { key: 'success_definition', label: 'How do you define success 12 weeks from now?', type: 'textarea' },
    ],
  },
  {
    title: 'Training History',
    fields: [
      { key: 'experience_level', label: 'Experience level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'] },
      { key: 'training_duration', label: 'How long have you been training consistently?', type: 'text' },
      { key: 'current_training', label: 'What does your current training look like (if any)?', type: 'textarea' },
      { key: 'likes_dislikes', label: 'What do you enjoy? What do you hate?', type: 'textarea' },
      { key: 'days_per_week', label: 'How many days per week can you realistically train?', type: 'number' },
      { key: 'session_length', label: 'How long per session?', type: 'text' },
      { key: 'preferred_time', label: 'Preferred training time of day', type: 'select', options: ['Morning', 'Afternoon', 'Evening', 'No preference'] },
    ],
  },
  {
    title: 'Access & Equipment',
    fields: [
      {
        key: 'training_location',
        label: 'Where will you train?',
        type: 'select',
        options: ['Commercial gym', 'Home gym', 'Bodyweight only', 'Other'],
      },
      { key: 'equipment_access', label: 'What equipment do you have access to?', type: 'textarea' },
      { key: 'equipment_limitations', label: 'Any equipment limitations I should know about?', type: 'textarea' },
    ],
  },
  {
    title: 'Injuries & Health',
    intro: 'Critical -- please be honest.',
    fields: [
      { key: 'injuries', label: 'Any current or past injuries?', type: 'textarea' },
      { key: 'pain_movements', label: 'Any movements that cause pain?', type: 'textarea' },
      { key: 'medical_conditions', label: 'Any medical conditions (heart, blood pressure, diabetes, asthma, etc.)?', type: 'textarea' },
      { key: 'medications', label: 'Any medications that affect training or recovery?', type: 'textarea' },
      { key: 'doctor_cleared', label: 'Are you cleared by a doctor to exercise?', type: 'boolean' },
      { key: 'pregnant_postpartum', label: 'Pregnant or postpartum? (if applicable)', type: 'text' },
    ],
  },
  {
    title: 'Nutrition',
    fields: [
      { key: 'typical_day_eating', label: 'Describe your typical day of eating', type: 'textarea' },
      { key: 'meals_per_day', label: 'How many meals per day?', type: 'number' },
      { key: 'cook_or_eat_out', label: 'Do you cook, eat out, or both?', type: 'select', options: ['Cook', 'Eat out', 'Both'] },
      { key: 'allergies', label: 'Any allergies or intolerances?', type: 'text' },
      { key: 'dietary_preference', label: 'Any dietary preference (vegetarian, vegan, halal, etc.)?', type: 'text' },
      { key: 'refused_foods', label: 'Foods you refuse to eat?', type: 'text' },
      { key: 'alcohol_frequency', label: 'Alcohol -- how often?', type: 'text' },
      { key: 'water_intake', label: 'Water intake per day', type: 'text' },
      { key: 'wants_nutrition_coaching', label: 'Do you want nutrition coaching, or training only?', type: 'boolean', trueLabel: 'Nutrition coaching', falseLabel: 'Training only' },
    ],
  },
  {
    title: 'Lifestyle & Recovery',
    fields: [
      { key: 'average_sleep', label: 'Average sleep per night', type: 'text' },
      { key: 'sleep_quality', label: 'Sleep quality', type: 'select', options: ['Poor', 'Okay', 'Good'] },
      { key: 'stress_level', label: 'Stress level', type: 'select', options: ['Low', 'Moderate', 'High'] },
      { key: 'lifestyle_obstacle', label: 'Biggest lifestyle obstacle to reaching your goal?', type: 'textarea' },
    ],
  },
  {
    title: 'Accountability',
    fields: [
      { key: 'communication_preference', label: 'How do you prefer to communicate?', type: 'select', options: ['WhatsApp', 'In-app', 'Email'] },
      { key: 'checkin_frequency', label: 'How often do you want check-ins?', type: 'select', options: ['Weekly', 'Bi-weekly', 'Monthly'] },
      { key: 'coaching_style', label: 'What kind of coaching motivates you?', type: 'select', options: ['Tough love', 'Supportive', 'Data-driven'] },
      { key: 'additional_notes', label: 'Anything else I should know about you?', type: 'textarea' },
    ],
  },
  {
    title: 'Agreement',
    fields: [
      { key: 'agreement_confirmed', label: "I confirm the above is accurate and I'm physically able to undertake exercise.", type: 'checkbox', required: true },
      { key: 'photo_consent', label: 'Photo/measurement consent for progress tracking', type: 'checkbox' },
    ],
  },
]

export function emptyIntakeForm() {
  const form = {}
  for (const section of INTAKE_SECTIONS) {
    for (const field of section.fields) {
      form[field.key] = field.type === 'checkbox' ? false : field.type === 'boolean' ? null : ''
    }
  }
  return form
}
