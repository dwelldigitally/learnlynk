import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  User, 
  MapPin, 
  Tag, 
  Activity, 
  Calendar,
  Mail,
  Settings,
  TrendingUp,
  Target,
  Zap,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { Lead, LEAD_PROPERTY_CATEGORIES, LEAD_PROPERTY_METADATA } from '@/types/lead';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface LeadAllPropertiesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
}

const categoryIcons: Record<string, React.ReactNode> = {
  personal: <User className="h-4 w-4" />,
  location: <MapPin className="h-4 w-4" />,
  classification: <Tag className="h-4 w-4" />,
  scores: <TrendingUp className="h-4 w-4" />,
  activity: <Activity className="h-4 w-4" />,
  engagement: <Clock className="h-4 w-4" />,
  conversion: <Target className="h-4 w-4" />,
  assignment: <User className="h-4 w-4" />,
  program: <FileText className="h-4 w-4" />,
  marketing: <Zap className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  system: <Settings className="h-4 w-4" />,
  ai: <Sparkles className="h-4 w-4" />,
  tags: <Tag className="h-4 w-4" />,
};

export function LeadAllPropertiesModal({ open, onOpenChange, lead }: LeadAllPropertiesModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [userNames, setUserNames] = useState<Record<string, string>>({});

  // Fetch user names for user ID fields
  useEffect(() => {
    const fetchUserNames = async () => {
      const userIds = [lead.created_by_user_id, lead.updated_by_user_id, lead.assigned_to].filter(Boolean) as string[];
      if (userIds.length === 0) return;

      const { data } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, email')
        .in('user_id', userIds);

      if (data) {
        const names: Record<string, string> = {};
        data.forEach(p => {
          names[p.user_id] = [p.first_name, p.last_name].filter(Boolean).join(' ') || p.email || 'Unknown';
        });
        setUserNames(names);
      }
    };

    if (open) {
      fetchUserNames();
    }
  }, [open, lead]);

  const formatValue = (key: string, value: any): string => {
    if (value === null || value === undefined) return '—';
    
    const metadata = LEAD_PROPERTY_METADATA[key];
    
    // Handle user ID fields - show name instead of ID
    if (key === 'assigned_to' || key === 'created_by_user_id' || key === 'updated_by_user_id') {
      return userNames[value] || value;
    }
    
    if (metadata?.type === 'datetime' || metadata?.type === 'date') {
      try {
        return format(new Date(value), 'MMM d, yyyy h:mm a');
      } catch {
        return value;
      }
    }
    
    if (metadata?.type === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    if (metadata?.type === 'duration') {
      // Convert milliseconds to human-readable
      const ms = Number(value);
      if (isNaN(ms)) return value;
      
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 24) {
        const days = Math.floor(hours / 24);
        return `${days}d ${hours % 24}h`;
      }
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    }
    
    if (metadata?.type === 'array') {
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join(', ') : '—';
      }
      return value;
    }
    
    return String(value);
  };

  const renderProperty = (key: string, value: any) => {
    const metadata = LEAD_PROPERTY_METADATA[key];
    const label = metadata?.label || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const formattedValue = formatValue(key, value);
    const isAutomatic = metadata?.editable === false;
    
    // Filter by search
    if (searchQuery && !label.toLowerCase().includes(searchQuery.toLowerCase())) {
      return null;
    }

    return (
      <div key={key} className="flex flex-col gap-1 py-3 border-b border-border/50 last:border-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {isAutomatic && (
            <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 text-muted-foreground">
              Auto
            </Badge>
          )}
        </div>
        <span className={cn(
          "text-sm",
          formattedValue === '—' ? "text-muted-foreground" : "text-foreground"
        )}>
          {formattedValue}
        </span>
        {metadata?.description && (
          <span className="text-xs text-muted-foreground">{metadata.description}</span>
        )}
      </div>
    );
  };

  const renderCategory = (categoryKey: string, category: { label: string; properties: readonly string[] }) => {
    const properties = category.properties.map(prop => renderProperty(prop, (lead as any)[prop])).filter(Boolean);
    
    if (properties.length === 0 && searchQuery) return null;

    return (
      <div key={categoryKey} className="mb-6">
        <div className="flex items-center gap-2 mb-3 sticky top-0 bg-background py-2">
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
            {categoryIcons[categoryKey]}
          </div>
          <h3 className="font-semibold text-sm">{category.label}</h3>
          <Badge variant="secondary" className="text-xs ml-auto">
            {category.properties.length}
          </Badge>
        </div>
        <div className="space-y-0">
          {properties.length > 0 ? properties : (
            <p className="text-sm text-muted-foreground py-2">No properties in this category match your search.</p>
          )}
        </div>
      </div>
    );
  };

  const totalProperties = Object.values(LEAD_PROPERTY_CATEGORIES).reduce(
    (sum, cat) => sum + cat.properties.length, 
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            All Properties
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Viewing {totalProperties} properties for {lead.first_name} {lead.last_name}
          </p>
          
          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          {Object.entries(LEAD_PROPERTY_CATEGORIES).map(([key, category]) => 
            renderCategory(key, category)
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
