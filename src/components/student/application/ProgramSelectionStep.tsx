import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, MapPin, Calendar, Users, Star, TrendingUp, Monitor, Building, RefreshCw } from "lucide-react";
import { STANDARDIZED_PROGRAMS, PROGRAM_DETAILS, StandardizedProgram } from "@/constants/programs";
import { getUpcomingIntakeDatesForProgram } from "@/constants/intakeDates";

interface ProgramSelectionStepProps {
  onSelect: (program: StandardizedProgram) => void;
  selectedProgram?: StandardizedProgram;
}

const ProgramSelectionStep: React.FC<ProgramSelectionStepProps> = ({
  onSelect,
  selectedProgram
}) => {
  const [hoveredProgram, setHoveredProgram] = useState<string | null>(null);

  const getProgramStats = (program: StandardizedProgram) => {
    const upcomingIntakes = getUpcomingIntakeDatesForProgram(program);
    const nextIntake = upcomingIntakes[0];
    
    return {
      nextIntake: nextIntake ? new Date(nextIntake.date).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      }) : 'Contact for dates',
      availableSpots: nextIntake ? nextIntake.capacity - nextIntake.enrolled : 0,
      totalIntakes: upcomingIntakes.length
    };
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Choose Your Program
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select the program that aligns with your career goals. Each program offers unique opportunities and pathways to success.
        </p>
      </div>

      {/* Program Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {STANDARDIZED_PROGRAMS.map((program) => {
          const details = PROGRAM_DETAILS[program];
          const stats = getProgramStats(program);
          const isSelected = selectedProgram === program;
          const isHovered = hoveredProgram === program;

          return (
            <Card
              key={program}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                isSelected 
                  ? 'ring-2 ring-primary border-primary bg-primary/5' 
                  : 'hover:border-primary/50'
              }`}
              onMouseEnter={() => setHoveredProgram(program)}
              onMouseLeave={() => setHoveredProgram(null)}
              onClick={() => onSelect(program)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold mb-2 line-clamp-2">
                      {program}
                    </CardTitle>
                    <Badge variant="secondary" className="mb-3">
                      {details.type}
                    </Badge>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    </div>
                  )}
                </div>

                {/* Program Description */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {details.description}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Key Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{details.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    <span className="text-xs">
                      ${details.domesticFee.toLocaleString()} - ${details.internationalFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{stats.nextIntake}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{stats.availableSpots} spots</span>
                  </div>
                </div>

                {/* Delivery Methods */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Delivery Options:</h4>
                  <div className="flex flex-wrap gap-1">
                    {details.deliveryMethods.map((method, index) => (
                      <Badge key={index} variant="outline" className="text-xs flex items-center gap-1">
                        {method === 'Online' && <Monitor className="w-3 h-3" />}
                        {method === 'In-class' && <Building className="w-3 h-3" />}
                        {method === 'Hybrid' && <RefreshCw className="w-3 h-3" />}
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Campus Locations */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Campus Locations:</h4>
                  <div className="flex flex-wrap gap-1">
                    {details.campusLocations.map((campus, index) => (
                      <Badge key={index} variant="outline" className="text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {campus}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className={`w-full transition-all duration-300 ${
                    isSelected || isHovered
                      ? 'bg-primary hover:bg-primary/90'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(program);
                  }}
                >
                  {isSelected ? 'Selected' : 'Select Program'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Help Section */}
      <div className="bg-muted/30 rounded-xl p-8 text-center">
        <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Need Help Choosing?</h3>
        <p className="text-muted-foreground mb-4">
          Our program advisors can help you find the perfect fit based on your interests and career goals.
        </p>
        <Button variant="outline">
          Speak with an Advisor
        </Button>
      </div>
    </div>
  );
};

export default ProgramSelectionStep;