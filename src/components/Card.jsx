function Card({ name, branch, year, gender, compatibility = 88 }) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="profile-card">
      <div className="profile-avatar">{initials}</div>
      <div className="profile-name">{name}</div>
      <div className="profile-branch">{branch} • Year {year}</div>
      <div className="profile-tags">
        <span className="tag">{gender}</span>
        <span className="tag">Night Owl</span>
        <span className="tag">Coder</span>
      </div>
      <div className="compatibility">{compatibility}%</div>
      <div className="compatibility-label">Compatibility</div>
      <Button text="View Profile" type="primary" fullWidth={true} />
    </div>
  )
}

import Button from './Button'
export default Card