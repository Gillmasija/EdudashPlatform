import { useEffect } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import TeacherStats from "@/components/TeacherStats";
import AssignmentList from "@/components/AssignmentList";
import StudentList from "@/components/StudentList";
import ScheduleManager from "@/components/ScheduleManager";

export default function TeacherDashboard() {
  const { user } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user && user.role !== "teacher") {
      setLocation("/");
    }
  }, [user, setLocation]);

  if (!user || user.role !== "teacher") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, {user.fullName}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TeacherStats />
          <AssignmentList />
          <StudentList />
          <ScheduleManager />
        </div>
      </main>
    </div>
  );
}
