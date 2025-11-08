import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, Calendar as CalendarIcon, MapPin, GraduationCap, Filter } from "lucide-react";
import { StudentFilters } from "@/services/studentService";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AdvancedFiltersProps {
  filters: StudentFilters;
  onFilterChange: (filters: StudentFilters) => void;
  onClearFilters: () => void;
}

const PROGRAMS = [
  "Computer Science",
  "Business Administration",
  "Engineering",
  "Medicine",
  "Law",
  "Arts & Humanities",
  "Data Science",
  "MBA",
];

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "India",
  "China",
  "Brazil",
  "Mexico",
];

export function AdvancedFilters({ filters, onFilterChange, onClearFilters }: AdvancedFiltersProps) {
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>(
    filters.programs || []
  );
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    filters.countries || []
  );
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    filters.date_from ? new Date(filters.date_from) : undefined
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    filters.date_to ? new Date(filters.date_to) : undefined
  );

  const toggleProgram = (program: string) => {
    const newPrograms = selectedPrograms.includes(program)
      ? selectedPrograms.filter((p) => p !== program)
      : [...selectedPrograms, program];
    
    setSelectedPrograms(newPrograms);
    onFilterChange({
      ...filters,
      programs: newPrograms.length > 0 ? newPrograms : undefined,
    });
  };

  const toggleCountry = (country: string) => {
    const newCountries = selectedCountries.includes(country)
      ? selectedCountries.filter((c) => c !== country)
      : [...selectedCountries, country];
    
    setSelectedCountries(newCountries);
    onFilterChange({
      ...filters,
      countries: newCountries.length > 0 ? newCountries : undefined,
    });
  };

  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date);
    onFilterChange({
      ...filters,
      date_from: date ? date.toISOString() : undefined,
    });
  };

  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date);
    onFilterChange({
      ...filters,
      date_to: date ? date.toISOString() : undefined,
    });
  };

  const clearAllFilters = () => {
    setSelectedPrograms([]);
    setSelectedCountries([]);
    setDateFrom(undefined);
    setDateTo(undefined);
    onClearFilters();
  };

  const activeFiltersCount = 
    selectedPrograms.length + 
    selectedCountries.length + 
    (dateFrom ? 1 : 0) + 
    (dateTo ? 1 : 0);

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Advanced Filters</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Program Multi-Select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              Program
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between text-left font-normal",
                    selectedPrograms.length === 0 && "text-muted-foreground"
                  )}
                >
                  <span className="truncate">
                    {selectedPrograms.length === 0
                      ? "Select programs..."
                      : `${selectedPrograms.length} selected`}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0" align="start">
                <div className="max-h-[300px] overflow-y-auto p-4 space-y-2">
                  {PROGRAMS.map((program) => (
                    <div key={program} className="flex items-center space-x-2">
                      <Checkbox
                        id={`program-${program}`}
                        checked={selectedPrograms.includes(program)}
                        onCheckedChange={() => toggleProgram(program)}
                      />
                      <label
                        htmlFor={`program-${program}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {program}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {selectedPrograms.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedPrograms.map((program) => (
                  <Badge
                    key={program}
                    variant="secondary"
                    className="text-xs cursor-pointer hover:bg-secondary/80"
                    onClick={() => toggleProgram(program)}
                  >
                    {program}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Country Multi-Select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Country
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between text-left font-normal",
                    selectedCountries.length === 0 && "text-muted-foreground"
                  )}
                >
                  <span className="truncate">
                    {selectedCountries.length === 0
                      ? "Select countries..."
                      : `${selectedCountries.length} selected`}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0" align="start">
                <div className="max-h-[300px] overflow-y-auto p-4 space-y-2">
                  {COUNTRIES.map((country) => (
                    <div key={country} className="flex items-center space-x-2">
                      <Checkbox
                        id={`country-${country}`}
                        checked={selectedCountries.includes(country)}
                        onCheckedChange={() => toggleCountry(country)}
                      />
                      <label
                        htmlFor={`country-${country}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {country}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {selectedCountries.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedCountries.map((country) => (
                  <Badge
                    key={country}
                    variant="secondary"
                    className="text-xs cursor-pointer hover:bg-secondary/80"
                    onClick={() => toggleCountry(country)}
                  >
                    {country}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Date From */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              From Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={handleDateFromChange}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {dateFrom && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => handleDateFromChange(undefined)}
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              To Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={handleDateToChange}
                  initialFocus
                  disabled={(date) => dateFrom ? date < dateFrom : false}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {dateTo && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => handleDateToChange(undefined)}
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
