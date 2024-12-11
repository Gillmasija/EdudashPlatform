import { useEffect } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Assignment } from "@db/schema";
import { CheckCircle, Clock } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user && user.role !== "student") {
      setLocation("/");
    }
  }, [user, setLocation]);

  const { data: assignments } = useQuery<Assignment[]>({
    queryKey: ["/api/student/assignments"],
  });

  const { data: submissions } = useQuery({
    queryKey: ["/api/student/submissions"],
  });

  if (!user || user.role !== "student") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            <span className="text-sm text-gray-500">Welcome, {user.fullName}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assignments Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Your Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments?.map((assignment) => {
                  const submitted = submissions?.find(
                    (s) => s.assignmentId === assignment.id
                  );
                  return (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{assignment.title}</h3>
                        <p className="text-sm text-gray-500">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      {submitted ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-orange-500" />
                          <Button
                            onClick={async () => {
                              await fetch("/api/submissions", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  assignmentId: assignment.id,
                                }),
                              });
                            }}
                          >
                            Submit
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Class Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.teacherId && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Your Teacher's Schedule</h3>
                    {/* Schedule items would be displayed here */}
                    <p className="text-sm text-gray-500">
                      Check with your teacher for the latest schedule updates.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
