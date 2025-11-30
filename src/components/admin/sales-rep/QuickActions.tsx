import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { 
  Phone, 
  Mail, 
  Calendar, 
  Plus,
  BarChart3,
  FileText,
  Users,
  Target,
  Settings
} from 'lucide-react';

export function QuickActions() {
  const isMobile = useIsMobile();

  const actions = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Make Call',
      description: 'Quick dial',
      bgColor: 'bg-[hsl(158,64%,90%)]',
      iconColor: 'text-[hsl(158,64%,40%)]',
      hoverBg: 'hover:bg-[hsl(158,64%,85%)]'
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Send Email',
      description: 'Compose',
      bgColor: 'bg-[hsl(200,80%,92%)]',
      iconColor: 'text-[hsl(200,80%,40%)]',
      hoverBg: 'hover:bg-[hsl(200,80%,87%)]'
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Schedule',
      description: 'Book meeting',
      bgColor: 'bg-[hsl(245,90%,94%)]',
      iconColor: 'text-primary',
      hoverBg: 'hover:bg-[hsl(245,90%,90%)]'
    },
    {
      icon: <Plus className="w-5 h-5" />,
      label: 'Add Lead',
      description: 'New prospect',
      bgColor: 'bg-[hsl(24,95%,92%)]',
      iconColor: 'text-[hsl(24,95%,45%)]',
      hoverBg: 'hover:bg-[hsl(24,95%,87%)]'
    }
  ];

  const reports = [
    { icon: <BarChart3 className="w-4 h-4" />, label: 'Daily Report', count: '3 pending' },
    { icon: <FileText className="w-4 h-4" />, label: 'Pipeline Review', count: 'Due today' },
    { icon: <Users className="w-4 h-4" />, label: 'Team Sync', count: '2:00 PM' }
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-[hsl(245,90%,94%)] rounded-lg">
          <Target className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-semibold text-sm text-foreground">Quick Actions</h3>
      </div>
      
      {/* Quick Action Buttons - HotSheet style */}
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className={cn(
              "h-auto p-4 flex flex-col items-center gap-2.5 rounded-2xl border-border transition-all duration-200",
              action.hoverBg,
              "hover:border-transparent hover:shadow-sm"
            )}
          >
            <div className={cn("p-2.5 rounded-xl", action.bgColor)}>
              <span className={action.iconColor}>{action.icon}</span>
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-foreground">{action.label}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{action.description}</div>
            </div>
          </Button>
        ))}
      </div>

      {/* Quick Reports - HotSheet style */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Today's Reports</h4>
        {reports.map((report, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-all duration-200 border border-transparent hover:border-border"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-muted rounded-lg">
                {report.icon}
              </div>
              <span className="text-sm text-foreground">{report.label}</span>
            </div>
            <Badge className="bg-muted text-muted-foreground border-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium">
              {report.count}
            </Badge>
          </div>
        ))}
      </div>

      {/* Settings Link - HotSheet style */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full justify-start rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50"
      >
        <Settings className="w-4 h-4 mr-2" />
        Dashboard Settings
      </Button>
    </div>
  );
}