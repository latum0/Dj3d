import React from 'react';
import Sidebar from '../components/ui/Sidebar';
import UserGreeting from '../components/ui/UserGreeting';
import UserProfileForm from '../components/ui/UserProfileForm';
import './AccountPage.css';

const AccountPage = () => {
  const currentUser = {
    firstName: '',
    lastName: '',
    email: '',
    address: ''
  };

  return (
    <div className="account-page">
      <UserGreeting user={currentUser} />
      <div className="content-container">
        <Sidebar />
        <UserProfileForm user={currentUser} />
      </div>
    </div>
  );
};

export default AccountPage;
