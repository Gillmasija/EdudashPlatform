import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/ui/file-upload";
import { Edit, Trash2, Upload, CheckCircle, Clock } from "lucide-react";
import type { Assignment } from "@db/schema";

export default function AssignmentList({ isTeacher = false }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: assignments } = useQuery<Assignment[]>({
    queryKey: [isTeacher ? "/api/teacher/assignments" : "/api/student/assignments"],
  });

  const createAssignment = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/assignments", {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teacher/assignments"] });
      setIsOpen(false);
      resetForm();
      toast({ title: "Success", description: "Assignment created successfully" });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const updateAssignment = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const res = await fetch(`/api/assignments/${id}`, {
        method: "PUT",
        body: data,
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teacher/assignments"] });
      setEditingId(null);
      resetForm();
      toast({ title: "Success", description: "Assignment updated successfully" });
    },
  });

  const deleteAssignment = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/assignments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teacher/assignments"] });
      toast({ title: "Success", description: "Assignment deleted successfully" });
    },
  });

  const submitAssignment = useMutation({
    mutationFn: async ({ id, submission }: { id: number; submission: FormData }) => {
      const res = await fetch(`/api/assignments/${id}/submit`, {
        method: "POST",
        body: submission,
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/student/assignments"] });
      toast({ title: "Success", description: "Assignment submitted successfully" });
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate(undefined);
    setFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dueDate) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("dueDate", dueDate.toISOString());
    if (file) formData.append("file", file);

    if (editingId !== null) {
      updateAssignment.mutate({ id: editingId, data: formData });
    } else {
      createAssignment.mutate(formData);
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingId(assignment.id);
    setTitle(assignment.title);
    setDescription(assignment.description);
    setDueDate(new Date(assignment.dueDate));
    setIsOpen(true);
  };

  const handleFileSubmit = async (assignmentId: number, file: File) => {
    const formData = new FormData();
    formData.append("submission", file);
    await submitAssignment.mutateAsync({ id: assignmentId, submission: formData });
  };

  return (
    <Card className="bg-[#FFF5E1] border-[#C17817]">
      <CardHeader className="flex flex-row items-center justify-between bg-[#8B4513] text-white">
        <CardTitle>Assignments</CardTitle>
        {isTeacher && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#E6A23C] hover:bg-[#C17817]">
                {editingId ? "Edit Assignment" : "Create Assignment"}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#FFF5E1]">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Assignment" : "New Assignment"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="border-[#8B4513]"
                />
                <Textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="border-[#8B4513]"
                />
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  required
                  className="rounded-md border-[#8B4513]"
                />
                <FileUpload
                  accept=".pdf,.doc,.docx"
                  onChange={(file) => setFile(file)}
                  className="border-[#8B4513]"
                />
                <Button type="submit" className="bg-[#E6A23C] hover:bg-[#C17817]">
                  {editingId ? "Update" : "Create"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments?.map((assignment) => (
            <div
              key={assignment.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#8B4513]"
            >
              <div>
                <h3 className="font-medium text-[#8B4513]">{assignment.title}</h3>
                <p className="text-sm text-[#C17817]">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
                <p className="text-sm mt-2">{assignment.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {isTeacher ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(assignment)}
                      className="text-[#8B4513]"
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAssignment.mutate(assignment.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    {assignment.submitted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <>
                        <Clock className="h-5 w-5 text-[#E6A23C]" />
                        <FileUpload
                          accept=".pdf,.doc,.docx"
                          onChange={(file) => handleFileSubmit(assignment.id, file)}
                          className="border-[#8B4513]"
                        >
                          <Button className="bg-[#E6A23C] hover:bg-[#C17817]">
                            <Upload className="h-4 w-4 mr-2" />
                            Submit
                          </Button>
                        </FileUpload>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {!assignments?.length && (
            <p className="text-center text-[#8B4513]">No assignments yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
