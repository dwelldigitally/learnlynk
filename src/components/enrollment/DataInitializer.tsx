import React from 'react';

interface DataInitializerProps {
  children: React.ReactNode;
}

/**
 * DataInitializer - Pass-through component
 * Demo seeding has been removed - app now relies entirely on real database data
 */
export function DataInitializer({ children }: DataInitializerProps) {
  return <>{children}</>;
}
