
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome back{user?.name ? `, ${user.name}` : ''}!</h2>
        <p className="text-gray-700 mb-6">
          This is your personal dashboard. Here you can manage your projects, check messages, and access support.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">Your Projects</h3>
            <p className="text-gray-600 mb-3">View and manage all your projects</p>
            <a href="/dashboard/projects" className="text-blue-600 hover:underline">View Projects →</a>
          </div>
          
          <div className="border rounded-lg p-4 hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">Messages</h3>
            <p className="text-gray-600 mb-3">Check your project-related messages</p>
            <a href="/dashboard/messages" className="text-blue-600 hover:underline">View Messages →</a>
          </div>
          
          <div className="border rounded-lg p-4 hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">Support</h3>
            <p className="text-gray-600 mb-3">Get help with your account or projects</p>
            <a href="/dashboard/support" className="text-blue-600 hover:underline">Contact Support →</a>
          </div>
          
          <div className="border rounded-lg p-4 hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">Account Settings</h3>
            <p className="text-gray-600 mb-3">Manage your profile and preferences</p>
            <a href="/settings" className="text-blue-600 hover:underline">Edit Settings →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
