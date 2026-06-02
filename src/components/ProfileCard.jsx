import { useState } from 'react'
import Button from './Button'

function ProfileCard({ name, branch, year, gender, compatibility, sleepTime, cleanliness, noise, studyHours, wakeTime, guests, about }) {

  const [expanded, setExpanded] = useState(false)

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()

  const compatColor =
    compatibility >= 70 ? 'text-green-500' :
    compatibility >= 40 ? 'text-yellow-500' : 'text-red-400'

  const compatBg =
    compatibility >= 70 ? 'bg-green-50 border-green-200' :
    compatibility >= 40 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'

  const avatarColors = [
    'bg-blue-600', 'bg-purple-600', 'bg-pink-600',
    'bg-indigo-600', 'bg-teal-600', 'bg-orange-500'
  ]
  const colorIndex = name.charCodeAt(0) % avatarColors.length
  const avatarColor = avatarColors[colorIndex]

  const tags = [sleepTime, cleanliness, noise, studyHours].filter(Boolean)

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-200 hover:shadow-md ${expanded ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}>

      {/* Compatibility bar at top */}
      <div className={`h-1.5 w-full ${compatibility >= 70 ? 'bg-green-400' : compatibility >= 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
        style={{ width: `${compatibility}%` }}>
      </div>

      <div className="p-6">

        {/* Top row */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-14 h-14 rounded-full ${avatarColor} text-white text-xl font-bold flex items-center justify-center flex-shrink-0`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-900 truncate">{name}</div>
            <div className="text-sm text-slate-400">{branch} • Year {year}</div>
            <div className="text-xs text-slate-400 mt-0.5">{gender}</div>
          </div>
          <div className={`text-right border rounded-xl px-3 py-1.5 ${compatBg}`}>
            <div className={`text-lg font-bold ${compatColor}`}>{compatibility}%</div>
            <div className="text-xs text-slate-400">match</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
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
            {expanded ? 'Show Less ▲' : 'View Profile ▼'}
          </button>
          <button className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
            Connect
          </button>
        </div>

      </div>
    </div>
  )
}

export default ProfileCard