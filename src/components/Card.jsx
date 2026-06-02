import Button from './Button'

function Card({ name, branch, year, gender, compatibility, sleepTime, cleanliness, noise, studyHours }) {

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  const tags = [sleepTime, cleanliness, noise, studyHours, gender].filter(Boolean)

  return (
    <div className="profile-card">
      <div className="profile-avatar">{initials}</div>
      <div className="profile-name">{name}</div>
      <div className="profile-branch">{branch} • Year {year}</div>
      <div className="profile-tags">
        {tags.map((tag, i) => (
          <span key={i} className="tag">{tag}</span>
        ))}
      </div>
      <div className="compatibility">{compatibility}%</div>
      <div className="compatibility-label">Compatibility</div>
      <Button text="View Profile" type="primary" fullWidth={true} />
    </div>
  )
}

export default Card