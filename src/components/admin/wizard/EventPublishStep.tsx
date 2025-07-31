import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Globe, Lock, Share2, Search, Eye, Calendar, MapPin, Ticket, Users } from "lucide-react";
import { EventData } from "./EventWizard";

interface EventPublishStepProps {
  data: EventData;
  onUpdate: (updates: Partial<EventData>) => void;
}

export const EventPublishStep: React.FC<EventPublishStepProps> = ({ data, onUpdate }) => {
  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    onUpdate({ tags });
  };

  const getImagePreview = (image: File | string | undefined): string | undefined => {
    if (!image) return undefined;
    if (typeof image === 'string') return image;
    return URL.createObjectURL(image);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Review & Publish</h2>
        <p className="text-muted-foreground">Review your event details and configure publishing settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Event Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.bannerImage && (
                <img
                  src={getImagePreview(data.bannerImage)}
                  alt="Event banner"
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}
              
              <div>
                <h3 className="font-semibold text-lg">{data.title || "Event Title"}</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {data.description || "Event description will appear here..."}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {data.startDate && data.startTime
                      ? `${new Date(data.startDate).toLocaleDateString()} at ${data.startTime}`
                      : "Date & time to be announced"
                    }
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{data.venue.name || "Venue to be announced"}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Ticket className="w-4 h-4 text-muted-foreground" />
                  <span>{data.ticketTypes.length} ticket type(s) available</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>Up to {data.maxCapacity} attendees</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant={data.eventType === "virtual" ? "secondary" : "default"}>
                  {data.eventType}
                </Badge>
                {data.category && (
                  <Badge variant="outline">{data.category}</Badge>
                )}
                {data.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ticket Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.ticketTypes.map((ticket) => (
                  <div key={ticket.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{ticket.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.maxQuantity} available
                      </p>
                    </div>
                    <Badge variant={ticket.isFree ? "secondary" : "default"}>
                      {ticket.isFree ? "Free" : `${ticket.currency} ${ticket.price}`}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Publishing Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  {data.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <div>
                    <Label htmlFor="is-public">Public Event</Label>
                    <p className="text-sm text-muted-foreground">
                      {data.isPublic ? "Visible to everyone" : "Private/invite-only"}
                    </p>
                  </div>
                </div>
                <Switch
                  id="is-public"
                  checked={data.isPublic}
                  onCheckedChange={(checked) => onUpdate({ isPublic: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <div>
                    <Label htmlFor="social-sharing">Social Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow attendees to share event
                    </p>
                  </div>
                </div>
                <Switch
                  id="social-sharing"
                  checked={data.allowSocialSharing}
                  onCheckedChange={(checked) => onUpdate({ allowSocialSharing: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>SEO & Discovery</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seo-description">SEO Description</Label>
                <Textarea
                  id="seo-description"
                  value={data.seoDescription}
                  onChange={(e) => onUpdate({ seoDescription: e.target.value })}
                  placeholder="Brief description for search engines..."
                  rows={3}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {data.seoDescription.length}/160 characters recommended
                </p>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={data.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="conference, networking, tech (comma-separated)"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Add relevant tags to help people discover your event
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ready to Publish?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <div className={`w-3 h-3 rounded-full mr-2 ${data.title && data.description ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span>Basic information completed</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className={`w-3 h-3 rounded-full mr-2 ${data.startDate && data.startTime ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span>Date & time set</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className={`w-3 h-3 rounded-full mr-2 ${data.ticketTypes.length > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span>Ticket types configured</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className={`w-3 h-3 rounded-full mr-2 ${data.venue.name ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span>Venue information added</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <p className="text-sm text-muted-foreground">
                Once published, your event will be {data.isPublic ? "publicly visible" : "private"} and 
                attendees can start registering. You can always edit details later.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};