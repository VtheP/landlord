'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type RentData = {
  totalRentDue: number;
  rentCollected: number;
  projectedRentCollection: number;
  monthlyRentData: Array<{
    month: string;
    projected: number;
    collected: number;
  }>;
};

const RentDashboard: React.FC = () => {
  const [rentData, setRentData] = useState<RentData | null>(null);

  useEffect(() => {
    const fetchRentData = async () => {
      try {
        const response = await fetch('/api/rent-dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch rent data');
        }
        const data = await response.json();
        setRentData(data);
      } catch (error) {
        console.error('Error fetching rent data:', error);
      }
    };

    fetchRentData();
  }, []);

  const generateMonthlyData = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const months = [];
    for (let i = 0; i < currentDate.getMonth() + 1; i++) {
      const month = new Date(currentYear, i, 1);
      months.push(month.toLocaleString('default', { month: 'short' }));
    }
    return months.map(month => ({
      month,
      projected: Math.floor(Math.random() * 5000) + 3000,
      collected: Math.floor(Math.random() * 5000) + 3000,
    }));
  };

  if (!rentData) return <div>Loading...</div>;

  const monthlyData = generateMonthlyData();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Rent Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold mb-2">Total Rent Due</h3>
          <p className="text-2xl font-bold">${rentData.totalRentDue}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold mb-2">Rent Collected</h3>
          <p className="text-2xl font-bold">${rentData.rentCollected}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold mb-2">Projected Annual Rent</h3>
          <p className="text-2xl font-bold">${rentData.projectedRentCollection}</p>
        </div>
      </div>
      <div className="bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold mb-4">Monthly Rent Collection</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="projected" fill="#8884d8" name="Projected Rent" />
            <Bar dataKey="collected" fill="#82ca9d" name="Collected Rent" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RentDashboard;