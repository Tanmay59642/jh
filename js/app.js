/**
 * Campus2Community Jharkhand - Master React Application Logic & Views
 */

const { useState, useEffect, useRef, useMemo } = React;

// Main App Component
function App() {
  // Global State Initializers
  const [theme, setTheme] = useState(() => localStorage.getItem('c2c_theme') || 'light');
  const [lang, setLang] = useState(() => localStorage.getItem('c2c_lang') || 'en');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('c2c_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [problems, setProblems] = useState(() => {
    const saved = localStorage.getItem('c2c_problems');
    return saved ? JSON.parse(saved) : window.C2C_DATA.INITIAL_PROBLEMS;
  });

  const [route, setRoute] = useState(() => window.location.hash || '#/');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Sync State with LocalStorage
  useEffect(() => {
    localStorage.setItem('c2c_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('c2c_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('c2c_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('c2c_problems', JSON.stringify(problems));
  }, [problems]);

  // Hash Navigation Handler
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
      setMobileMenuOpen(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
  };

  const t = (key) => {
    return window.C2C_DATA.TRANSLATIONS[lang][key] || key;
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleLang = () => setLang(prev => prev === 'en' ? 'hi' : 'en');

  const logout = () => {
    setUser(null);
    navigate('#/');
  };

  // Helper to get active route component
  const renderRoute = () => {
    const path = route.replace('#', '');
    
    // Route matching
    if (path === '' || path === '/') return <HomePage navigate={navigate} t={t} problems={problems} lang={lang} />;
    if (path === '/about') return <AboutPage t={t} lang={lang} />;
    if (path === '/how-it-works') return <HowItWorksPage t={t} lang={lang} />;
    if (path === '/report' || path === '/user/report') return <ReportPage navigate={navigate} t={t} lang={lang} user={user} setProblems={setProblems} />;
    if (path === '/track' || path === '/user/track') return <TrackPage t={t} lang={lang} problems={problems} />;
    if (path === '/login') return <LoginPage navigate={navigate} setUser={setUser} t={t} lang={lang} />;
    if (path === '/register') return <RegisterPage navigate={navigate} setUser={setUser} t={t} lang={lang} />;

    // Resident Routes
    if (path === '/user/dashboard' || path === '/user/problems') {
      if (!user || user.role !== 'resident') return <RequireAuth role="resident" navigate={navigate} t={t} />;
      return <UserDashboard user={user} problems={problems} navigate={navigate} t={t} lang={lang} />;
    }

    // Admin Routes
    if (path.startsWith('/admin')) {
      if (!user || user.role !== 'admin') return <RequireAuth role="admin" navigate={navigate} t={t} />;
      
      if (path === '/admin/dashboard' || path === '/admin/problems') {
        return <AdminDashboard problems={problems} setProblems={setProblems} navigate={navigate} t={t} lang={lang} />;
      }
      if (path.startsWith('/admin/problem/')) {
        const id = path.replace('/admin/problem/', '');
        return <AdminProblemDetail problemId={id} problems={problems} setProblems={setProblems} navigate={navigate} t={t} lang={lang} />;
      }
      if (path === '/admin/universities') {
        return <AdminUniversitiesPage problems={problems} navigate={navigate} t={t} lang={lang} />;
      }
      if (path === '/admin/tracker') {
        return <AdminTrackerPage problems={problems} navigate={navigate} t={t} lang={lang} />;
      }
    }

    // University Routes
    if (path.startsWith('/university')) {
      if (!user || user.role !== 'university') return <RequireAuth role="university" navigate={navigate} t={t} />;

      if (path === '/university/dashboard' || path === '/university/problems') {
        return <UniversityDashboard problems={problems} user={user} navigate={navigate} t={t} lang={lang} />;
      }
      if (path.startsWith('/university/problem/')) {
        const id = path.replace('/university/problem/', '');
        return <UniversityProblemDetail problemId={id} problems={problems} setProblems={setProblems} user={user} navigate={navigate} t={t} lang={lang} />;
      }
      if (path === '/university/enrollments') {
        return <UniversityEnrollmentsPage user={user} problems={problems} navigate={navigate} t={t} lang={lang} />;
      }
    }

    // Fallback Home
    return <HomePage navigate={navigate} t={t} problems={problems} lang={lang} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col transition-colors duration-200">
      {/* Header */}
      <Header 
        t={t} 
        lang={lang} 
        toggleLang={toggleLang} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        user={user} 
        logout={logout}
        navigate={navigate}
        setSearchOpen={setSearchOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        route={route}
      />

      {/* Main Content View */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {renderRoute()}
      </main>

      {/* Footer */}
      <Footer t={t} lang={lang} navigate={navigate} />

      {/* Global Search Modal */}
      {searchOpen && (
        <SearchModal 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          setSearchOpen={setSearchOpen} 
          problems={problems}
          navigate={navigate}
          lang={lang}
        />
      )}

      {/* AI Chatbot Floating Widget */}
      <ChatbotWidget 
        chatOpen={chatOpen} 
        setChatOpen={setChatOpen} 
        lang={lang} 
        setLang={setLang}
      />
    </div>
  );
}

// ----------------------------------------------------------------------
// HEADER & NAV
// ----------------------------------------------------------------------
function Header({ t, lang, toggleLang, theme, toggleTheme, user, logout, navigate, setSearchOpen, mobileMenuOpen, setMobileMenuOpen, route }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
      {/* Official State Banner */}
      <div className="bg-emerald-800 dark:bg-emerald-950 px-4 py-1.5 text-xs text-center text-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto">
          <span className="font-semibold uppercase tracking-wider bg-emerald-700 dark:bg-emerald-900 px-2 py-0.5 rounded text-[10px]">Jharkhand Portal</span>
          <span>{lang === 'hi' ? 'सामुदायिक समस्या समाधान एवं विवि सहयोग पहल' : 'Community Problem-Reporting & University Collaboration Platform'}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('#/')}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-white shadow-lg text-xl">
            C2C
          </div>
          <div>
            <div className="font-bold text-lg leading-tight tracking-tight text-white flex items-center gap-2">
              Campus2Community
              <span className="text-xs font-normal text-emerald-400 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-700/50">Jharkhand</span>
            </div>
            <div className="text-xs text-slate-400 hidden sm:block">
              {lang === 'hi' ? 'जन-समस्या से समाधान तक' : 'Societal Impact Platform'}
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 font-medium text-sm text-slate-300">
          <button onClick={() => navigate('#/')} className={`px-3 py-2 rounded-md hover:text-white transition-colors ${route === '#/' ? 'text-white bg-slate-800 font-semibold' : ''}`}>
            {t('navHome')}
          </button>
          <button onClick={() => navigate('#/report')} className={`px-3 py-2 rounded-md hover:text-white transition-colors ${route === '#/report' ? 'text-white bg-slate-800 font-semibold' : ''}`}>
            {t('navReport')}
          </button>
          <button onClick={() => navigate('#/track')} className={`px-3 py-2 rounded-md hover:text-white transition-colors ${route === '#/track' ? 'text-white bg-slate-800 font-semibold' : ''}`}>
            {t('navTrack')}
          </button>
          <button onClick={() => navigate('#/how-it-works')} className={`px-3 py-2 rounded-md hover:text-white transition-colors ${route === '#/how-it-works' ? 'text-white bg-slate-800 font-semibold' : ''}`}>
            {t('navHowItWorks')}
          </button>
          <button onClick={() => navigate('#/about')} className={`px-3 py-2 rounded-md hover:text-white transition-colors ${route === '#/about' ? 'text-white bg-slate-800 font-semibold' : ''}`}>
            {t('navAbout')}
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button 
            onClick={() => setSearchOpen(true)}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-2 text-xs border border-slate-700"
            title="Global Search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <span className="hidden md:inline text-slate-400">Search (Ctrl+K)</span>
          </button>

          {/* Language Switcher */}
          <button 
            onClick={toggleLang}
            className="px-2.5 py-1.5 text-xs font-semibold bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/60 rounded-lg transition-colors flex items-center gap-1"
          >
            🌐 {lang === 'en' ? 'English' : 'सरल हिंदी'}
          </button>

          {/* Theme Switcher */}
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
            title="Toggle Theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* User Auth Buttons */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
              <button 
                onClick={() => {
                  if (user.role === 'resident') navigate('#/user/dashboard');
                  else if (user.role === 'admin') navigate('#/admin/dashboard');
                  else if (user.role === 'university') navigate('#/university/dashboard');
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-xs shadow-sm flex items-center gap-1.5"
              >
                <span>👤</span>
                <span className="capitalize hidden sm:inline">{user.name || user.role}</span>
              </button>
              <button 
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-400 text-xs"
                title="Logout"
              >
                🚪
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('#/login')}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg shadow transition-colors flex items-center gap-1"
            >
              🔐 {t('navLogin')}
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg ml-1"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-2 text-sm font-medium">
          <button onClick={() => navigate('#/')} className="block w-full text-left py-2 px-3 hover:bg-slate-800 rounded">{t('navHome')}</button>
          <button onClick={() => navigate('#/report')} className="block w-full text-left py-2 px-3 hover:bg-slate-800 rounded">{t('navReport')}</button>
          <button onClick={() => navigate('#/track')} className="block w-full text-left py-2 px-3 hover:bg-slate-800 rounded">{t('navTrack')}</button>
          <button onClick={() => navigate('#/how-it-works')} className="block w-full text-left py-2 px-3 hover:bg-slate-800 rounded">{t('navHowItWorks')}</button>
          <button onClick={() => navigate('#/about')} className="block w-full text-left py-2 px-3 hover:bg-slate-800 rounded">{t('navAbout')}</button>
          
          {user && (
            <div className="pt-2 border-t border-slate-800 space-y-1">
              <div className="text-xs text-emerald-400 px-3 font-semibold">Logged in as {user.name} ({user.role})</div>
              {user.role === 'resident' && <button onClick={() => navigate('#/user/dashboard')} className="block w-full text-left py-2 px-3 hover:bg-slate-800 rounded">Resident Dashboard</button>}
              {user.role === 'admin' && <button onClick={() => navigate('#/admin/dashboard')} className="block w-full text-left py-2 px-3 hover:bg-slate-800 rounded">Admin Dashboard</button>}
              {user.role === 'university' && <button onClick={() => navigate('#/university/dashboard')} className="block w-full text-left py-2 px-3 hover:bg-slate-800 rounded">University Dashboard</button>}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

// ----------------------------------------------------------------------
// REQUIRE AUTH GUARD
// ----------------------------------------------------------------------
function RequireAuth({ role, navigate, t }) {
  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 text-center">
      <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🔒</div>
      <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
        You need to log in as a <strong className="capitalize text-emerald-600">{role}</strong> to access this page.
      </p>
      <div className="flex gap-3 justify-center">
        <button 
          onClick={() => navigate('#/login')}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm shadow"
        >
          Go to Login
        </button>
        <button 
          onClick={() => navigate('#/')}
          className="px-5 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-lg font-medium text-sm"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// SEARCH MODAL
// ----------------------------------------------------------------------
function SearchModal({ searchQuery, setSearchQuery, setSearchOpen, problems, navigate, lang }) {
  const categories = window.C2C_DATA.CATEGORIES;

  const results = useMemo(() => {
    if (!searchQuery.trim()) return { functions: [], categories: [], problems: [] };
    const q = searchQuery.toLowerCase();

    // 1. Website functions
    const funcs = [
      { title: "Report a Problem", desc: "Submit societal issue with photos & geotag", path: "#/report", icon: "📝" },
      { title: "Track My Problem", desc: "View 9-stage solution status by Problem ID", path: "#/track", icon: "🔍" },
      { title: "University Enrollment / Registration", desc: "For colleges & institutes to register and enroll", path: "#/login", icon: "🎓" },
      { title: "How to upload a photo", desc: "Upload multiple JPEG/PNG photos up to 5MB", path: "#/how-it-works", icon: "📷" },
      { title: "About Founders Team", desc: "Parnavi Janbhor, Tanmay Shirgudi & Team", path: "#/about", icon: "👥" }
    ].filter(f => f.title.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q));

    // 2. Problem Categories
    const cats = categories.filter(c => c.toLowerCase().includes(q));

    // 3. Problems
    const probs = problems.filter(p => 
      p.id.toLowerCase().includes(q) || 
      p.title.toLowerCase().includes(q) || 
      p.district.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );

    return { functions: funcs, categories: cats, problems: probs };
  }, [searchQuery, problems]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-start justify-center pt-16 px-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3 bg-slate-50 dark:bg-slate-850">
          <span className="text-xl">🔍</span>
          <input 
            type="text"
            autoFocus
            placeholder={window.C2C_DATA.TRANSLATIONS[lang].searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-base focus:outline-none text-slate-800 dark:text-slate-100"
          />
          <button 
            onClick={() => setSearchOpen(false)}
            className="text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 px-2.5 py-1 rounded text-slate-600 dark:text-slate-300 font-semibold"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1">
          {!searchQuery.trim() && (
            <div className="text-center py-8 text-slate-400 text-sm">
              Type to search website functions, problem themes (e.g. 'water'), or complaint IDs.
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {["water", "track complaint", "register university", "roads", "how to upload a photo"].map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => setSearchQuery(tag)}
                    className="text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full hover:bg-emerald-100"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Functions Section */}
          {results.functions.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                ⚙️ Website Functions ({results.functions.length})
              </div>
              <div className="space-y-1.5">
                {results.functions.map((f, i) => (
                  <div 
                    key={i} 
                    onClick={() => { setSearchOpen(false); navigate(f.path); }}
                    className="p-2.5 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer flex items-center justify-between border border-transparent hover:border-emerald-200 dark:hover:border-slate-600 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{f.icon}</span>
                      <div>
                        <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{f.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{f.desc}</div>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-600 font-semibold">Open →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories Section */}
          {results.categories.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                🏷️ Problem Categories ({results.categories.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {results.categories.map(cat => (
                  <div 
                    key={cat}
                    onClick={() => { setSearchOpen(false); navigate('#/'); }}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white rounded-lg text-sm cursor-pointer font-medium border border-slate-200 dark:border-slate-600 transition-all"
                  >
                    {cat}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Problems Section */}
          {results.problems.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                📌 Reported Problems ({results.problems.length})
              </div>
              <div className="space-y-2">
                {results.problems.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => { setSearchOpen(false); navigate('#/track'); }}
                    className="p-3 bg-slate-50 dark:bg-slate-750 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">{p.id}</span>
                        <span className="text-xs text-slate-500 font-medium">{p.district} • {p.category}</span>
                      </div>
                      <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 mt-1">{p.title}</div>
                    </div>
                    <span className="text-xs bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded text-slate-700 dark:text-slate-300 font-medium">{p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 9-STAGE PIPELINE COMPONENT
// ----------------------------------------------------------------------
function PipelineVisualizer({ currentStage, lang }) {
  const stages = window.C2C_DATA.STAGES;

  return (
    <div className="my-6 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>⚙️</span> 9-Stage Solution Pipeline Progress
        </h4>
        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-800">
          Stage {currentStage} of 9
        </span>
      </div>

      {/* Pipeline Progression Steps Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
        {stages.map((stg) => {
          const isDone = stg.id < currentStage;
          const isCurrent = stg.id === currentStage;

          let badgeBg = "bg-slate-100 dark:bg-slate-700 text-slate-400 border-slate-200 dark:border-slate-600";
          let icon = "○";

          if (isDone) {
            badgeBg = "bg-emerald-500 text-white border-emerald-600 shadow-sm";
            icon = "✓";
          } else if (isCurrent) {
            badgeBg = "bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300 dark:ring-amber-900 shadow-md animate-pulse";
            icon = "●";
          }

          return (
            <div key={stg.id} className="flex flex-col items-center text-center group relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${badgeBg}`}>
                {icon}
              </div>
              <div className="text-[11px] font-semibold mt-1.5 leading-tight text-slate-700 dark:text-slate-300 line-clamp-2">
                {lang === 'hi' ? stg.nameHi : stg.nameEn}
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block z-20 w-40 bg-slate-900 text-white text-[10px] p-2 rounded shadow-lg text-center">
                <strong>Stage {stg.id}: {stg.nameEn}</strong>
                <p className="text-slate-300 mt-1">{stg.descEn}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// LEAFLET MAP COMPONENT
// ----------------------------------------------------------------------
function LeafletMap({ lat = 23.3441, lng = 85.3096, isInteractive = false, onLocationSelect = null, markers = [] }) {
  const mapRef = useRef(null);
  const leafletInstance = useRef(null);
  const markerInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletInstance.current) {
      leafletInstance.current = L.map(mapRef.current).setView([lat, lng], isInteractive ? 11 : 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(leafletInstance.current);

      if (isInteractive) {
        markerInstance.current = L.marker([lat, lng], { draggable: true }).addTo(leafletInstance.current);

        markerInstance.current.on('dragend', function (e) {
          const coord = e.target.getLatLng();
          if (onLocationSelect) onLocationSelect(coord.lat, coord.lng);
        });

        leafletInstance.current.on('click', function (e) {
          markerInstance.current.setLatLng(e.latlng);
          if (onLocationSelect) onLocationSelect(e.latlng.lat, e.latlng.lng);
        });
      }
    } else {
      leafletInstance.current.setView([lat, lng]);
      if (markerInstance.current) markerInstance.current.setLatLng([lat, lng]);
    }

    // Add extra markers if provided
    if (markers.length > 0 && leafletInstance.current) {
      markers.forEach(m => {
        L.marker([m.latitude, m.longitude])
          .addTo(leafletInstance.current)
          .bindPopup(`<b>${m.title}</b><br/>${m.district} (${m.status})`);
      });
    }

  }, [lat, lng, isInteractive, markers]);

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-inner z-0">
      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
}

// ----------------------------------------------------------------------
// HOME PAGE
// ----------------------------------------------------------------------
function HomePage({ navigate, t, problems, lang }) {
  const [selectedCat, setSelectedCat] = useState("All");

  const filteredProblems = useMemo(() => {
    if (selectedCat === "All") return problems;
    return problems.filter(p => p.category === selectedCat);
  }, [problems, selectedCat]);

  return (
    <div className="space-y-10 py-4">
      {/* Hero Section */}
      <section className="text-center py-10 px-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-600/50 text-emerald-300 text-xs font-semibold">
            <span>🇮🇳</span> Jharkhand Public Innovation Network
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            {t('heroHeading')}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            {t('heroSubheading')}
          </p>

          {/* Hero Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button 
              onClick={() => navigate('#/report')}
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>📝</span> {t('btnReport')}
            </button>
            <button 
              onClick={() => navigate('#/track')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 shadow-md transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>🔍</span> {t('btnTrack')}
            </button>
          </div>
        </div>
      </section>

      {/* 4 Compact Feature Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl mb-3">1</div>
          <h3 className="font-bold text-base mb-1 text-slate-800 dark:text-slate-100">{t('cardReportTitle')}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t('cardReportDesc')}</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl mb-3">2</div>
          <h3 className="font-bold text-base mb-1 text-slate-800 dark:text-slate-100">{t('cardTrackTitle')}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t('cardTrackDesc')}</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xl mb-3">3</div>
          <h3 className="font-bold text-base mb-1 text-slate-800 dark:text-slate-100">{t('cardConnectTitle')}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t('cardConnectDesc')}</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl mb-3">4</div>
          <h3 className="font-bold text-base mb-1 text-slate-800 dark:text-slate-100">{t('cardSolveTitle')}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t('cardSolveDesc')}</p>
        </div>
      </section>

      {/* Active Community Problems Stream */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>📍</span> {t('recentProblems')}
            </h2>
            <p className="text-xs text-slate-500">Problems reported by residents across Jharkhand districts</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {["All", ...window.C2C_DATA.CATEGORIES.slice(0, 5)].map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedCat === cat 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'bg-slate-200 dark:bg-slate-750 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProblems.map(prob => (
            <div 
              key={prob.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {prob.images && prob.images.length > 0 && (
                  <div className="h-40 w-full overflow-hidden relative bg-slate-100 dark:bg-slate-900">
                    <img src={prob.images[0]} alt={prob.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                      {prob.district}
                    </span>
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      {prob.id}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                      {prob.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-2 hover:text-emerald-600 transition-colors">
                    {prob.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {prob.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-750 flex items-center justify-between text-xs mt-2">
                <div className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <span>●</span> {prob.status}
                </div>
                <button 
                  onClick={() => navigate('#/track')}
                  className="text-emerald-600 hover:text-emerald-700 font-bold"
                >
                  Track Pipeline →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ----------------------------------------------------------------------
// REPORT PROBLEM PAGE
// ----------------------------------------------------------------------
function ReportPage({ navigate, t, lang, user, setProblems }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(window.C2C_DATA.CATEGORIES[0]);
  const [district, setDistrict] = useState(window.C2C_DATA.DISTRICTS[0]);
  const [villageCity, setVillageCity] = useState('');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [lat, setLat] = useState(23.3441);
  const [lng, setLng] = useState(85.3096);
  const [images, setImages] = useState([]);
  const [docName, setDocName] = useState('');
  const [submittedId, setSubmittedId] = useState(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          alert(`Location set: Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)}`);
        },
        () => {
          alert("Could not fetch GPS location. Defaulting to Ranchi center.");
        }
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !mobile) {
      alert("Please fill in all required fields!");
      return;
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = `JC2C-2026-${randomNum}`;

    const newProblem = {
      id: newId,
      title,
      description,
      category,
      district,
      villageCity: villageCity || district,
      mobile,
      latitude: lat,
      longitude: lng,
      status: "Reported",
      stage: 1,
      createdBy: mobile,
      createdAt: new Date().toISOString(),
      images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80"],
      assignedUniversity: null,
      enrollments: []
    };

    setProblems(prev => [newProblem, ...prev]);
    setSubmittedId(newId);
  };

  if (submittedId) {
    return (
      <div className="max-w-xl mx-auto my-10 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 text-center space-y-5">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto font-bold">✓</div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Problem Reported Successfully!</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Your complaint has been submitted to the Jharkhand State Administration for scrutiny.
        </p>

        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 font-semibold uppercase">Generated Problem ID</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-wider mt-1">{submittedId}</div>
          <div className="text-xs text-slate-400 mt-1">Status: <span className="font-bold text-amber-500">Reported (Stage 1/9)</span></div>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <button 
            onClick={() => navigate('#/track')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md"
          >
            Track My Problem
          </button>
          <button 
            onClick={() => setSubmittedId(null)}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-semibold text-sm"
          >
            Report Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>📝</span> Report a Societal Problem
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Provide accurate information and photos to help Jharkhand universities work on practical solutions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Problem Title *</label>
          <input 
            type="text" 
            required
            placeholder="e.g. Broken Water Filtration Tank in Ormanjhi Panchayat"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Category / Theme *</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {window.C2C_DATA.CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">District *</label>
            <select 
              value={district}
              onChange={e => setDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {window.C2C_DATA.DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Village / Town / Ward</label>
            <input 
              type="text"
              placeholder="e.g. Ormanjhi Village Ward 4"
              value={villageCity}
              onChange={e => setVillageCity(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Mobile Number *</label>
            <input 
              type="tel"
              required
              placeholder="e.g. 9876543210"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Detailed Description *</label>
          <textarea 
            rows="4"
            required
            placeholder="Explain the societal issue, affected population, severity, and key observations..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          ></textarea>
        </div>

        {/* Photo Upload Box */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Upload Photographs (Multiple)</label>
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleImageUpload}
            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 dark:file:bg-emerald-950 file:text-emerald-700 dark:file:text-emerald-300 hover:file:bg-emerald-200"
          />

          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {images.map((img, i) => (
                <div key={i} className="relative h-20 rounded-lg overflow-hidden border border-slate-300 group">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Geolocation Picker */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Geolocation Map Marker</label>
            <button 
              type="button"
              onClick={handleUseLocation}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100"
            >
              📍 {t('useMyLocation')}
            </button>
          </div>

          <LeafletMap 
            lat={lat} 
            lng={lng} 
            isInteractive={true} 
            onLocationSelect={(newLat, newLng) => {
              setLat(newLat);
              setLng(newLng);
            }} 
          />

          <div className="flex gap-4 mt-2 text-xs font-mono text-slate-500">
            <span>Lat: {lat.toFixed(6)}</span>
            <span>Lng: {lng.toFixed(6)}</span>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-colors text-sm"
        >
          Submit Problem Complaint
        </button>
      </form>
    </div>
  );
}

// ----------------------------------------------------------------------
// TRACK PROBLEM PAGE
// ----------------------------------------------------------------------
function TrackPage({ t, lang, problems }) {
  const [searchId, setSearchId] = useState('');
  const [searchMobile, setSearchMobile] = useState('');
  const [foundProblem, setFoundProblem] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    setSearched(true);
    const p = problems.find(item => 
      item.id.toLowerCase().trim() === searchId.toLowerCase().trim()
    );
    setFoundProblem(p || null);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🔍</span> Track Problem Status
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Enter your unique Problem ID and Mobile Number to view real-time stage progress.
        </p>
      </div>

      <form onSubmit={handleTrack} className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          required
          placeholder="Problem ID (e.g. JC2C-2026-00101)"
          value={searchId}
          onChange={e => setSearchId(e.target.value)}
          className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100"
        />
        <input 
          type="tel"
          placeholder="Mobile Number (Optional)"
          value={searchMobile}
          onChange={e => setSearchMobile(e.target.value)}
          className="w-full sm:w-48 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100"
        />
        <button 
          type="submit"
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-sm shadow transition-colors"
        >
          Track Status
        </button>
      </form>

      {/* Result Display */}
      {searched && !foundProblem && (
        <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500">
          <span className="text-3xl block mb-2">❌</span>
          <p className="font-semibold text-slate-700 dark:text-slate-300">No problem found matching ID "{searchId}"</p>
          <p className="text-xs text-slate-400 mt-1">Please verify your ID or check the demo problems list on Home Page.</p>
        </div>
      )}

      {foundProblem && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-750 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded border border-emerald-300 dark:border-emerald-800">
                {foundProblem.id}
              </span>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-2">{foundProblem.title}</h2>
              <div className="text-xs text-slate-500 mt-1">
                Category: <strong>{foundProblem.category}</strong> • District: <strong>{foundProblem.district}</strong>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block text-xs font-bold px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-full border border-amber-300 dark:border-amber-800">
                {foundProblem.status}
              </span>
            </div>
          </div>

          {/* 9-Stage Pipeline */}
          <PipelineVisualizer currentStage={foundProblem.stage || 1} lang={lang} />

          {/* Description & Assigned Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-750 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Problem Description</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{foundProblem.description}</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-750 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Assigned University</h4>
              {foundProblem.assignedUniversity ? (
                <div className="text-xs text-slate-800 dark:text-slate-200 font-semibold space-y-1">
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{foundProblem.assignedUniversity.name}</div>
                  <div>NAAC Grade: {foundProblem.assignedUniversity.naac} • NIRF Rank: {foundProblem.assignedUniversity.nirf}</div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">No university assigned yet. Currently under admin review / enrollment stage.</div>
              )}
            </div>
          </div>

          {/* Geotag Map */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">Submitted Location Pin</h4>
            <LeafletMap lat={foundProblem.latitude} lng={foundProblem.longitude} isInteractive={false} />
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// LOGIN & REGISTER PAGES
// ----------------------------------------------------------------------
function LoginPage({ navigate, setUser, t, lang }) {
  const [role, setRole] = useState('resident');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleQuickDemo = (userType) => {
    const demo = window.C2C_DATA.DEMO_USERS[userType];
    setUser(demo);
    if (userType === 'resident') navigate('#/user/dashboard');
    else if (userType === 'admin') navigate('#/admin/dashboard');
    else if (userType === 'university') navigate('#/university/dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const demoUser = {
      role,
      name: identifier.split('@')[0] || "User",
      email: role !== 'resident' ? identifier : undefined,
      mobile: role === 'resident' ? identifier : undefined
    };
    setUser(demoUser);
    if (role === 'resident') navigate('#/user/dashboard');
    else if (role === 'admin') navigate('#/admin/dashboard');
    else if (role === 'university') navigate('#/university/dashboard');
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Portal Login</h2>
        <p className="text-xs text-slate-500 mt-1">Select your role to access your dashboard</p>
      </div>

      {/* Role Switcher Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-semibold">
        <button 
          onClick={() => setRole('resident')}
          className={`py-2 rounded-lg transition-all ${role === 'resident' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm font-bold' : 'text-slate-500'}`}
        >
          Resident
        </button>
        <button 
          onClick={() => setRole('admin')}
          className={`py-2 rounded-lg transition-all ${role === 'admin' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm font-bold' : 'text-slate-500'}`}
        >
          Admin
        </button>
        <button 
          onClick={() => setRole('university')}
          className={`py-2 rounded-lg transition-all ${role === 'university' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm font-bold' : 'text-slate-500'}`}
        >
          University
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            {role === 'resident' ? 'Mobile Number' : 'Official Email Address'}
          </label>
          <input 
            type={role === 'resident' ? 'tel' : 'email'} 
            required
            placeholder={role === 'resident' ? 'e.g. 9876543210' : 'e.g. admin@jharkhand.gov.in'}
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Password</label>
          <input 
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100"
          />
        </div>

        <button 
          type="submit"
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow transition-colors text-sm"
        >
          Login as {role.toUpperCase()}
        </button>
      </form>

      {/* Demo Account Quick Buttons */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-750 text-center space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">⚡ Demo 1-Click Login</div>
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => handleQuickDemo('resident')} className="px-2 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 text-xs font-medium rounded">Resident</button>
          <button onClick={() => handleQuickDemo('admin')} className="px-2 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 text-xs font-medium rounded">Admin</button>
          <button onClick={() => handleQuickDemo('university')} className="px-2 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 text-xs font-medium rounded">University</button>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ navigate, setUser, t, lang }) {
  return <LoginPage navigate={navigate} setUser={setUser} t={t} lang={lang} />;
}

// ----------------------------------------------------------------------
// USER DASHBOARD
// ----------------------------------------------------------------------
function UserDashboard({ user, problems, navigate, t }) {
  const myProblems = problems.filter(p => p.createdBy === user.mobile || user.role === 'resident');

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-emerald-950 p-6 rounded-2xl text-white shadow-md">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.name || "Resident"}</h1>
          <p className="text-xs text-slate-300 mt-1">Track your submitted problems & contribute to Jharkhand community</p>
        </div>
        <button 
          onClick={() => navigate('#/report')}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow"
        >
          + Report New Problem
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div onClick={() => navigate('#/report')} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer text-center">
          <span className="text-2xl block mb-1">📝</span>
          <span className="font-bold text-xs text-slate-800 dark:text-slate-200">Report Problem</span>
        </div>
        <div onClick={() => navigate('#/track')} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer text-center">
          <span className="text-2xl block mb-1">🔍</span>
          <span className="font-bold text-xs text-slate-800 dark:text-slate-200">Track Problem</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <span className="text-2xl font-black text-emerald-600 block mb-1">{myProblems.length}</span>
          <span className="font-bold text-xs text-slate-800 dark:text-slate-200">My Complaints</span>
        </div>
        <div onClick={() => navigate('#/how-it-works')} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer text-center">
          <span className="text-2xl block mb-1">❓</span>
          <span className="font-bold text-xs text-slate-800 dark:text-slate-200">Help Guide</span>
        </div>
      </div>

      {/* My Problems List */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">My Submitted Problems</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myProblems.map(p => (
            <div key={p.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">{p.id}</span>
                <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded font-semibold">{p.status}</span>
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{p.title}</h4>
              <p className="text-xs text-slate-500">{p.district} • {p.category}</p>
              <button onClick={() => navigate('#/track')} className="text-xs font-bold text-emerald-600 hover:underline pt-1 block">
                View Stage Progression →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// ADMIN DASHBOARD & DETAIL VIEWS
// ----------------------------------------------------------------------
function AdminDashboard({ problems, setProblems, navigate, t, lang }) {
  const [filterCat, setFilterCat] = useState("All");
  const [filterDist, setFilterDist] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const stats = useMemo(() => {
    return {
      total: problems.length,
      underReview: problems.filter(p => p.status === 'Verification' || p.status === 'Admin Scrutiny' || p.status === 'Reported').length,
      enrolling: problems.filter(p => p.status === 'University Enrollment').length,
      inProgress: problems.filter(p => p.status === 'Solution Development' || p.status === 'University Selected' || p.status === 'Field Testing').length,
      solved: problems.filter(p => p.status === 'Solved').length
    };
  }, [problems]);

  const filtered = useMemo(() => {
    return problems.filter(p => {
      if (filterCat !== "All" && p.category !== filterCat) return false;
      if (filterDist !== "All" && p.district !== filterDist) return false;
      if (filterStatus !== "All" && p.status !== filterStatus) return false;
      return true;
    });
  }, [problems, filterCat, filterDist, filterStatus]);

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>🛡️</span> State Admin Control Panel
          </h1>
          <p className="text-xs text-slate-500">Jharkhand Nodal Scrutiny & University Assignment Dashboard</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('#/admin/tracker')} className="px-3 py-1.5 bg-slate-800 text-white rounded text-xs font-medium">District Tracker</button>
          <button onClick={() => navigate('#/admin/universities')} className="px-3 py-1.5 bg-slate-800 text-white rounded text-xs font-medium">University Partners</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center shadow-sm">
          <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.total}</div>
          <div className="text-[11px] text-slate-500 font-bold uppercase mt-1">Total Problems</div>
        </div>
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 text-center shadow-sm">
          <div className="text-2xl font-black text-amber-600">{stats.underReview}</div>
          <div className="text-[11px] text-amber-700 dark:text-amber-300 font-bold uppercase mt-1">Under Scrutiny</div>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 text-center shadow-sm">
          <div className="text-2xl font-black text-blue-600">{stats.enrolling}</div>
          <div className="text-[11px] text-blue-700 dark:text-blue-300 font-bold uppercase mt-1">Enrolling</div>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-900 text-center shadow-sm">
          <div className="text-2xl font-black text-purple-600">{stats.inProgress}</div>
          <div className="text-[11px] text-purple-700 dark:text-purple-300 font-bold uppercase mt-1">In Progress</div>
        </div>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900 text-center shadow-sm">
          <div className="text-2xl font-black text-emerald-600">{stats.solved}</div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold uppercase mt-1">Solved</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap gap-3 items-center">
        <span className="text-xs font-bold uppercase text-slate-400">Filters:</span>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs">
          <option value="All">All Categories</option>
          {window.C2C_DATA.CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterDist} onChange={e => setFilterDist(e.target.value)} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs">
          <option value="All">All Districts</option>
          {window.C2C_DATA.DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Problems Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
              <th className="p-3">Problem ID</th>
              <th className="p-3">Title & Category</th>
              <th className="p-3">District</th>
              <th className="p-3">Status</th>
              <th className="p-3">Enrolled</th>
              <th className="p-3">Assigned University</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-750">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">{p.id}</td>
                <td className="p-3">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{p.title}</div>
                  <div className="text-[10px] text-slate-500">{p.category}</div>
                </td>
                <td className="p-3 text-slate-600 dark:text-slate-400">{p.district}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded font-semibold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    {p.status}
                  </span>
                </td>
                <td className="p-3 font-bold text-blue-600">{p.enrollments ? p.enrollments.length : 0}</td>
                <td className="p-3 text-slate-700 dark:text-slate-300">
                  {p.assignedUniversity ? p.assignedUniversity.name : <span className="text-slate-400 italic">None</span>}
                </td>
                <td className="p-3 text-right">
                  <button 
                    onClick={() => navigate(`#/admin/problem/${p.id}`)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold text-xs shadow-sm"
                  >
                    Scrutinize & Assign →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Admin Problem Detail & Scrutiny Page
function AdminProblemDetail({ problemId, problems, setProblems, navigate, t, lang }) {
  const problem = problems.find(p => p.id === problemId);

  if (!problem) {
    return <div className="p-8 text-center text-slate-500">Problem not found!</div>;
  }

  const handleUpdateStage = (newStage, newStatus) => {
    setProblems(prev => prev.map(p => {
      if (p.id === problemId) {
        return { ...p, stage: newStage, status: newStatus };
      }
      return p;
    }));
    alert(`Status updated to Stage ${newStage}: ${newStatus}`);
  };

  const handleAssignUniversity = (enr) => {
    setProblems(prev => prev.map(p => {
      if (p.id === problemId) {
        return {
          ...p,
          stage: 6,
          status: "University Selected",
          assignedUniversity: {
            id: enr.universityId,
            name: enr.universityName,
            naac: enr.naacGrade,
            nirf: enr.nirfRating
          }
        };
      }
      return p;
    }));
    alert(`Assigned ${enr.universityName} to solve problem ${problemId}!`);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
        <div>
          <button onClick={() => navigate('#/admin/dashboard')} className="text-xs text-emerald-600 font-bold mb-1 block">← Back to Admin Table</button>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Scrutinize Complaint: {problem.id}</h1>
        </div>
        <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-full">
          {problem.status} (Stage {problem.stage}/9)
        </span>
      </div>

      {/* Complaint Info */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{problem.title}</h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{problem.description}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-750">
          <div>Category: <strong>{problem.category}</strong></div>
          <div>District: <strong>{problem.district}</strong></div>
          <div>Reporter Mobile: <strong>{problem.mobile}</strong></div>
          <div>Date: <strong>{new Date(problem.createdAt).toLocaleDateString()}</strong></div>
        </div>
      </div>

      {/* Evidence Photos & Location Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Uploaded Evidence</h4>
          {problem.images && problem.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {problem.images.map((img, i) => (
                <img key={i} src={img} alt="Evidence" className="h-32 w-full object-cover rounded-lg border border-slate-200" />
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400">No photos attached</div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Geotagged Location</h4>
          <LeafletMap lat={problem.latitude} lng={problem.longitude} isInteractive={false} />
        </div>
      </div>

      {/* Stage Control Panel */}
      <div className="bg-slate-900 text-white p-5 rounded-xl shadow-md space-y-3">
        <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
          <span>⚙️</span> Update Problem Solution Stage
        </h4>
        <div className="flex flex-wrap gap-2">
          {window.C2C_DATA.STAGES.map(stg => (
            <button 
              key={stg.id}
              onClick={() => handleUpdateStage(stg.id, stg.status)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                problem.stage === stg.id 
                  ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Stage {stg.id}: {stg.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Enrolled Universities List */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🎓</span> Enrolled Universities ({problem.enrollments ? problem.enrollments.length : 0})
        </h3>

        {(!problem.enrollments || problem.enrollments.length === 0) ? (
          <div className="p-6 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 text-slate-400 text-xs">
            No universities have enrolled for this problem yet. Click "Stage 5: University Enrollment" above to publish to university dashboards.
          </div>
        ) : (
          <div className="space-y-3">
            {problem.enrollments.map(enr => (
              <div key={enr.id} className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-base text-slate-800 dark:text-slate-100">{enr.universityName}</h4>
                    <div className="text-xs text-slate-500">{enr.department}</div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded">NAAC {enr.naacGrade}</span>
                    <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded">NIRF #{enr.nirfRating}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-750">
                  <div><strong>Previous Experience:</strong> {enr.experience}</div>
                  <div><strong>Proposed Technical Solution:</strong> {enr.proposedSolution}</div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-slate-400">Submitted: {new Date(enr.createdAt).toLocaleDateString()}</span>
                  <button 
                    onClick={() => handleAssignUniversity(enr)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow"
                  >
                    Select & Assign University
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminUniversitiesPage({ problems, navigate, t }) {
  return (
    <div className="space-y-6 py-4">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-3">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Jharkhand University Partners</h1>
        <p className="text-xs text-slate-500">Accredited institutions collaborating on public societal problems</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: "Birla Institute of Technology, Mesra", naac: "A+", nirf: "53", location: "Ranchi", dept: "Civil & Environmental Engineering" },
          { name: "Indian Institute of Technology (ISM) Dhanbad", naac: "A++", nirf: "14", location: "Dhanbad", dept: "Environmental Science & Engineering" },
          { name: "National Institute of Technology Jamshedpur", naac: "A", nirf: "90", location: "Jamshedpur", dept: "Mechanical & Production Engineering" },
          { name: "Ranchi University", naac: "B++", nirf: "N/A", location: "Ranchi", dept: "Department of Social Sciences" }
        ].map((u, i) => (
          <div key={i} className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{u.name}</h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">NAAC {u.naac}</span>
            </div>
            <div className="text-xs text-slate-500">{u.location} • NIRF Rank #{u.nirf}</div>
            <div className="text-xs text-slate-400">Primary Dept: {u.dept}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminTrackerPage({ problems, navigate, t }) {
  return (
    <div className="space-y-6 py-4">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-3">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">District Resolution Tracker Matrix</h1>
        <p className="text-xs text-slate-500">Geographic & stage distribution across 24 districts of Jharkhand</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {window.C2C_DATA.DISTRICTS.slice(0, 6).map(dist => {
          const distProbs = problems.filter(p => p.district.includes(dist.split(' ')[0]));
          return (
            <div key={dist} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{dist}</h4>
                <span className="text-xs font-bold bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">{distProbs.length} Problems</span>
              </div>
              <div className="space-y-1">
                {distProbs.map(dp => (
                  <div key={dp.id} className="text-[11px] flex justify-between text-slate-600 dark:text-slate-400">
                    <span className="truncate max-w-[180px]">{dp.title}</span>
                    <span className="font-semibold text-emerald-600">{dp.status}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// UNIVERSITY DASHBOARD & ENROLLMENT FORM
// ----------------------------------------------------------------------
function UniversityDashboard({ problems, user, navigate, t, lang }) {
  const [filterCat, setFilterCat] = useState("All");
  const [filterDist, setFilterDist] = useState("All");

  const openProblems = useMemo(() => {
    return problems.filter(p => {
      if (filterCat !== "All" && p.category !== filterCat) return false;
      if (filterDist !== "All" && p.district !== filterDist) return false;
      return true;
    });
  }, [problems, filterCat, filterDist]);

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-teal-950 p-6 rounded-2xl text-white shadow-md">
        <div>
          <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">University Collaboration Hub</span>
          <h1 className="text-2xl font-extrabold mt-1">Problems Looking for Solutions</h1>
          <p className="text-xs text-slate-300 mt-1">Browse open Jharkhand community challenges and submit technical solution proposals</p>
        </div>
        <button onClick={() => navigate('#/university/enrollments')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700">
          My Enrolled Solutions
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap gap-3 items-center">
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs">
          <option value="All">All Categories</option>
          {window.C2C_DATA.CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterDist} onChange={e => setFilterDist(e.target.value)} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs">
          <option value="All">All Districts</option>
          {window.C2C_DATA.DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Available Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {openProblems.map(p => (
          <div key={p.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">{p.id}</span>
                <span className="text-xs font-semibold text-slate-500">{p.district}</span>
              </div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">{p.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">{p.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-750 flex items-center justify-between">
              <span className="text-xs text-slate-400">{p.enrollments ? p.enrollments.length : 0} Enrollments</span>
              <button 
                onClick={() => navigate(`#/university/problem/${p.id}`)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow"
              >
                View & Enroll →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// University Problem Detail & Enrollment Form Modal
function UniversityProblemDetail({ problemId, problems, setProblems, user, navigate, t }) {
  const problem = problems.find(p => p.id === problemId);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  // Form inputs
  const [univName, setUnivName] = useState(user?.name || '');
  const [officialEmail, setOfficialEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('0651-2275444');
  const [naac, setNaac] = useState(user?.naac || 'A+');
  const [nirf, setNirf] = useState(user?.nirf || '53');
  const [department, setDepartment] = useState(user?.dept || 'Department of Civil Engineering');
  const [experience, setExperience] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!problem) return <div className="p-8 text-center text-slate-500">Problem not found!</div>;

  const alreadyEnrolled = problem.enrollments && problem.enrollments.some(e => e.universityId === officialEmail);

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    if (!experience || !proposedSolution) {
      alert("Please detail your previous experience and proposed solution!");
      return;
    }

    const newEnrollment = {
      id: `ENR-${Math.floor(100 + Math.random() * 900)}`,
      universityId: officialEmail,
      universityName: univName,
      naacGrade: naac,
      nirfRating: nirf,
      department,
      experience,
      proposedSolution,
      status: "Pending Review",
      createdAt: new Date().toISOString()
    };

    setProblems(prev => prev.map(p => {
      if (p.id === problemId) {
        return {
          ...p,
          enrollments: [...(p.enrollments || []), newEnrollment]
        };
      }
      return p;
    }));

    setSubmittedSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <button onClick={() => navigate('#/university/dashboard')} className="text-xs text-emerald-600 font-bold">← Back to Dashboard</button>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded">{problem.id}</span>
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">{problem.title}</h1>
            <div className="text-xs text-slate-500 mt-1">{problem.category} • {problem.district}</div>
          </div>
          {alreadyEnrolled ? (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">✓ Already Enrolled</span>
          ) : (
            <button 
              onClick={() => setShowEnrollModal(true)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow"
            >
              Enroll to Solve Problem
            </button>
          )}
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{problem.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Evidence Images</h4>
          {problem.images && problem.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {problem.images.map((img, i) => (
                <img key={i} src={img} alt="Evidence" className="h-32 w-full object-cover rounded-lg" />
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Geographical Pin</h4>
          <LeafletMap lat={problem.latitude} lng={problem.longitude} isInteractive={false} />
        </div>
      </div>

      {/* Enrollment Form Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            {submittedSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto font-bold">✓</div>
                <h3 className="text-xl font-bold">Enrollment Submitted!</h3>
                <p className="text-xs text-slate-500">Your enrollment has been submitted for admin review.</p>
                <button onClick={() => setShowEnrollModal(false)} className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-lg text-xs">Close</button>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">University Enrollment Form</h3>
                  <button type="button" onClick={() => setShowEnrollModal(false)} className="text-slate-400 font-bold">✕</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Institution Name</label>
                    <input type="text" required value={univName} onChange={e => setUnivName(e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-900 border rounded text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Official Email</label>
                    <input type="email" required value={officialEmail} onChange={e => setOfficialEmail(e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-900 border rounded text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">NAAC Grade</label>
                    <input type="text" value={naac} onChange={e => setNaac(e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-900 border rounded text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">NIRF Rank</label>
                    <input type="text" value={nirf} onChange={e => setNirf(e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-900 border rounded text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Department</label>
                    <input type="text" value={department} onChange={e => setDepartment(e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-900 border rounded text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Previous Work Experience *</label>
                  <textarea rows="2" required placeholder="Detail previous research or field implementation projects..." value={experience} onChange={e => setExperience(e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-900 border rounded text-xs" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Proposed Technical Solution *</label>
                  <textarea rows="3" required placeholder="Describe technical methodology, timeline, equipment, and expected societal impact..." value={proposedSolution} onChange={e => setProposedSolution(e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-900 border rounded text-xs" />
                </div>

                <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow">
                  Submit Enrollment Proposal
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function UniversityEnrollmentsPage({ user, problems, navigate, t }) {
  const myEnrollments = useMemo(() => {
    const list = [];
    problems.forEach(p => {
      if (p.enrollments) {
        p.enrollments.forEach(enr => {
          if (enr.universityId === user.email) {
            list.push({ ...enr, problemTitle: p.title, problemId: p.id });
          }
        });
      }
    });
    return list;
  }, [problems, user]);

  return (
    <div className="space-y-6 py-4">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-3">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">My University Enrollments</h1>
        <p className="text-xs text-slate-500">Submitted solution proposals under admin evaluation</p>
      </div>

      {myEnrollments.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 text-slate-400 text-xs">
          No active enrollments yet. Browse open problems on the dashboard to apply.
        </div>
      ) : (
        <div className="space-y-4">
          {myEnrollments.map(enr => (
            <div key={enr.id} className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">{enr.problemId}</span>
                <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">{enr.status}</span>
              </div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">{enr.problemTitle}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Proposed Solution: {enr.proposedSolution}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// ABOUT US & HOW WE SOLVE PAGES
// ----------------------------------------------------------------------
function AboutPage({ t, lang }) {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-3">
        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-full">
          Platform Overview
        </span>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">About Campus2Community</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t('aboutText')}
        </p>
      </div>

      {/* Founders Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-center text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
          <span>👥</span> {t('foundersTitle')}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {window.C2C_DATA.FOUNDERS.map((f, i) => (
            <div key={i} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center shadow-sm hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-700 text-white rounded-full flex items-center justify-center font-black text-lg mx-auto mb-3 shadow">
                {f.avatar}
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{f.name}</h3>
              <p className="text-[11px] text-slate-500 font-medium">{f.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowItWorksPage({ t, lang }) {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">How We Solve Societal Challenges</h1>
        <p className="text-xs text-slate-500 mt-1">Structured 9-stage problem reporting & university collaboration workflow</p>
      </div>

      <div className="space-y-4">
        {window.C2C_DATA.STAGES.map(stg => (
          <div key={stg.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-600 text-white font-bold text-sm rounded-lg flex items-center justify-center shrink-0 shadow">
              {stg.id}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">{lang === 'hi' ? stg.nameHi : stg.nameEn}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{stg.descEn}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// AI CHATBOT WIDGET
// ----------------------------------------------------------------------
function ChatbotWidget({ chatOpen, setChatOpen, lang, setLang }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: lang === 'hi' ? 'नमस्ते! मैं Campus2Community सहायता असिस्टेंट हूं। मैं आपकी क्या मदद कर सकता हूं?' : 'Hello! I am Campus2Community Help Assistant. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (textToSend = input) => {
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Query matching
    setTimeout(() => {
      const q = textToSend.toLowerCase();
      let matchedFaq = window.C2C_DATA.BOT_FAQ.find(f => f.keywords.some(k => q.includes(k)));

      let botReply = lang === 'hi' 
        ? "माफ़ कीजिये, मैं समझ नहीं पाया। कृपया 'समस्या दर्ज करें', 'ट्रैक', या 'विश्वविद्यालय' से संबंधित सवाल पूछें।"
        : "I am sorry, I couldn't fully understand. Please ask about reporting problems, tracking status, geolocation, or university enrollment.";

      if (matchedFaq) {
        botReply = lang === 'hi' ? matchedFaq.answerHi : matchedFaq.answerEn;
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 400);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!chatOpen ? (
        <button 
          onClick={() => setChatOpen(true)}
          className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl transition-transform hover:scale-105 border-2 border-white dark:border-slate-800"
          title="Campus2Community Help AI Chatbot"
        >
          💬
        </button>
      ) : (
        <div className="bg-white dark:bg-slate-800 w-80 sm:w-96 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col h-96 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <div className="font-bold text-xs leading-none">Campus2Community Help</div>
                <div className="text-[10px] text-emerald-400">AI Assistant • English | सरल हिंदी</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-emerald-300 font-semibold"
              >
                {lang === 'en' ? 'सरल हिंदी' : 'English'}
              </button>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-850 text-xs">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2.5 rounded-xl ${
                  m.sender === 'user' 
                    ? 'bg-emerald-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-600 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick FAQ Chips */}
          <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex gap-1 overflow-x-auto text-[10px] whitespace-nowrap">
            <button onClick={() => handleSend(lang === 'hi' ? "समस्या कैसे दर्ज करें?" : "How do I report a problem?")} className="px-2 py-1 bg-white dark:bg-slate-800 border rounded hover:bg-emerald-50">Report Problem?</button>
            <button onClick={() => handleSend(lang === 'hi' ? "लोकेशन कैसे जोड़ें?" : "How do I add my location?")} className="px-2 py-1 bg-white dark:bg-slate-800 border rounded hover:bg-emerald-50">Location?</button>
            <button onClick={() => handleSend(lang === 'hi' ? "प्रॉब्लम आईडी कहां मिलेगी?" : "Where is my Problem ID?")} className="px-2 py-1 bg-white dark:bg-slate-800 border rounded hover:bg-emerald-50">Problem ID?</button>
            <button onClick={() => handleSend(lang === 'hi' ? "विश्वविद्यालय कैसे एनरोल करें?" : "How can a university enroll?")} className="px-2 py-1 bg-white dark:bg-slate-800 border rounded hover:bg-emerald-50">University Enroll?</button>
          </div>

          {/* Input Bar */}
          <div className="p-2 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <input 
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs focus:outline-none"
            />
            <button onClick={() => handleSend()} className="p-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold px-3">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// FOOTER COMPONENT
// ----------------------------------------------------------------------
function Footer({ t, lang, navigate }) {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
      <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-bold text-sm text-white flex items-center gap-2">
            Campus2Community Jharkhand
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Community Problem-Reporting & University Collaboration Platform for Jharkhand.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-xs">
          <button onClick={() => navigate('#/')} className="hover:text-white">Home</button>
          <button onClick={() => navigate('#/report')} className="hover:text-white">Report Problem</button>
          <button onClick={() => navigate('#/track')} className="hover:text-white">Track Status</button>
          <button onClick={() => navigate('#/how-it-works')} className="hover:text-white">How We Solve</button>
          <button onClick={() => navigate('#/about')} className="hover:text-white">Founders & About</button>
        </div>

        <div className="text-[11px] text-slate-500 text-center md:text-right">
          © 2026 Campus2Community Jharkhand. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// Render Application into Root
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
