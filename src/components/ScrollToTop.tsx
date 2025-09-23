import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // Disable browser scroll restoration on mount
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    console.log('ScrollToTop: Navigating to', pathname);
    
    // Enhanced scroll reset function
    const scrollToTop = () => {
      // Temporarily disable smooth scrolling for instant reset
      const htmlElement = document.documentElement;
      const originalScrollBehavior = htmlElement.style.scrollBehavior;
      htmlElement.style.scrollBehavior = 'auto';
      
      // Reset window scroll in multiple ways
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
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
      
      let resetCount = 0;
      scrollableSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (element instanceof HTMLElement) {
            element.scrollTop = 0;
            resetCount++;
          }
        });
      });
      
      // Also try to find the main content area specifically
      const mainContent = document.querySelector('main');
      if (mainContent && mainContent instanceof HTMLElement) {
        mainContent.scrollTop = 0;
        resetCount++;
      }
      
      console.log('ScrollToTop: Reset', resetCount, 'containers');
      
      // Restore original scroll behavior
      htmlElement.style.scrollBehavior = originalScrollBehavior;
    };
    
    // Run scroll reset multiple times to catch late-mounting content
    scrollToTop(); // Immediate
    
    const rafId = requestAnimationFrame(() => {
      scrollToTop(); // After next frame
    });
    
    const timeoutId = setTimeout(() => {
      scrollToTop(); // After a delay for late content
    }, 120);
    
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  return null;
};

export default ScrollToTop;