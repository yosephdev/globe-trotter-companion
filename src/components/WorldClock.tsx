import { useEffect, useState } from 'react';
import { Clock, Plus, Globe } from 'lucide-react';

// Common timezones with city names
const TIMEZONES = [
  { id: 'local', name: 'Local Time', timezone: 'local' },
  { id: 'europe-london', name: 'London', timezone: 'Europe/London' },
  { id: 'america-new_york', name: 'New York', timezone: 'America/New_York' },
  { id: 'asia-tokyo', name: 'Tokyo', timezone: 'Asia/Tokyo' },
  { id: 'australia-sydney', name: 'Sydney', timezone: 'Australia/Sydney' },
  { id: 'asia-dubai', name: 'Dubai', timezone: 'Asia/Dubai' },
  { id: 'europe-paris', name: 'Paris', timezone: 'Europe/Paris' },
  { id: 'america-los_angeles', name: 'Los Angeles', timezone: 'America/Los_Angeles' },
  { id: 'asia-singapore', name: 'Singapore', timezone: 'Asia/Singapore' },
  { id: 'america-sao_paulo', name: 'São Paulo', timezone: 'America/Sao_Paulo' },
];

interface ClockEntry {
  id: string;
  name: string;
  timezone: string;
  time: string;
  date: string;
}

const WorldClock = () => {
  const [clocks, setClocks] = useState<ClockEntry[]>([
    { id: 'local', name: 'Local Time', timezone: 'local', time: '', date: '' },
    { id: 'europe-london', name: 'London', timezone: 'Europe/London', time: '', date: '' }
  ]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState('');

  const updateTimes = () => {
    setLoading(true);
    
    const updatedClocks = clocks.map((clock) => {
      try {
        const now = new Date();
        
        if (clock.timezone === 'local') {
          // For local time, use the current date directly
          return {
            ...clock,
            time: now.toLocaleTimeString(),
            date: now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
          };
        } else {
          // For other timezones, use the Intl API directly to format the date
          // This is more reliable than creating a new Date from a formatted string
          return {
            ...clock,
            time: now.toLocaleTimeString(undefined, { timeZone: clock.timezone }),
            date: now.toLocaleDateString(undefined, { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              timeZone: clock.timezone 
            })
          };
        }
      } catch (error) {
        console.error(`Error updating time for ${clock.name}:`, error);
        return {
          ...clock,
          time: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
        };
      }
    });
    
    setClocks(updatedClocks);
    setLoading(false);
  };

  useEffect(() => {
    updateTimes();
    const interval = setInterval(updateTimes, 1000); // Update every second
    return () => clearInterval(interval);
  }, [clocks.length]);

  const addClock = () => {
    if (!selectedTimezone || clocks.some(c => c.timezone === selectedTimezone)) {
      return;
    }
    
    const timezone = TIMEZONES.find(t => t.timezone === selectedTimezone);
    if (timezone) {
      setClocks([...clocks, { 
        id: timezone.id, 
        name: timezone.name, 
        timezone: timezone.timezone, 
        time: '', 
        date: '' 
      }]);
    }
    
    setDialogOpen(false);
    setSelectedTimezone('');
  };

  const removeClock = (id: string) => {
    if (clocks.length <= 1) return;
    setClocks(clocks.filter(clock => clock.id !== id));
  };

  return (
    <div className="card">
      <div className="card-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
        <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '2rem', 
              height: '2rem', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(124, 58, 237, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
            <span>World Clock</span>
          </div>
          <button 
            onClick={() => setDialogOpen(true)} 
            className="btn btn-ghost btn-sm"
            style={{ 
              width: '2rem', 
              height: '2rem', 
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Add timezone"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="card-content">
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
          borderRadius: '0.75rem',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          {loading && clocks.every(c => !c.time) ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                border: '3px solid rgba(124, 58, 237, 0.2)', 
                borderTopColor: '#7c3aed',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {clocks.map((clock) => (
                <div key={clock.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s ease'
                }} className="dark:bg-gray-800/50">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ 
                      width: '2.5rem', 
                      height: '2.5rem', 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(124, 58, 237, 0.1)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <Globe className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p style={{ fontWeight: '500' }}>{clock.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{clock.date}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <p style={{ fontSize: '1.25rem', fontWeight: '600' }}>{clock.time}</p>
                    {clocks.length > 1 && (
                      <button 
                        onClick={() => removeClock(clock.id)}
                        style={{
                          width: '1.5rem',
                          height: '1.5rem',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0, 0, 0, 0.05)',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          lineHeight: 1,
                          opacity: 0.7,
                          transition: 'opacity 0.2s ease'
                        }}
                        className="dark:bg-gray-700"
                        onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {dialogOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              width: '90%',
              maxWidth: '400px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
            }} className="dark:bg-gray-800">
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Add a timezone</h3>
              <div style={{ marginBottom: '1rem' }}>
                <select
                  value={selectedTimezone}
                  onChange={(e) => setSelectedTimezone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    marginBottom: '1rem',
                    outline: 'none'
                  }}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select a timezone</option>
                  {TIMEZONES.filter(tz => !clocks.some(c => c.timezone === tz.timezone))
                    .map(timezone => (
                      <option key={timezone.id} value={timezone.timezone}>
                        {timezone.name}
                      </option>
                    ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setDialogOpen(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={addClock}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: '#7c3aed',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  disabled={!selectedTimezone}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default WorldClock;