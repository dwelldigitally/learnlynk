import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, Info, GraduationCap, Languages, Briefcase, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface EntryRequirement {
  id: string;
  title: string;
  type: string;
  description?: string;
  mandatory: boolean;
  minimumGrade?: string | number;
  minimumScore?: string | number;
  yearsRequired?: number;
  alternatives?: string[];
  linkedDocumentTemplates?: string[];
}

interface RequirementThresholdDisplayProps {
  entryRequirement: EntryRequirement | null;
}

export function RequirementThresholdDisplay({ entryRequirement }: RequirementThresholdDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!entryRequirement) return null;

  const hasThreshold = entryRequirement.minimumGrade || 
    entryRequirement.minimumScore || 
    entryRequirement.yearsRequired ||
    entryRequirement.alternatives?.length;

  if (!hasThreshold) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'academic': return <GraduationCap className="h-3 w-3" />;
      case 'language': return <Languages className="h-3 w-3" />;
      case 'experience': return <Briefcase className="h-3 w-3" />;
      default: return <Info className="h-3 w-3" />;
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-between text-xs h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50">
          <span className="flex items-center gap-1.5">
            {getTypeIcon(entryRequirement.type)}
            Threshold Requirements
          </span>
          <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize text-[10px]">
              {entryRequirement.type}
            </Badge>
            {entryRequirement.mandatory && (
              <Badge variant="secondary" className="text-[10px]">Required</Badge>
            )}
          </div>
          
          <p className="font-medium text-amber-900">{entryRequirement.title}</p>
          
          {entryRequirement.description && (
            <p className="text-amber-700">{entryRequirement.description}</p>
          )}

          <div className="space-y-1">
            {entryRequirement.minimumGrade && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-amber-600" />
                <span className="text-amber-800">
                  <strong>Minimum Grade:</strong> {entryRequirement.minimumGrade}
                </span>
              </div>
            )}
            
            {entryRequirement.minimumScore && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-amber-600" />
                <span className="text-amber-800">
                  <strong>Minimum Score:</strong> {entryRequirement.minimumScore}
                </span>
              </div>
            )}
            
            {entryRequirement.yearsRequired && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-amber-600" />
                <span className="text-amber-800">
                  <strong>Years Required:</strong> {entryRequirement.yearsRequired} years
                </span>
              </div>
            )}
            
            {entryRequirement.alternatives && entryRequirement.alternatives.length > 0 && (
              <div className="mt-2">
                <p className="text-amber-700 font-medium">Alternatives accepted:</p>
                <ul className="list-disc list-inside text-amber-800 ml-2">
                  {entryRequirement.alternatives.map((alt, idx) => (
                    <li key={idx}>{alt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
