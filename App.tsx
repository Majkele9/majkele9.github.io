import React, { useState } from 'react';
import BettingGame from './components/BettingGame';
import RandomBettingGame from './components/RandomBettingGame';
import TeamDrafter from './components/TeamDrafter';
import QuizGame from './components/QuizGame';

type Tab = 'random' | 'manual' | 'team-drafter' | 'quiz';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('random');

  const Header = () => (
    <header className="bg-slate-800 p-4 shadow-lg flex items-center space-x-4">
      <div className="text-5xl">🍺</div>
      <div>
        <h1 className="text-3xl font-bold text-amber-400">Piwne Bety</h1>
        <p className="text-slate-400">Twój symulator zakładów i teleturniejów.</p>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <div className="flex-grow">
        <Header />
        <div className="p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex border-b border-slate-700 mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('random')}
                className={`py-2 px-4 text-lg font-semibold transition-colors duration-300 shrink-0 ${activeTab === 'random' ? 'border-b-2 border-amber-400 text-amber-400' : 'text-slate-400 hover:text-amber-300'}`}
              >
                Losowe Bety
              </button>
              <button
                onClick={() => setActiveTab('manual')}
                className={`py-2 px-4 text-lg font-semibold transition-colors duration-300 shrink-0 ${activeTab === 'manual' ? 'border-b-2 border-amber-400 text-amber-400' : 'text-slate-400 hover:text-amber-300'}`}
              >
                Zakłady
              </button>
              <button
                onClick={() => setActiveTab('team-drafter')}
                className={`py-2 px-4 text-lg font-semibold transition-colors duration-300 shrink-0 ${activeTab === 'team-drafter' ? 'border-b-2 border-amber-400 text-amber-400' : 'text-slate-400 hover:text-amber-300'}`}
              >
                Losowanie Drużyn
              </button>
               <button
                onClick={() => setActiveTab('quiz')}
                className={`py-2 px-4 text-lg font-semibold transition-colors duration-300 shrink-0 ${activeTab === 'quiz' ? 'border-b-2 border-amber-400 text-amber-400' : 'text-slate-400 hover:text-amber-300'}`}
              >
                Teleturniej
              </button>
            </div>
            <main>
              {activeTab === 'random' && <RandomBettingGame />}
              {activeTab === 'manual' && <BettingGame />}
              {activeTab === 'team-drafter' && <TeamDrafter />}
              {activeTab === 'quiz' && <QuizGame />}
            </main>
          </div>
        </div>
      </div>
      <footer className="text-center p-4 text-slate-500 text-sm">
        Powered by Google and Knur
      </footer>
    </div>
  );
};

export default App;