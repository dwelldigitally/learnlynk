import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export function getIconComponent(iconName: string): LucideIcon | null {
  const icons = LucideIcons as Record<string, any>;
  return icons[iconName] || null;
}
