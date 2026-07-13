import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

const footerLinks = [
  { to: '/genres', label: 'Genres' },
  { to: '/top-anime', label: 'Top Anime' },
  { to: '/trending', label: 'Trending' },
  { to: '/about', label: 'About' },
];

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`w-full border-t ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-indigo-100/50'}`}>
      <div className="px-6 py-12 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <Logo size={32} />
              <span className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>Anivora</span>
            </Link>
            <p className={`text-sm max-w-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Discover, track, and enjoy your favorite anime with a modern, beautiful experience.
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className={`mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4 ${
          isDark ? 'border-slate-800' : 'border-indigo-100/50'
        }`}>
          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            © 2024 Anivora. Powered by Jikan API.
          </p>
          <div className="flex gap-3">
            {['twitter', 'github', 'discord'].map((s) => (
              <a
                key={s}
                href="#"
                className={`p-2 rounded-full transition-all ${
                  isDark ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-700 hover:bg-indigo-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="currentColor">
                  <path d="m476-80 182-480h84L476-80Zm-68-400L280-80h-84l192-400h20Z"/>
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
