import React from 'react';
import './UserGreeting.css';

const UserGreeting = ({ user }) => {
  return (
    <div className="user-greeting">
      Welcome! <span>{user.firstName} {user.lastName}</span>
    </div>
  );
};

export default UserGreeting;
