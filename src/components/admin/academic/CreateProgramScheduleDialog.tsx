import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateProgramTermSchedule } from '@/hooks/useProgramTermSchedules';
import { useAcademicTerms } from '@/hooks/useAcademicTerms';
import { useScheduleTemplates } from '@/hooks/useScheduleTemplates';

const programScheduleSchema = z.object({
  term_id: z.string().min(1, 'Term is required'),
  schedule_id: z.string().min(1, 'Schedule template is required'),
  capacity_limit: z.number().min(1),
  special_requirements: z.string().optional(),
  classroom_location: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['planned', 'active', 'full', 'cancelled']).default('planned'),
});

type ProgramScheduleFormData = z.infer<typeof programScheduleSchema>;

interface CreateProgramScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProgramScheduleDialog({ open, onOpenChange }: CreateProgramScheduleDialogProps) {
  const createProgramSchedule = useCreateProgramTermSchedule();
  const { data: terms } = useAcademicTerms();
  const { data: schedules } = useScheduleTemplates();

  const form = useForm<ProgramScheduleFormData>({
    resolver: zodResolver(programScheduleSchema),
    defaultValues: {
      capacity_limit: 30,
      status: 'planned',
    },
  });

  const onSubmit = async (data: ProgramScheduleFormData) => {
    try {
      const scheduleData = {
        term_id: data.term_id,
        schedule_id: data.schedule_id,
        capacity_limit: data.capacity_limit,
        enrollment_count: 0,
        special_requirements: data.special_requirements,
        classroom_location: data.classroom_location,
        notes: data.notes,
        status: data.status,
      };
      await createProgramSchedule.mutateAsync(scheduleData);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating program schedule:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Program</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="term_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Term</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {terms?.map((term) => (
                          <SelectItem key={term.id} value={term.id}>
                            {term.name} ({term.academic_year})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="schedule_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Template</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select schedule" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schedules?.map((schedule) => (
                          <SelectItem key={schedule.id} value={schedule.id}>
                            {schedule.template_name} ({schedule.schedule_type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity Limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="30"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="full">Full</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="classroom_location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classroom Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Room 101, Building A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="special_requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requirements</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any special requirements or prerequisites..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createProgramSchedule.isPending}>
                {createProgramSchedule.isPending ? 'Creating...' : 'Create Schedule'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}