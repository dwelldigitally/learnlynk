import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Save, Eye } from "lucide-react";

interface SimpleFormBuilderProps {
  formId?: string;
}

export function SimpleFormBuilder({ formId }: SimpleFormBuilderProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    redirectUrl: "",
    emailSubject: "",
    emailTemplate: ""
  });

  const [fields, setFields] = useState([
    { id: 'name', type: 'text', label: 'Full Name', required: true },
    { id: 'email', type: 'email', label: 'Email Address', required: true },
    { id: 'phone', type: 'tel', label: 'Phone Number', required: false }
  ]);

  const handleSave = () => {
    console.log('Saving form:', { formData, fields });
    // Here you would save the form
  };

  const addField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      type: 'text',
      label: 'New Field',
      required: false
    };
    setFields([...fields, newField]);
  };

  return (
    <div className="space-y-6">
      {/* Form Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Form Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="formName">Form Name</Label>
              <Input
                id="formName"
                placeholder="Enter form name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="redirectUrl">Redirect URL</Label>
              <Input
                id="redirectUrl"
                placeholder="https://example.com/thank-you"
                value={formData.redirectUrl}
                onChange={(e) => setFormData({...formData, redirectUrl: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Form description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Fields */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Form Fields</CardTitle>
          <Button onClick={addField} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Field Type</Label>
                    <Select value={field.type}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="tel">Phone</SelectItem>
                        <SelectItem value="textarea">Text Area</SelectItem>
                        <SelectItem value="select">Dropdown</SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Field Label</Label>
                    <Input
                      value={field.label}
                      onChange={(e) => {
                        const updatedFields = [...fields];
                        updatedFields[index].label = e.target.value;
                        setFields(updatedFields);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Required</Label>
                    <Select 
                      value={field.required ? "true" : "false"}
                      onValueChange={(value) => {
                        const updatedFields = [...fields];
                        updatedFields[index].required = value === "true";
                        setFields(updatedFields);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Required</SelectItem>
                        <SelectItem value="false">Optional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emailSubject">Email Subject</Label>
            <Input
              id="emailSubject"
              placeholder="New lead submission"
              value={formData.emailSubject}
              onChange={(e) => setFormData({...formData, emailSubject: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailTemplate">Email Template</Label>
            <Textarea
              id="emailTemplate"
              placeholder="Email template content..."
              rows={4}
              value={formData.emailTemplate}
              onChange={(e) => setFormData({...formData, emailTemplate: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Form
        </Button>
        <Button variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>
    </div>
  );
}