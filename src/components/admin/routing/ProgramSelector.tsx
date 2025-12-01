import React from 'react';
import { usePrograms } from '@/hooks/usePrograms';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface ProgramSelectorProps {
  selectedPrograms: string[];
  onChange: (programs: string[]) => void;
}

export function ProgramSelector({ selectedPrograms, onChange }: ProgramSelectorProps) {
  const { data: programs = [], isLoading } = usePrograms();

  const addProgram = (programId: string) => {
    if (!selectedPrograms.includes(programId)) {
      onChange([...selectedPrograms, programId]);
    }
  };

  const removeProgram = (programId: string) => {
    onChange(selectedPrograms.filter(id => id !== programId));
  };

  const getProgramName = (programId: string) => {
    return programs.find(p => p.id === programId)?.name || programId;
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {selectedPrograms.map((programId) => (
        <Badge key={programId} variant="secondary" className="flex items-center gap-1">
          {getProgramName(programId)}
          <button
            type="button"
            onClick={() => removeProgram(programId)}
            className="ml-1 hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      
      <Select value="" onValueChange={addProgram} disabled={isLoading}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={isLoading ? "Loading..." : "Select program..."} />
        </SelectTrigger>
        <SelectContent>
          {programs.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground">No programs available</div>
          ) : (
            programs.map((program) => (
              <SelectItem 
                key={program.id} 
                value={program.id}
                disabled={selectedPrograms.includes(program.id)}
              >
                {program.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
