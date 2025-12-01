import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Upload, 
  X, 
  Plus, 
  ImageIcon,
  FileText,
  Type,
  Hash,
  Loader2
} from "lucide-react";
import { Program } from "@/types/program";
import { useActiveCampuses } from "@/hooks/useCampuses";

interface BasicInfoStepProps {
  data: Partial<Program>;
  onDataChange: (data: Partial<Program>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  data,
  onDataChange,
  onNext,
  onPrevious
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: campuses = [], isLoading: campusesLoading } = useActiveCampuses();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    onDataChange({
      name,
      urlSlug: generateSlug(name)
    });
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: `img_${Date.now()}_${Math.random()}`,
            url: e.target?.result as string,
            alt: `${data.name || 'Program'} image`,
            type: (data.images?.length === 0 ? 'hero' : 'gallery') as 'hero' | 'gallery' | 'thumbnail',
            order: data.images?.length || 0
          };

          onDataChange({
            images: [...(data.images || []), newImage]
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (imageId: string) => {
    onDataChange({
      images: data.images?.filter(img => img.id !== imageId) || []
    });
  };

  const setImageAsHero = (imageId: string) => {
    onDataChange({
      images: data.images?.map(img => ({
        ...img,
        type: img.id === imageId ? 'hero' : 'gallery'
      })) || []
    });
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !data.tags?.includes(tag.trim())) {
      onDataChange({
        tags: [...(data.tags || []), tag.trim()]
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    onDataChange({
      tags: data.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const addCampus = (campus: string) => {
    if (campus && !data.campus?.includes(campus)) {
      onDataChange({
        campus: [...(data.campus || []), campus]
      });
    }
  };

  const removeCampus = (campusToRemove: string) => {
    onDataChange({
      campus: data.campus?.filter(campus => campus !== campusToRemove) || []
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Basic Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="program-name" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Program Name *
            </Label>
            <Input
              id="program-name"
              value={data.name || ''}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Health Care Assistant"
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url-slug" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              URL Slug
            </Label>
            <Input
              id="url-slug"
              value={data.urlSlug || ''}
              onChange={(e) => onDataChange({ urlSlug: e.target.value })}
              placeholder="health-care-assistant"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              This will be used in the program URL: /programs/{data.urlSlug || 'program-slug'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Program Type *</Label>
              <Select
                value={data.type || ''}
                onValueChange={(value: any) => onDataChange({ type: value })}
              >
                <SelectTrigger className="min-h-[44px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="degree">Degree</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Duration *</Label>
              <Input
                value={data.duration || ''}
                onChange={(e) => onDataChange({ duration: e.target.value })}
                placeholder="e.g., 12 months"
                className="min-h-[44px]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Delivery Method</Label>
            <Select
              value={data.deliveryMethod || 'in-person'}
              onValueChange={(value: any) => onDataChange({ deliveryMethod: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Program Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="color"
                value={data.color || '#3B82F6'}
                onChange={(e) => onDataChange({ color: e.target.value })}
                className="w-16 h-10 p-1 rounded"
              />
              <Input
                value={data.color || '#3B82F6'}
                onChange={(e) => onDataChange({ color: e.target.value })}
                placeholder="#3B82F6"
                className="font-mono"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={data.category || ''}
              onValueChange={(value) => onDataChange({ category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="trades">Trades</SelectItem>
                <SelectItem value="aviation">Aviation</SelectItem>
                <SelectItem value="hospitality">Hospitality</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Campus Locations *</Label>
            <Select onValueChange={addCampus} disabled={campusesLoading}>
              <SelectTrigger>
                {campusesLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading campuses...
                  </span>
                ) : (
                  <SelectValue placeholder="Add campus" />
                )}
              </SelectTrigger>
              <SelectContent>
                {campuses.length === 0 ? (
                  <SelectItem value="no-campuses" disabled>
                    No campuses configured. Add campuses in Campus Management.
                  </SelectItem>
                ) : (
                  campuses.map((campus) => (
                    <SelectItem key={campus.id} value={campus.name}>
                      {campus.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.campus?.map((campus) => (
                <Badge key={campus} variant="secondary" className="flex items-center gap-1">
                  {campus}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeCampus(campus)}
                  />
                </Badge>
              ))}
            </div>
            {campuses.length === 0 && !campusesLoading && (
              <p className="text-xs text-muted-foreground">
                Configure campuses in System Configuration → Campuses to see them here.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <Input
              placeholder="Add tag and press Enter"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              {data.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Program Facts (Optional)</Label>
            <p className="text-xs text-muted-foreground mb-3">Add key statistics about the program</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Total Program Hours</Label>
                <Input
                  type="number"
                  value={data.programFacts?.totalProgramHours || ''}
                  onChange={(e) => onDataChange({ 
                    programFacts: { 
                      ...data.programFacts, 
                      totalProgramHours: e.target.value ? parseInt(e.target.value) : undefined 
                    } 
                  })}
                  placeholder="e.g., 900"
                  className="min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Practice Experience Hours</Label>
                <Input
                  type="number"
                  value={data.programFacts?.practiceExperienceHours || ''}
                  onChange={(e) => onDataChange({ 
                    programFacts: { 
                      ...data.programFacts, 
                      practiceExperienceHours: e.target.value ? parseInt(e.target.value) : undefined 
                    } 
                  })}
                  placeholder="e.g., 400"
                  className="min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Graduate Employment Rate (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={data.programFacts?.graduateEmploymentRate || ''}
                  onChange={(e) => onDataChange({ 
                    programFacts: { 
                      ...data.programFacts, 
                      graduateEmploymentRate: e.target.value ? parseFloat(e.target.value) : undefined 
                    } 
                  })}
                  placeholder="e.g., 95"
                  className="min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Graduate Employment Hourly Rate ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={data.programFacts?.graduateEmploymentHourlyRate || ''}
                  onChange={(e) => onDataChange({ 
                    programFacts: { 
                      ...data.programFacts, 
                      graduateEmploymentHourlyRate: e.target.value ? parseFloat(e.target.value) : undefined 
                    } 
                  })}
                  placeholder="e.g., 25.50"
                  className="min-h-[44px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Program Description *
          </Label>
          <Textarea
            id="description"
            value={data.description || ''}
            onChange={(e) => onDataChange({ description: e.target.value })}
            placeholder="Provide a comprehensive description of the program, including objectives, curriculum overview, and career outcomes..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="short-description">Short Description</Label>
          <Textarea
            id="short-description"
            value={data.shortDescription || ''}
            onChange={(e) => onDataChange({ shortDescription: e.target.value })}
            placeholder="Brief summary for program listings and previews..."
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="marketing-copy">Marketing Copy</Label>
          <Textarea
            id="marketing-copy"
            value={data.marketingCopy || ''}
            onChange={(e) => onDataChange({ marketingCopy: e.target.value })}
            placeholder="Compelling marketing description for promotional materials and website..."
            rows={3}
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Program Images
        </Label>
        
        <Card 
          className={`border-2 border-dashed transition-colors ${
            dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleImageUpload(e.dataTransfer.files);
          }}
        >
          <CardContent className="p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop images here, or click to browse
            </p>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Images
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)}
            />
          </CardContent>
        </Card>

        {data.images && data.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {data.images.map((image) => (
              <Card key={image.id} className="relative overflow-hidden">
                <CardContent className="p-0">
                  <img 
                    src={image.url} 
                    alt={image.alt}
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2">
                    <div className="flex justify-between items-center">
                      <Badge 
                        variant={image.type === 'hero' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {image.type}
                      </Badge>
                      <div className="flex gap-1">
                        {image.type !== 'hero' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setImageAsHero(image.id)}
                            className="h-6 text-xs"
                          >
                            Hero
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeImage(image.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoStep;