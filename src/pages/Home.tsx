import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Lock, Zap, Github } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import BlogCard from "../components/BlogCard";
import { useEffect, useState } from "react";

const featuredProjects = [
  {
    title: "Vortex Engine",
    description: "A lightweight 2D game engine built with TypeScript and WebGL, focusing on rapid prototyping.",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9600?auto=format&fit=crop&q=80&w=800",
    tech: ["TypeScript", "WebGL", "Math"],
    repoUrl: "#"
  },
  {
    title: "Cyber-UI Kit",
    description: "A futuristic component library designed for high-performance dashboards and sci-fi interfaces.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    tech: ["React", "Framer Motion", "Tailwind"],
    liveUrl: "#"
  }
];

export default function Home() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/blogs")
      .then(res => res.json())
      .then(data => setBlogs(data.slice(0, 3)));
      
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => setProjects(data.slice(0, 2)));
  }, []);

  return (
    <div className="space-y-16 lg:space-y-24 pb-24 lg:pb-32">
      {/* Hero & Featured Split Section */}
      <section className="max-w-7xl mx-auto px-5 lg:px-6 pt-20 lg:pt-24 grid grid-cols-12 gap-8 lg:gap-12 min-h-screen lg:min-h-[70vh]">
        
        {/* Hero Content (7 COLS) */}
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-center relative overflow-hidden pr-0 lg:pr-10 py-12 lg:py-0">
          <div className="glow-orb -top-10 -left-10 w-64 h-64 bg-primary-purple/10"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-secondary-blue uppercase tracking-[0.3em] font-bold text-[9px] lg:text-[10px] mb-6 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-primary-purple rounded-full animate-pulse shadow-[0_0_12px_#B366FF]"></span>
              SYSTEM STATUS: ONLINE
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 lg:mb-8 tracking-tighter uppercase">
              Endless <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-purple via-secondary-blue to-primary-purple animate-gradient-x">
                Lives.
              </span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-lg mb-10 leading-relaxed font-medium">
              Just a small team of programmers that want to be famous and useful.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/projects" className="px-8 py-4 bg-primary-purple text-black font-black rounded-xl shadow-purple-glow hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm">
                PROJECT ARCHIVE <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/blog" className="px-8 py-4 border border-white/10 rounded-xl hover:bg-white/5 font-bold transition-all text-white backdrop-blur-sm text-center text-sm">
                READ JOURNAL
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Secondary Feed (5 COLS) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-10 lg:gap-8 pb-12 lg:pb-0">
          <div>
            <div className="flex justify-between items-end mb-4 px-1">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-purple">Projects</h2>
              <Link to="/projects" className="text-[9px] text-gray-500 hover:text-white uppercase font-bold tracking-widest transition-colors font-mono">Check Out</Link>
            </div>
            <div className="grid gap-4">
              {projects.length > 0 ? projects.map((project, idx) => (
                <Link key={idx} to="/projects" className="group glass-card p-4 flex gap-4 hover:border-primary-purple/30">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-900 rounded-lg flex-shrink-0 bg-gradient-to-tr from-black to-primary-purple/20 border border-white/10 overflow-hidden relative">
                    <img src={project.image} className="w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-opacity" alt="" />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h3 className="text-sm md:text-base font-black group-hover:text-primary-purple transition-colors tracking-tight truncate">{project.title}</h3>
                    <div className="flex gap-2 mt-2">
                      {project.tech.slice(0, 2).map(t => (
                        <span key={t} className="px-1.5 py-0.5 bg-white/5 rounded text-[8px] text-secondary-blue font-mono font-bold border border-white/5 uppercase tracking-tighter truncate">{t}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="py-8 text-center glass-card border-dashed text-gray-500 text-[10px] font-mono capitalize">Scanning...</div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-end mb-4 px-1">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary-blue">BLOGS</h2>
              <Link to="/blog" className="text-[9px] text-gray-500 hover:text-white uppercase font-bold tracking-widest transition-colors font-mono">GET_L</Link>
            </div>
            <div className="flex-1 glass-card p-5 lg:p-6 border-white/10 relative overflow-hidden">
              <div className="space-y-6">
                {blogs.map((blog, idx) => (
                  <Link key={idx} to={`/blog/${blog.slug}`} className="block relative pl-4 border-l border-white/10 hover:border-primary-purple transition-all group">
                    <span className="block text-[8px] text-gray-500 font-mono mb-1 uppercase tracking-widest font-bold">{blog.date}</span>
                    <h4 className="text-xs md:text-sm font-bold group-hover:text-primary-purple transition-colors leading-snug">{blog.title}</h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="max-w-7xl mx-auto px-5 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {[
            { icon: Zap, title: "STRESS TESTS", desc: "High-concurrency engines testing infrastructure limits." },
            { icon: Lock, title: "WAF RESEARCH", desc: "Deconstructing firewalls to find architectural bypasses." },
            { icon: Github, title: "PURE CODE", desc: "Building for the thrill of the break and the joy of the solve." }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 glass-card group relative overflow-hidden"
            >
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-purple/20 group-hover:text-primary-purple transition-all duration-500">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black mb-2 tracking-widest uppercase">{item.title}</h3>
              <p className="text-gray-400 text-[13px] leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="max-w-7xl mx-auto px-5 lg:px-6">
        <div className="flex justify-between items-end mb-10 px-2">
          <div>
            <h2 className="text-2xl lg:text-3xl font-black tracking-tighter mb-2 uppercase">ARMORY</h2>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Tactical security experiments.</p>
          </div>
          <Link to="/projects" className="flex items-center text-primary-purple font-black transition-all gap-2 uppercase text-[9px] tracking-widest hover:tracking-[0.1em]">
            EXPLORE ALL <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project, idx) => (
            <ProjectCard key={idx} {...project} />
          ))}
        </div>
      </section>

      {/* Telegram CTA Section */}
      <section className="max-w-7xl mx-auto px-5 lg:px-6">
        <div className="bg-gradient-to-br from-[#0A0A0A] to-[#111] rounded-[2.5rem] p-10 lg:p-20 border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group text-center md:text-left">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-blue/5 blur-[100px] -z-10 group-hover:bg-secondary-blue/10 transition-colors" />
          
          <div className="max-w-xl">
            <span className="text-secondary-blue font-mono text-[10px] uppercase tracking-[0.3em] font-bold mb-4 block">// SECURE_COMMUNICATION_LINK</span>
            <h2 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase mb-6 leading-none">
              Stay inside the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-blue to-primary-purple">Perimeter.</span>
            </h2>
            <p className="text-gray-400 text-base font-medium leading-relaxed mb-0">
              Join our Telegram channel for more information, discussions, and exclusive content on our latest projects and research. Connect with us and be part of the journey.
            </p>
          </div>

          <a 
            href="https://t.me/braziv" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group/btn relative px-12 py-6 bg-white text-black font-black rounded-2xl flex items-center gap-4 transition-all hover:scale-105 hover:shadow-[0_20px_50px_rgba(255,255,255,0.1)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-secondary-blue translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 uppercase tracking-widest text-sm group-hover/btn:text-black transition-colors">Join @braziv</span>
            <svg className="relative z-10 w-6 h-6 transition-transform group-hover/btn:translate-x-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.35-.99.53-1.41.52-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.89.03-.25.38-.51 1.07-.78 4.2-1.82 7-3.03 8.4-3.61 4-.66 4.83-.77 5.37-.78.12 0 .38.03.55.17.14.12.18.28.19.45.01.06.02.18.02.2z" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
