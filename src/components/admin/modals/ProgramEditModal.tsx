import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useActiveCampuses } from "@/hooks/useCampuses";

interface Program {
  id: string;
  name: string;
  description: string;
  duration: string;
  type: string;
  campus: string;
  color: string;
  status: string;
  enrolled: number;
  capacity: number;
  tuitionFee: number;
  nextIntake: string;
}

interface ProgramEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
  onSave: (program: Program) => void;
}

const programEditSchema = z.object({
  name: z.string().min(1, "Program name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  duration: z.string().min(1, "Duration is required"),
  type: z.string().min(1, "Program type is required"),
  campus: z.string().min(1, "Campus is required"),
  status: z.string().min(1, "Status is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  tuitionFee: z.number().min(0, "Tuition fee must be positive"),
  color: z.string().min(1, "Color is required"),
});

type ProgramEditForm = z.infer<typeof programEditSchema>;

const programTypes = ["Certificate", "Diploma", "Bachelor", "Master"];
const statuses = ["active", "inactive", "pending"];
const colors = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F59E0B" },
  { name: "Pink", value: "#EC4899" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Teal", value: "#14B8A6" },
];

export const ProgramEditModal = ({ isOpen, onClose, program, onSave }: ProgramEditModalProps) => {
  const { data: campuses = [], isLoading: campusesLoading } = useActiveCampuses();
  const form = useForm<ProgramEditForm>({
    resolver: zodResolver(programEditSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: "",
      type: "",
      campus: "",
      status: "",
      capacity: 0,
      tuitionFee: 0,
      color: "",
    },
  });

  // Reset form when program changes
  React.useEffect(() => {
    if (isOpen && program) {
      form.reset({
        name: program.name,
        description: program.description,
        duration: program.duration,
        type: program.type,
        campus: program.campus,
        status: program.status,
        capacity: program.capacity,
        tuitionFee: program.tuitionFee,
        color: program.color,
      });
    }
  }, [isOpen, program, form]);

  const handleSubmit = (data: ProgramEditForm) => {
    if (!program) return;
    
    const updatedProgram: Program = {
      ...program,
      ...data,
    };
    
    onSave(updatedProgram);
    onClose();
  };

  if (!program) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Program - {program.name}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter program name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select program type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {programTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter program description" 
                      className="min-h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 12 months" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="campus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campus</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={campusesLoading}>
                      <FormControl>
                        <SelectTrigger>
                          {campusesLoading ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Loading...
                            </span>
                          ) : (
                            <SelectValue placeholder="Select campus" />
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {campuses.length === 0 ? (
                          <SelectItem value="" disabled>No campuses configured</SelectItem>
                        ) : (
                          campuses.map((campus) => (
                            <SelectItem key={campus.id} value={campus.name}>
                              {campus.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Maximum students"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tuitionFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tuition Fee ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="15000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            <div className="flex items-center space-x-2">
                              <Badge variant={status === 'active' ? 'default' : 'secondary'}>
                                {status}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Color</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 ${
                            field.value === color.value ? 'border-primary' : 'border-muted'
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => field.onChange(color.value)}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};