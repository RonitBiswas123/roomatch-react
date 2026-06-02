import { useState, useMemo } from 'react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import ProfileCard from '../components/ProfileCard'
import FilterBar from '../components/FilterBar'

const sampleStudents = [
  { id: 1,  name: 'Rahul Sharma',   branch: 'CSE', year: 2, gender: 'Male',   compatibility: 92, sleepTime: '12AM - 2AM',  wakeTime: '8AM - 10AM', cleanliness: 'Clean',      noise: 'Quiet',    studyHours: '4-6 hrs', guests: 'Rare guests',  about: 'CSE student who loves competitive programming and late night coding.' },
  { id: 2,  name: 'Priya Singh',    branch: 'ECE', year: 2, gender: 'Female', compatibility: 85, sleepTime: '10PM - 12AM', wakeTime: '6AM - 8AM',  cleanliness: 'Very Clean', noise: 'Silent',   studyHours: '6+ hrs',  guests: 'No guests',    about: 'ECE student, early riser, loves clean spaces and focused study time.' },
  { id: 3,  name: 'Arjun Mehta',    branch: 'CSE', year: 3, gender: 'Male',   compatibility: 78, sleepTime: 'After 2AM',   wakeTime: 'After 10AM', cleanliness: 'Moderate',   noise: 'Moderate', studyHours: '2-4 hrs', guests: 'Occasional',   about: 'Night owl, coder and gamer, moderate cleanliness standards.' },
  { id: 4,  name: 'Sneha Reddy',    branch: 'ME',  year: 1, gender: 'Female', compatibility: 74, sleepTime: 'Before 10PM', wakeTime: 'Before 6AM', cleanliness: 'Clean',      noise: 'Quiet',    studyHours: '4-6 hrs', guests: 'No guests',    about: 'Mechanical engineering student, very disciplined and organized.' },
  { id: 5,  name: 'Vikram Nair',    branch: 'EE',  year: 2, gender: 'Male',   compatibility: 70, sleepTime: '10PM - 12AM', wakeTime: '6AM - 8AM',  cleanliness: 'Relaxed',    noise: 'Loud',     studyHours: '0-2 hrs', guests: 'Frequent ok',  about: 'Chill EE student who enjoys music and hanging out with friends.' },
  { id: 6,  name: 'Ananya Gupta',   branch: 'CSE', year: 3, gender: 'Female', compatibility: 88, sleepTime: '12AM - 2AM',  wakeTime: '8AM - 10AM', cleanliness: 'Clean',      noise: 'Moderate', studyHours: '4-6 hrs', guests: 'Rare guests',  about: 'Full stack developer in the making, loves hackathons and open source.' },
  { id: 7,  name: 'Karan Patel',    branch: 'CE',  year: 1, gender: 'Male',   compatibility: 65, sleepTime: '10PM - 12AM', wakeTime: '6AM - 8AM',  cleanliness: 'Clean',      noise: 'Quiet',    studyHours: '6+ hrs',  guests: 'No guests',    about: 'Civil engineering fresher, very studious and keeps to himself.' },
  { id: 8,  name: 'Meera Iyer',     branch: 'ECE', year: 4, gender: 'Female', compatibility: 60, sleepTime: 'Before 10PM', wakeTime: 'Before 6AM', cleanliness: 'Very Clean', noise: 'Silent',   studyHours: '6+ hrs',  guests: 'No guests',    about: 'Final year ECE student preparing for placements, needs quiet environment.' },
  { id: 9,  name: 'Rohan Das',      branch: 'CSE', year: 2, gender: 'Male',   compatibility: 55, sleepTime: 'After 2AM',   wakeTime: 'After 10AM', cleanliness: 'Relaxed',    noise: 'Loud',     studyHours: '0-2 hrs', guests: 'Frequent ok',  about: 'Party-loving CSE student who works hard and plays harder.' },
  { id: 10, name: 'Divya Sharma',   branch: 'ME',  year: 3, gender: 'Female', compatibility: 50, sleepTime: '12AM - 2AM',  wakeTime: '8AM - 10AM', cleanliness: 'Moderate',   noise: 'Moderate', studyHours: '2-4 hrs', guests: 'Occasional',   about: 'ME student with a passion for robotics and design.' },
]

function Home({ navigate, userProfile }) {
  const [search,        setSearch]        = useState('')
  const [filterBranch,  setFilterBranch]  = useState('')
  const [filterYear,    setFilterYear]    = useState('')
  const [filterGender,  setFilterGender]  = useState('')
  const [sortBy,        setSortBy]        = useState('compatibility')

  const filtered = useMemo(() => {
    let result = [...sampleStudents]

    if (search)       result = result.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    if (filterBranch) result = result.filter(s => s.branch === filterBranch)
    if (filterYear)   result = result.filter(s => String(s.year) === filterYear)
    if (filterGender) result = result.filter(s => s.gender === filterGender)

    if (sortBy === 'compatibility') result.sort((a, b) => b.compatibility - a.compatibility)
    if (sortBy === 'name')          result.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'year')          result.sort((a, b) => a.year - b.year)

    return result
  }, [search, filterBranch, filterYear, filterGender, sortBy])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar navigate={navigate} userProfile={userProfile} />

      {/* Hero */}
      <div className="text-center py-16 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
        <h2 className="text-5xl font-bold text-white mb-4">
          Find Your Perfect Roommate
        </h2>
        <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
          Match with students who share your sleep schedule, habits, and vibe.
        </p>
        <div className="flex gap-4 justify-center">
          <Button text="Get Started" type="primary" onClick={() => navigate('register')} />
          <Button text="Login"       type="outline"  onClick={() => navigate('login')}    />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Your profile card */}
        {userProfile && (
          <div className="mb-10">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Your Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <ProfileCard
                name={userProfile.name}
                branch={userProfile.branch}
                year={userProfile.year}
                gender={userProfile.gender}
                compatibility={100}
                sleepTime={userProfile.sleepTime}
                wakeTime={userProfile.wakeTime}
                cleanliness={userProfile.cleanliness}
                noise={userProfile.noise}
                studyHours={userProfile.studyHours}
                guests={userProfile.guests}
                about={userProfile.about}
              />
            </div>
          </div>
        )}

        {/* Filter bar */}
        <FilterBar
          search={search}           setSearch={setSearch}
          filterBranch={filterBranch} setFilterBranch={setFilterBranch}
          filterYear={filterYear}   setFilterYear={setFilterYear}
          filterGender={filterGender} setFilterGender={setFilterGender}
          sortBy={sortBy}           setSortBy={setSortBy}
        />

        {/* Results count */}
        <p className="text-sm text-slate-400 mb-4">
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span> students
        </p>

        {/* Student cards */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(student => (
              <ProfileCard
                key={student.id}
                name={student.name}
                branch={student.branch}
                year={student.year}
                gender={student.gender}
                compatibility={student.compatibility}
                sleepTime={student.sleepTime}
                wakeTime={student.wakeTime}
                cleanliness={student.cleanliness}
                noise={student.noise}
                studyHours={student.studyHours}
                guests={student.guests}
                about={student.about}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-medium">No students found</p>
            <p className="text-sm mt-1">Try changing your filters</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Home