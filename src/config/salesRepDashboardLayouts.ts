import { Layout } from 'react-grid-layout';

export const todayDefaultLayout: Layout[] = [
  { 
    i: 'calendar', 
    x: 0, 
    y: 0, 
    w: 8, 
    h: 4, 
    minW: 6, 
    minH: 3, 
    maxH: 6 
  },
  { 
    i: 'tasks', 
    x: 8, 
    y: 0, 
    w: 4, 
    h: 4, 
    minW: 3, 
    minH: 3 
  },
  { 
    i: 'new-assignments', 
    x: 0, 
    y: 4, 
    w: 8, 
    h: 5, 
    minW: 6, 
    minH: 4 
  },
  { 
    i: 'communications', 
    x: 8, 
    y: 4, 
    w: 4, 
    h: 5, 
    minW: 3, 
    minH: 4 
  },
  { 
    i: 'quick-actions', 
    x: 8, 
    y: 9, 
    w: 4, 
    h: 3, 
    minW: 3, 
    minH: 2 
  },
];

export const STORAGE_KEYS = {
  TODAY_LAYOUT: 'sales-rep-today-layout',
  LAYOUT_LOCKED: 'sales-rep-layout-locked',
};
