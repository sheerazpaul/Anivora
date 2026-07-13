import { motion } from 'framer-motion';
import { Sparkles, Zap, Heart, Palette } from 'lucide-react';
import Logo from '../components/Logo';

const features = [
  { title: 'Browse Anime', desc: 'Explore thousands of anime series and movies', icon: Sparkles },
  { title: 'Real-time Data', desc: 'Powered by Jikan API for up-to-date information', icon: Zap },
  { title: 'Favorites & Watchlist', desc: 'Save and track your anime collection', icon: Heart },
  { title: 'Modern Design', desc: 'Built with React, Tailwind, and Framer Motion', icon: Palette },
];

export default function About() {
  return (
    <div className="min-h-screen pt-24">
      <main className="pb-16 px-6 max-w-screen-2xl mx-auto">
        <section className="mb-16 text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-center mb-6">
              <Logo size={56} />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-slate-800">About Anivora</h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              A modern anime discovery platform built with passion for anime fans worldwide.
              Browse, search, and track your favorite anime series and movies.
            </p>
          </motion.div>
        </section>

        <section className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-2xl border border-indigo-100/60 p-6 transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">{f.title}</h3>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </motion.div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
