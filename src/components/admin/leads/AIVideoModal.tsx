import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Video, Mic, MicOff, VideoOff, Phone, 
  Settings, Users, Clock, Calendar 
} from 'lucide-react';

interface AIVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadName: string;
  leadEmail: string;
}

export function AIVideoModal({ isOpen, onClose, leadName, leadEmail }: AIVideoModalProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [meetingStatus, setMeetingStatus] = useState<'waiting' | 'connecting' | 'connected'>('waiting');

  const handleStartMeeting = () => {
    setMeetingStatus('connecting');
    // Simulate connection delay
    setTimeout(() => {
      setMeetingStatus('connected');
    }, 2000);
  };

  const handleEndMeeting = () => {
    setMeetingStatus('waiting');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Meeting - {leadName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex gap-4">
          {/* Main Video Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-black rounded-lg relative flex items-center justify-center">
              {meetingStatus === 'waiting' && (
                <div className="text-center text-white">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Ready to start meeting</h3>
                  <p className="text-gray-300 mb-4">Click start to begin the video call</p>
                  <Button onClick={handleStartMeeting} className="bg-green-600 hover:bg-green-700">
                    Start Meeting
                  </Button>
                </div>
              )}
              
              {meetingStatus === 'connecting' && (
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold mb-2">Connecting...</h3>
                  <p className="text-gray-300">Please wait while we establish the connection</p>
                </div>
              )}
              
              {meetingStatus === 'connected' && (
                <div className="text-center text-white">
                  <div className="relative">
                    <div className="w-64 h-48 bg-gray-800 rounded-lg mb-4 mx-auto flex items-center justify-center">
                      <Users className="h-16 w-16 opacity-50" />
                    </div>
                    <Badge className="absolute top-2 left-2 bg-green-600">
                      <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                      Live
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold">Meeting in progress</h3>
                  <p className="text-gray-300">Connected with {leadName}</p>
                </div>
              )}

              {/* Meeting Controls */}
              {meetingStatus === 'connected' && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                  <Button
                    variant={isAudioEnabled ? "default" : "destructive"}
                    size="sm"
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  >
                    {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={isVideoEnabled ? "default" : "destructive"}
                    size="sm"
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  >
                    {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleEndMeeting}>
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel */}
          <div className="w-72 space-y-4">
            {/* Lead Info */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Meeting Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{leadName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Started at {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">AI Meeting Insights</h4>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-blue-50 rounded text-blue-800">
                    💡 Lead shows high interest in MBA program
                  </div>
                  <div className="p-2 bg-green-50 rounded text-green-800">
                    ✅ Positive sentiment detected
                  </div>
                  <div className="p-2 bg-yellow-50 rounded text-yellow-800">
                    ⏰ Best time to discuss pricing
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    📧 Send follow-up email
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    📅 Schedule next meeting
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    📋 Add to sequence
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}