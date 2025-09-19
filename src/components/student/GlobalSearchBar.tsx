import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Search, FileText, Calendar, Users, Bell, Command } from 'lucide-react';

interface GlobalSearchBarProps {
  isMobile?: boolean;
}

const searchResults = [
  { type: 'application', title: 'Engineering Application', description: 'Application deadline approaching', icon: FileText },
  { type: 'schedule', title: 'MATH 101 - Calculus I', description: 'Today at 2:00 PM', icon: Calendar },
  { type: 'community', title: 'Study Group: Physics', description: '5 members online', icon: Users },
  { type: 'notification', title: 'Fee Payment Due', description: 'Due in 3 days', icon: Bell },
];

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({ isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResults = searchResults.filter(result =>
    result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="w-9 h-9 p-0"
        >
          <Search className="w-4 h-4" />
        </Button>
        
        <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
          <CommandInput 
            placeholder="Search applications, schedule, messages..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Results">
              {filteredResults.map((result, index) => (
                <CommandItem key={index} className="flex items-center gap-3 p-3">
                  <result.icon className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{result.title}</div>
                    <div className="text-xs text-muted-foreground">{result.description}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    );
  }

  return (
    <>
      <div className="relative w-full">
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-full justify-start text-muted-foreground hover:bg-muted/50 h-9"
        >
          <Search className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Search everything...</span>
          <span className="sm:hidden">Search...</span>
          <div className="ml-auto hidden sm:flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <Command className="w-3 h-3" />K
            </kbd>
          </div>
        </Button>
      </div>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput 
          placeholder="Search applications, schedule, messages..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem className="flex items-center gap-3 p-3">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span>View All Applications</span>
            </CommandItem>
            <CommandItem className="flex items-center gap-3 p-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Check Today's Schedule</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Results">
            {filteredResults.map((result, index) => (
              <CommandItem key={index} className="flex items-center gap-3 p-3">
                <result.icon className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{result.title}</div>
                  <div className="text-xs text-muted-foreground">{result.description}</div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};