import { motion } from "motion/react";
import { ExternalLink, Github } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tech: string[];
  liveUrl?: string;
  repoUrl?: string;
}

export default function ProjectCard({ title, description, image, tech, liveUrl, repoUrl }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative glass-card overflow-hidden hover:border-primary-purple/30 transition-all backdrop-blur-sm"
    >
      <div className="h-56 overflow-hidden relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover grayscale opacity-40 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-80 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-80" />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary-purple/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white text-black rounded-xl hover:scale-110 transition-transform">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {repoUrl && (
            <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-[#0A0A0A] text-white rounded-xl hover:scale-110 transition-transform border border-white/10">
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      <div className="p-6 relative">
        <div className="flex flex-wrap gap-2 mb-3">
          {tech.map((t) => (
            <span key={t} className="text-[9px] font-mono font-bold text-secondary-blue bg-secondary-blue/10 px-2 py-0.5 rounded border border-secondary-blue/20 uppercase tracking-tighter">
              {t}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-black mb-2 group-hover:text-primary-purple transition-colors tracking-tight uppercase">
          {title}
        </h3>
        <p className="text-gray-400 text-xs leading-relaxed font-medium line-clamp-2">
          {description}
        </p>
      </div>
      
      {/* Glow Effect */}
      <div className="absolute -inset-px rounded-2xl border border-primary-purple/0 group-hover:border-primary-purple/30 group-hover:shadow-[0_0_20px_rgba(179,102,255,0.1)] pointer-events-none transition-all" />
    </motion.div>
  );
}
