import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Eye, EyeOff, Save, X, FileText, LayoutGrid, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<"blogs" | "projects">("blogs");
  const [blogs, setBlogs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setIsAuth(true);
      setError("");
      fetchData();
    } else {
      setError("Invalid password");
    }
  };

  const fetchData = async () => {
    const resB = await fetch("/api/blogs?admin=true");
    const blogsData = await resB.json();
    setBlogs(blogsData);

    const resP = await fetch("/api/projects");
    const projectsData = await resP.json();
    setProjects(projectsData);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password,
        slug: editingPost.slug,
        data: {
          title: editingPost.title,
          date: editingPost.date || new Date().toISOString().split('T')[0],
          author: editingPost.author || "El7 Team",
          description: editingPost.description,
          image: editingPost.image,
          tags: typeof editingPost.tags === 'string' ? editingPost.tags.split(',').map((t: string) => t.trim()) : editingPost.tags,
          published: editingPost.published
        },
        body: editingPost.body
      }),
    });
    if (res.ok) {
      setEditingPost(null);
      fetchData();
    }
  };

  const handleDeleteBlog = async (slug: string) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/admin/blogs/${slug}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) fetchData();
  };

  const handleSaveProjects = async (newProjects: any[]) => {
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, projects: newProjects }),
    });
    if (res.ok) {
      setEditingProject(null);
      fetchData();
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-full max-w-md bg-[#111] p-8 lg:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl"
        >
          <div className="w-16 h-16 bg-primary-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-primary-purple/20">
            <Terminal className="text-primary-purple w-8 h-8" />
          </div>
          <h1 className="text-2xl font-display font-black text-center mb-8 uppercase tracking-widest">Access Restricted</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                placeholder="Secure Key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-primary-purple font-mono placeholder:text-gray-600"
              />
              {error && <p className="text-red-400 text-[10px] mt-3 font-mono uppercase tracking-widest font-bold">ERROR: {error}</p>}
            </div>
            <button type="submit" className="w-full py-4 bg-primary-purple text-black font-black rounded-xl uppercase tracking-widest shadow-purple-glow hover:brightness-110 active:scale-95 transition-all text-xs">
              Authenticate
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-4 py-24 pb-48">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
           <span className="text-primary-purple font-mono text-[10px] uppercase mb-2 block tracking-widest font-bold">// ROOT_ACCESS_GRANTED</span>
           <h1 className="text-3xl lg:text-4xl font-display font-black tracking-tighter uppercase">Omni Dashboard</h1>
        </div>
        
        <div className="flex gap-2 p-1.5 bg-[#111] rounded-2xl border border-white/5 w-full md:w-auto">
          <button 
            onClick={() => setActiveTab("blogs")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === "blogs" ? "bg-primary-purple text-black shadow-purple-glow" : "text-gray-500 hover:text-white"}`}
          >
            <FileText className="w-4 h-4" /> Journal
          </button>
          <button 
            onClick={() => setActiveTab("projects")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === "projects" ? "bg-primary-purple text-black shadow-purple-glow" : "text-gray-500 hover:text-white"}`}
          >
            <LayoutGrid className="w-4 h-4" /> Arsenal
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
         <h2 className="text-sm font-black uppercase tracking-[0.2em]">{activeTab === "blogs" ? "Journal Entries" : "Leaked Artifacts"}</h2>
         <button
          onClick={() => {
            if (activeTab === "blogs") {
              setEditingPost({ title: "", description: "", image: "", body: "", tags: "", published: true, slug: "" });
            } else {
              setEditingProject({ id: Date.now().toString(), title: "", description: "", image: "", tech: "", category: "Security", repoUrl: "" });
            }
          }}
          className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 hover:border-primary-purple/50 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-xs"
        >
          <Plus className="w-4 h-4" /> New {activeTab === "blogs" ? "Entry" : "Artifact"}
        </button>
      </div>

      <div className="grid gap-4">
        {(activeTab === "blogs" ? blogs : projects).map((item: any) => (
          <div key={item.slug || item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-[#111] border border-white/5 rounded-2xl transition-all hover:border-primary-purple/20 group gap-6">
            <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
              <div className="w-14 h-14 rounded-xl bg-gray-900 border border-white/5 flex-shrink-0 overflow-hidden">
                <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all opacity-50 group-hover:opacity-100" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base group-hover:text-primary-purple transition-colors truncate uppercase tracking-tight">{item.title}</h3>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase truncate">{activeTab === "blogs" ? `${item.date}` : `${item.category}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-auto sm:ml-0">
               {activeTab === "blogs" && (
                 <span className={`hidden xs:inline-block text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md ${item.published ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                   {item.published ? 'LIVE' : 'DRAFT'}
                 </span>
               )}
               <button onClick={() => {
                 if (activeTab === "blogs") {
                    fetch(`/api/blogs/${item.slug}`).then(r => r.json()).then(data => setEditingPost(data));
                 } else {
                    setEditingProject(item);
                 }
               }} className="p-2.5 bg-white/5 rounded-xl hover:text-primary-purple transition-all border border-white/10">
                 <Edit2 className="w-4 h-4" />
               </button>
               <button onClick={() => {
                 if (activeTab === "blogs") {
                    handleDeleteBlog(item.slug);
                 } else {
                   if(confirm("Confirm Delete?")) {
                      handleSaveProjects(projects.filter(p => p.id !== item.id));
                   }
                 }
               }} className="p-2.5 bg-white/5 rounded-xl hover:text-red-400 transition-all border border-white/10">
                 <Trash2 className="w-4 h-4" />
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Blog Editor Modal */}
      <AnimatePresence>
        {editingPost && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-3 lg:p-4 bg-black/95 backdrop-blur-xl"
          >
            <motion.div layoutId="editor" className="bg-[#0A0A0A] w-full max-w-5xl h-full lg:h-[90vh] rounded-[2rem] lg:rounded-[3rem] border border-white/10 flex flex-col shadow-[0_0_100px_rgba(179,102,255,0.15)] overflow-hidden">
               <div className="flex justify-between items-center p-6 lg:p-8 border-b border-white/5">
                  <h2 className="text-xl lg:text-2xl font-black uppercase tracking-tight">Journal Editor</h2>
                  <button onClick={() => setEditingPost(null)} className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-all"><X className="w-5 h-5 lg:w-6 lg:h-6" /></button>
               </div>
               <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-6 lg:space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Entry Title</label>
                      <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-bold text-base" value={editingPost.title} onChange={e => setEditingPost({...editingPost, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Access Slug</label>
                      <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs" value={editingPost.slug} onChange={e => setEditingPost({...editingPost, slug: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Hero Source</label>
                      <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs" value={editingPost.image} onChange={e => setEditingPost({...editingPost, image: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Encryption Tags</label>
                      <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs" value={Array.isArray(editingPost.tags) ? editingPost.tags.join(', ') : editingPost.tags} onChange={e => setEditingPost({...editingPost, tags: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Summary</label>
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-20 resize-none text-sm" value={editingPost.description} onChange={e => setEditingPost({...editingPost, description: e.target.value})} />
                  </div>
                  <div className="space-y-2 flex-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Raw MDX Data</label>
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-6 h-64 lg:h-[400px] font-mono text-[11px] leading-relaxed" value={editingPost.body} onChange={e => setEditingPost({...editingPost, body: e.target.value})} />
                  </div>
               </div>
               <div className="p-6 lg:p-8 bg-white/5 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 lg:gap-0">
                  <button onClick={() => setEditingPost({...editingPost, published: !editingPost.published})} className={`w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest border transition-all ${editingPost.published ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'}`}>
                    {editingPost.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />} {editingPost.published ? 'BROADCASTING' : 'DARK_MODE'}
                  </button>
                  <button onClick={handleSaveBlog} className="w-full sm:w-auto px-10 py-4 bg-primary-purple text-black font-black rounded-xl uppercase tracking-widest shadow-purple-glow hover:brightness-110 active:scale-95 transition-all text-xs">DECODE_SAVE</button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Editor Modal */}
      <AnimatePresence>
        {editingProject && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-3 lg:p-4 bg-black/95 backdrop-blur-xl"
          >
            <motion.div className="bg-[#0A0A0A] w-full max-w-2xl rounded-[2rem] lg:rounded-[3rem] border border-white/10 flex flex-col shadow-[0_0_100px_rgba(179,102,255,0.15)] overflow-hidden">
               <div className="flex justify-between items-center p-6 lg:p-8 border-b border-white/5">
                  <h2 className="text-xl lg:text-2xl font-black uppercase tracking-tight">Artifact Config</h2>
                  <button onClick={() => setEditingProject(null)} className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-all"><X className="w-5 h-5 lg:w-6 lg:h-6" /></button>
               </div>
               <div className="p-6 lg:p-10 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Title</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-bold" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Category</label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs" value={editingProject.category} onChange={e => setEditingProject({...editingProject, category: e.target.value})}>
                        <option value="Security">Security</option>
                        <option value="Destruction">Destruction</option>
                        <option value="Tools">Tools</option>
                        <option value="Labs">Labs</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Tech Stack</label>
                      <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs" value={Array.isArray(editingProject.tech) ? editingProject.tech.join(', ') : editingProject.tech} onChange={e => setEditingProject({...editingProject, tech: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Image Source</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs" value={editingProject.image} onChange={e => setEditingProject({...editingProject, image: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Intel Summary</label>
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-24 resize-none text-sm" value={editingProject.description} onChange={e => setEditingProject({...editingProject, description: e.target.value})} />
                  </div>
                  <button 
                    onClick={() => {
                        const updatedProjects = projects.some(p => p.id === editingProject.id)
                          ? projects.map(p => p.id === editingProject.id ? {...editingProject, tech: typeof editingProject.tech === 'string' ? editingProject.tech.split(',').map((t: string) => t.trim()) : editingProject.tech} : p)
                          : [...projects, {...editingProject, tech: typeof editingProject.tech === 'string' ? editingProject.tech.split(',').map((t: string) => t.trim()) : editingProject.tech}];
                        handleSaveProjects(updatedProjects);
                    }} 
                    className="w-full py-4 bg-primary-purple text-black font-black rounded-xl uppercase tracking-widest shadow-purple-glow hover:brightness-110 active:scale-95 transition-all text-xs"
                  >
                    Commit Configuration
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
