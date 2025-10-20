import React, { useState } from 'react';
import PracticeView from './components/PracticeView';
import QuizGenerator from './components/KahootGenerator'; // Filename is the same, but component is renamed
import { BookOpenIcon, SparklesIcon, BrainIcon } from './components/icons/Icons';
import RetrievalPracticeView from './components/RetrievalPracticeView';

type View = 'practice' | 'retrieval' | 'quiz';

const App: React.FC = () => {
  const [view, setView] = useState<View>('practice');

  const navButtonClasses = (isActive: boolean) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-lg'
        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-2">
            Mandarin Revision Hub
          </h1>
          <p className="text-slate-400 text-lg">
            Time to Practice
          </p>
        </header>

        <nav className="flex flex-wrap justify-center gap-4 mb-8">
          <button onClick={() => setView('practice')} className={navButtonClasses(view === 'practice')}>
            <BookOpenIcon />
            Practice Mode
          </button>
          <button onClick={() => setView('retrieval')} className={navButtonClasses(view === 'retrieval')}>
            <BrainIcon />
            Retrieval Practice
          </button>
          <button onClick={() => setView('quiz')} className={navButtonClasses(view === 'quiz')}>
            <SparklesIcon />
            Quiz Mode
          </button>
        </nav>

        <main>
          {view === 'practice' && <PracticeView />}
          {view === 'retrieval' && <RetrievalPracticeView />}
          {view === 'quiz' && <QuizGenerator />}
        </main>
      </div>
       <footer className="text-center mt-12 text-slate-500 text-sm">
        <p>Built for Year 10 students.</p>
      </footer>
    </div>
  );
};

export default App;