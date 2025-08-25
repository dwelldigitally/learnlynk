import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Radar, Search, Archive, AlertTriangle, TrendingDown, Filter } from 'lucide-react';

interface WasteCandidate {
  id: string;
  student_name: string;
  program: string;
  reason: string;
  last_contact: string;
  score: number;
  status: 'duplicate' | 'cold' | 'wrong_intake' | 'spam';
}

export function CapacityManagement() {
  const [candidates, setCandidates] = useState<WasteCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterReason, setFilterReason] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [archivedCount, setArchivedCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadWasteCandidates();
  }, []);

  const loadWasteCandidates = async () => {
    try {
      // Mock data for demo - in real implementation, this would analyze actual leads
      const mockCandidates: WasteCandidate[] = [
        {
          id: '1',
          student_name: 'John Smith',
          program: 'Business Administration',
          reason: 'Duplicate email detected',
          last_contact: '2024-01-15',
          score: 5,
          status: 'duplicate'
        },
        {
          id: '2',
          student_name: 'Sarah Wilson',
          program: 'Healthcare Assistant',
          reason: 'No engagement for 30+ days',
          last_contact: '2023-12-20',
          score: 2,
          status: 'cold'
        },
        {
          id: '3',
          student_name: 'Mike Johnson',
          program: 'IT Support',
          reason: 'Looking for different program type',
          last_contact: '2024-01-18',
          score: 8,
          status: 'wrong_intake'
        },
        {
          id: '4',
          student_name: 'test@test.com',
          program: 'Business Administration',
          reason: 'Invalid/test email pattern',
          last_contact: '2024-01-20',
          score: 1,
          status: 'spam'
        }
      ];

      setCandidates(mockCandidates);
      setArchivedCount(12); // Mock archived count
    } catch (error) {
      console.error('Error loading waste candidates:', error);
      toast({
        title: "Error",
        description: "Failed to load waste radar data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveCandidate = async (candidateId: string) => {
    try {
      setCandidates(candidates.filter(c => c.id !== candidateId));
      setArchivedCount(prev => prev + 1);
      
      toast({
        title: "Student archived",
        description: "Student removed from active counselor lists",
      });
    } catch (error) {
      console.error('Error archiving candidate:', error);
      toast({
        title: "Error",
        description: "Failed to archive student",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'duplicate': return 'bg-red-100 text-red-800 border-red-200';
      case 'cold': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'wrong_intake': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'spam': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'duplicate': return 'Duplicate';
      case 'cold': return 'Cold Lead';
      case 'wrong_intake': return 'Wrong Intake';
      case 'spam': return 'Spam/Test';
      default: return 'Other';
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesFilter = filterReason === 'all' || candidate.status === filterReason;
    const matchesSearch = candidate.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.program.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Capacity Management</h1>
        <p className="text-muted-foreground">
          Waste Radar - Remove duplicates, cold leads, and wrong-intake students so counselors focus on high-value prospects
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Radar className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Flagged for Review</p>
                <p className="text-2xl font-bold">{candidates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Archive className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Archived This Month</p>
                <p className="text-2xl font-bold">{archivedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Time Saved</p>
                <p className="text-2xl font-bold">24h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Efficiency Gain</p>
                <p className="text-2xl font-bold">18%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Explanation */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <h3 className="font-medium mb-2">How Waste Radar Works</h3>
          <p className="text-sm text-muted-foreground">
            The system automatically identifies students who may be wasting counselor time: 
            duplicates, extremely cold leads, students looking for different programs, 
            and test/spam entries. Archive these to make the Today list shorter and more valuable.
          </p>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label className="text-sm mb-2 block">Search Students</Label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search by name or program..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-sm mb-2 block">Filter by Reason</Label>
              <Select value={filterReason} onValueChange={setFilterReason}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reasons</SelectItem>
                  <SelectItem value="duplicate">Duplicates</SelectItem>
                  <SelectItem value="cold">Cold Leads</SelectItem>
                  <SelectItem value="wrong_intake">Wrong Intake</SelectItem>
                  <SelectItem value="spam">Spam/Test</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Waste Candidates ({filteredCandidates.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredCandidates.length === 0 ? (
            <div className="p-8 text-center">
              <Archive className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">All clean!</h3>
              <p className="text-muted-foreground">
                No waste candidates found. Your student list is optimized for counselor efficiency.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredCandidates.map((candidate) => (
                <div key={candidate.id} className="p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{candidate.student_name}</span>
                        <Badge variant="outline" className={getStatusColor(candidate.status)}>
                          {getStatusLabel(candidate.status)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{candidate.program}</span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{candidate.reason}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Last contact: {new Date(candidate.last_contact).toLocaleDateString()}</span>
                        <span>Score: {candidate.score}/10</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleArchiveCandidate(candidate.id)}
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}