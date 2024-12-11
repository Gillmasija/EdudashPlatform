import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "@db/schema";

export default function StudentList() {
  const { data: students } = useQuery<User[]>({
    queryKey: ["/api/teacher/students"],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Students</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students?.map((student) => (
            <div
              key={student.id}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              <Avatar>
                <AvatarFallback>
                  {student.fullName.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{student.fullName}</h3>
                <p className="text-sm text-gray-500">{student.username}</p>
              </div>
            </div>
          ))}
          {!students?.length && (
            <p className="text-center text-gray-500">No students assigned yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
