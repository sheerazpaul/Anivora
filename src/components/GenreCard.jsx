import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords, Rocket, Heart, Wand2, Smile, Skull } from 'lucide-react';

const genreIcons = {
  Action: Swords,
  'Sci-Fi': Rocket,
  Romance: Heart,
  Fantasy: Wand2,
  Comedy: Smile,
  Horror: Skull,
};

export default function GenreCard({ genre, index = 0 }) {
  const Icon = genreIcons[genre.name] || Swords;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/genre/${genre.mal_id}?name=${encodeURIComponent(genre.name)}`}
        className="block p-6 rounded-2xl text-center transition-all bg-white border border-indigo-100/60 hover:border-primary/30 hover:shadow-lg hover:bg-primary-container/30"
      >
        <Icon size={28} className="mx-auto mb-3 text-primary" />
        <span className="font-semibold text-slate-700">{genre.name}</span>
      </Link>
    </motion.div>
  );
}
