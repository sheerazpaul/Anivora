import { motion } from 'framer-motion';

export default function CharacterCard({ character, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-indigo-100/60 p-3 flex gap-4 transition-all hover:shadow-md hover:border-primary/30 group cursor-pointer"
    >
      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
        <img
          src={character?.images?.jpg?.image_url}
          alt={character?.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="flex flex-col justify-center">
        <h4 className="text-sm font-semibold text-slate-800">{character?.name}</h4>
        <p className="text-slate-400 text-xs mt-0.5">{character?.role || 'Character'}</p>
        {character?.voice_actors?.[0] && (
          <p className="text-primary text-xs mt-1.5 font-medium">{character.voice_actors[0].person?.name} (JP)</p>
        )}
      </div>
    </motion.div>
  );
}
