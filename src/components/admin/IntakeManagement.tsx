import React, { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Calendar, Users, Building2, BookOpen } from 'lucide-react';
import { IntakeService, IntakeData } from '@/services/intakeService';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/modern/PageHeader';
import { ModernCard } from '@/components/modern/ModernCard';
import { InfoBadge } from '@/components/modern/InfoBadge';
import { MetadataItem } from '@/components/modern/MetadataItem';

interface IntakeManagementProps {
  programId: string;
  intakes: any[];
  onIntakeChange?: () => void;
}

export const IntakeManagement: React.FC<IntakeManagementProps> = ({
  programId,
  intakes = [],
  onIntakeChange
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingIntake, setEditingIntake] = useState<any>(null);
  const [formData, setFormData] = useState<Partial<IntakeData>>({
    name: '',
    start_date: '',
    application_deadline: '',
    capacity: 30,
    sales_approach: 'balanced',
    status: 'open',
    delivery_method: 'on-campus',
    study_mode: 'full-time',
    campus: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: '',
      start_date: '',
      application_deadline: '',
      capacity: 30,
      sales_approach: 'balanced',
      status: 'open',
      delivery_method: 'on-campus',
      study_mode: 'full-time',
      campus: ''
    });
    setEditingIntake(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingIntake) {
        await IntakeService.updateIntake(editingIntake.id, formData);
      } else {
        await IntakeService.createIntake({
          ...formData,
          program_id: programId
        } as IntakeData);
      }

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['intakes'] });
      
      onIntakeChange?.();
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving intake:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (intakeId: string) => {
    if (!confirm('Are you sure you want to delete this intake?')) return;

    try {
      await IntakeService.deleteIntake(intakeId);
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['intakes'] });
      
      onIntakeChange?.();
    } catch (error) {
      console.error('Error deleting intake:', error);
    }
  };

  const handleEdit = (intake: any) => {
    setEditingIntake(intake);
    setFormData({
      name: intake.name || '',
      start_date: intake.start_date || '',
      application_deadline: intake.application_deadline || '',
      capacity: intake.capacity || 30,
      sales_approach: intake.sales_approach || 'balanced',
      status: intake.status || 'open',
      delivery_method: intake.delivery_method || 'on-campus',
      study_mode: intake.study_mode || 'full-time',
      campus: intake.campus || ''
    });
    setIsAddModalOpen(true);
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'destructive' | 'default' | 'secondary' => {
    switch (status) {
      case 'open': return 'success';
      case 'closed': return 'secondary';
      case 'full': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PageHeader
        title="Manage Program Intakes"
        subtitle="Schedule and manage intake periods for your academic programs"
      />

      <div className="mb-6 flex justify-end">
        <Dialog open={isAddModalOpen} onOpenChange={(open) => {
          setIsAddModalOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Add New Intake
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingIntake ? 'Edit Intake' : 'Add New Intake'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Intake Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Spring 2024"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="application_deadline">Application Deadline</Label>
                  <Input
                    id="application_deadline"
                    type="date"
                    value={formData.application_deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, application_deadline: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Study Mode</Label>
                  <Select
                    value={formData.study_mode}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, study_mode: value as 'full-time' | 'part-time' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Delivery Method</Label>
                  <Select
                    value={formData.delivery_method}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, delivery_method: value as 'on-campus' | 'online' | 'hybrid' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on-campus">On Campus</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Campus</Label>
                  <Select
                    value={formData.campus}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, campus: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select campus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Surrey">Surrey</SelectItem>
                      <SelectItem value="Vancouver">Vancouver</SelectItem>
                      <SelectItem value="Richmond">Richmond</SelectItem>
                      <SelectItem value="Burnaby">Burnaby</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : editingIntake ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {intakes.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light mb-4">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No intakes scheduled yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Get started by creating your first intake period for this program
          </p>
          <Button size="lg" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Intake
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {intakes.map((intake) => (
            <ModernCard key={intake.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base text-foreground mb-1 truncate">
                        {intake.name}
                      </h3>
                      <InfoBadge variant={getStatusVariant(intake.status)}>
                        {intake.status.toUpperCase()}
                      </InfoBadge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <MetadataItem
                    icon={Calendar}
                    label="Start Date"
                    value={new Date(intake.start_date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  />
                  
                  <MetadataItem
                    icon={Users}
                    label="Capacity"
                    value={`${intake.capacity} students`}
                  />

                  <MetadataItem
                    icon={BookOpen}
                    label="Study Mode"
                    value={intake.study_mode === 'full-time' ? 'Full Time' : 'Part Time'}
                  />

                  {intake.campus && (
                    <MetadataItem
                      icon={Building2}
                      label="Campus"
                      value={intake.campus}
                    />
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(intake)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(intake.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </ModernCard>
          ))}
        </div>
      )}
    </div>
  );
};