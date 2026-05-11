import { Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="px-10 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase font-bold tracking-widest gap-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <span>© {new Date().getFullYear()} EL7 TEAM. ALL RIGHTS RESERVED.</span>
        <div className="flex gap-6">
          <a href="https://t.me/braziv" target="_blank" rel="noopener noreferrer" className="hover:text-secondary-blue transition-colors flex items-center gap-2">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.35-.99.53-1.41.52-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.89.03-.25.38-.51 1.07-.78 4.2-1.82 7-3.03 8.4-3.61 4-.66 4.83-.77 5.37-.78.12 0 .38.03.55.17.14.12.18.28.19.45.01.06.02.18.02.2z" /></svg>
            Telegram
          </a>
          <a href="https://github.com/HexZoNetwork" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Github</a>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
        <span className="font-mono">We Are Not Dev [ -WAND- ]</span>
      </div>
    </footer>
  );
}
