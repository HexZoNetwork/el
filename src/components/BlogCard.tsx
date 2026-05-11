import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Calendar, User, ArrowRight } from "lucide-react";

interface BlogCardProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
}

export default function BlogCard({ slug, title, description, date, author, image, tags }: BlogCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group bg-[#111] rounded-2xl overflow-hidden border border-white/10 hover:border-primary-purple/50 transition-all purple-glow-hover"
    >
      <Link to={`/blog/${slug}`} className="block h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </Link>
      <div className="p-6">
        <div className="flex gap-2 mb-4">
          {tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 bg-primary-purple/10 text-primary-purple rounded">
              {tag}
            </span>
          ))}
        </div>
        <Link to={`/blog/${slug}`}>
          <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary-purple transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-gray-400 text-sm line-clamp-2 mb-6">
          {description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center space-x-4 text-[10px] text-gray-500 font-medium">
             <div className="flex items-center">
               <Calendar className="w-3 h-3 mr-1" />
               {date}
             </div>
             <div className="flex items-center">
               <User className="w-3 h-3 mr-1" />
               {author}
             </div>
          </div>
          <Link to={`/blog/${slug}`} className="text-primary-purple opacity-0 group-hover:opacity-100 transition-all flex items-center">
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
