import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Card from '../components/Card'

const sampleStudents = [
  { id: 1, name: 'Rahul Sharma',  branch: 'CSE', year: 2, gender: 'Male',   compatibility: 92, sleepTime: '12AM - 2AM',  cleanliness: 'Clean',      noise: 'Quiet',    studyHours: '4-6 hrs' },
  { id: 2, name: 'Priya Singh',   branch: 'ECE', year: 2, gender: 'Female', compatibility: 85, sleepTime: '10PM - 12AM', cleanliness: 'Very Clean', noise: 'Silent',   studyHours: '6+ hrs'  },
  { id: 3, name: 'Arjun Mehta',   branch: 'CSE', year: 3, gender: 'Male',   compatibility: 78, sleepTime: 'After 2AM',   cleanliness: 'Moderate',   noise: 'Moderate', studyHours: '2-4 hrs' },
  { id: 4, name: 'Sneha Reddy',   branch: 'ME',  year: 1, gender: 'Female', compatibility: 74, sleepTime: 'Before 10PM', cleanliness: 'Clean',      noise: 'Quiet',    studyHours: '4-6 hrs' },
  { id: 5, name: 'Vikram Nair',   branch: 'EE',  year: 2, gender: 'Male',   compatibility: 70, sleepTime: '10PM - 12AM', cleanliness: 'Relaxed',    noise: 'Loud',     studyHours: '0-2 hrs' },
  { id: 6, name: 'Ananya Gupta',  branch: 'CSE', year: 3, gender: 'Female', compatibility: 88, sleepTime: '12AM - 2AM',  cleanliness: 'Clean',      noise: 'Moderate', studyHours: '4-6 hrs' },
]

function Home({ navigate, userProfile }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar navigate={navigate} userProfile={userProfile} />

      <div className="text-center py-20 px-4">
        <h2 className="text-5xl font-bold text-slate-900 mb-4">
          Find Your Perfect Roommate
        </h2>
        <p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto">
          Match with students who share your sleep schedule, habits, and vibe.
        </p>
        <div className="flex gap-4 justify-center">
          <Button text="Get Started" type="primary" onClick={() => navigate('register')} />
          <Button text="Login"       type="outline"  onClick={() => navigate('login')}    />
        </div>
      </div>

      {userProfile && (
        <div className="max-w-5xl mx-auto px-8 mb-8">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
            Your Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
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
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
            Suggested Roommates
          </h3>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
    </div>
  )
}

export default Home