import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, CheckCircle, Eye, BookOpen, Users, Clock, Route } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Program {
  id: string;
  name: string;
  type: string;
  category?: string;
  status?: string;
  journeyConfiguration?: {
    mode: 'master' | 'copy' | 'custom';
    domesticJourneyId?: string;
    internationalJourneyId?: string;
  };
}

interface ProgramJourneySelectorProps {
  programs: Program[];
  onSelect: (program: Program, studentType?: 'domestic' | 'international' | 'both') => void;
  selectedProgramId?: string;
}

export function ProgramJourneySelector({ programs, onSelect, selectedProgramId }: ProgramJourneySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [previewProgram, setPreviewProgram] = useState<Program | null>(null);
  const [selectedStudentType, setSelectedStudentType] = useState<'domestic' | 'international' | 'both'>('both');

  // Filter programs
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || program.category === filterCategory;
    const matchesType = filterType === 'all' || program.type === filterType;
    const hasJourney = program.journeyConfiguration && 
      (program.journeyConfiguration.domesticJourneyId || program.journeyConfiguration.internationalJourneyId);
    
    return matchesSearch && matchesCategory && matchesType && hasJourney;
  });

  // Get unique categories and types
  const categories = Array.from(new Set(programs.map(p => p.category).filter(Boolean)));
  const types = Array.from(new Set(programs.map(p => p.type).filter(Boolean)));

  const handlePreview = (program: Program) => {
    setPreviewProgram(program);
  };

  const handleConfirmSelection = () => {
    if (previewProgram) {
      onSelect(previewProgram, selectedStudentType);
      setPreviewProgram(null);
    }
  };

  const getJourneyInfo = (program: Program) => {
    if (!program.journeyConfiguration) return { stages: 0, hasDomestic: false, hasInternational: false };
    
    return {
      stages: 8, // Mock value - would come from actual journey data
      hasDomestic: !!program.journeyConfiguration.domesticJourneyId,
      hasInternational: !!program.journeyConfiguration.internationalJourneyId
    };
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat!}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map(type => (
              <SelectItem key={type} value={type!}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Programs List */}
      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {filteredPrograms.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Programs Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterCategory !== 'all' || filterType !== 'all'
                    ? "Try adjusting your search or filters"
                    : "No programs with configured journeys available"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPrograms.map(program => {
              const journeyInfo = getJourneyInfo(program);
              const isSelected = selectedProgramId === program.id;

              return (
                <Card
                  key={program.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          {program.name}
                          {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{program.type}</Badge>
                          {program.category && (
                            <Badge variant="outline">{program.category}</Badge>
                          )}
                          {program.status && (
                            <Badge variant="outline" className="capitalize">{program.status}</Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(program)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Route className="h-4 w-4" />
                        <span>{journeyInfo.stages} stages</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {journeyInfo.hasDomestic && (
                          <Badge variant="outline" className="text-xs">Domestic</Badge>
                        )}
                        {journeyInfo.hasInternational && (
                          <Badge variant="outline" className="text-xs">International</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Preview Dialog */}
      <Dialog open={!!previewProgram} onOpenChange={(open) => !open && setPreviewProgram(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Journey Preview: {previewProgram?.name}</DialogTitle>
          </DialogHeader>
          
          {previewProgram && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {getJourneyInfo(previewProgram).stages}
                  </div>
                  <div className="text-sm text-muted-foreground">Stages</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {previewProgram.journeyConfiguration?.mode || 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Journey Type</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    60-90
                  </div>
                  <div className="text-sm text-muted-foreground">Est. Days</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Select Student Type to Copy</h4>
                <Select value={selectedStudentType} onValueChange={(value: any) => setSelectedStudentType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Both Domestic & International</SelectItem>
                    {getJourneyInfo(previewProgram).hasDomestic && (
                      <SelectItem value="domestic">Domestic Only</SelectItem>
                    )}
                    {getJourneyInfo(previewProgram).hasInternational && (
                      <SelectItem value="international">International Only</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Available Journeys</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {getJourneyInfo(previewProgram).hasDomestic && (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">Domestic Student Journey</span>
                      <Badge variant="secondary" className="ml-auto">Active</Badge>
                    </div>
                  )}
                  {getJourneyInfo(previewProgram).hasInternational && (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">International Student Journey</span>
                      <Badge variant="secondary" className="ml-auto">Active</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewProgram(null)}>Cancel</Button>
            <Button onClick={handleConfirmSelection}>Copy Journey</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
