import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, DollarSign, MapPin, Clock, FileText, GraduationCap } from "lucide-react";

interface Program {
  id: string;
  name: string;
  description: string;
  duration: string;
  type: string;
  campus: string;
  color: string;
  status: string;
  enrolled: number;
  capacity: number;
  tuitionFee: number;
  nextIntake: string;
  intakes: Array<{
    date: string;
    capacity: number;
    enrolled: number;
    status: string;
  }>;
}

interface ProgramViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
}

export const ProgramViewModal = ({ isOpen, onClose, program }: ProgramViewModalProps) => {
  if (!program) return null;

  const enrollmentPercentage = (program.enrolled / program.capacity) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: program.color }}
            />
            <div>
              <DialogTitle className="text-2xl">{program.name}</DialogTitle>
              <p className="text-muted-foreground">{program.type} • {program.duration}</p>
            </div>
            <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
              {program.status}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="intakes">Intakes</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Enrollment</p>
                      <p className="text-2xl font-bold">{program.enrolled}</p>
                      <p className="text-xs text-muted-foreground">of {program.capacity} capacity</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tuition Fee</p>
                      <p className="text-2xl font-bold">${(program.tuitionFee ?? 0).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Next Intake</p>
                      <p className="text-lg font-semibold">{new Date(program.nextIntake).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enrollment Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Enrollment Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Enrollment</span>
                    <span>{program.enrolled} / {program.capacity} ({enrollmentPercentage.toFixed(1)}%)</span>
                  </div>
                  <Progress value={enrollmentPercentage} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Program Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Program Description</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{program.description}</p>
              </CardContent>
            </Card>

            {/* Campus Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Campus & Logistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Campus Location</p>
                    <p className="font-medium">{program.campus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Program Duration</p>
                    <p className="font-medium">{program.duration}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="intakes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Intakes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(program.intakes || []).map((intake, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{new Date(intake.date).toLocaleDateString()}</h4>
                          <Badge variant={
                            intake.status === 'open' ? 'default' :
                            intake.status === 'planning' ? 'outline' : 'secondary'
                          }>
                            {intake.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Enrollment</span>
                            <span>{intake.enrolled} / {intake.capacity}</span>
                          </div>
                          <Progress 
                            value={(intake.enrolled / intake.capacity) * 100} 
                            className="h-2" 
                          />
                        </div>
                        
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Available Spots</span>
                          <span>{intake.capacity - intake.enrolled}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Admission Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Academic Prerequisites</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• High school diploma or equivalent</li>
                      <li>• Minimum 65% average in Grade 12 English</li>
                      <li>• Grade 12 Biology (recommended)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Required Documents</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Official transcripts</li>
                      <li>• Copy of government-issued ID</li>
                      <li>• Personal statement</li>
                      <li>• Two reference letters</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Additional Requirements</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• English proficiency test (if applicable)</li>
                      <li>• Criminal background check</li>
                      <li>• Health clearance (program-specific)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Program Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Program Structure</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Duration:</span>
                          <span>{program.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Credential Type:</span>
                          <span>{program.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Delivery Mode:</span>
                          <span>In-person</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Schedule</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Class Days:</span>
                          <span>Monday - Friday</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Class Hours:</span>
                          <span>9:00 AM - 3:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Financial Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tuition Fee:</span>
                          <span>${(program.tuitionFee ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Application Fee:</span>
                          <span>$150</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment Plans:</span>
                          <span>Available</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Career Outcomes</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>• 92% employment rate within 6 months</p>
                        <p>• Average starting salary: $45,000</p>
                        <p>• Industry partnerships for job placement</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};