import React, { useState } from 'react';
import { VOCABULARY, SENTENCES } from '../constants';
import { VocabularyCategory, VocabularyItem, SentenceItem } from '../types';

type SessionState = 'idle' | 'active' | 'finished';
type PracticeItem = VocabularyItem | SentenceItem;

const RetrievalPracticeView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<VocabularyCategory>('All');
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  
  const [reviewPile, setReviewPile] = useState<PracticeItem[]>([]);
  const [knownPile, setKnownPile] = useState<PracticeItem[]>([]);
  const [currentItem, setCurrentItem] = useState<PracticeItem | null>(null);
  
  const [isRevealed, setIsRevealed] = useState(false);
  const [userInput, setUserInput] = useState('');

  const categories: VocabularyCategory[] = ['All', 'Body Parts & Appearance', 'Food, Drinks & Currency', 'Illness & Health', 'Key Verbs'];

  const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

  const startSession = () => {
    const vocab = activeCategory === 'All' ? Object.values(VOCABULARY).flat() : VOCABULARY[activeCategory] || [];
    const sentences = activeCategory === 'All' ? Object.values(SENTENCES).flat() : SENTENCES[activeCategory] || [];
    const fullDeck = shuffleArray([...vocab, ...sentences]);
    
    if (fullDeck.length === 0) return;

    setReviewPile(fullDeck);
    setKnownPile([]);
    setCurrentItem(fullDeck[0] || null);
    setIsRevealed(false);
    setUserInput('');
    setSessionState('active');
  };

  const nextCard = (pile: PracticeItem[]) => {
    if (pile.length > 0) {
      setCurrentItem(pile[0]);
      setIsRevealed(false);
      setUserInput('');
    } else {
      setSessionState('finished');
      setCurrentItem(null);
    }
  };

  const handleAssessment = (knewIt: boolean) => {
    if (!currentItem) return;

    const currentPile = reviewPile.slice(1);

    if (knewIt) {
      setKnownPile(prev => [...prev, currentItem]);
      setReviewPile(currentPile);
      nextCard(currentPile);
    } else {
      // Re-insert the card into the review pile, e.g., 3 cards away
      const newPile = [...currentPile];
      const reinsertIndex = Math.min(3, newPile.length);
      newPile.splice(reinsertIndex, 0, currentItem);
      setReviewPile(newPile);
      nextCard(newPile);
    }
  };

  const restartSession = () => {
    setSessionState('idle');
  };

  const categoryButtonClasses = (category: VocabularyCategory) =>
    `px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 ${
      activeCategory === category
        ? 'bg-indigo-600 text-white'
        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
    }`;

  const renderIdleView = () => (
    <>
      <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
        Retrieval Practice
      </h2>
      <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
        Actively recall vocabulary and sentences to strengthen your memory. Select a category and start practicing.
      </p>
       <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl shadow-inner mb-6">
        <h3 className="text-xl font-bold mb-4 text-center text-slate-300">Select a Category</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={categoryButtonClasses(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={startSession}
        className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105"
      >
        Start Practice
      </button>
    </>
  );
  
  const renderActiveView = () => {
    if (!currentItem) return null;
    const totalCards = reviewPile.length + knownPile.length;
    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-sm font-medium text-slate-400 mb-1">
                    <span>Reviewing: {reviewPile.length}</span>
                    <span>Mastered: {knownPile.length}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div 
                        className="bg-green-500 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${(knownPile.length / totalCards) * 100}%` }}>
                    </div>
                </div>
            </div>

            {/* Card */}
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg min-h-[250px] flex flex-col justify-center items-center text-center">
                <p className="text-sm text-slate-500 mb-2">What is the Mandarin for:</p>
                <p className="text-3xl font-bold text-slate-100 mb-4">{currentItem.translation}</p>
                
                {isRevealed ? (
                    <div className="text-center animate-fade-in">
                        <p className="text-2xl font-bold text-indigo-300">{currentItem.character}</p>
                        <p className="text-lg text-slate-400">({currentItem.pinyin})</p>
                    </div>
                ) : (
                    <div className="w-full max-w-sm">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Type pinyin here..."
                            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-center text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            aria-label="Your answer for pinyin"
                        />
                        <button 
                            onClick={() => setIsRevealed(true)}
                            className="mt-4 px-6 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition-colors"
                        >
                            Show Answer
                        </button>
                    </div>
                )}
            </div>
            
            {/* Assessment Buttons */}
            {isRevealed && (
                 <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                    <button
                        onClick={() => handleAssessment(false)}
                        className="p-4 w-full text-center font-semibold rounded-lg transition-colors duration-200 bg-red-800 hover:bg-red-700 text-white"
                    >
                        Needs Review
                    </button>
                     <button
                        onClick={() => handleAssessment(true)}
                        className="p-4 w-full text-center font-semibold rounded-lg transition-colors duration-200 bg-green-800 hover:bg-green-700 text-white"
                    >
                        I Knew It!
                    </button>
                </div>
            )}
        </div>
    );
  };

  const renderFinishedView = () => (
     <div className="text-center">
        <h3 className="text-4xl font-bold text-slate-100">Practice Complete!</h3>
        <p className="text-2xl text-slate-300 my-4">
            You mastered <span className="text-green-400 font-bold">{knownPile.length}</span> items in this session.
        </p>
        <button
            onClick={restartSession}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-200"
        >
            Practice Again
        </button>
    </div>
  );

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl text-center min-h-[400px] flex flex-col justify-center items-center">
      {sessionState === 'idle' && renderIdleView()}
      {sessionState === 'active' && renderActiveView()}
      {sessionState === 'finished' && renderFinishedView()}
    </div>
  );
};

export default RetrievalPracticeView;