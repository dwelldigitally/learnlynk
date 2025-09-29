import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Users, Calendar, MoreHorizontal } from 'lucide-react';
import { useStudentBatches, useUnassignedStudents, useStudentBatchMutations } from '@/hooks/useScheduling';
import { usePracticumPrograms } from '@/hooks/usePracticum';
import { StudentBatch } from '@/types/scheduling';
import { format } from 'date-fns';

export function BatchManagement() {
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAddStudentsOpen, setIsAddStudentsOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<StudentBatch | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  
  const { data: batches = [] } = useStudentBatches(user?.id || '');
  const { data: unassignedStudents = [] } = useUnassignedStudents(user?.id || '');
  const { data: programs = [] } = usePracticumPrograms(user?.id || '');
  const { createBatch, addStudentsToBatch } = useStudentBatchMutations();

  const [newBatch, setNewBatch] = useState({
    batch_name: '',
    description: '',
    program_id: '',
  });

  const handleCreateBatch = async () => {
    if (!user?.id || !newBatch.batch_name) return;

    try {
      await createBatch.mutateAsync({
        ...newBatch,
        user_id: user.id,
        program_id: newBatch.program_id || undefined,
        status: 'draft' as const,
      });
      setIsCreateDialogOpen(false);
      setNewBatch({ batch_name: '', description: '', program_id: '' });
    } catch (error) {
      console.error('Failed to create batch:', error);
    }
  };

  const handleAddStudents = async () => {
    if (!selectedBatch || selectedStudents.length === 0) return;

    try {
      await addStudentsToBatch.mutateAsync({
        batchId: selectedBatch.id,
        assignmentIds: selectedStudents,
      });
      setIsAddStudentsOpen(false);
      setSelectedStudents([]);
      setSelectedBatch(null);
    } catch (error) {
      console.error('Failed to add students to batch:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'draft': return 'outline';
      default: return 'outline';
    }
  };

  const filteredStudents = selectedBatch?.program_id 
    ? unassignedStudents.filter(s => s.practicum_programs?.id === selectedBatch.program_id)
    : unassignedStudents;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Batch Management</h2>
          <p className="text-muted-foreground">
            Create and manage student batches for coordinated scheduling
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Batch</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="batch_name">Batch Name</Label>
                <Input
                  id="batch_name"
                  value={newBatch.batch_name}
                  onChange={(e) => setNewBatch({ ...newBatch, batch_name: e.target.value })}
                  placeholder="Enter batch name"
                />
              </div>
              
              <div>
                <Label htmlFor="program_id">Program (Optional)</Label>
                <Select
                  value={newBatch.program_id}
                  onValueChange={(value) => setNewBatch({ ...newBatch, program_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Programs</SelectItem>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.program_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newBatch.description}
                  onChange={(e) => setNewBatch({ ...newBatch, description: e.target.value })}
                  placeholder="Enter batch description"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateBatch}
                  disabled={createBatch.isPending || !newBatch.batch_name}
                >
                  Create Batch
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Batch List */}
      <div className="grid gap-4">
        {batches.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No batches created yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first batch to start organizing students for scheduling
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Batch
              </Button>
            </CardContent>
          </Card>
        ) : (
          batches.map((batch) => (
            <Card key={batch.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{batch.batch_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Created {format(new Date(batch.created_at), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(batch.status)}>
                      {batch.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedBatch(batch);
                        setIsAddStudentsOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Students
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Program:</span>
                    <span className="ml-2">
                      {programs.find(p => p.id === batch.program_id)?.program_name || 'All Programs'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Students:</span>
                    <span className="ml-2">0</span> {/* We'll update this with actual count */}
                  </div>
                </div>
                {batch.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {batch.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Students Dialog */}
      <Dialog open={isAddStudentsOpen} onOpenChange={setIsAddStudentsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Students to {selectedBatch?.batch_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Select students to add to this batch. 
              {selectedBatch?.program_id && (
                <span> Showing students from {programs.find(p => p.id === selectedBatch.program_id)?.program_name}</span>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No unassigned students available
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <div key={student.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedStudents([...selectedStudents, student.id]);
                        } else {
                          setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                        }
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-medium">
                        {student.leads?.first_name} {student.leads?.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {student.practicum_programs?.program_name}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {selectedStudents.length} students selected
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsAddStudentsOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddStudents}
                  disabled={addStudentsToBatch.isPending || selectedStudents.length === 0}
                >
                  Add Students
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}