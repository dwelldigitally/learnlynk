import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, FileText, MessageCircle, Plus, Send, Upload } from 'lucide-react';
import { usePageEntranceAnimation } from '@/hooks/useAnimations';

interface Appeal {
  id: string;
  type: 'financial-change' | 'special-circumstances' | 'aid-adjustment' | 'other';
  title: string;
  description: string;
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'denied';
  submittedDate?: string;
  reviewDate?: string;
  decision?: string;
  supportingDocuments: string[];
}

const mockAppeals: Appeal[] = [
  {
    id: '1',
    type: 'financial-change',
    title: 'Change in Family Income',
    description: 'Parent lost job in December 2023, significant reduction in family income',
    status: 'under-review',
    submittedDate: '2024-02-15',
    supportingDocuments: ['unemployment-letter.pdf', 'bank-statements.pdf']
  },
  {
    id: '2',
    type: 'special-circumstances',
    title: 'Medical Emergency',
    description: 'Unexpected medical expenses due to emergency surgery',
    status: 'approved',
    submittedDate: '2024-01-20',
    reviewDate: '2024-02-05',
    decision: 'Additional $2,000 in emergency grant funding approved',
    supportingDocuments: ['medical-bills.pdf', 'insurance-statement.pdf']
  }
];

const appealTypes = [
  { value: 'financial-change', label: 'Change in Financial Circumstances' },
  { value: 'special-circumstances', label: 'Special Circumstances' },
  { value: 'aid-adjustment', label: 'Financial Aid Adjustment Request' },
  { value: 'other', label: 'Other' }
];

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-blue-100 text-blue-700',
  'under-review': 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  denied: 'bg-red-100 text-red-700'
};

export function FinancialAidAppeals() {
  const controls = usePageEntranceAnimation();
  const [showNewAppealForm, setShowNewAppealForm] = useState(false);
  const [newAppeal, setNewAppeal] = useState({
    type: '',
    title: '',
    description: '',
    circumstances: ''
  });

  const handleSubmitAppeal = () => {
    console.log('Submitting appeal:', newAppeal);
    setShowNewAppealForm(false);
    setNewAppeal({ type: '', title: '', description: '', circumstances: '' });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'under-review': return 'Under Review';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Appeals & Special Circumstances</h1>
            <p className="text-muted-foreground mt-2">
              Submit appeals for financial aid adjustments and special circumstances
            </p>
          </div>
        </div>
        <Button 
          onClick={() => setShowNewAppealForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Appeal
        </Button>
      </div>

      {/* Information Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">When to Submit an Appeal</h3>
              <p className="text-blue-700 text-sm mt-1">
                Submit an appeal if you've experienced significant changes in your financial situation, 
                unexpected expenses, or special circumstances that weren't reflected in your original 
                financial aid application.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Appeal Form */}
      {showNewAppealForm && (
        <Card>
          <CardHeader>
            <CardTitle>Submit New Appeal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appealType">Appeal Type</Label>
                <Select 
                  value={newAppeal.type} 
                  onValueChange={(value) => setNewAppeal(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select appeal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {appealTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="appealTitle">Appeal Title</Label>
                <Input
                  id="appealTitle"
                  placeholder="Brief title for your appeal"
                  value={newAppeal.title}
                  onChange={(e) => setNewAppeal(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description of Circumstances</Label>
              <Textarea
                id="description"
                placeholder="Describe your situation and why you're requesting an appeal..."
                rows={4}
                value={newAppeal.description}
                onChange={(e) => setNewAppeal(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="circumstances">Additional Details</Label>
              <Textarea
                id="circumstances"
                placeholder="Provide any additional context or specific details about your circumstances..."
                rows={3}
                value={newAppeal.circumstances}
                onChange={(e) => setNewAppeal(prev => ({ ...prev, circumstances: e.target.value }))}
              />
            </div>

            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-amber-900 mb-2">Supporting Documentation</h4>
                <p className="text-amber-700 text-sm mb-3">
                  Upload documents that support your appeal, such as:
                </p>
                <ul className="text-amber-700 text-sm list-disc list-inside space-y-1">
                  <li>Medical bills or insurance statements</li>
                  <li>Unemployment or layoff notices</li>
                  <li>Bank statements showing financial changes</li>
                  <li>Death certificates or divorce decrees</li>
                  <li>Any other relevant documentation</li>
                </ul>
                <Button variant="outline" className="mt-3 w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Supporting Documents
                </Button>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button onClick={handleSubmitAppeal}>
                <Send className="h-4 w-4 mr-2" />
                Submit Appeal
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNewAppealForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Appeals */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Appeals</h2>
        
        {mockAppeals.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Appeals Submitted</h3>
              <p className="text-muted-foreground">
                You haven't submitted any appeals yet. Click "New Appeal" to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          mockAppeals.map((appeal) => (
            <Card key={appeal.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{appeal.title}</CardTitle>
                      <Badge variant="outline">
                        {appealTypes.find(t => t.value === appeal.type)?.label}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{appeal.description}</p>
                  </div>
                  <Badge className={statusColors[appeal.status]}>
                    {getStatusText(appeal.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {appeal.submittedDate && (
                    <div>
                      <span className="font-medium">Submitted:</span> {new Date(appeal.submittedDate).toLocaleDateString()}
                    </div>
                  )}
                  {appeal.reviewDate && (
                    <div>
                      <span className="font-medium">Reviewed:</span> {new Date(appeal.reviewDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {appeal.decision && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-900 mb-2">Decision</h4>
                      <p className="text-green-700">{appeal.decision}</p>
                    </CardContent>
                  </Card>
                )}

                {appeal.supportingDocuments.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Supporting Documents</h4>
                    <div className="flex flex-wrap gap-2">
                      {appeal.supportingDocuments.map((doc, index) => (
                        <Badge key={index} variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Counselor
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
