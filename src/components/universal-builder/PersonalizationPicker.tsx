import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { User, Mail, Phone, Building, Tag, Calendar, Link as LinkIcon } from 'lucide-react';

interface PersonalizationPickerProps {
  onInsert: (token: string) => void;
}

const personalizationTokens = [
  {
    category: 'Lead Information',
    icon: User,
    tokens: [
      { label: 'First Name', value: '{{firstName}}' },
      { label: 'Last Name', value: '{{lastName}}' },
      { label: 'Full Name', value: '{{fullName}}' },
      { label: 'Email', value: '{{email}}' },
      { label: 'Phone', value: '{{phone}}' },
    ]
  },
  {
    category: 'Organization',
    icon: Building,
    tokens: [
      { label: 'Company', value: '{{company}}' },
      { label: 'Program', value: '{{program}}' },
      { label: 'Status', value: '{{status}}' },
    ]
  },
  {
    category: 'Campaign',
    icon: Tag,
    tokens: [
      { label: 'Campaign Name', value: '{{campaignName}}' },
      { label: 'Sender Name', value: '{{senderName}}' },
      { label: 'Unsubscribe Link', value: '{{unsubscribeLink}}' },
    ]
  },
  {
    category: 'Dates',
    icon: Calendar,
    tokens: [
      { label: 'Today\'s Date', value: '{{todayDate}}' },
      { label: 'Current Year', value: '{{currentYear}}' },
      { label: 'Application Date', value: '{{applicationDate}}' },
    ]
  }
];

export function PersonalizationPicker({ onInsert }: PersonalizationPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Tag className="h-4 w-4" />
          Insert Variable
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="max-h-[400px] overflow-y-auto">
          {personalizationTokens.map((category, idx) => {
            const Icon = category.icon;
            return (
              <div key={idx} className="border-b last:border-b-0">
                <div className="px-3 py-2 bg-muted/50 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{category.category}</span>
                </div>
                <div className="p-1">
                  {category.tokens.map((token) => (
                    <button
                      key={token.value}
                      onClick={() => onInsert(token.value)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm transition-colors flex items-center justify-between group"
                    >
                      <span>{token.label}</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded opacity-60 group-hover:opacity-100">
                        {token.value}
                      </code>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-3 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground">
            <LinkIcon className="h-3 w-3 inline mr-1" />
            Tokens will be replaced with actual values when emails are sent
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
