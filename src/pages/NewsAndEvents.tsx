import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewsCard from "@/components/student/NewsCard";
import EventCard from "@/components/student/EventCard";
import { programNewsAndEvents } from "@/data/programContent";
import { Event } from "@/types/student";

const NewsAndEvents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram] = useState("Health Care Assistant"); // This would come from context/state
  const [registeredEvents, setRegisteredEvents] = useState<string[]>(() => {
    const saved = localStorage.getItem('registeredEvents');
    return saved ? JSON.parse(saved) : [];
  });

  const programContent = programNewsAndEvents[selectedProgram] || programNewsAndEvents["Health Care Assistant"];
  
  const filteredNews = useMemo(() => {
    return programContent.news.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [programContent.news, searchTerm]);

  const filteredEvents = useMemo(() => {
    return programContent.events.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [programContent.events, searchTerm]);

  const myEvents = useMemo(() => {
    return programContent.events.filter(event => registeredEvents.includes(event.id));
  }, [programContent.events, registeredEvents]);

  const allItems = useMemo(() => {
    const combined = [
      ...filteredNews.map(item => ({ ...item, itemType: 'news' as const })),
      ...filteredEvents.map(item => ({ ...item, itemType: 'event' as const }))
    ];
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredNews, filteredEvents]);

  const handleEventRegistration = (eventId: string, isRegistered: boolean) => {
    const newRegisteredEvents = isRegistered 
      ? [...registeredEvents, eventId]
      : registeredEvents.filter(id => id !== eventId);
    
    setRegisteredEvents(newRegisteredEvents);
    localStorage.setItem('registeredEvents', JSON.stringify(newRegisteredEvents));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">News & Events</h1>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search news and events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="all">All ({allItems.length})</TabsTrigger>
          <TabsTrigger value="news">News ({filteredNews.length})</TabsTrigger>
          <TabsTrigger value="events">Events ({filteredEvents.length})</TabsTrigger>
          <TabsTrigger value="my-events">My Events ({myEvents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allItems.map((item) => (
              <div key={item.itemType === 'news' ? `news-${item.id}` : `event-${item.id}`} className="aspect-square">
                {item.itemType === 'news' ? (
                  <NewsCard news={item} />
                ) : (
                  <EventCard event={item} onRegisterToggle={handleEventRegistration} />
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((news) => (
              <div key={news.id} className="aspect-square">
                <NewsCard news={news} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="aspect-square">
                <EventCard event={event} onRegisterToggle={handleEventRegistration} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-events" className="space-y-6">
          {myEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No registered events yet. Browse events to register!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEvents.map((event) => (
                <div key={event.id} className="aspect-square">
                  <EventCard event={event} onRegisterToggle={handleEventRegistration} />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsAndEvents;