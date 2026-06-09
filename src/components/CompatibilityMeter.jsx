function CompatibilityMeter({ score, showLabel = true, showBar = true, size = 'md' }) {

  const color =
    score >= 70 ? { text: 'text-green-500',  bg: 'bg-green-500',  light: 'bg-green-50',  border: 'border-green-200'  } :
    score >= 40 ? { text: 'text-yellow-500', bg: 'bg-yellow-500', light: 'bg-yellow-50', border: 'border-yellow-200' } :
                  { text: 'text-red-400',    bg: 'bg-red-400',    light: 'bg-red-50',    border: 'border-red-200'    }

  const label =
    score >= 80 ? 'Excellent Match' :
    score >= 60 ? 'Good Match'      :
    score >= 40 ? 'Fair Match'      : 'Low Match'

  const emoji =
    score >= 80 ? '🔥' :
    score >= 60 ? '✅' :
    score >= 40 ? '🟡' : '❌'

  const textSize = size === 'lg' ? 'text-4xl' : size === 'sm' ? 'text-lg' : 'text-2xl'
  const labelSize = size === 'lg' ? 'text-sm' : 'text-xs'

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`font-bold ${textSize} ${color.text}`}>
        {score}%
      </div>

      {showLabel && (
        <span className={`${labelSize} px-2.5 py-0.5 rounded-full border font-medium ${color.light} ${color.border} ${color.text}`}>
          {emoji} {label}
        </span>
      )}

      {showBar && (
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
          <div
            className={`h-full rounded-full transition-all duration-700 ${color.bg}`}
            style={{ width: `${score}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default CompatibilityMeter