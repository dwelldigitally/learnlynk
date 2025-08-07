import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { 
  Phone, 
  Mail, 
  Calendar, 
  Users, 
  Target, 
  TrendingUp,
  Plus,
  BarChart3,
  FileText,
  Settings
} from 'lucide-react';

export function QuickActions() {
  const isMobile = useIsMobile();

  const actions = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Make Call',
      description: 'Quick dial',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Send Email',
      description: 'Compose',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Schedule',
      description: 'Book meeting',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      icon: <Plus className="w-5 h-5" />,
      label: 'Add Lead',
      description: 'New prospect',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    }
  ];

  const reports = [
    { icon: <BarChart3 className="w-4 h-4" />, label: 'Daily Report', count: '3 pending' },
    { icon: <FileText className="w-4 h-4" />, label: 'Pipeline Review', count: 'Due today' },
    { icon: <Users className="w-4 h-4" />, label: 'Team Sync', count: '2:00 PM' }
  ];

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="w-4 h-4" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={cn(
                "h-auto p-3 flex flex-col items-center gap-2 border-2 transition-all duration-200",
                "hover:border-transparent hover:text-white",
                action.hoverColor
              )}
            >
              <div className={cn("p-2 rounded-lg text-white", action.color)}>
                {action.icon}
              </div>
              <div className="text-center">
                <div className="text-xs font-medium">{action.label}</div>
                <div className="text-xs opacity-70">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Quick Reports */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Today's Reports</h4>
          {reports.map((report, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                {report.icon}
                <span className="text-sm">{report.label}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {report.count}
              </Badge>
            </div>
          ))}
        </div>

        {/* Settings Link */}
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Settings className="w-4 h-4 mr-2" />
          Dashboard Settings
        </Button>
      </CardContent>
    </Card>
  );
}