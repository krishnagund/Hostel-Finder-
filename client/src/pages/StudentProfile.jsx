import React from 'react';

const StudentProfile = ({ student, onLogout }) => {
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-bold text-[#3A2C99] mb-4">Student Profile</h2>
      <div className="space-y-3 text-gray-700">
        <p><span className="font-semibold">Name:</span> {student.name}</p>
        <p><span className="font-semibold">Email:</span> {student.email}</p>
        <p><span className="font-semibold">Phone:</span> {student.phone}</p>
        <p><span className="font-semibold">College:</span> {student.college}</p>
      </div>

      <button
        onClick={onLogout}
        className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default StudentProfile;
