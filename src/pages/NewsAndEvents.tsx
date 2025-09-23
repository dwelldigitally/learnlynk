import React, { useState, useMemo } from "react";
import { Search, Calendar, Clock, Users, TrendingUp, Filter, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/modern/GlassCard";
import { motion } from "framer-motion";
import NewsCard from "@/components/student/NewsCard";
import EventCard from "@/components/student/EventCard";
import { programNewsAndEvents } from "@/data/programContent";
import { Event } from "@/types/student";

const NewsAndEvents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram] = useState("Health Care Assistant");
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
    <div className="min-h-screen hero-gradient">
      {/* Modern Header */}
      <div className="border-b border-border/40 bg-background/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-primary/70 bg-clip-text text-transparent">
                  News & Events
                </h1>
                <p className="text-muted-foreground text-lg mt-1">
                  Stay updated with campus news and upcoming events
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard className="p-4 min-w-[320px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search news and events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50 border-border/30"
                  />
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          <GlassCard className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold text-foreground">{allItems.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total Items</p>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-foreground">{filteredNews.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">News Articles</p>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-foreground">{filteredEvents.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Upcoming Events</p>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-2xl font-bold text-foreground">{myEvents.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">My Events</p>
          </GlassCard>
        </motion.div>

        {/* Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Tabs defaultValue="all" className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <TabsList className="grid grid-cols-4 h-12 bg-muted/30 backdrop-blur-xl">
                <TabsTrigger value="all" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  All
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {allItems.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="news" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  News
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filteredNews.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="events" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Events
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filteredEvents.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="my-events" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  My Events
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {myEvents.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {allItems.map((item, index) => (
                  <motion.div
                    key={item.itemType === 'news' ? `news-${item.id}` : `event-${item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * (index % 6) }}
                    className="hover-scale transition-all duration-300"
                  >
                    {item.itemType === 'news' ? (
                      <NewsCard news={item} />
                    ) : (
                      <EventCard event={item} onRegisterToggle={handleEventRegistration} isRegistered={registeredEvents.includes(item.id)} />
                    )}
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="news" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredNews.map((news, index) => (
                  <motion.div
                    key={news.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="hover-scale transition-all duration-300"
                  >
                    <NewsCard news={news} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="hover-scale transition-all duration-300"
                  >
                    <EventCard event={event} onRegisterToggle={handleEventRegistration} isRegistered={registeredEvents.includes(event.id)} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="my-events" className="space-y-6">
              {myEvents.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <GlassCard className="p-12 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="p-4 bg-muted/30 rounded-full w-fit mx-auto mb-4">
                        <Users className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Events Registered Yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Start exploring upcoming events and register for those that interest you!
                      </p>
                      <Button onClick={() => (document.querySelector('[value="events"]') as HTMLElement)?.click()}>
                        Browse Events
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {myEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      className="hover-scale transition-all duration-300"
                    >
                      <EventCard event={event} onRegisterToggle={handleEventRegistration} isRegistered={registeredEvents.includes(event.id)} />
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default NewsAndEvents;