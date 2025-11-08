import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { User, FileText, MessageSquare, Briefcase, Users, Star } from 'lucide-react';

interface Section {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sections: Section[] = [
  { id: 'ai-assessment', label: 'AI Assessment', icon: Star },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'essays', label: 'Essays', icon: FileText },
  { id: 'responses', label: 'Responses', icon: MessageSquare },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'references', label: 'References', icon: Users },
];

export const SectionNavigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('ai-assessment');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="hidden lg:block sticky top-24 self-start w-48 space-y-1 max-h-[calc(100vh-7rem)] overflow-y-auto">
      <p className="text-xs font-semibold text-muted-foreground mb-3 px-3">
        SECTIONS
      </p>
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        
        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
              "hover:bg-muted/50",
              isActive
                ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                : "text-muted-foreground border-l-2 border-transparent"
            )}
          >
            <Icon className={cn("h-4 w-4 transition-colors", isActive && "text-primary")} />
            <span className="animate-fade-in">{section.label}</span>
          </button>
        );
      })}
    </div>
  );
};
