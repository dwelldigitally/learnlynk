import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GraduationCap,
  Languages,
  Briefcase,
  Heart,
  Calendar,
  AlertCircle,
  Search,
  FileText,
  Plus,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface LibraryRequirement {
  id: string;
  type: string;
  title: string;
  description: string;
  mandatory: boolean;
  details?: string;
  minimum_grade?: string;
  alternatives?: string[];
  linked_document_templates?: string[];
}

interface RequirementLibrarySelectorProps {
  onSelect: (requirement: LibraryRequirement) => void;
}

const REQUIREMENT_TYPES = [
  { value: 'all', label: 'All Types', icon: AlertCircle, color: 'bg-gray-500' },
  { value: 'academic', label: 'Academic', icon: GraduationCap, color: 'bg-blue-500' },
  { value: 'language', label: 'Language', icon: Languages, color: 'bg-green-500' },
  { value: 'experience', label: 'Experience', icon: Briefcase, color: 'bg-orange-500' },
  { value: 'health', label: 'Health', icon: Heart, color: 'bg-red-500' },
  { value: 'age', label: 'Age', icon: Calendar, color: 'bg-purple-500' },
  { value: 'other', label: 'Other', icon: AlertCircle, color: 'bg-gray-500' },
];

export function RequirementLibrarySelector({ onSelect }: RequirementLibrarySelectorProps) {
  const [requirements, setRequirements] = useState<LibraryRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    try {
      const { data, error } = await supabase
        .from('entry_requirements')
        .select('*')
        .order('type', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;

      setRequirements(data || []);
    } catch (error) {
      console.error('Error fetching requirements:', error);
      toast.error('Failed to load requirements library');
    } finally {
      setLoading(false);
    }
  };

  const getTypeConfig = (type: string) => {
    return REQUIREMENT_TYPES.find((t) => t.value === type) || REQUIREMENT_TYPES[0];
  };

  const filteredRequirements = requirements.filter((req) => {
    const matchesSearch =
      searchQuery === '' ||
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || req.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const groupedRequirements = REQUIREMENT_TYPES.slice(1).reduce((acc, typeConfig) => {
    const filtered = filteredRequirements.filter((req) => req.type === typeConfig.value);
    if (filtered.length > 0) {
      acc[typeConfig.value] = filtered;
    }
    return acc;
  }, {} as Record<string, LibraryRequirement[]>);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requirements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REQUIREMENT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <type.icon className="h-4 w-4" />
                  {type.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Requirements List */}
      {Object.keys(groupedRequirements).length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Requirements Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find requirements.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedRequirements).map(([type, reqs]) => {
            const typeConfig = getTypeConfig(type);

            return (
              <Card key={type}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className={`w-3 h-3 rounded-full ${typeConfig.color}`} />
                    <typeConfig.icon className="h-4 w-4" />
                    {typeConfig.label} Requirements ({reqs.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {reqs.map((req) => (
                    <Card key={req.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{req.title}</h4>
                              {req.mandatory && (
                                <Badge variant="destructive" className="text-xs">
                                  Required
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {req.description}
                            </p>
                            {req.linked_document_templates &&
                              req.linked_document_templates.length > 0 && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <FileText className="h-3 w-3" />
                                  <span>
                                    {req.linked_document_templates.length} linked template
                                    {req.linked_document_templates.length > 1 ? 's' : ''}
                                  </span>
                                </div>
                              )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => onSelect(req)}
                            className="shrink-0"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
