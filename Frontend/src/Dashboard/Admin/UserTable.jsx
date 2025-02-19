// UserTable.js
import React,{useState,useEffect} from "react";
import { FaEye, FaUserSlash, FaTrash } from "react-icons/fa";

const UserTable = ({ users, suspendUser, handleDeleteUser }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Status</th>
         {users[0]?.role==="admin"?  <th className="p-3 text-left">Actions</th>:""}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b hover:bg-gray-50 transition duration-200"
            >
              <td className="p-3">
                {user.firstName} {user.lastName}
              </td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : user.status === "Suspended"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              {users[0]?.role==="admin" &&(<td className="p-3 flex space-x-2">
                <button className="text-blue-500 hover:text-blue-700">
                  <FaEye />
                </button>
                <button
                  className="text-yellow-500 hover:text-yellow-700"
                  onClick={() => suspendUser(user.id)}
                >
                  <FaUserSlash />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  <FaTrash />
                </button>
              </td> ) }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
