import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Camera, Clock, Users, DollarSign, BookOpen, FileCheck, TrendingUp } from 'lucide-react';
import { Card, CardContent } from "./Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";

const data = [
  { name: 'Jan', line1: 400, line2: 240 },
  { name: 'Feb', line1: 300, line2: 139 },
  { name: 'Mar', line1: 200, line2: 980 },
  { name: 'Apr', line1: 278, line2: 390 },
  { name: 'May', line1: 189, line2: 480 },
];

const Bardata = [
  { name: 'CSD', line1: 400 },
  { name: 'CIVIL', line1: 300 },
  { name: 'QS', line1: 200 },
  { name: 'BM', line1: 278 },
  { name: 'AS', line1: 189 },
];

const StatCard = ({ icon: Icon, title, value, subtitle, className }) => (
  <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div className={`absolute inset-0 opacity-10 ${className}`} />
    <CardContent className="p-6">
      <div className="flex items-center space-x-2">
        <div className={`p-2 rounded-lg ${className}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <div className="mt-4">
        <div className="flex items-baseline">
          <h2 className="text-3xl font-bold">{value?.toLocaleString()}</h2>
        </div>
        {subtitle && (
          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
    </CardContent>
  </Card>
);

const ChartSection = ({ data, barData, selectedDepartment, onDepartmentChange }) => (
  <div className="mt-8 space-y-6">
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-6 bg-white rounded-xl shadow-sm">
      <div className="flex items-center space-x-2">
        <TrendingUp className="w-5 h-5 text-indigo-500" />
        <h2 className="text-xl font-semibold">Arrears & Payment</h2>
        <span className="text-sm text-indigo-500">(This month)</span>
      </div>
      <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          <SelectItem value="csd">CSD</SelectItem>
          <SelectItem value="civil">Civil</SelectItem>
          <SelectItem value="qs">QS</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="line1" stroke="#6366f1" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                <Line type="monotone" dataKey="line2" stroke="#22c55e" strokeWidth={2} dot={{ strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Department Distribution</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="line1" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dashboardData, setDashboardData] = useState({
    noOfCheck: 0,
    thisMonthDue: 0,
    todayCollection: 0,
    noOfStudent: 0,
    todayArrers: 0,
    thisMonthCollection: 0
  });

  useEffect(() => {
    const fetchDashBoard = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/dashboardDetails');
        const data = await response.json();
        setDashboardData(data);
        setError(null);
      } catch (error) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashBoard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={FileCheck}
          title="No. of Checks"
          value={dashboardData.noOfCheck}
          subtitle="Today"
          className="bg-indigo-500"
        />
        <StatCard
          icon={BookOpen}
          title="This Month Due"
          value={dashboardData.thisMonthDue}
          className="bg-pink-500"
        />
        <StatCard
          icon={DollarSign}
          title="Today Collection"
          value={dashboardData.todayCollection}
          subtitle="Today"
          className="bg-green-500"
        />
        <StatCard
          icon={Users}
          title="Total Students"
          value={dashboardData.noOfStudent}
          subtitle="Today"
          className="bg-blue-500"
        />
        <StatCard
          icon={Clock}
          title="Today Arrears"
          value={dashboardData.todayArrers}
          subtitle="Today"
          className="bg-orange-500"
        />
        <StatCard
          icon={Camera}
          title="Month Collection"
          value={dashboardData.thisMonthCollection}
          className="bg-cyan-500"
        />
      </div>

      <ChartSection
        data={data}
        barData={Bardata}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
      />
    </div>
  );
}