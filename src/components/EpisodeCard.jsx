import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function EpisodeCard({ episode, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-indigo-100/60 p-3 flex gap-4 transition-all hover:shadow-md hover:border-primary/30 cursor-pointer"
    >
      <div className="relative shrink-0 w-28 h-16 rounded-xl overflow-hidden bg-indigo-50">
        {episode?.images?.jpg?.image_url ? (
          <img src={episode.images.jpg.image_url} alt={`Ep ${episode.mal_id}`} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-50">
            <Play size={20} className="text-indigo-300" />
          </div>
        )}
        <span className="absolute bottom-1 right-1 text-[9px] font-bold bg-black/60 px-1.5 py-0.5 rounded-md text-white backdrop-blur-sm">
          {episode.mal_id}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-slate-700 truncate group-hover:text-primary transition-colors">
          {episode.title || `Episode ${episode.mal_id}`}
        </h4>
        {episode.title_japanese && (
          <p className="text-xs text-slate-400 truncate mt-0.5">{episode.title_japanese}</p>
        )}
        {episode.aired && (
          <p className="text-xs text-slate-400 mt-1">{new Date(episode.aired).toLocaleDateString()}</p>
        )}
      </div>
    </motion.div>
  );
}
