import { useState, useEffect } from 'react';
import { Globe, MapPin, Clock, DollarSign, Sun, Plane, Settings, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

interface SidebarProps {
  onSectionChange?: (section: string) => void;
}

const Sidebar = ({ onSectionChange }: SidebarProps) => {
  const [activeSection, setActiveSection] = useState('map');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait until mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    if (onSectionChange) {
      onSectionChange(section);
    }
    
    // Save last active section to localStorage
    try {
      localStorage.setItem('lastActiveSection', section);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Load last active section from localStorage
  useEffect(() => {
    try {
      const lastSection = localStorage.getItem('lastActiveSection');
      if (lastSection && onSectionChange) {
        setActiveSection(lastSection);
        onSectionChange(lastSection);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }, [onSectionChange]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Save theme preference to localStorage
    try {
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  };

  const navItems = [
    { id: 'map', icon: <Globe className="w-6 h-6" />, label: 'World Map' },
    { id: 'weather', icon: <Sun className="w-6 h-6" />, label: 'Weather' },
    { id: 'clock', icon: <Clock className="w-6 h-6" />, label: 'World Clock' },
    { id: 'currency', icon: <DollarSign className="w-6 h-6" />, label: 'Currency' },
    { id: 'airports', icon: <Plane className="w-6 h-6" />, label: 'Airports' },
  ];

  return (
    <div className="sidebar">
      <div className="text-white/90" style={{ marginBottom: '2rem' }}>
        <div style={{ 
          width: '3rem', 
          height: '3rem', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5)'
        }}>
          <Globe className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <nav className="flex-1 space-y-4">
        {navItems.map(item => (
          <div key={item.id} style={{ position: 'relative' }}>
            <button 
              className={`sidebar-button ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => handleSectionClick(item.id)}
              title={item.label}
              aria-label={item.label}
            >
              {item.icon}
            </button>
            {activeSection === item.id && (
              <div style={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '4px',
                height: '20px',
                background: 'white',
                borderRadius: '0 4px 4px 0'
              }}></div>
            )}
          </div>
        ))}
      </nav>
      
      <div className="space-y-4 mt-auto">
        {mounted && (
          <button 
            className="sidebar-button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        )}
        
        <button 
          className="sidebar-button"
          title="Settings"
          aria-label="Settings"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      <style>{`
        .sidebar-button {
          position: relative;
          overflow: hidden;
        }
        
        .sidebar-button::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          transition: transform 0.3s ease;
        }
        
        .sidebar-button:hover::after {
          transform: translate(-50%, -50%) scale(1.5);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;