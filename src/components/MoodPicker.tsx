import type { Mood } from '../domain/types'

const moods: Array<{ value: Mood; label: string; emoji: string }> = [
  { value: 'joy', label: '开心', emoji: '☀️' },
  { value: 'calm', label: '平静', emoji: '🌿' },
  { value: 'tired', label: '疲惫', emoji: '🌙' },
  { value: 'brave', label: '勇敢', emoji: '🔥' },
  { value: 'missing', label: '想念', emoji: '💌' },
  { value: 'grateful', label: '感激', emoji: '✨' },
]

interface MoodPickerProps {
  value: Mood
  onChange: (value: Mood) => void
}

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div className="mood-picker" role="radiogroup" aria-label="心情">
      {moods.map((mood) => (
        <button
          key={mood.value}
          type="button"
          role="radio"
          aria-checked={value === mood.value}
          className={value === mood.value ? 'mood-chip active' : 'mood-chip'}
          onClick={() => onChange(mood.value)}
        >
          <span>{mood.emoji}</span>
          {mood.label}
        </button>
      ))}
    </div>
  )
}
