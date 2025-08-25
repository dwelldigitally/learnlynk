import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Phone, Mail, MapPin, Calendar, MessageSquare, FileText, User, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';

interface StudentData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  program: string;
  yield_score: number;
  yield_band: string;
  location?: string;
  source?: string;
  last_contacted?: string;
  stage?: string;
  notes?: string[];
  communication_history?: Array<{
    type: string;
    date: string;
    subject: string;
    outcome?: string;
  }>;
  preferences?: {
    best_contact_time?: string;
    preferred_method?: string;
    timezone?: string;
  };
}

interface StudentPreviewPanelProps {
  studentId: string;
  onClose: () => void;
}

export function StudentPreviewPanel({ studentId, onClose }: StudentPreviewPanelProps) {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, [studentId]);

  const loadStudentData = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockStudent: StudentData = {
        id: studentId,
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "+1 (555) 123-4567",
        program: "Computer Science MS",
        yield_score: 85,
        yield_band: "high",
        location: "New York, NY",
        source: "Website Form",
        last_contacted: "2024-01-15T10:30:00Z",
        stage: "Application Review",
        notes: [
          "Interested in AI/ML concentration",
          "Has background in software development",
          "Prefers evening calls after 6 PM EST"
        ],
        communication_history: [
          {
            type: "email",
            date: "2024-01-15T10:30:00Z",
            subject: "Application Status Update",
            outcome: "Opened, no reply"
          },
          {
            type: "call",
            date: "2024-01-10T16:45:00Z",
            subject: "Initial consultation call",
            outcome: "Connected, 15 min discussion"
          },
          {
            type: "email",
            date: "2024-01-08T09:15:00Z",
            subject: "Welcome and next steps",
            outcome: "Replied with questions"
          }
        ],
        preferences: {
          best_contact_time: "6:00 PM - 8:00 PM EST",
          preferred_method: "Phone call",
          timezone: "America/New_York"
        }
      };

      setStudent(mockStudent);
    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="space-y-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!student) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Student not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{student.name}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            variant="outline"
            className={`${
              student.yield_band === 'high' ? 'bg-green-50 text-green-700 border-green-200' :
              student.yield_band === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
              'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {student.yield_score}% Yield Score
          </Badge>
          <Badge variant="secondary">{student.stage}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4">
            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
                <User className="h-4 w-4 mr-1" />
                Contact Information
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span>{student.email}</span>
                </div>
                {student.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span>{student.phone}</span>
                  </div>
                )}
                {student.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>{student.location}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Program & Status */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
                <GraduationCap className="h-4 w-4 mr-1" />
                Program Information
              </h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Program:</span> {student.program}</p>
                <p><span className="font-medium">Source:</span> {student.source}</p>
                {student.last_contacted && (
                  <p><span className="font-medium">Last Contact:</span> {format(new Date(student.last_contacted), 'MMM d, yyyy h:mm a')}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Communication Preferences */}
            {student.preferences && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Communication Preferences
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Best Time:</span> {student.preferences.best_contact_time}</p>
                    <p><span className="font-medium">Preferred Method:</span> {student.preferences.preferred_method}</p>
                    <p><span className="font-medium">Timezone:</span> {student.preferences.timezone}</p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Notes */}
            {student.notes && student.notes.length > 0 && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    Notes
                  </h3>
                  <div className="space-y-1">
                    {student.notes.map((note, index) => (
                      <p key={index} className="text-sm text-muted-foreground">• {note}</p>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Recent Communication */}
            {student.communication_history && student.communication_history.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Recent Communication
                </h3>
                <div className="space-y-2">
                  {student.communication_history.slice(0, 3).map((comm, index) => (
                    <div key={index} className="p-2 bg-muted/50 rounded text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {comm.type === 'email' ? 
                            <Mail className="h-3 w-3" /> : 
                            <Phone className="h-3 w-3" />
                          }
                          <span className="font-medium">{comm.type}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comm.date), 'MMM d')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{comm.subject}</p>
                      {comm.outcome && (
                        <p className="text-xs text-green-600 mt-1">→ {comm.outcome}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}