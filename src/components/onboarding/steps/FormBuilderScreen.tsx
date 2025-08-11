import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FileText, Eye, Plus, Edit } from 'lucide-react';

interface FormBuilderScreenProps {
  data: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onSkip: () => void;
}

const FORM_TEMPLATES = [
  {
    id: 'inquiry',
    name: 'Program Inquiry Form',
    description: 'Capture initial interest from prospective students',
    fields: ['Name', 'Email', 'Phone', 'Program Interest', 'Preferred Start Date'],
    useCase: 'Website lead capture'
  },
  {
    id: 'application',
    name: 'Application Form',
    description: 'Comprehensive application for program admission',
    fields: ['Personal Info', 'Education History', 'Program Selection', 'Documents Upload'],
    useCase: 'Full application process'
  },
  {
    id: 'info-session',
    name: 'Info Session Registration',
    description: 'Register students for information sessions',
    fields: ['Name', 'Email', 'Session Selection', 'Questions'],
    useCase: 'Event registration'
  },
  {
    id: 'contact',
    name: 'Contact Us Form',
    description: 'General contact and support requests',
    fields: ['Name', 'Email', 'Subject', 'Message', 'Department'],
    useCase: 'General inquiries'
  }
];

const FormBuilderScreen: React.FC<FormBuilderScreenProps> = ({
  data,
  onComplete,
  onNext,
  onSkip
}) => {
  const { toast } = useToast();
  const [selectedForms, setSelectedForms] = useState(data?.forms || []);

  const handleSelectTemplate = (template: any) => {
    const formConfig = {
      id: template.id,
      name: template.name,
      description: template.description,
      type: template.id,
      status: 'active',
      fields: template.fields,
      created_at: new Date().toISOString()
    };

    if (!selectedForms.find(f => f.id === template.id)) {
      setSelectedForms(prev => [...prev, formConfig]);
      toast({
        title: "Form Template Added",
        description: `${template.name} has been added to your forms.`,
      });
    }
  };

  const handleRemoveForm = (formId: string) => {
    setSelectedForms(prev => prev.filter(f => f.id !== formId));
  };

  const handleComplete = () => {
    onComplete({ forms: selectedForms });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Lead Capture Forms</h3>
        <p className="text-muted-foreground">
          Create forms to capture leads and applications from your website.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Available Templates</h4>
          {FORM_TEMPLATES.map((template) => (
            <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSelectTemplate(template)}
                    disabled={selectedForms.find(f => f.id === template.id)}
                  >
                    {selectedForms.find(f => f.id === template.id) ? 'Added' : 'Select'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground mb-2">
                  Use case: {template.useCase}
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.fields.map((field, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Selected Forms</h4>
          {selectedForms.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No forms selected yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Select templates from the left to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            selectedForms.map((form) => (
              <Card key={form.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{form.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{form.description}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRemoveForm(form.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {form.fields.map((field, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-success/10 text-success text-xs rounded-full"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2">Form Integration Features</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Forms automatically create leads in your CRM</li>
          <li>• Smart field validation and required field enforcement</li>
          <li>• Automated email confirmations and follow-ups</li>
          <li>• Anti-spam protection and duplicate detection</li>
          <li>• Mobile-responsive design for all devices</li>
        </ul>
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={onSkip} className="glass-button">
          Skip This Step
        </Button>
        <Button 
          onClick={handleComplete}
          className="bg-primary hover:bg-primary-hover"
        >
          Continue with {selectedForms.length} Form{selectedForms.length !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  );
};

export default FormBuilderScreen;