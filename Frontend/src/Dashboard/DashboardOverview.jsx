import React, { useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import useAdminStore from '../Store/AdminStore';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DashboardOverview = () => {
  // Fetch analytics from Zustand store
  const { analytics, fetchAnalytics, loading, error } = useAdminStore();

  useEffect(() => {
    if (!analytics) fetchAnalytics(); // ✅ Fetch only if analytics is not loaded
  }, [analytics, fetchAnalytics]);

  console.log(analytics); // Debugging purpose

  // Process data for Bar Chart
  const chartData = useMemo(() => {
    return analytics?.userGrowth?.map((entry) => ({
      date: `${entry._id.year}-${String(entry._id.month).padStart(2, '0')}`,
      users: entry.count,
      revenue: analytics?.revenueTrend?.find(
        (rev) => rev._id.year === entry._id.year && rev._id.month === entry._id.month
      )?.total || 0,
    })) || [];
  }, [analytics]);

  // Stats summary
  const stats = useMemo(() => ({
    totalUsers: analytics?.totalUsers || 0,
    totalStudents: analytics?.totalStudents || 0,
    totalInstructors: analytics?.totalInstructors || 0,
    totalAdmins: analytics?.totalAdmins || 0,
    totalCourses: analytics?.totalCourses || 0,
    totalPayments: analytics?.totalPayments || 0,
    totalRevenue: analytics?.totalRevenue || 0,
  }), [analytics]);



  if (loading) return <p className="text-center text-gray-600">Loading analytics...</p>;
  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-600">error</p>
        <button
          onClick={fetchAnalytics}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Dashboard Overview</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Users', value: stats.totalUsers, color: 'bg-blue-500' },
          { label: 'Students', value: stats.totalStudents, color: 'bg-green-500' },
          { label: 'Instructors', value: stats.totalInstructors, color: 'bg-purple-500' },
          { label: 'Admins', value: stats.totalAdmins, color: 'bg-red-500' },
          { label: 'Courses', value: stats.totalCourses, color: 'bg-yellow-500' },
          { label: 'Payments', value: ` ${stats.totalRevenue} birr`, color: 'bg-blue-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`p-6 rounded-lg shadow-lg flex flex-col items-center justify-center ${color} text-white`}>
            <h2 className="text-2xl font-semibold">Total {label}</h2>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">User Growth & Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" stroke="#333" />
            <YAxis stroke="#333" />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#1E3A8A" name="Users" />
            <Bar dataKey="revenue" fill="#10B981" name="Revenue (birr)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardOverview;
