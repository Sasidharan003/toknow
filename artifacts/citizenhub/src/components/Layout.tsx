import { Link, useLocation } from "wouter";
import { BookOpen, Home, Scale, FileText, User, MessageCircle, Info, Landmark, AlertTriangle, Newspaper, Bookmark, MapPin, FilePlus, Trophy, Briefcase, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState(0);
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    function updateXp() {
      try {
        const val = parseInt(localStorage.getItem("citizenhub_xp") ?? "0") || 0;
        setXp(val);
      } catch {
        setXp(0);
      }
    }
    updateXp();
    const interval = setInterval(updateXp, 1000);
    return () => clearInterval(interval);
  }, []);

  const levelName = xp < 100 ? "Beginner" : xp < 300 ? "Learner" : xp < 600 ? "Citizen" : xp < 1000 ? "Expert" : "Champion";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-primary text-primary-foreground py-3 px-6 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          {/* Hamburger Menu Trigger for Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer mr-1"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5.5 h-5.5" />
          </button>
          
          <Link href="/" className="flex items-center gap-3.5 text-xl font-bold tracking-tight cursor-pointer">
            <img 
              src="/logo.jpg" 
              alt="TO KNOW Logo" 
              className="w-11 h-11 object-contain shrink-0" 
              style={{ filter: "invert(1) brightness(1.25)", mixBlendMode: "screen" }}
            />
            <span>TO KNOW</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold border border-white/20">
            <Trophy className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>{xp} XP</span>
            <span className="opacity-60">•</span>
            <span className="text-secondary font-medium">{levelName}</span>
          </div>
          <Link href="/bookmarks" className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer" title="Saved Items">
            <Bookmark className="w-5 h-5" />
          </Link>
          <Link href="/profile" className="w-8 h-8 rounded-full bg-secondary hover:opacity-90 text-white flex items-center justify-center font-bold transition-all shadow-inner border border-white/10 cursor-pointer" title="My Profile">
            IN
          </Link>
        </div>
      </header>
      
      <div className="bg-secondary text-white text-sm py-1.5 px-4 text-center font-medium shadow-sm z-40">
        📢 This platform provides educational information and guidance. It does not constitute legal advice.
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r bg-card hidden md:block overflow-y-auto shrink-0">
          <nav className="p-4 space-y-1">
            <SidebarLink href="/" icon={<Home size={18} />} label="Dashboard" />
            <SidebarLink href="/laws" icon={<Scale size={18} />} label="Laws & Rights" />
            <SidebarLink href="/schemes" icon={<FileText size={18} />} label="Gov Schemes" />
            <SidebarLink href="/services" icon={<User size={18} />} label="Public Services" />
            <SidebarLink href="/lawyers" icon={<Briefcase size={18} />} label="Verified Lawyers" />
            <SidebarLink href="/complaints" icon={<AlertTriangle size={18} />} label="Complaint Center" />
            <SidebarLink href="/documents" icon={<FilePlus size={18} />} label="Legal Documents" />
            <SidebarLink href="/nearby" icon={<MapPin size={18} />} label="Nearby Services" />
            <SidebarLink href="/learning" icon={<BookOpen size={18} />} label="Learning Center" />
            <SidebarLink href="/news" icon={<Newspaper size={18} />} label="News & Updates" />
            <SidebarLink href="/profile" icon={<User size={18} />} label="My Profile" />
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
          <div key={location} className="p-6 md:p-10 max-w-7xl mx-auto animate-page-enter">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer Panel */}
          <aside className="fixed top-0 left-0 bottom-0 w-64 bg-card border-r shadow-2xl flex flex-col z-50 animate-slide-in-left overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between bg-primary text-primary-foreground">
              <div className="flex items-center gap-2 font-bold text-sm">
                <img 
                  src="/logo.jpg" 
                  alt="TO KNOW Logo" 
                  className="w-8 h-8 object-contain shrink-0" 
                  style={{ filter: "invert(1) brightness(1.25)", mixBlendMode: "screen" }}
                />
                <span>TO KNOW</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-primary-foreground transition-colors cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="p-4 space-y-1">
              <SidebarLink href="/" icon={<Home size={18} />} label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
              <SidebarLink href="/laws" icon={<Scale size={18} />} label="Laws & Rights" onClick={() => setIsMobileMenuOpen(false)} />
              <SidebarLink href="/schemes" icon={<FileText size={18} />} label="Gov Schemes" onClick={() => setIsMobileMenuOpen(false)} />
              <SidebarLink href="/services" icon={<User size={18} />} label="Public Services" onClick={() => setIsMobileMenuOpen(false)} />
              <SidebarLink href="/lawyers" icon={<Briefcase size={18} />} label="Verified Lawyers" onClick={() => setIsMobileMenuOpen(false)} />
              <SidebarLink href="/complaints" icon={<AlertTriangle size={18} />} label="Complaint Center" onClick={() => setIsMobileMenuOpen(false)} />
              <SidebarLink href="/documents" icon={<FilePlus size={18} />} label="Legal Documents" onClick={() => setIsMobileMenuOpen(false)} />
              <SidebarLink href="/nearby" icon={<MapPin size={18} />} label="Nearby Services" onClick={() => setIsMobileMenuOpen(false)} />
              <SidebarLink href="/learning" icon={<BookOpen size={18} />} label="Learning Center" onClick={() => setIsMobileMenuOpen(false)} />
              <SidebarLink href="/news" icon={<Newspaper size={18} />} label="News & Updates" onClick={() => setIsMobileMenuOpen(false)} />
              <SidebarLink href="/profile" icon={<User size={18} />} label="My Profile" onClick={() => setIsMobileMenuOpen(false)} />
            </nav>
            
            {/* Mobile Level Info */}
            <div className="mt-auto p-4 border-t bg-muted/40">
              <div className="flex items-center gap-2 bg-white border px-3 py-2 rounded-xl text-xs font-semibold shadow-sm">
                <Trophy className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-foreground">{xp} XP</div>
                  <div className="text-[10px] text-muted-foreground font-medium truncate">{levelName} Rank</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function SidebarLink({ href, icon, label, onClick }: { href: string, icon: React.ReactNode, label: string, onClick?: () => void }) {
  const [location] = useLocation();
  const isActive = location === href || (href !== "/" && location.startsWith(href));
  
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-150 cursor-pointer font-medium text-sm ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
    >
      {icon}
      {label}
    </Link>
  );
}

