import React, { useState, useEffect } from 'react';
import { StudentPortalService, StudentPortal } from '@/services/studentPortalService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ExternalLink, Search, Users, GraduationCap, Calendar, Copy } from 'lucide-react';

export function StudentPortalsDashboard() {
  const [portals, setPortals] = useState<StudentPortal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPortals();
  }, []);

  const fetchPortals = async () => {
    try {
      setLoading(true);
      const data = await StudentPortalService.getAllPortals();
      setPortals(data);
    } catch (error) {
      console.error('Error fetching portals:', error);
      toast({
        title: "Error",
        description: "Failed to load student portals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPortals = portals.filter(portal =>
    portal.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portal.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portal.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyAccessToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast({
      title: "Copied!",
      description: "Access token copied to clipboard",
    });
  };

  const openPortal = (accessToken: string) => {
    window.open(`/student-portal/${accessToken}`, '_blank');
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "default" : "secondary"}>
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  const stats = {
    total: portals.length,
    active: portals.filter(p => p.is_active).length,
    programs: new Set(portals.map(p => p.program)).size,
    thisMonth: portals.filter(p => {
      const created = new Date(p.created_at);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-primary">Student Portals</h2>
        <p className="text-muted-foreground">
          Manage and monitor student portal access and activity
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Portals</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programs</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.programs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonth}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Portal Management</CardTitle>
          <CardDescription>
            Search and manage student portals created through applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Intake Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPortals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No student portals found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPortals.map((portal) => (
                    <TableRow key={portal.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{portal.student_name}</div>
                          <div className="text-sm text-muted-foreground">{portal.email}</div>
                          {portal.country && (
                            <div className="text-xs text-muted-foreground">{portal.country}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{portal.program}</Badge>
                      </TableCell>
                      <TableCell>
                        {portal.intake_date 
                          ? new Date(portal.intake_date).toLocaleDateString()
                          : 'Not specified'
                        }
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(portal.is_active)}
                      </TableCell>
                      <TableCell>
                        {new Date(portal.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPortal(portal.access_token)}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyAccessToken(portal.access_token)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredPortals.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredPortals.length} of {portals.length} portals
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}