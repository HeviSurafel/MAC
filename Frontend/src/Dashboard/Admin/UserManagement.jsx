// Updated React code with PDF certificate and background text

import React, { useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaPlus, FaEye } from "react-icons/fa";
import jsPDF from "jspdf";

const UserManagement = () => {
  // Mock user data
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Inactive" },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", role: "User", status: "Active" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  // Generate Certificate PDF
  const generateCertificate = (user) => {
    const doc = new jsPDF();

    // Add watermark background text
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(50);
    doc.text("Makalla Technology Solution", 35, 140, { angle: 45 });

    // Add certificate content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.text("Certificate of Completion", 60, 60);

    doc.setFontSize(14);
    doc.text(`This is to certify that`, 70, 80);
    doc.setFontSize(16);
    doc.text(`${user.name}`, 70, 90);

    doc.setFontSize(14);
    doc.text(`has successfully completed the course.`, 55, 100);

    doc.text(`Date: ${new Date().toLocaleDateString()}`, 60, 120);
    doc.text(`Signature: ___________________`, 60, 140);

    // Save the PDF
    doc.save(`${user.name}_certificate.pdf`);
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      {/* Search Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50 transition duration-200">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      user.status === "Active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    onClick={() => generateCertificate(user)}
                  >
                    Generate Certificate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
