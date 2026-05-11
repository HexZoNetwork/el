import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Terminal, Cpu } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";

const navItems = [
  { name: "Portfolio", path: "/projects" },
  { name: "Journal", path: "/blog" },
  { name: "Terminal", path: "/admin" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled ? "py-3 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5" : "py-6 bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-5 lg:px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-primary-purple transition-all duration-500 border border-white/10 group-hover:shadow-purple-glow">
            <Terminal className="w-5 h-5 text-white group-hover:text-black transition-colors" />
          </div>
          <span className="text-lg lg:text-xl font-black tracking-tighter uppercase group-hover:tracking-widest transition-all duration-500">
            EL7 <span className="text-primary-purple">TEAM</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:tracking-[0.3em]",
                location.pathname === item.path ? "text-primary-purple" : "text-gray-400 hover:text-white"
              )}
            >
              {item.name}
            </Link>
          ))}
          <div className="w-px h-6 bg-white/10 mx-4" />
          <div className="flex items-center gap-3">
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono font-bold text-secondary-blue uppercase">Connection</span>
                <span className="text-[10px] font-mono font-black text-green-500 uppercase flex items-center gap-1.5 leading-none">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  SECURE
                </span>
             </div>
             <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                <Cpu className="w-4 h-4 text-gray-500" />
             </div>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-400 hover:text-white p-3 bg-white/5 rounded-xl border border-white/10"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#0A0A0A] border-b border-primary-purple/20 px-8 py-10 flex flex-col gap-8 shadow-2xl backdrop-blur-2xl"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-xl font-black uppercase tracking-widest",
                  location.pathname === item.path ? "text-primary-purple" : "text-gray-400"
                )}
              >
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
