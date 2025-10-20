import React, { useState } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { LoadingSpinner, WarningIcon, SparklesIcon } from './icons/Icons';

type QuizState = 'idle' | 'generating' | 'active' | 'finished';

const QuizGenerator: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);

  const handleGenerate = async () => {
    setQuizState('generating');
    setError(null);
    setQuestions([]);
    try {
      const generated = await generateQuizQuestions();
      setQuestions(generated);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setQuizState('active');
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setQuizState('idle');
    }
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (selectedAnswer !== null) return; // Prevent changing answer

    setSelectedAnswer(optionIndex);
    if (optionIndex === questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizState('finished');
    }
  };
  
  const handleRestart = () => {
    setQuizState('idle');
    setQuestions([]);
  };

  const renderContent = () => {
    switch (quizState) {
      case 'generating':
        return (
          <div className="text-center">
             <button disabled className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-indigo-400 text-white font-semibold rounded-lg shadow-lg cursor-not-allowed">
                <LoadingSpinner />
                Generating Quiz...
            </button>
          </div>
        );

      case 'active':
        const currentQuestion = questions[currentQuestionIndex];
        return (
          <div className="text-left max-w-2xl mx-auto">
            <div className="mb-4 text-center">
              <p className="text-slate-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
              <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-6 text-center">{currentQuestion.question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = currentQuestion.correctAnswerIndex === index;
                let buttonClass = 'bg-slate-700 hover:bg-slate-600';
                if (selectedAnswer !== null) {
                  if (isCorrect) {
                    buttonClass = 'bg-green-600';
                  } else if (isSelected && !isCorrect) {
                    buttonClass = 'bg-red-600';
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`p-4 w-full text-left font-semibold rounded-lg transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-80 ${buttonClass}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {selectedAnswer !== null && (
              <div className="text-center mt-6">
                <button
                  onClick={handleNextQuestion}
                  className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-200"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </button>
              </div>
            )}
          </div>
        );

      case 'finished':
        return (
          <div className="text-center">
            <h3 className="text-4xl font-bold text-slate-100">Quiz Complete!</h3>
            <p className="text-2xl text-slate-300 my-4">
              You scored <span className="text-green-400 font-bold">{score}</span> out of <span className="font-bold">{questions.length}</span>!
            </p>
            <button
              onClick={handleRestart}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-200"
            >
              Try a New Quiz
            </button>
          </div>
        );

      case 'idle':
      default:
        return (
          <>
            <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
              Ready to test your knowledge? Click the button to start a 20-question quiz generated from your vocabulary list. Good luck!
            </p>
            <button
              onClick={handleGenerate}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
            >
              <SparklesIcon />
              Quiz Me
            </button>
          </>
        );
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl text-center min-h-[300px] flex flex-col justify-center">
      <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
        Quiz Time
      </h2>
      
      {renderContent()}

      {error && quizState === 'idle' && (
        <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg flex items-center gap-3 justify-center max-w-2xl mx-auto">
          <WarningIcon />
          <span><strong>Error:</strong> {error}</span>
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;