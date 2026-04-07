import React from 'react'
import '../Pages/Style/Attendence.css'
import AttendenceForm from '../Components/AttendenceForm/AttendenceForm'

function Attendence() {
  return (
    <div className='AttendceMain'>
      <h1>Attendance Page</h1>
      <AttendenceForm />
    </div>
  )
}

export default Attendence
