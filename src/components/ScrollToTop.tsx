import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    const scrollToTop = () => {
      // Scroll window to top
      window.scrollTo(0, 0);
      
      // Find and scroll all scrollable containers to top
      const scrollableSelectors = [
        '[data-scroll-container]', // Custom data attribute
        '.overflow-y-auto',
        '.overflow-y-scroll',
        '.overflow-auto',
        '[style*="overflow-y: auto"]',
        '[style*="overflow-y: scroll"]',
        '[style*="overflow: auto"]'
      ];
      
      scrollableSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (element instanceof HTMLElement) {
            element.scrollTop = 0;
          }
        });
      });
      
      // Also try to find the main content area specifically
      const mainContent = document.querySelector('main');
      if (mainContent && mainContent instanceof HTMLElement) {
        mainContent.scrollTop = 0;
      }
    };
    
    // Small delay to ensure DOM is ready after route change
    const timeoutId = setTimeout(scrollToTop, 10);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
};

export default ScrollToTop;