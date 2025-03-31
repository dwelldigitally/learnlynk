
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Clock, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UnengagedLeadsListProps {
  responseTimeThreshold: number;
}

const UnengagedLeadsList: React.FC<UnengagedLeadsListProps> = ({ responseTimeThreshold }) => {
  const { toast } = useToast();
  const [reassigning, setReassigning] = useState(false);
  
  // Mock data - in a real app, this would come from an API
  const unengagedLeads = [
    { id: "L-2458", name: "Horizon Tech", assigned: "David Chen", time: 12, source: "Website", reason: "No response" },
    { id: "L-2455", name: "Global Shipping Co", assigned: "Amy Johnson", time: 7, source: "Email", reason: "Response time exceeded" },
    { id: "L-2451", name: "NexGen Solutions", assigned: "Michael Kim", time: 9, source: "Referral", reason: "No response" },
    { id: "L-2447", name: "MediCare Plus", assigned: "Sarah Lee", time: 5, source: "Website", reason: "Response time exceeded" },
    { id: "L-2443", name: "EduSource Inc", assigned: "Amy Johnson", time: 16, source: "LinkedIn", reason: "No response" },
    { id: "L-2442", name: "Retail Solutions", assigned: "David Chen", time: 8, source: "Email", reason: "Response time exceeded" },
  ];
  
  const handleReassignAll = () => {
    setReassigning(true);
    
    setTimeout(() => {
      setReassigning(false);
      toast({
        title: "Leads Reassigned",
        description: `${unengagedLeads.length} leads have been reassigned based on current AI settings`,
      });
    }, 1500);
  };
  
  const handleReassignLead = (leadId: string) => {
    toast({
      title: "Lead Reassigned",
      description: `Lead ${leadId} has been reassigned to a new team member`,
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Unengaged Leads</CardTitle>
            <CardDescription>
              Leads that require attention or reassignment
            </CardDescription>
          </div>
          <Button onClick={handleReassignAll} disabled={reassigning}>
            {reassigning ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Reassigning...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reassign All
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Currently Assigned</TableHead>
                <TableHead>Waiting Time</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unengagedLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    <div>{lead.name}</div>
                    <div className="text-xs text-muted-foreground">{lead.id}</div>
                  </TableCell>
                  <TableCell>{lead.assigned}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-amber-500" />
                      <span>{lead.time} hours</span>
                    </div>
                  </TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      {lead.reason}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleReassignLead(lead.id)}
                    >
                      Reassign
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 flex items-center justify-end">
          <p className="text-sm text-muted-foreground mr-4">
            Showing leads unengaged for over {responseTimeThreshold} hours
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnengagedLeadsList;
