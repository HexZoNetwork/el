import { motion } from "motion/react";
import ProjectCard from "../components/ProjectCard";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const categories = ["All", "Security", "Destruction", "Tools", "Labs"];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/projects?t=" + Date.now())
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Failed to load projects:", err));
  }, []);

  const filteredProjects = projects.filter(
    p => activeCategory === "All" || p.category === activeCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pb-40">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-10">
        <div className="max-w-3xl">
          <span className="text-primary-purple font-mono text-sm mb-4 block uppercase tracking-widest font-bold">// SECURE_VAULT_DECRYPTED</span>
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">The El7 Arsenal</h1>
          <p className="text-gray-400 text-xl leading-relaxed">
            A collection of tools, exploits, and research prototypes developed for the thrill of understanding how systems truly work. Every artifact here was built for fun and absolute performance.
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 glass-card p-2 border-white/5 backdrop-blur-md">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest border ${
                activeCategory === cat 
                  ? "bg-primary-purple border-primary-purple text-black shadow-purple-glow" 
                  : "bg-white/5 border-transparent text-gray-500 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {filteredProjects.length > 0 ? filteredProjects.map((project, idx) => (
          <motion.div
            key={project.id || project.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <ProjectCard {...project} />
          </motion.div>
        )) : (
          <div className="col-span-full py-32 text-center">
            <p className="text-gray-600 font-mono uppercase tracking-widest mb-4">No artifacts detected in this sector.</p>
            <div className="w-12 h-1 bg-white/5 mx-auto" />
          </div>
        )}
      </div>
      
      {/* Collaboration Call-to-action */}
      <section className="mt-40 p-16 glass-card border-primary-purple/10 text-center relative overflow-hidden group">
         <div className="glow-orb -top-20 -left-20 w-64 h-64 bg-primary-purple/10"></div>
         <h2 className="text-4xl font-display font-black mb-6 uppercase tracking-tighter">Initiate Collaboration?</h2>
         <p className="text-gray-400 mb-12 max-w-xl mx-auto text-lg">We are currently accepting selective research partnerships and experimental coding requests.</p>
         <a href="mailto:contact@el7-team.com" className="px-12 py-5 bg-white text-black rounded-2xl font-black hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3">
            ESTABLISH CONNECTION <ArrowRight className="w-5 h-5" />
         </a>
      </section>
    </div>
  );
}
