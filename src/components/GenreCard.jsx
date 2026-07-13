import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords, Rocket, Heart, Wand2, Smile, Skull, Zap, Brain, Crosshair, Sun, Moon, Eye, Shield, Music, BookOpen } from 'lucide-react';

const genreIconMap = {
  Action: Swords,
  'Sci-Fi': Rocket,
  Romance: Heart,
  Fantasy: Wand2,
  Comedy: Smile,
  Horror: Skull,
  Adventure: Zap,
  Mystery: Eye,
  Psychological: Brain,
  Thriller: Crosshair,
  Drama: Sun,
  'Slice of Life': Moon,
  Mecha: Shield,
  Music: Music,
  Seinen: BookOpen,
};

const genreColors = {
  Action: 'from-rose-500/20 to-orange-500/20 border-rose-200/50 text-rose-600',
  'Sci-Fi': 'from-cyan-500/20 to-blue-500/20 border-cyan-200/50 text-cyan-600',
  Romance: 'from-pink-500/20 to-red-500/20 border-pink-200/50 text-pink-600',
  Fantasy: 'from-violet-500/20 to-purple-500/20 border-violet-200/50 text-violet-600',
  Comedy: 'from-yellow-500/20 to-amber-500/20 border-yellow-200/50 text-yellow-600',
  Horror: 'from-slate-600/20 to-zinc-600/20 border-slate-300/50 text-slate-600',
};

export default function GenreCard({ genre, index = 0 }) {
  const Icon = genreIconMap[genre.name] || Swords;
  const colors = genreColors[genre.name] || 'from-indigo-500/20 to-primary/20 border-indigo-200/50 text-indigo-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/genre/${genre.mal_id}?name=${encodeURIComponent(genre.name)}`}
        className={`block p-5 rounded-2xl text-center transition-all bg-gradient-to-br ${colors} hover:shadow-lg hover:shadow-primary/5 border`}
      >
        <Icon size={26} className="mx-auto mb-2.5" />
        <span className="font-semibold text-sm">{genre.name}</span>
      </Link>
    </motion.div>
  );
}
