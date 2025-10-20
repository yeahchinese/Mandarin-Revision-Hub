import React, { useState, useMemo, useEffect } from 'react';
import { VOCABULARY, SENTENCES } from '../constants';
import { VocabularyCategory, VocabularyItem, SentenceItem } from '../types';
import { ShuffleIcon } from './icons/Icons';

const InteractivePracticeCard: React.FC<{ item: VocabularyItem | SentenceItem }> = ({ item }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`card group [perspective:1000px] cursor-pointer h-full ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsFlipped(!isFlipped)}
      aria-pressed={isFlipped}
      aria-label={`Flashcard for ${item.character}. Click to see translation.`}
    >
      <div className="card-inner relative w-full h-full min-h-[120px] rounded-lg shadow-lg">
        {/* Front of Card */}
        <div className="card-front absolute w-full h-full bg-slate-800 p-4 rounded-lg flex flex-col justify-center items-center text-center">
          <p className="text-xl font-bold text-indigo-300">{item.character}</p>
          <p className="text-md text-slate-400">({item.pinyin})</p>
          <p className="absolute bottom-2 text-xs text-slate-500 group-hover:opacity-100 opacity-0 transition-opacity">
            Click to reveal
          </p>
        </div>

        {/* Back of Card */}
        <div className="card-back absolute w-full h-full bg-slate-700 p-4 rounded-lg flex flex-col justify-center items-center text-center">
          <p className="text-lg text-white">{item.translation}</p>
        </div>
      </div>
    </div>
  );
};


const PracticeView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<VocabularyCategory>('All');
  const [shuffledVocab, setShuffledVocab] = useState<VocabularyItem[]>([]);
  const [shuffledSentences, setShuffledSentences] = useState<SentenceItem[]>([]);

  const categories: VocabularyCategory[] = ['All', 'Body Parts & Appearance', 'Food, Drinks & Currency', 'Illness & Health', 'Key Verbs'];

  const filteredVocab = useMemo(() => {
    if (activeCategory === 'All') {
      return Object.values(VOCABULARY).flat();
    }
    return VOCABULARY[activeCategory] || [];
  }, [activeCategory]);
  
  const filteredSentences = useMemo(() => {
    if (activeCategory === 'All') {
      return Object.values(SENTENCES).flat();
    }
    return SENTENCES[activeCategory] || [];
  }, [activeCategory]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    setShuffledVocab(shuffleArray(filteredVocab));
    setShuffledSentences(shuffleArray(filteredSentences));
  }, [filteredVocab, filteredSentences]);

  const handleShuffleVocab = () => setShuffledVocab(shuffleArray(filteredVocab));
  const handleShuffleSentences = () => setShuffledSentences(shuffleArray(filteredSentences));

  const categoryButtonClasses = (category: VocabularyCategory) =>
    `px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 ${
      activeCategory === category
        ? 'bg-indigo-600 text-white'
        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
    }`;
    
  const shuffleButtonClasses = "p-2 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500";


  return (
    <div className="space-y-8">
      <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Filter by Category</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={categoryButtonClasses(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-center items-center gap-4 mb-4">
            <h3 className="text-3xl font-bold text-slate-200 border-b-2 border-indigo-500 pb-2">Vocabulary</h3>
            <button onClick={handleShuffleVocab} className={shuffleButtonClasses} aria-label="Shuffle vocabulary">
                <ShuffleIcon />
            </button>
        </div>
        {shuffledVocab.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {shuffledVocab.map((item, index) => (
              <InteractivePracticeCard key={`vocab-${index}`} item={item} />
            ))}
          </div>
        ) : <p className="text-center text-slate-400">No vocabulary in this category.</p>}
      </div>
      
      <div>
        <div className="flex justify-center items-center gap-4 mb-4">
            <h3 className="text-3xl font-bold text-slate-200 border-b-2 border-indigo-500 pb-2">Example Sentences</h3>
            <button onClick={handleShuffleSentences} className={shuffleButtonClasses} aria-label="Shuffle sentences">
                <ShuffleIcon />
            </button>
        </div>
        {shuffledSentences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shuffledSentences.map((item, index) => (
              <InteractivePracticeCard key={`sentence-${index}`} item={item} />
            ))}
          </div>
        ) : <p className="text-center text-slate-400">No sentences in this category.</p>}
      </div>
    </div>
  );
};

export default PracticeView;