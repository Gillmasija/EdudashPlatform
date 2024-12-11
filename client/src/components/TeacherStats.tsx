import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";

export default function TeacherStats() {
  const { data: stats } = useQuery({
    queryKey: ["/api/teacher/stats"],
    queryFn: async () => {
      const assignments = await fetch("/api/teacher/assignments").then(r => r.json());
      const students = await fetch("/api/teacher/students").then(r => r.json());
      
      return {
        totalAssignments: assignments.length,
        totalStudents: students.length,
        completedSubmissions: assignments.reduce((acc: number, curr: any) => 
          acc + curr.submissions?.filter((s: any) => s.status === "completed").length, 0),
        pendingSubmissions: assignments.reduce((acc: number, curr: any) => 
          acc + curr.submissions?.filter((s: any) => s.status === "pending").length, 0),
      };
    }
  });

  const chartData = [
    { name: "Assignments", value: stats?.totalAssignments || 0 },
    { name: "Students", value: stats?.totalStudents || 0 },
    { name: "Completed", value: stats?.completedSubmissions || 0 },
    { name: "Pending", value: stats?.pendingSubmissions || 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <BarChart width={400} height={200} data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="hsl(24, 96%, 39%)" />
          </BarChart>
        </div>
      </CardContent>
    </Card>
  );
}
