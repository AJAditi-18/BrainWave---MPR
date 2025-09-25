import React from 'react';
import Navbar from "../components/Layout/navbar";
import Card from "../components/common/card";   

const Profile = () => (
  <>
    <Navbar />
    <div className="max-w-md mx-auto mt-8">
      <Card>
        <h2 className="text-xl font-bold text-brainwave-primary mb-4">Profile</h2>
        <div>
          <p><strong>Name:</strong> Student</p>
          <p><strong>Email:</strong> student@msijanakpuri.com</p>
        </div>
      </Card>
    </div>
  </>
);

export default Profile;
