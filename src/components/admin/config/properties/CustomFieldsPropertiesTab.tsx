import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface CustomField {
  id: string;
  field_name: string;
  field_type: string;
  field_label: string;
  required: boolean;
  enabled: boolean;
  order_index: number;
}

// Dummy data
const DUMMY_LEAD_FIELDS: CustomField[] = [
  { id: '1', field_name: 'industry', field_type: 'select', field_label: 'Industry', required: false, enabled: true, order_index: 1 },
  { id: '2', field_name: 'company_size', field_type: 'select', field_label: 'Company Size', required: false, enabled: true, order_index: 2 },
];

const DUMMY_APPLICANT_FIELDS: CustomField[] = [
  { id: '3', field_name: 'previous_education', field_type: 'textarea', field_label: 'Previous Education', required: true, enabled: true, order_index: 1 },
  { id: '4', field_name: 'work_experience', field_type: 'number', field_label: 'Years of Experience', required: false, enabled: true, order_index: 2 },
];

const DUMMY_STUDENT_FIELDS: CustomField[] = [
  { id: '5', field_name: 'emergency_contact', field_type: 'text', field_label: 'Emergency Contact', required: true, enabled: true, order_index: 1 },
  { id: '6', field_name: 'dietary_restrictions', field_type: 'textarea', field_label: 'Dietary Restrictions', required: false, enabled: true, order_index: 2 },
];

const DUMMY_PROGRAM_FIELDS: CustomField[] = [
  { id: '7', field_name: 'specialization', field_type: 'select', field_label: 'Specialization', required: false, enabled: true, order_index: 1 },
  { id: '8', field_name: 'prerequisites', field_type: 'textarea', field_label: 'Prerequisites', required: false, enabled: true, order_index: 2 },
];

const FIELD_TYPES = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Dropdown' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'date', label: 'Date' },
  { value: 'checkbox', label: 'Checkbox' },
];

export function CustomFieldsPropertiesTab() {
  const [activeContext, setActiveContext] = useState('lead');
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<CustomField | undefined>();
  
  const [leadFields, setLeadFields] = useState(DUMMY_LEAD_FIELDS);
  const [applicantFields, setApplicantFields] = useState(DUMMY_APPLICANT_FIELDS);
  const [studentFields, setStudentFields] = useState(DUMMY_STUDENT_FIELDS);
  const [programFields, setProgramFields] = useState(DUMMY_PROGRAM_FIELDS);

  const [formData, setFormData] = useState({
    field_name: '',
    field_label: '',
    field_type: 'text',
    required: false,
    enabled: true,
  });

  const fields = activeContext === 'lead' ? leadFields :
                 activeContext === 'applicant' ? applicantFields :
                 activeContext === 'student' ? studentFields :
                 programFields;

  const setFields = activeContext === 'lead' ? setLeadFields :
                    activeContext === 'applicant' ? setApplicantFields :
                    activeContext === 'student' ? setStudentFields :
                    setProgramFields;

  const handleAddNew = () => {
    setSelectedField(undefined);
    setFormData({
      field_name: '',
      field_label: '',
      field_type: 'text',
      required: false,
      enabled: true,
    });
    setEditorOpen(true);
  };

  const handleEdit = (field: CustomField) => {
    setSelectedField(field);
    setFormData({
      field_name: field.field_name,
      field_label: field.field_label,
      field_type: field.field_type,
      required: field.required,
      enabled: field.enabled,
    });
    setEditorOpen(true);
  };

  const handleSave = () => {
    if (selectedField) {
      const updated = { ...selectedField, ...formData };
      setFields(fields.map((f: CustomField) => f.id === selectedField.id ? updated : f));
      toast.success('Custom field updated');
    } else {
      const newField: CustomField = {
        id: Date.now().toString(),
        ...formData,
        order_index: fields.length + 1,
      };
      setFields([...fields, newField]);
      toast.success('Custom field created');
    }
    setEditorOpen(false);
  };

  const handleDelete = (field: CustomField) => {
    setFields(fields.filter((f: CustomField) => f.id !== field.id));
    toast.success('Custom field deleted');
  };

  const handleToggleEnabled = (field: CustomField) => {
    const updated = { ...field, enabled: !field.enabled };
    setFields(fields.map((f: CustomField) => f.id === field.id ? updated : f));
    toast.success('Custom field updated');
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeContext} onValueChange={setActiveContext}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="lead">Lead Fields</TabsTrigger>
          <TabsTrigger value="applicant">Applicant Fields</TabsTrigger>
          <TabsTrigger value="student">Student Fields</TabsTrigger>
          <TabsTrigger value="program">Program Fields</TabsTrigger>
        </TabsList>

        <TabsContent value={activeContext} className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Custom Fields - {activeContext === 'lead' ? 'Leads' : activeContext === 'applicant' ? 'Applicants' : activeContext === 'student' ? 'Students' : 'Programs'}</CardTitle>
                  <CardDescription>
                    Add custom fields to capture additional information
                  </CardDescription>
                </div>
                <Button onClick={handleAddNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Label</TableHead>
                      <TableHead>Field Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Enabled</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No custom fields found. Click "Add Field" to create one.
                        </TableCell>
                      </TableRow>
                    ) : (
                      fields.map((field) => (
                        <TableRow key={field.id}>
                          <TableCell className="font-medium">{field.field_label}</TableCell>
                          <TableCell className="font-mono text-sm text-muted-foreground">{field.field_name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{field.field_type}</Badge>
                          </TableCell>
                          <TableCell>
                            {field.required ? (
                              <Badge variant="destructive">Required</Badge>
                            ) : (
                              <Badge variant="outline">Optional</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={field.enabled}
                              onCheckedChange={() => handleToggleEnabled(field)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(field)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(field)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedField ? 'Edit Custom Field' : 'Add Custom Field'}</DialogTitle>
            <DialogDescription>
              {selectedField ? 'Update custom field details' : 'Create a new custom field'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="field_label">Field Label *</Label>
              <Input
                id="field_label"
                value={formData.field_label}
                onChange={(e) => setFormData({ ...formData, field_label: e.target.value })}
                placeholder="e.g., Industry"
              />
            </div>

            <div>
              <Label htmlFor="field_name">Field Name *</Label>
              <Input
                id="field_name"
                value={formData.field_name}
                onChange={(e) => setFormData({ ...formData, field_name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                placeholder="e.g., industry"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lowercase with underscores (auto-formatted)
              </p>
            </div>

            <div>
              <Label htmlFor="field_type">Field Type *</Label>
              <Select value={formData.field_type} onValueChange={(value) => setFormData({ ...formData, field_type: value })}>
                <SelectTrigger id="field_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="required">Required Field</Label>
              <Switch
                id="required"
                checked={formData.required}
                onCheckedChange={(checked) => setFormData({ ...formData, required: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enabled">Enabled</Label>
              <Switch
                id="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {selectedField ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
