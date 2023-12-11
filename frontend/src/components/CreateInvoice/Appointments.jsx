import React from 'react';
import '../../styles/appointments.scss';

const Appointments = (props) => {

  const { appointments } = props;
  console.log('appointments', appointments);


  return (
    <div >
      {appointments.map((app) => {
        return (
          <div key={app.id} className='appointment'>
            <div className='add-edit'>
              <h2>{app.startTime}</h2>
              <div className='button-container'>
                <button type='button' className='delete-button'>❌</button>
                <button type='button' className='edit-button'>✏️</button>
              </div>
            </div>
            <p>{app.notes}</p>
          </div>
        )
      })}
    </div>
  );
};

export default Appointments;
