
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InfoIcon, Search } from "lucide-react";

const AIAuditTrail: React.FC = () => {
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  
  // Mock data - in a real app, this would come from an API
  const assignments = [
    { 
      id: "A-4821", 
      lead: "Bright Future Academy", 
      assigned: "John Smith", 
      date: "Today, 11:23 AM", 
      confidence: "High",
      factors: [
        { name: "Program match conversion rate", value: "38%", influence: "High" },
        { name: "Timezone alignment", value: "12-hour match", influence: "Medium" },
        { name: "Prior closes from source", value: "2 deals", influence: "Medium" },
        { name: "Industry expertise", value: "Education", influence: "Low" }
      ]
    },
    { 
      id: "A-4820", 
      lead: "Modern Solutions Inc", 
      assigned: "Amy Johnson", 
      date: "Today, 10:05 AM", 
      confidence: "Very High",
      factors: [
        { name: "Response time history", value: "4.2 hours avg", influence: "Very High" },
        { name: "Lead source expertise", value: "27 similar leads", influence: "High" },
        { name: "Deal value alignment", value: "$25k-50k range", influence: "Medium" },
        { name: "Geographic proximity", value: "Same region", influence: "Low" }
      ]
    },
    { 
      id: "A-4819", 
      lead: "Global Logistics Partners", 
      assigned: "David Chen", 
      date: "Today, 9:17 AM", 
      confidence: "Medium",
      factors: [
        { name: "Industry expertise", value: "Logistics", influence: "High" },
        { name: "Workload balance", value: "3 active leads", influence: "Medium" },
        { name: "Prior company interactions", value: "1 prior deal", influence: "Medium" },
        { name: "Contact preferences match", value: "Phone-first", influence: "Low" }
      ]
    },
    { 
      id: "A-4818", 
      lead: "Healthcare Innovations", 
      assigned: "Sarah Lee", 
      date: "Yesterday, 3:42 PM", 
      confidence: "High",
      factors: [
        { name: "Specialization match", value: "Healthcare", influence: "Very High" },
        { name: "Recent conversion rate", value: "43%", influence: "High" },
        { name: "Lead source familiarity", value: "15 prior leads", influence: "Medium" },
        { name: "Response time average", value: "2.8 hours", influence: "Low" }
      ]
    },
    { 
      id: "A-4817", 
      lead: "Tech Innovate Solutions", 
      assigned: "Michael Kim", 
      date: "Yesterday, 1:15 PM", 
      confidence: "Medium",
      factors: [
        { name: "Product knowledge match", value: "Enterprise solution", influence: "High" },
        { name: "Deal size expertise", value: "$50k+ deals", influence: "Medium" },
        { name: "Lead score history", value: "72% conversion", influence: "Medium" },
        { name: "Communication style", value: "Technical focus", influence: "Low" }
      ]
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>AI Assignment Audit Trail</CardTitle>
          <CardDescription>
            View the reasoning behind AI lead assignment decisions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment ID</TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>AI Confidence</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.id}</TableCell>
                    <TableCell>{assignment.lead}</TableCell>
                    <TableCell>{assignment.assigned}</TableCell>
                    <TableCell>{assignment.date}</TableCell>
                    <TableCell>
                      <Badge className={
                        assignment.confidence === "Very High" ? "bg-green-100 text-green-800" :
                        assignment.confidence === "High" ? "bg-emerald-100 text-emerald-800" :
                        "bg-yellow-100 text-yellow-800"
                      }>
                        {assignment.confidence}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setSelectedAssignment(assignment)}
                      >
                        <InfoIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 flex justify-end">
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
      
      <Dialog open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Assignment Decision Factors</DialogTitle>
            <DialogDescription>
              {selectedAssignment && (
                <>
                  Lead <span className="font-medium">{selectedAssignment.lead}</span> was assigned to <span className="font-medium">{selectedAssignment.assigned}</span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAssignment && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Assignment ID: {selectedAssignment.id}</h4>
                <p className="text-sm text-muted-foreground">
                  Assigned on {selectedAssignment.date} with {selectedAssignment.confidence} confidence
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Contributing Factors</h4>
                {selectedAssignment.factors.map((factor: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{factor.name}</p>
                      <p className="text-sm text-muted-foreground">{factor.value}</p>
                    </div>
                    <Badge className={
                      factor.influence === "Very High" ? "bg-indigo-100 text-indigo-800" :
                      factor.influence === "High" ? "bg-blue-100 text-blue-800" :
                      factor.influence === "Medium" ? "bg-teal-100 text-teal-800" :
                      "bg-gray-100 text-gray-800"
                    }>
                      {factor.influence} influence
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIAuditTrail;
