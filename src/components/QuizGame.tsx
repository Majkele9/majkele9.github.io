import React, { useState, useEffect } from 'react';
import { FALLBACK_QUESTIONS } from '../constants';
import { Question, Difficulty } from '../types';

type GamePhase = 'menu' | 'playing' | 'gameOver';

interface Player {
  id: number;
  chances: number;
  score: number;
  isActive: boolean; // Is it this player's turn?
  isEliminated: boolean;
}

// FIX: Added a trailing comma to the generic type parameter <T,> to resolve parsing ambiguity with JSX syntax in a .tsx file.
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const QuizGame: React.FC = () => {
    const [phase, setPhase] = useState<GamePhase>('menu');
    const [players, setPlayers] = useState<Player[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [winner, setWinner] = useState<Player | null>(null);

    const currentQuestion = questions[currentQuestionIndex];

    useEffect(() => {
        if (currentQuestion) {
            const options = shuffleArray([currentQuestion.correctAnswer, ...currentQuestion.incorrectAnswers]);
            setShuffledOptions(options);
        }
    }, [currentQuestion]);

    const handleStartGame = (playerCount: number, difficulty: Difficulty) => {
        let questionPool: Question[] = [];
        if (difficulty === 'mieszany') {
            questionPool = [...FALLBACK_QUESTIONS.łatwy, ...FALLBACK_QUESTIONS.średni, ...FALLBACK_QUESTIONS.trudny];
        } else {
            questionPool = FALLBACK_QUESTIONS[difficulty];
        }

        setQuestions(shuffleArray(questionPool));
        setPlayers(Array.from({ length: playerCount }, (_, i) => ({
            id: i + 1,
            chances: 3,
            score: 0,
            isActive: i === 0,
            isEliminated: false
        })));
        setCurrentQuestionIndex(0);
        setWinner(null);
        setPhase('playing');
    };

    const nextTurn = () => {
        const activePlayers = players.filter(p => !p.isEliminated);
        if (activePlayers.length <= 1 || currentQuestionIndex >= questions.length - 1) {
            let finalWinner = winner;
            if (!finalWinner) {
                const maxScore = Math.max(...activePlayers.map(p => p.score));
                const topPlayers = activePlayers.filter(p => p.score === maxScore);
                if (topPlayers.length === 1) {
                    finalWinner = topPlayers[0];
                } else {
                    const maxChances = Math.max(...topPlayers.map(p => p.chances));
                    finalWinner = topPlayers.find(p => p.chances === maxChances) || topPlayers[0];
                }
            }
            setWinner(finalWinner);
            setPhase('gameOver');
            return;
        }

        setIsAnswered(false);
        setSelectedAnswer(null);
        setCurrentQuestionIndex(prev => prev + 1);

        setPlayers(prevPlayers => {
            const activePlayerIndex = prevPlayers.findIndex(p => p.isActive);
            const nextPlayers = [...prevPlayers];
            nextPlayers[activePlayerIndex].isActive = false;

            let nextPlayerIndex = (activePlayerIndex + 1) % nextPlayers.length;
            while (nextPlayers[nextPlayerIndex].isEliminated) {
                nextPlayerIndex = (nextPlayerIndex + 1) % nextPlayers.length;
            }
            nextPlayers[nextPlayerIndex].isActive = true;
            return nextPlayers;
        });
    };

    const handleAnswer = (answer: string) => {
        if (isAnswered) return;

        setSelectedAnswer(answer);
        setIsAnswered(true);

        const activePlayerIndex = players.findIndex(p => p.isActive);
        const newPlayers = [...players];
        const player = newPlayers[activePlayerIndex];

        if (answer === currentQuestion.correctAnswer) {
            player.score += 1;
        } else {
            player.chances -= 1;
            if (player.chances === 0) {
                player.isEliminated = true;
            }
        }

        setPlayers(newPlayers);

        const remainingPlayers = newPlayers.filter(p => !p.isEliminated);
        if (remainingPlayers.length === 1) {
            setWinner(remainingPlayers[0]);
            setPhase('gameOver');
        } else {
            setTimeout(nextTurn, 2000);
        }
    };
    
    if (phase === 'menu') {
        return <Menu onStart={handleStartGame} />;
    }

    if (phase === 'gameOver') {
        return (
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-3xl font-bold text-amber-400 mb-4">Koniec Gry!</h2>
                {winner ? (
                    <p className="text-xl">Zwycięzcą jest Gracz {winner.id} z {winner.score} punktami!</p>
                ) : (
                    <p className="text-xl">Gra zakończona remisem!</p>
                )}
                <button onClick={() => setPhase('menu')} className="mt-6 px-8 py-3 bg-amber-600 hover:bg-amber-500 rounded-md font-bold text-white transition-colors text-lg">
                    Zagraj Ponownie
                </button>
            </div>
        );
    }

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <div className="mb-4">
                <div className="flex justify-center gap-4 flex-wrap">
                    {players.map(player => (
                        <div key={player.id} className={`p-3 rounded-lg text-center transition-all ${player.isActive ? 'bg-amber-500 text-slate-900' : 'bg-slate-700'} ${player.isEliminated ? 'opacity-40' : ''}`}>
                            <div className="font-bold">Gracz {player.id}</div>
                            <div className="flex justify-center items-center gap-1 mt-1">
                                {[...Array(player.chances)].map((_, i) => <span key={i}>🍺</span>)}
                            </div>
                            <div>Pkt: {player.score}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-xl text-center font-medium text-slate-200 min-h-[80px] flex items-center justify-center bg-slate-700/50 p-4 rounded-lg">
                    {currentQuestion.question}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shuffledOptions.map((option, index) => {
                         const getButtonClass = () => {
                            if (!isAnswered) return 'bg-slate-700 hover:bg-slate-600';
                            if (option === currentQuestion.correctAnswer) return 'bg-green-600';
                            if (option === selectedAnswer) return 'bg-red-600';
                            return 'bg-slate-700 opacity-50';
                        };
                        return (
                             <button
                                key={index}
                                onClick={() => handleAnswer(option)}
                                disabled={isAnswered}
                                className={`p-4 rounded-lg text-lg transition-colors duration-300 w-full ${getButtonClass()}`}
                            >
                                {option}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

const Menu: React.FC<{ onStart: (playerCount: number, difficulty: Difficulty) => void }> = ({ onStart }) => {
    const [playerCount, setPlayerCount] = useState<number>(4);
    const [difficulty, setDifficulty] = useState<Difficulty>('łatwy');
    
    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-3xl font-bold text-amber-400 mb-6">Witaj w Teleturnieju!</h2>
            
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Wybierz tryb gry:</h3>
                <div className="flex justify-center flex-wrap gap-2">
                    {[4, 5, 6, 7].map(count => (
                        <button key={count} onClick={() => setPlayerCount(count)} className={`px-4 py-2 rounded-md font-semibold ${playerCount === count ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 hover:bg-slate-600'}`}>
                            1 z {count}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Wybierz poziom trudności:</h3>
                <div className="flex justify-center flex-wrap gap-2">
                    {(['łatwy', 'średni', 'trudny', 'mieszany'] as Difficulty[]).map(level => (
                        <button key={level} onClick={() => setDifficulty(level)} className={`px-4 py-2 rounded-md font-semibold capitalize ${difficulty === level ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 hover:bg-slate-600'}`}>
                            {level}
                        </button>
                    ))}
                </div>
            </div>

            <button onClick={() => onStart(playerCount, difficulty)} className="w-full max-w-xs mx-auto px-8 py-3 bg-amber-600 hover:bg-amber-500 rounded-md font-bold text-white transition-colors text-lg">
                Rozpocznij Grę
            </button>
        </div>
    );
}

export default QuizGame;
