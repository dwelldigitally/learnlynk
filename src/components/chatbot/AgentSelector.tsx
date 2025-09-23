import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                agent.id === activeAgent
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onSelectAgent(agent.id)}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                  style={{ backgroundColor: agent.color }}
                >
                  {agent.avatar}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{agent.name}</h3>
                    {agent.id === activeAgent && (
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {agent.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 2).map((capability, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: agent.color }}
                      >
                        {capability}
                      </Badge>
                    ))}
                    {agent.capabilities.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{agent.capabilities.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};