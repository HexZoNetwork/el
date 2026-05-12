import { useState, useEffect } from "react";
import BlogCard from "../components/BlogCard";
import { motion } from "motion/react";
import SearchBar from "../components/SearchBar";

export default function BlogListing() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/blogs?t=" + Date.now())
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setBlogs(data))
      .catch(err => console.error("Failed to load blogs:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight">The El7 Blog</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Insights, tutorials, and project updates from the El7 Team. Stay updated with the latest in technology and design.
        </p>
        <div className="pt-4">
          <SearchBar />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog, idx) => (
          <motion.div
            key={blog.slug}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <BlogCard {...blog} />
          </motion.div>
        ))}
        {blogs.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-500 font-medium">
            No posts found. Check back later!
          </div>
        )}
      </div>
      
      {/* Telegram Channel CTA */}
      <section className="bg-[#111] rounded-[2rem] p-12 text-center border border-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary-purple/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
        <div className="w-16 h-16 bg-secondary-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
           <svg className="w-8 h-8 text-secondary-blue" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.35-.99.53-1.41.52-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.89.03-.25.38-.51 1.07-.78 4.2-1.82 7-3.03 8.4-3.61 4-.66 4.83-.77 5.37-.78.12 0 .38.03.55.17.14.12.18.28.19.45.01.06.02.18.02.2z" />
           </svg>
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight mb-4">JOIN THE CHANNEL</h2>
        <p className="text-gray-400 mb-8 max-w-sm mx-auto font-medium">Get real-time updates, leak alerts, and exclusive tools directly on Telegram.</p>
        <a 
          href="https://t.me/braziv" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-4 bg-secondary-blue text-black font-black rounded-xl shadow-[0_0_20px_rgba(77,159,255,0.3)] hover:scale-105 transition-all text-sm uppercase tracking-widest"
        >
          CONNECT TO @BRAZIV
        </a>
      </section>
    </div>
  );
}
