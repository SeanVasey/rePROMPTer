import { Image as ImageIcon, RefreshCw, Settings2 } from 'lucide-react';

type NavItem = 'history' | 'studio' | 'config';

interface NavBarProps {
  activeItem: NavItem;
  onNavigate: (item: NavItem) => void;
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, active, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-colors ${
        active ? 'bg-accent text-white shadow-md' : 'text-muted hover:bg-surface-border'
      }`}
      aria-current={active ? 'page' : undefined}
      aria-label={label}
    >
      {icon}
      <span className="text-[11px] font-bold uppercase tracking-widest hidden sm:inline">
        {label}
      </span>
    </button>
  );
}

export default function NavBar({ activeItem, onNavigate }: NavBarProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none z-50">
      <nav
        className="max-w-xl mx-auto flex justify-center pointer-events-auto"
        aria-label="Main navigation"
      >
        <div className="bg-surface-secondary/90 backdrop-blur-md border border-surface-border p-1.5 rounded-2xl shadow-2xl flex gap-1">
          <NavButton
            icon={<ImageIcon size={18} />}
            label="History"
            active={activeItem === 'history'}
            onClick={() => onNavigate('history')}
          />
          <NavButton
            icon={<RefreshCw size={18} />}
            label="Studio"
            active={activeItem === 'studio'}
            onClick={() => onNavigate('studio')}
          />
          <NavButton
            icon={<Settings2 size={18} />}
            label="Config"
            active={activeItem === 'config'}
            onClick={() => onNavigate('config')}
          />
        </div>
      </nav>
    </footer>
  );
}
