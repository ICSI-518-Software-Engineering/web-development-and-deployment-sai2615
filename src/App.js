import React from 'react';
import Profile from './clientside/profile';
import Addition from './serverside/addition';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="container my-4">
      <Profile />
      <Addition />
    </div>
  );
}

export default App;
