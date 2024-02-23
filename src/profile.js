import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Profile() {
  const [name, setName] = useState('SaiSiddhardha Narisetty');
  const [description, setDescription] = useState('I am a professional software engineer. My tech stacks include Javascript and Python');

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-4 d-flex align-items-start">
          <img src="sample.png" alt="Profile" style={{ width: '300px', height: '300px' }} />
        </div>
        <div className="col-md-8">
          <div className="form-group">
            <label htmlFor="nameInput" className="form-label">Name</label>
            <input 
              id="nameInput"
              className="form-control" 
              value={name}
              onChange={(e) => setName(e.target.value)} // Update state on change
            />
          </div>
          <div className="form-group">
            <label htmlFor="bioInput" className="form-label">Biography</label>
            <textarea 
              id="bioInput"
              className="form-control" 
              value={description}
              onChange={(e) => setDescription(e.target.value)} // Update state on change
              style={{ height: 'calc(300px - 88px)' }} // Adjust the height to align with the image
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
