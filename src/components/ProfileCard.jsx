import { useState } from 'react'
import CompatibilityMeter from './CompatibilityMeter'

function ProfileCard({ name, branch, year, gender, compatibility, sleepTime, cleanliness, noise, studyHours, wakeTime, guests, about }) {

  const [expanded, setExpanded] = useState(false)

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()

  const avatarColors = ['bg-blue-600', 'bg-purple-600', 'bg-pink-600', 'bg-indigo-600', 'bg-teal-600', 'bg-orange-500']
  const avatarColor  = avatarColors[name.charCodeAt(0) % avatarColors.length]

  const tags = [sleepTime, cleanliness, noise, studyHours].filter(Boolean)

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-200 hover:shadow-md ${expanded ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}>

      {/* Compatibility bar */}
      <div
        className={`h-1.5 ${compatibility >= 70 ? 'bg-green-400' : compatibility >= 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
        style={{ width: `${compatibility}%` }}
      />

      <div className="p-5">

        {/* Top row */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-12 h-12 rounded-full ${avatarColor} text-white text-lg font-bold flex items-center justify-center flex-shrink-0`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-900 truncate">{name}</div>
            <div className="text-sm text-slate-400">{branch} • Year {year}</div>
            <div className="text-xs text-slate-400">{gender}</div>
          </div>

          {/* Compatibility meter */}
          <div className="flex-shrink-0">
            <CompatibilityMeter score={compatibility} showLabel={false} showBar={false} size="sm" />
          </div>
        </div>

        {/* Compatibility bar with label */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-400">Compatibility</span>
            <span className={`text-xs font-semibold ${compatibility >= 70 ? 'text-green-500' : compatibility >= 40 ? 'text-yellow-500' : 'text-red-400'}`}>
              {compatibility >= 80 ? '🔥 Excellent' : compatibility >= 60 ? '✅ Good' : compatibility >= 40 ? '🟡 Fair' : '❌ Low'}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${compatibility >= 70 ? 'bg-green-400' : compatibility >= 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
              style={{ width: `${compatibility}%` }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="border-t border-slate-100 pt-4 mb-4">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { icon: '🌙', label: 'Sleeps',  val: sleepTime   },
                { icon: '☀️', label: 'Wakes',   val: wakeTime    },
                { icon: '📚', label: 'Studies', val: studyHours  },
                { icon: '✨', label: 'Clean',   val: cleanliness },
                { icon: '🔊', label: 'Noise',   val: noise       },
                { icon: '👥', label: 'Guests',  val: guests      },
              ].map(item => (
                <div key={item.label} className="bg-slate-50 rounded-lg px-3 py-2">
                  <div className="text-xs text-slate-400">{item.icon} {item.label}</div>
                  <div className="text-xs font-semibold text-slate-700 mt-0.5">{item.val || '—'}</div>
                </div>
              ))}
            </div>
            {about && (
              <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3 leading-relaxed">
                {about}
              </p>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {expanded ? 'Show Less ▲' : 'View Details ▼'}
          </button>
          <button className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
            Connect 🤝
          </button>
        </div>

      </div>
    </div>
  )
}

export default ProfileCard