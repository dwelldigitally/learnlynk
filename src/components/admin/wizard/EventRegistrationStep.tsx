import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, FormInput, Users, Settings, UserCheck } from "lucide-react";
import { EventData, RegistrationField } from "./EventWizard";

interface EventRegistrationStepProps {
  data: EventData;
  onUpdate: (updates: Partial<EventData>) => void;
}

const fieldTypes = [
  { value: "text", label: "Text Input" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone Number" },
  { value: "textarea", label: "Long Text" },
  { value: "select", label: "Dropdown" },
  { value: "checkbox", label: "Checkbox" },
];

export const EventRegistrationStep: React.FC<EventRegistrationStepProps> = ({ data, onUpdate }) => {
  const [isCreatingField, setIsCreatingField] = useState(false);
  const [editingField, setEditingField] = useState<RegistrationField | null>(null);
  const [newField, setNewField] = useState<Partial<RegistrationField>>({
    label: "",
    type: "text",
    required: false,
    options: [],
  });

  const resetFieldForm = () => {
    setNewField({
      label: "",
      type: "text",
      required: false,
      options: [],
    });
    setEditingField(null);
  };

  const handleCreateField = () => {
    if (!newField.label) return;
    
    const field: RegistrationField = {
      id: editingField?.id || Date.now().toString(),
      label: newField.label!,
      type: newField.type as any,
      required: newField.required || false,
      options: newField.options || [],
    };

    if (editingField) {
      const updatedFields = data.registrationForm.map(f => f.id === editingField.id ? field : f);
      onUpdate({ registrationForm: updatedFields });
    } else {
      onUpdate({ registrationForm: [...data.registrationForm, field] });
    }
    
    setIsCreatingField(false);
    resetFieldForm();
  };

  const handleEditField = (field: RegistrationField) => {
    setEditingField(field);
    setNewField(field);
    setIsCreatingField(true);
  };

  const handleDeleteField = (fieldId: string) => {
    const updatedFields = data.registrationForm.filter(f => f.id !== fieldId);
    onUpdate({ registrationForm: updatedFields });
  };

  const addOption = () => {
    setNewField({
      ...newField,
      options: [...(newField.options || []), ""]
    });
  };

  const updateOption = (index: number, value: string) => {
    const options = [...(newField.options || [])];
    options[index] = value;
    setNewField({ ...newField, options });
  };

  const removeOption = (index: number) => {
    const options = (newField.options || []).filter((_, i) => i !== index);
    setNewField({ ...newField, options });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Registration & Attendee Management</h2>
        <p className="text-muted-foreground">Configure registration requirements and attendee settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FormInput className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{data.registrationForm.length}</p>
                <p className="text-sm text-muted-foreground">Form Fields</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {data.requiresApproval ? "Yes" : "No"}
                </p>
                <p className="text-sm text-muted-foreground">Approval Required</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {data.allowWaitlist ? "Yes" : "No"}
                </p>
                <p className="text-sm text-muted-foreground">Waitlist Enabled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Registration Form</h3>
            <Dialog open={isCreatingField} onOpenChange={setIsCreatingField}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetFieldForm(); setIsCreatingField(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingField ? "Edit Form Field" : "Add Form Field"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="field-label">Field Label *</Label>
                    <Input
                      id="field-label"
                      value={newField.label}
                      onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                      placeholder="e.g., Company Name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="field-type">Field Type</Label>
                    <Select
                      value={newField.type}
                      onValueChange={(value) => setNewField({ ...newField, type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="field-required">Required Field</Label>
                    <Switch
                      id="field-required"
                      checked={newField.required}
                      onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
                    />
                  </div>
                  
                  {newField.type === "select" && (
                    <div>
                      <Label>Options</Label>
                      <div className="space-y-2 mt-2">
                        {(newField.options || []).map((option, index) => (
                          <div key={index} className="flex space-x-2">
                            <Input
                              value={option}
                              onChange={(e) => updateOption(index, e.target.value)}
                              placeholder="Option value"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => removeOption(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" onClick={addOption} className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Option
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleCreateField} className="flex-1">
                      {editingField ? "Update Field" : "Add Field"}
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreatingField(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {data.registrationForm.map((field, index) => (
              <Card key={field.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{field.label}</span>
                        {field.required && (
                          <span className="text-red-500 text-xs">*</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {fieldTypes.find(t => t.value === field.type)?.label}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="icon" onClick={() => handleEditField(field)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteField(field.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {data.registrationForm.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-4">
                    <FormInput className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No form fields added yet. Add fields to collect attendee information.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Registration Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <Label htmlFor="requires-approval">Approval Required</Label>
                  <p className="text-sm text-muted-foreground">
                    Manually approve each registration
                  </p>
                </div>
                <Switch
                  id="requires-approval"
                  checked={data.requiresApproval}
                  onCheckedChange={(checked) => onUpdate({ requiresApproval: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <Label htmlFor="allow-waitlist">Enable Waitlist</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow registration when event is full
                  </p>
                </div>
                <Switch
                  id="allow-waitlist"
                  checked={data.allowWaitlist}
                  onCheckedChange={(checked) => onUpdate({ allowWaitlist: checked })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="max-capacity">Maximum Capacity</Label>
              <Input
                id="max-capacity"
                type="number"
                min="1"
                value={data.maxCapacity}
                onChange={(e) => onUpdate({ maxCapacity: parseInt(e.target.value) || 1 })}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Total number of attendees allowed
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Registration Flow</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Attendee fills registration form</li>
                <li>2. {data.requiresApproval ? "Admin approves/rejects" : "Auto-approved"}</li>
                <li>3. Confirmation email sent</li>
                <li>4. Ticket/access provided</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};