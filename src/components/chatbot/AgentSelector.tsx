import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronLeft } from 'lucide-react';
import { AIAgent, AIAgentType } from '@/types/chatbot';

interface AgentSelectorProps {
  agents: AIAgent[];
  activeAgent: AIAgentType;
  onSelectAgent: (agentId: string) => void;
  onBackToChat: () => void;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  agents,
  activeAgent,
  onSelectAgent,
  onBackToChat
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Back button */}
      <div className="p-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToChat}
          className="gap-2"
        >
          <ChevronLeft size={16} />
          Back to Chat
        </Button>
      </div>

      {/* Agents list */}
      <ScrollArea className="flex-1 bg-gradient-to-b from-background to-muted/30">
        <div className="p-4 space-y-4">
          {agents.map((agent, index) => (
            <div
              key={agent.id}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-soft hover:shadow-medium animate-stagger ${
                agent.id === activeAgent
                  ? 'border-primary bg-gradient-primary text-primary-foreground shadow-large'
                  : 'border-border/50 hover:border-primary/50 bg-card hover:bg-gradient-elevated'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onSelectAgent(agent.id)}
            >
              <div className="flex items-start gap-4">
                <Avatar className="w-14 h-14 shrink-0 ring-2 ring-border/30 shadow-medium">
                  <AvatarFallback 
                    className="text-sm text-white font-medium" 
                    style={{ backgroundColor: agent.color }}
                  >
                    <img 
                      src={agent.avatar} 
                      alt={agent.name}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    <span style={{ display: 'none' }}>
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`font-semibold text-base ${
                      agent.id === activeAgent ? 'text-primary-foreground' : 'text-foreground'
                    }`}>
                      {agent.name}
                    </h3>
                    {agent.id === activeAgent && (
                      <Badge variant="secondary" className="text-xs bg-white/20 text-primary-foreground border-white/30">
                        ✨ Active
                      </Badge>
                    )}
                  </div>
                  
                  <p className={`text-sm mb-3 line-clamp-2 ${
                    agent.id === activeAgent ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}>
                    {agent.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {agent.capabilities.slice(0, 2).map((capability, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={`text-xs px-2 py-1 transition-all duration-200 ${
                          agent.id === activeAgent 
                            ? 'border-white/30 text-primary-foreground bg-white/10' 
                            : 'border-border/50 bg-muted/50'
                        }`}
                        style={agent.id !== activeAgent ? { borderColor: agent.color } : {}}
                      >
                        {capability}
                      </Badge>
                    ))}
                    {agent.capabilities.length > 2 && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-2 py-1 ${
                          agent.id === activeAgent 
                            ? 'border-white/30 text-primary-foreground bg-white/10' 
                            : 'border-border/50 bg-muted/50'
                        }`}
                      >
                        +{agent.capabilities.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className={`text-2xl transition-transform duration-200 ${
                  agent.id === activeAgent ? 'scale-110' : ''
                }`}>
                  {agent.id === activeAgent ? '✨' : '👋'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};