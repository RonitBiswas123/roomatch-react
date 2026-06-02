import Button from './Button'

function Card({ name, branch, year, gender, compatibility, sleepTime, cleanliness, noise, studyHours }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()
  const tags = [sleepTime, cleanliness, noise, studyHours, gender].filter(Boolean)

  const compatColor =
    compatibility >= 70 ? 'text-green-500' :
    compatibility >= 40 ? 'text-yellow-500' : 'text-red-400'

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md text-center hover:shadow-lg transition-shadow duration-200">
      <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
        {initials}
      </div>
      <div className="text-lg font-semibold text-slate-900 mb-1">{name}</div>
      <div className="text-sm text-slate-400 mb-4">{branch} • Year {year}</div>

      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {tags.map((tag, i) => (
          <span key={i} className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
            {tag}
          </span>
        ))}
      </div>

      <div className={`text-2xl font-bold mb-1 ${compatColor}`}>
        {compatibility}%
      </div>
      <div className="text-xs text-slate-400 mb-4">Compatibility</div>
      <Button text="View Profile" type="primary" fullWidth={true} />
    </div>
  )
}

export default Card