import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DashboardOverview = () => {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    course: '',
    paymentStatus: 'Unpaid',
    dob: '',
    registrationDate: new Date().toLocaleDateString(),
  });

  const openAddUserModal = () => setIsAddUserModalOpen(true);
  const closeAddUserModal = () => setIsAddUserModalOpen(false);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUser({ ...newUser, password });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = () => {
    console.log('New User:', newUser);
    closeAddUserModal();
  };

  const generateCertificate = () => {
    const doc = new jsPDF();
    doc.text('Certificate of Completion', 70, 30);
    doc.text(`This is to certify that`, 80, 50);
    doc.text(`${newUser.name}`, 80, 60);
    doc.text(`has successfully completed the course: ${newUser.course}`, 50, 70);
    doc.text(`Date of Completion: ${newUser.registrationDate}`, 50, 80);
    doc.save(`${newUser.name}_certificate.pdf`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-gray-600">1,234</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Total Courses</h2>
          <p className="text-gray-600">56</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Active Sessions</h2>
          <p className="text-gray-600">12</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <ul>
          <li className="text-gray-600">User John Doe registered</li>
          <li className="text-gray-600">Course React Basics added</li>
          <li className="text-gray-600">User Jane Doe updated profile</li>
        </ul>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex space-x-4 mb-4">
        <button 
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
          onClick={openAddUserModal}
        >
          Add User
        </button>
        <button className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition duration-200">
          Add Course
        </button>
        <button 
          className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition duration-200"
          onClick={generateCertificate}
        >
          Generate Certificate
        </button>
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4">Add User</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="flex">
                  <input
                    type="text"
                    name="password"
                    value={newUser.password}
                    readOnly
                    className="w-full p-2 border rounded-l-lg"
                  />
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="bg-blue-500 text-white px-4 rounded-r-lg"
                  >
                    Generate
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Assign to Course</label>
                <input
                  type="text"
                  name="course"
                  value={newUser.course}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Payment Status</label>
                <select
                  name="paymentStatus"
                  value={newUser.paymentStatus}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={newUser.dob}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Registration Date</label>
                <input
                  type="text"
                  value={newUser.registrationDate}
                  readOnly
                  className="w-full p-2 border rounded-lg bg-gray-100"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeAddUserModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
