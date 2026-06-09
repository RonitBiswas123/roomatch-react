import CompatibilityMeter from './CompatibilityMeter'

function CompatibilityBreakdown({ student, userProfile }) {

  const factors = [
    {
      label:   'Sleep Time',
      icon:    '🌙',
      weight:  30,
      matched: userProfile?.sleepTime === student?.sleep_time,
      mine:    userProfile?.sleepTime,
      theirs:  student?.sleep_time,
    },
    {
      label:   'Branch',
      icon:    '🎓',
      weight:  20,
      matched: userProfile?.branch === student?.branch,
      mine:    userProfile?.branch,
      theirs:  student?.branch,
    },
    {
      label:   'Cleanliness',
      icon:    '✨',
      weight:  20,
      matched: userProfile?.cleanliness === student?.cleanliness,
      mine:    userProfile?.cleanliness,
      theirs:  student?.cleanliness,
    },
    {
      label:   'Study Hours',
      icon:    '📚',
      weight:  15,
      matched: userProfile?.studyHours === student?.study_hours,
      mine:    userProfile?.studyHours,
      theirs:  student?.study_hours,
    },
    {
      label:   'Noise',
      icon:    '🔊',
      weight:  15,
      matched: userProfile?.noise === student?.noise,
      mine:    userProfile?.noise,
      theirs:  student?.noise,
    },
  ]

  const score = factors.reduce((sum, f) => sum + (f.matched ? f.weight : 0), 0)

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

      {/* Score header */}
      <div className="text-center mb-6">
        <CompatibilityMeter score={score} size="lg" showBar={true} />
        <p className="text-sm text-slate-400 mt-2">with {student?.name}</p>
      </div>

      {/* Factor breakdown */}
      <div className="flex flex-col gap-3">
        {factors.map(factor => (
          <div key={factor.label} className="flex items-center gap-3">

            <span className="text-lg w-6 flex-shrink-0">{factor.icon}</span>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-600">{factor.label}</span>
                <span className={`text-xs font-bold ${factor.matched ? 'text-green-500' : 'text-red-400'}`}>
                  {factor.matched ? `+${factor.weight}` : '+0'}
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${factor.matched ? 'bg-green-400' : 'bg-slate-200'}`}
                  style={{ width: factor.matched ? '100%' : '0%' }}
                />
              </div>
              <div className="flex justify-between mt-0.5">
                <span className="text-xs text-slate-400">You: {factor.mine || '—'}</span>
                <span className="text-xs text-slate-400">Them: {factor.theirs || '—'}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
        <span className="text-sm font-medium text-slate-600">Total Score</span>
        <span className={`text-lg font-bold ${score >= 70 ? 'text-green-500' : score >= 40 ? 'text-yellow-500' : 'text-red-400'}`}>
          {score} / 100
        </span>
      </div>

    </div>
  )
}

export default CompatibilityBreakdown