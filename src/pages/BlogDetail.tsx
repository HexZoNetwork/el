import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Calendar, User, Tag, ArrowLeft, Share2 } from "lucide-react";
import MarkdownRenderer from "../components/MarkdownRenderer";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blogs/${slug}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setBlog(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch blog:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
       <div className="w-8 h-8 border-4 border-primary-purple border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <article className="pb-24">
      {/* Hero Header */}
      <header className="relative h-[60vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0 z-0">
          <img src={blog.image} className="w-full h-full object-cover" alt={blog.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 w-full pb-12">
          <Link to="/blog" className="inline-flex items-center text-sm font-bold text-primary-purple mb-8 hover:-translate-x-2 transition-transform">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Link>
          <div className="flex gap-2 mb-6">
            {blog.tags?.map((tag: string) => (
               <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase text-gray-200 border border-white/10">
                 {tag}
               </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight mb-8 leading-tight">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-8 text-sm text-gray-400 font-medium">
            <div className="flex items-center min-w-max">
              <User className="w-4 h-4 mr-2 text-primary-purple" />
              {blog.author}
            </div>
            <div className="flex items-center min-w-max">
              <Calendar className="w-4 h-4 mr-2 text-primary-purple" />
              {blog.date}
            </div>
            <button className="flex items-center text-primary-purple hover:text-white transition-colors ml-auto">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 mt-20">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
        >
          <MarkdownRenderer content={blog.body || ""} />
        </motion.div>

        {/* Footer info */}
        <div className="mt-20 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="text-center md:text-left">
             <h4 className="text-lg font-bold mb-2">Enjoyed this post?</h4>
             <p className="text-gray-400 text-sm">Join our community to stay updated on new projects.</p>
           </div>
           <Link to="/blog" className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all">
             Explore more articles
           </Link>
        </div>
      </div>
    </article>
  );
}
