import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Card from '../components/Card'

const sampleStudents = [
  { id: 1, name: 'Rahul Sharma',  branch: 'CSE', year: 2, gender: 'Male',   compatibility: 92, sleepTime: '12AM - 2AM',   cleanliness: 'Clean',      noise: 'Quiet',    studyHours: '4-6 hrs' },
  { id: 2, name: 'Priya Singh',   branch: 'ECE', year: 2, gender: 'Female', compatibility: 85, sleepTime: '10PM - 12AM',  cleanliness: 'Very Clean', noise: 'Silent',   studyHours: '6+ hrs'  },
  { id: 3, name: 'Arjun Mehta',   branch: 'CSE', year: 3, gender: 'Male',   compatibility: 78, sleepTime: 'After 2AM',    cleanliness: 'Moderate',   noise: 'Moderate', studyHours: '2-4 hrs' },
  { id: 4, name: 'Sneha Reddy',   branch: 'ME',  year: 1, gender: 'Female', compatibility: 74, sleepTime: 'Before 10PM',  cleanliness: 'Clean',      noise: 'Quiet',    studyHours: '4-6 hrs' },
  { id: 5, name: 'Vikram Nair',   branch: 'EE',  year: 2, gender: 'Male',   compatibility: 70, sleepTime: '10PM - 12AM',  cleanliness: 'Relaxed',    noise: 'Loud',     studyHours: '0-2 hrs' },
  { id: 6, name: 'Ananya Gupta',  branch: 'CSE', year: 3, gender: 'Female', compatibility: 88, sleepTime: '12AM - 2AM',   cleanliness: 'Clean',      noise: 'Moderate', studyHours: '4-6 hrs' },
]

function Home({ navigate, userProfile }) {
  return (
    <div>
      <Navbar navigate={navigate} />

      <div className="hero">
        <h2>Find Your Perfect Roommate</h2>
        <p>Match with students who share your sleep schedule, habits, and vibe.</p>
        <div className="hero-buttons">
          <Button
            text="Get Started"
            type="primary"
            onClick={() => navigate('register')}
          />
          <Button
            text="Login"
            type="outline"
            onClick={() => navigate('login')}
          />
        </div>
      </div>

      {userProfile && (
        <div style={{ padding: '0 32px', maxWidth: 960, margin: '0 auto' }}>
          <h3 style={{ fontSize: 16, color: '#888', marginBottom: 16 }}>
            Your Profile
          </h3>
          <div className="cards-grid" style={{ padding: 0, marginBottom: 32 }}>
            <Card
              name={userProfile.name}
              branch={userProfile.branch}
              year={userProfile.year}
              gender={userProfile.gender}
              compatibility={100}
              sleepTime={userProfile.sleepTime}
              cleanliness={userProfile.cleanliness}
              noise={userProfile.noise}
              studyHours={userProfile.studyHours}
            />
          </div>
          <h3 style={{ fontSize: 16, color: '#888', marginBottom: 16 }}>
            Suggested Roommates
          </h3>
        </div>
      )}

      <div className="cards-grid">
        {sampleStudents.map(student => (
          <Card
            key={student.id}
            name={student.name}
            branch={student.branch}
            year={student.year}
            gender={student.gender}
            compatibility={student.compatibility}
            sleepTime={student.sleepTime}
            cleanliness={student.cleanliness}
            noise={student.noise}
            studyHours={student.studyHours}
          />
        ))}
      </div>
    </div>
  )
}

export default Home