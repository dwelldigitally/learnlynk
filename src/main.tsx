
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Main.tsx loading...');
const rootElement = document.getElementById("root");
console.log('Root element found:', !!rootElement);
createRoot(rootElement!).render(<App />);
