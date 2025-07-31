import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Image, X, Palette } from "lucide-react";
import { EventData } from "./EventWizard";

interface EventMediaStepProps {
  data: EventData;
  onUpdate: (updates: Partial<EventData>) => void;
}

export const EventMediaStep: React.FC<EventMediaStepProps> = ({ data, onUpdate }) => {
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpdate({ bannerImage: file });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpdate({ eventLogo: file });
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onUpdate({ galleryImages: [...data.galleryImages, ...files] });
    }
  };

  const removeGalleryImage = (index: number) => {
    const newImages = data.galleryImages.filter((_, i) => i !== index);
    onUpdate({ galleryImages: newImages });
  };

  const getImagePreview = (image: File | string): string => {
    if (typeof image === 'string') return image;
    return URL.createObjectURL(image);
  };

  const colorOptions = [
    "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
    "#06b6d4", "#f97316", "#84cc16", "#ec4899", "#6366f1"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Media & Branding</h2>
        <p className="text-muted-foreground">Add images and customize the look of your event.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Image className="w-5 h-5" />
                <span>Event Banner</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.bannerImage ? (
                  <div className="relative">
                    <img
                      src={getImagePreview(data.bannerImage)}
                      alt="Event banner"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => onUpdate({ bannerImage: undefined })}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                    onClick={() => bannerInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload banner image
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 1920x1080px
                    </p>
                  </div>
                )}
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerUpload}
                />
                <Button
                  variant="outline"
                  onClick={() => bannerInputRef.current?.click()}
                  className="w-full"
                >
                  {data.bannerImage ? "Change Banner" : "Upload Banner"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.eventLogo ? (
                  <div className="relative w-32 h-32">
                    <img
                      src={getImagePreview(data.eventLogo)}
                      alt="Event logo"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2"
                      onClick={() => onUpdate({ eventLogo: undefined })}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <Button
                  variant="outline"
                  onClick={() => logoInputRef.current?.click()}
                  size="sm"
                >
                  {data.eventLogo ? "Change Logo" : "Upload Logo"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Color Theme</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        data.colorTheme === color
                          ? "border-primary scale-110"
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => onUpdate({ colorTheme: color })}
                    />
                  ))}
                </div>
                <div>
                  <Label htmlFor="custom-color">Custom Color</Label>
                  <Input
                    id="custom-color"
                    type="color"
                    value={data.colorTheme}
                    onChange={(e) => onUpdate({ colorTheme: e.target.value })}
                    className="w-full h-12 mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gallery Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.galleryImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {data.galleryImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={getImagePreview(image)}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-1 -right-1 w-6 h-6"
                          onClick={() => removeGalleryImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleGalleryUpload}
                />
                <Button
                  variant="outline"
                  onClick={() => galleryInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add Gallery Images
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};