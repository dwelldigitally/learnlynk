import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layout, Mail, Gift, Bell, Calendar } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  html: string;
}

const emailTemplates: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    description: 'Warm welcome message for new leads',
    icon: Mail,
    category: 'Onboarding',
    html: `<h2>Welcome {{firstName}}!</h2>
<p>We're thrilled to have you join us. Here's what you can expect next:</p>
<ul>
  <li>Personalized guidance from our team</li>
  <li>Access to exclusive resources</li>
  <li>Updates on your application status</li>
</ul>
<p>If you have any questions, just reply to this email.</p>
<p>Best regards,<br>{{senderName}}</p>`
  },
  {
    id: 'followup',
    name: 'Follow-up',
    description: 'Check in with leads',
    icon: Bell,
    category: 'Engagement',
    html: `<h2>Hi {{firstName}},</h2>
<p>We wanted to check in and see how you're doing. Have you had a chance to review the information we sent?</p>
<p>We're here to answer any questions you might have about:</p>
<ul>
  <li>Our programs</li>
  <li>The application process</li>
  <li>Next steps</li>
</ul>
<p>Looking forward to hearing from you!</p>
<p>{{senderName}}</p>`
  },
  {
    id: 'event-invite',
    name: 'Event Invitation',
    description: 'Invite leads to events',
    icon: Calendar,
    category: 'Events',
    html: `<h2>You're Invited, {{firstName}}!</h2>
<p>Join us for an exclusive event designed just for prospective students like you.</p>
<h3>Event Details</h3>
<ul>
  <li><strong>Date:</strong> [Event Date]</li>
  <li><strong>Time:</strong> [Event Time]</li>
  <li><strong>Location:</strong> [Event Location]</li>
</ul>
<p><a href="[RSVP Link]" style="display: inline-block; padding: 12px 24px; background: #0066cc; color: white; text-decoration: none; border-radius: 4px;">RSVP Now</a></p>
<p>We look forward to seeing you there!</p>`
  },
  {
    id: 'promotional',
    name: 'Promotional Offer',
    description: 'Special offers and promotions',
    icon: Gift,
    category: 'Marketing',
    html: `<h2>Special Offer for {{firstName}}</h2>
<p>For a limited time, we're offering an exclusive benefit to applicants like you.</p>
<div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3 style="margin: 0 0 10px 0;">Limited Time Offer</h3>
  <p style="margin: 0; font-size: 18px; font-weight: bold;">[Offer Details]</p>
</div>
<p><strong>This offer expires on [Date]</strong></p>
<p><a href="[Action Link]" style="display: inline-block; padding: 12px 24px; background: #0066cc; color: white; text-decoration: none; border-radius: 4px;">Claim Your Offer</a></p>
<p>Don't miss out!</p>`
  },
  {
    id: 'blank',
    name: 'Blank Template',
    description: 'Start from scratch',
    icon: Layout,
    category: 'Basic',
    html: `<p>Start writing your email content here...</p>`
  }
];

interface EmailTemplateSelectorProps {
  onSelect: (html: string) => void;
}

export function EmailTemplateSelector({ onSelect }: EmailTemplateSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (template: EmailTemplate) => {
    onSelect(template.html);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Layout className="h-4 w-4" />
          Use Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Choose Email Template</DialogTitle>
          <DialogDescription>
            Select a pre-designed template to get started quickly
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-2 gap-4">
            {emailTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => handleSelect(template)}
                  className="text-left p-4 border rounded-lg hover:border-primary hover:bg-accent transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1">{template.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {template.description}
                      </p>
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {template.category}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
