import React from 'react';
import { Head } from '@inertiajs/react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  CalendarIcon, 
  UserIcon, 
  UserPlusIcon, 
  VoteIcon 
} from "lucide-react";
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ stats }) {
  const dashboardStats = stats || {
    totalElections: 0,
    activeElections: 0,
    totalVoters: 0,
    totalVotes: 0,
    recentElections: []
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card>
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`p-4 rounded-full bg-${color}-100`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <Head title="Admin Dashboard" />

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Elections" 
            value={dashboardStats.totalElections} 
            icon={<CalendarIcon className="h-6 w-6 text-blue-600" />} 
            color="blue"
          />
          <StatCard 
            title="Active Elections" 
            value={dashboardStats.activeElections} 
            icon={<CalendarIcon className="h-6 w-6 text-green-600" />} 
            color="green"
          />
          <StatCard 
            title="Registered Voters" 
            value={dashboardStats.totalVoters} 
            icon={<UserIcon className="h-6 w-6 text-purple-600" />} 
            color="purple"
          />
          <StatCard 
            title="Total Votes Cast" 
            value={dashboardStats.totalVotes} 
            icon={<VoteIcon className="h-6 w-6 text-amber-600" />} 
            color="amber"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Elections</CardTitle>
              <CardDescription>Overview of the latest election events</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardStats.recentElections.length > 0 ? (
                <ul className="space-y-4">
                  {dashboardStats.recentElections.map((election) => (
                    <li key={election.id} className="border-b pb-3">
                      <p className="font-medium">{election.title}</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{election.course_id}</span>
                        <span>{new Date(election.start_date).toLocaleDateString()}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 py-4 text-center">No recent elections</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you might want to perform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href={route('admin.elections.create')} className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Create Election</span>
                  </div>
                </a>
                <a href={route('admin.voters.import')} className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <UserPlusIcon className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Import Voters</span>
                  </div>
                </a>
                <a href={route('admin.positions.create')} className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Add Position</span>
                  </div>
                </a>
                <a href={route('admin.candidates.create')} className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-amber-600" />
                    <span className="font-medium">Add Candidate</span>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
