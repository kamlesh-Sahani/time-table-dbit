"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TeacherTable from "./TeacherTable";
import {usePathname} from "next/navigation"
import { useToast } from "@/hooks/use-toast";
export default function TeacherDetails() {
  const {toast}=useToast()
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all");
  const [teacher, setTeacher] = useState<any[]>([]);
  const [loading,setLoading]= useState<boolean>(false);
  const pathname = usePathname();
  const getData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-teacher");
      if(response.ok){
        const teacherData = await response.json();
        setTeacher(teacherData.data);
      }  
    } catch (error:any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while deleting the slot.",
        variant: "destructive",
      });
    }finally{
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);


  useEffect(()=>{
    const names = pathname.split("/")
    if(names.length>1){
      setSelectedTeacher(names.at(-1)!)
    }
  },[pathname])

  return (
    <div className="min-h-screen">
      <div className="w-full flex flex-col gap-4 sm:p-10">
        <div className="flex justify-between w-full items-center p-3">
          <h1 className="text-4xl font-extrabold bg-clip-text ">
            Teacher Details
          </h1>
          <div className="flex  max-sm:flex-col gap-4">
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger className="w-[200px] max-sm:w-full shadow-md bg-white">
                <SelectValue placeholder="Select Teacher" />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem value="all">All</SelectItem>
                {teacher.map((c: any, index: number) => (
                  <SelectItem key={index} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
          </div>
        </div>
        <div className="">
          {selectedTeacher !== "all" && (
            <TeacherTable selectedTeacher={selectedTeacher} setSelectedTeacher={setSelectedTeacher} />
          )}
        </div>

        {selectedTeacher === "all" && (
          <div className="overflow-x-auto bg-white rounded-lg ">
            <table className="w-full border-collapse text-left gap-3">
              <thead>
                <tr className="bg-[#4B3F72] text-white">
                  <th className="border p-4 font-bold ">Teacher</th>
                  <th className="border p-4 font-bold">Subjects</th>
                  <th className="border p-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teacher.map((tdata: any, index: number) => (
                  <tr key={index} className="hover:bg-indigo-50">
                    <td className="border p-4">{tdata.name}</td>
                    <td className="border p-4 bg-white rounded">
                      <div className="flex flex-wrap gap-3">
                        {tdata.subjects.map((subject: string, i: number) => (
                          <p key={i} className="text-sm bg-indigo-50 px-2 py-1 rounded-md">
                            {subject}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="border p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTeacher(tdata.name)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
