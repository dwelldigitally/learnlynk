export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  badge?: string;
}

export interface MainNavSection {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavigationItem[];
}

export interface NavigationStructure {
  sections: MainNavSection[];
}