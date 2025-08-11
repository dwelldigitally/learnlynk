import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronRight, 
  Users, 
  Plus,
  Edit,
  Move,
  Settings
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TeamNode {
  id: string;
  name: string;
  type: 'team' | 'department' | 'individual';
  members: number;
  manager?: string;
  children?: TeamNode[];
  isExpanded?: boolean;
  avatar?: string;
  role?: string;
  performance?: {
    efficiency: number;
    satisfaction: number;
  };
}

interface TeamHierarchyVisualizerProps {
  onEditNode?: (node: TeamNode) => void;
  onMoveNode?: (nodeId: string, newParentId: string) => void;
  onAddNode?: (parentId: string) => void;
}

const TeamHierarchyVisualizer: React.FC<TeamHierarchyVisualizerProps> = ({
  onEditNode,
  onMoveNode,
  onAddNode
}) => {
  const [orgData, setOrgData] = useState<TeamNode>({
    id: "org-root",
    name: "WCC Organization",
    type: "team",
    members: 25,
    manager: "Chief Executive",
    isExpanded: true,
    children: [
      {
        id: "dept-admissions",
        name: "Admissions Department",
        type: "department",
        members: 8,
        manager: "Robert Smith",
        isExpanded: true,
        performance: { efficiency: 92, satisfaction: 88 },
        children: [
          {
            id: "team-senior-advisors",
            name: "Senior Advisors",
            type: "team",
            members: 3,
            manager: "Nicole Adams",
            isExpanded: false,
            performance: { efficiency: 95, satisfaction: 91 },
            children: [
              {
                id: "member-nicole",
                name: "Nicole Adams",
                type: "individual",
                members: 1,
                role: "Senior Admissions Advisor",
                avatar: "/src/assets/advisor-nicole.jpg",
                performance: { efficiency: 96, satisfaction: 93 }
              },
              {
                id: "member-john",
                name: "John Parker",
                type: "individual",
                members: 1,
                role: "Senior Admissions Advisor",
                performance: { efficiency: 94, satisfaction: 89 }
              }
            ]
          },
          {
            id: "team-junior-advisors",
            name: "Junior Advisors",
            type: "team",
            members: 5,
            manager: "Sarah Kim",
            isExpanded: false,
            performance: { efficiency: 87, satisfaction: 85 }
          }
        ]
      },
      {
        id: "dept-finance",
        name: "Finance Department",
        type: "department",
        members: 6,
        manager: "Sarah Kim",
        isExpanded: false,
        performance: { efficiency: 89, satisfaction: 92 }
      },
      {
        id: "dept-marketing",
        name: "Marketing Department",
        type: "department",
        members: 4,
        manager: "Ahmed Hassan",
        isExpanded: false,
        performance: { efficiency: 91, satisfaction: 87 }
      },
      {
        id: "dept-academic",
        name: "Academic Department",
        type: "department",
        members: 7,
        manager: "Dr. Lisa Wong",
        isExpanded: false,
        performance: { efficiency: 94, satisfaction: 96 }
      }
    ]
  });

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  const toggleExpand = (nodeId: string) => {
    setOrgData(prev => updateNodeExpansion(prev, nodeId));
  };

  const updateNodeExpansion = (node: TeamNode, targetId: string): TeamNode => {
    if (node.id === targetId) {
      return { ...node, isExpanded: !node.isExpanded };
    }
    if (node.children) {
      return {
        ...node,
        children: node.children.map(child => updateNodeExpansion(child, targetId))
      };
    }
    return node;
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'individual':
        return <Avatar className="h-6 w-6">
          <AvatarFallback className="text-xs">{type[0].toUpperCase()}</AvatarFallback>
        </Avatar>;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const renderNode = (node: TeamNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode === node.id;

    return (
      <div key={node.id} className={cn("ml-4", level === 0 && "ml-0")}>
        <div
          className={cn(
            "flex items-center p-3 rounded-lg border transition-all cursor-pointer group",
            isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            draggedNode === node.id && "opacity-50"
          )}
          onClick={() => setSelectedNode(isSelected ? null : node.id)}
          draggable={node.type !== 'team' || level > 0}
          onDragStart={() => setDraggedNode(node.id)}
          onDragEnd={() => setDraggedNode(null)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (draggedNode && draggedNode !== node.id) {
              onMoveNode?.(draggedNode, node.id);
              setDraggedNode(null);
            }
          }}
        >
          <div className="flex items-center flex-1 space-x-3">
            {hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(node.id);
                }}
              >
                {node.isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            ) : (
              <div className="w-6" />
            )}

            {getNodeIcon(node.type)}

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-sm">{node.name}</h4>
                <Badge variant="outline" className="text-xs">
                  {node.type === 'individual' ? node.role : `${node.members} members`}
                </Badge>
              </div>
              {node.manager && node.type !== 'individual' && (
                <p className="text-xs text-muted-foreground">Manager: {node.manager}</p>
              )}
              {node.performance && (
                <div className="flex space-x-4 mt-1">
                  <span className={cn("text-xs", getPerformanceColor(node.performance.efficiency))}>
                    Efficiency: {node.performance.efficiency}%
                  </span>
                  <span className={cn("text-xs", getPerformanceColor(node.performance.satisfaction))}>
                    Satisfaction: {node.performance.satisfaction}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onAddNode?.(node.id);
              }}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onEditNode?.(node);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            {node.type !== 'team' || level > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 cursor-move"
              >
                <Move className="h-3 w-3" />
              </Button>
            ) : null}
          </div>
        </div>

        {hasChildren && node.isExpanded && (
          <div className="mt-2 space-y-2">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Team Hierarchy</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Team
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {renderNode(orgData)}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamHierarchyVisualizer;