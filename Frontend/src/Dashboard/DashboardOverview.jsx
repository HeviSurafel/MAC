import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DashboardOverview = () => {
  const [stats, setStats] = useState({ users: 0, courses: 0, sessions: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Simulating API call to fetch analytics data
    const fetchData = async () => {
      const data = [
        { date: '2024-02-01', users: 1000, courses: 50, sessions: 10 },
        { date: '2024-02-02', users: 1100, courses: 52, sessions: 11 },
        { date: '2024-02-03', users: 1234, courses: 56, sessions: 12 },
      ];
      setStats({
        users: data[data.length - 1].users,
        courses: data[data.length - 1].courses,
        sessions: data[data.length - 1].sessions,
      });
      setChartData(data);
    };
    fetchData();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Makalla Code Academy - Dashboard Report', 10, 10);
    doc.autoTable({
      head: [['Date', 'Users', 'Courses', 'Sessions']],
      body: chartData.map(({ date, users, courses, sessions }) => [date, users, courses, sessions]),
    });
    doc.save('Dashboard_Report.pdf');
  };

  return (
    <div className="p-6 bg-white">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold">Total Users</h2>
          <p className="text-3xl font-bold">{stats.users}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold">Total Courses</h2>
          <p className="text-3xl font-bold">{stats.courses}</p>
        </div>
        <div className="bg-blue-700 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold">Active Sessions</h2>
          <p className="text-3xl font-bold">{stats.sessions}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Analytics Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" stroke="#333" />
            <YAxis stroke="#333" />
            <Tooltip />
            <Line type="monotone" dataKey="users" stroke="#1E3A8A" strokeWidth={3} name="Users" />
            <Line type="monotone" dataKey="courses" stroke="#10B981" strokeWidth={3} name="Courses" />
            <Line type="monotone" dataKey="sessions" stroke="#3B82F6" strokeWidth={3} name="Sessions" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center">
        <button
          onClick={generatePDF}
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition"
        >
          Download Report
        </button>
      </div>
    </div>
  );
};

export default DashboardOverview;
