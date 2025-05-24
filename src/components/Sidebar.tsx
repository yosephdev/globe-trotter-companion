import { Globe, MapPin, Clock, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  return (
    <div className="h-screen w-16 bg-primary fixed left-0 top-0 flex flex-col items-center py-4 space-y-8">
      <div className="text-white/90">
        <Globe className="w-8 h-8" />
      </div>
      <nav className="flex-1 space-y-4">
        <button className="w-12 h-12 flex items-center justify-center text-white/90 hover:bg-white/10 rounded-lg transition-colors">
          <MapPin className="w-6 h-6" />
        </button>
        <button className="w-12 h-12 flex items-center justify-center text-white/90 hover:bg-white/10 rounded-lg transition-colors">
          <Clock className="w-6 h-6" />
        </button>
        <button className="w-12 h-12 flex items-center justify-center text-white/90 hover:bg-white/10 rounded-lg transition-colors">
          <DollarSign className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;