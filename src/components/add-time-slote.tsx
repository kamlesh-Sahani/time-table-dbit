"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface AddTimeSlotProps {
  onAdd: (start: string, end: string) => void;
}

export function AddTimeSlot({ onAdd }: AddTimeSlotProps) {
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = () => {
    onAdd(start, end);
    setIsOpen(false);
    setStart("09:00");
    setEnd("10:00");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" /> Add Time Slot
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Time Slot</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <Input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleAdd} className="w-full bg-[#4B3F72] hover:bg-[#7160a7]">
            Add Time Slot
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}