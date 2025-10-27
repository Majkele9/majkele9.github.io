import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface RandomBetScenario {
    question: string;
    optionA: string;
    optionB: string;
    correctOption?: 'A' | 'B';
}

interface RandomBetHistoryEntry {
    id: number;
    question: string;
    selection: string;
    outcome: 'won' | 'lost';
    stake: number;
    winnings: number;
    timestamp: Date;
}

const SWAP_COST = 20;
const BONUS_THRESHOLD = 5;
const BONUS_AMOUNT = 250;
const CATEGORIES = ['Absurdalne', 'Sport', 'Historia', 'Nauka', 'Technologia', 'Popkultura', 'Rynki finansowe/Kryptowaluty', 'Transport', 'NSFW'];

const SCENARIOS_DATABASE: { [key: string]: RandomBetScenario[] } = {
    'Absurdalne': [
        { question: "Czy jeśli kot wyląduje na księżycu, to czy jego mruczenie będzie słyszalne w próżni?", optionA: "Tak, ale tylko dla innych kotów.", optionB: "Nie, ale za to zrzuci coś z krawędzi krateru." },
        { question: "Co by się stało, gdyby gołębie zorganizowały się w profesjonalną ligę koszykówki?", optionA: "Mecze byłyby krótkie, bo ciągle gubiłyby piłkę.", optionB: "Największym sponsorem zostałaby firma produkująca chleb." },
        { question: "Kto wygrałby w wyścigu: ślimak z napędem rakietowym czy żółw na deskorolce?", optionA: "Ślimak, bo ma lepszą aerodynamikę.", optionB: "Żółw, bo ma lepszą przyczepność." },
        { question: "Czy kanapka posmarowana masłem zawsze spada masłem na dół, nawet w stanie nieważkości?", optionA: "Tak, to fundamentalne prawo fizyki.", optionB: "Nie, w kosmosie kanapka zaczyna lewitować i kwestionować sens istnienia." },
        { question: "Gdyby kaczki nosiły spodnie, nosiłyby je na nogach czy na całym ciele?", optionA: "Tylko na nogach, jak normalni ludzie.", optionB: "Na całym ciele, jak kombinezon, dla lepszej opływowości." },
    ],
    'Sport': [
        { question: "W którym roku Polska zajęła 3. miejsce na Mistrzostwach Świata w Piłce Nożnej?", optionA: "1974", optionB: "1986", correctOption: 'A' },
        { question: "Który skoczek narciarski jako pierwszy przekroczył granicę 250 metrów?", optionA: "Peter Prevc", optionB: "Johan Remen Evensen", correctOption: 'B'},
    ],
    'Historia': [
        { question: "W którym roku miała miejsce bitwa pod Grunwaldem?", optionA: "1410", optionB: "1525", correctOption: 'A' },
        { question: "Kto był pierwszym królem Polski?", optionA: "Mieszko I", optionB: "Bolesław Chrobry", correctOption: 'B' },
    ],
    'Nauka': [
        { question: "Jaki pierwiastek chemiczny ma symbol 'Au'?", optionA: "Srebro", optionB: "Złoto", correctOption: 'B' },
        { question: "Która planeta jest nazywana 'Czerwoną Planetą'?", optionA: "Mars", optionB: "Jowisz", correctOption: 'A' },
    ],
    'Technologia': [
        { question: "Co oznacza skrót 'HTTP'?", optionA: "HyperText Transfer Protocol", optionB: "High-Tech Transfer Protocol", correctOption: 'A' },
        { question: "Która firma stworzyła system operacyjny Android?", optionA: "Apple", optionB: "Google", correctOption: 'B' },
    ],
    'Popkultura': [
        { question: "Kto zagrał główną rolę w filmie 'Matrix'?", optionA: "Keanu Reeves", optionB: "Tom Cruise", correctOption: 'A' },
        { question: "Jak nazywa się fikcyjne miasto, w którym mieszka Batman?", optionA: "Metropolis", optionB: "Gotham City", correctOption: 'B' },
    ],
    'Rynki finansowe/Kryptowaluty': [
        { question: "Jak nazywa się pierwsza i najbardziej znana kryptowaluta?", optionA: "Ethereum", optionB: "Bitcoin", correctOption: 'B' },
        { question: "Co oznacza skrót 'giełda papierów wartościowych'?", optionA: "GPW", optionB: "NBP", correctOption: 'A' },
    ],
     'Transport': [
        { question: "Który kraj jest znany z produkcji samochodów marki Ferrari?", optionA: "Niemcy", optionB: "Włochy", correctOption: 'B' },
        { question: "Jak nazywa się największy pasażerski samolot na świecie?", optionA: "Boeing 747", optionB: "Airbus A380", correctOption: 'B' },
    ],
     'NSFW': [
        { question: "W którym kraju powstał portal 'Pornhub'?", optionA: "Stany Zjednoczone", optionB: "Kanada", correctOption: 'B' },
        { question: "Jak potocznie nazywa się akt prawny 'Stop Online Piracy Act'?", optionA: "SOPA", optionB: "PIPA", correctOption: 'A' },
    ],
};


const RandomBettingGame: React.FC = () => {
    const [balance, setBalance] = useState<number>(() => {
        const savedBalance = localStorage.getItem('piwneBetyRandomBalance');
        return savedBalance ? JSON.parse(savedBalance) : 1000;
    });
    const [scenario, setScenario] = useState<RandomBetScenario | null>(null);
    const [stake, setStake] = useState<string>('100');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [resultMessage, setResultMessage] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('Absurdalne');
    const [bonusCounter, setBonusCounter] = useState<number>(() => {
        const savedCounter = localStorage.getItem('piwneBetyBonusCounter');
        return savedCounter ? JSON.parse(savedCounter) : 0;
    });
    const [bonusMessage, setBonusMessage] = useState<string | null>(null);
    const [betHistory, setBetHistory] = useState<RandomBetHistoryEntry[]>(() => {
        try {
            const savedHistory = localStorage.getItem('piwneBetyRandomHistory');
            if (savedHistory) {
                const parsedHistory = JSON.parse(savedHistory);
                if (Array.isArray(parsedHistory)) {
                    return parsedHistory.map((bet: any) => ({
                        ...bet,
                        timestamp: new Date(bet.timestamp)
                    }));
                }
            }
        } catch (error) {
            console.error("Błąd podczas wczytywania historii losowych zakładów:", error);
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('piwneBetyRandomBalance', JSON.stringify(balance));
    }, [balance]);

    useEffect(() => {
        localStorage.setItem('piwneBetyBonusCounter', JSON.stringify(bonusCounter));
    }, [bonusCounter]);
    
    useEffect(() => {
        try {
            localStorage.setItem('piwneBetyRandomHistory', JSON.stringify(betHistory));
        } catch (error) {
            console.error("Błąd podczas zapisywania historii losowych zakładów:", error);
        }
    }, [betHistory]);

    const getNextScenario = useCallback(() => {
        const scenariosForCategory = SCENARIOS_DATABASE[selectedCategory] || SCENARIOS_DATABASE['Absurdalne'];
        const randomScenario = scenariosForCategory[Math.floor(Math.random() * scenariosForCategory.length)];
        setScenario(randomScenario);
        setSelectedOption(null);
        setResultMessage(null);
    }, [selectedCategory]);

    useEffect(() => {
        getNextScenario();
    }, [selectedCategory, getNextScenario]);


    const handleSwapBet = () => {
        if (balance >= SWAP_COST) {
            getNextScenario();
            setBalance(balance - SWAP_COST);
        }
    };
    
    const handleTopUp = () => {
        setBalance(balance + 1000);
    };

    const handlePlaceBet = () => {
        if (!scenario || !selectedOption) return;
        const numericStake = parseInt(stake, 10);
        if (isNaN(numericStake) || numericStake <= 0 || numericStake > balance) {
            setResultMessage("Wybierz opcję i podaj prawidłową stawkę (nie większą niż stan konta).");
            return;
        }

        const isAbsurd = !scenario.correctOption;
        let isWin: boolean;
        let winningOption: string;
        
        if (isAbsurd) {
            isWin = Math.random() < 0.5;
            winningOption = isWin ? selectedOption : (selectedOption === scenario.optionA ? scenario.optionB : scenario.optionA);
        } else {
            const correctOptionIsA = scenario.correctOption === 'A';
            winningOption = correctOptionIsA ? scenario.optionA : scenario.optionB;
            isWin = selectedOption === winningOption;
        }

        const odds = 2.0;
        const payout = numericStake * odds;

        const newHistoryEntry: RandomBetHistoryEntry = {
            id: Date.now(),
            question: scenario.question,
            selection: selectedOption,
            outcome: isWin ? 'won' : 'lost',
            stake: numericStake,
            winnings: isWin ? payout - numericStake : -numericStake,
            timestamp: new Date(),
        };
        setBetHistory(prev => [newHistoryEntry, ...prev]);

        if (isWin) {
            setBalance(balance - numericStake + payout);
            setResultMessage(`Wygrałeś! Prawidłowa odpowiedź to: "${winningOption}". Wygrywasz ${payout} monet!`);
        } else {
            setBalance(balance - numericStake);
            setResultMessage(`Przegrałeś! Prawidłowa odpowiedź to: "${winningOption}". Tracisz ${numericStake} monet.`);
        }

        const newBonusCounter = bonusCounter + 1;
        if (newBonusCounter >= BONUS_THRESHOLD) {
            setBalance(prevBalance => prevBalance + BONUS_AMOUNT);
            setBonusMessage(`Gratulacje! Otrzymujesz bonus ${BONUS_AMOUNT} monet za postawienie ${BONUS_THRESHOLD} zakładów!`);
            setBonusCounter(0);
            setTimeout(() => {
                setBonusMessage(null);
            }, 5000);
        } else {
            setBonusCounter(newBonusCounter);
        }

        setTimeout(getNextScenario, 3000);
    };
    
     const groupedHistory = useMemo(() => {
        const groups: { [date: string]: RandomBetHistoryEntry[] } = {};
        betHistory.forEach(bet => {
            const dateKey = bet.timestamp.toLocaleDateString('pl-PL');
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(bet);
        });
        return groups;
    }, [betHistory]);

    return (
        <div className="space-y-8">
            {bonusMessage && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 font-bold p-4 rounded-lg shadow-xl z-50 animate-fade-in-out">
                    {bonusMessage}
                </div>
            )}
            <div className="bg-slate-800 p-4 md:p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
                 <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                    <div className="flex-grow">
                        <h2 className="text-2xl font-bold text-amber-400 mb-2">Nowy Zakład</h2>
                        <button 
                            onClick={handleSwapBet}
                            disabled={balance < SWAP_COST || !!resultMessage}
                            className="px-3 py-1 text-sm bg-slate-600 hover:bg-slate-500 rounded-md font-semibold transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Wymień zakład (-{SWAP_COST} monet)
                        </button>
                    </div>
                     <div className="bg-slate-700 p-3 rounded-md w-full md:w-auto md:min-w-[250px] shadow-inner space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Stan konta:</span>
                            <span className="font-bold text-lg text-green-400">{balance} monet</span>
                        </div>
                         {balance < 100 && (
                             <button
                                onClick={handleTopUp}
                                className="w-full px-3 py-1 text-xs bg-green-600 hover:bg-green-500 rounded-md font-semibold transition-colors"
                            >
                                Doładuj (+1000)
                            </button>
                        )}
                        <div>
                            <p className="text-xs text-slate-300 mb-1 text-center">
                                Postęp bonusu ({bonusCounter}/{BONUS_THRESHOLD})
                            </p>
                            <div className="w-full bg-slate-600 rounded-full h-2">
                                <div 
                                    className="bg-amber-500 h-2 rounded-full transition-all duration-300" 
                                    style={{ width: `${(bonusCounter / BONUS_THRESHOLD) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-amber-400 mb-3">Wybierz kategorię:</h3>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                disabled={!!resultMessage}
                                className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 ${selectedCategory === category ? 'bg-amber-500 text-slate-900' : 'bg-slate-600 hover:bg-slate-500'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {scenario && (
                    <div className="space-y-6">
                        <p className="text-lg text-center text-slate-300 min-h-[60px] flex items-center justify-center">{scenario.question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => setSelectedOption(scenario.optionA)}
                                disabled={!!resultMessage}
                                className={`p-4 rounded-lg text-center transition-all h-full min-h-[80px] flex items-center justify-center ${selectedOption === scenario.optionA ? 'bg-amber-500 text-slate-900 ring-2 ring-amber-300' : 'bg-slate-700 hover:bg-slate-600'} disabled:cursor-not-allowed disabled:bg-slate-700/50`}
                            >
                                {scenario.optionA}
                            </button>
                            <button
                                onClick={() => setSelectedOption(scenario.optionB)}
                                disabled={!!resultMessage}
                                className={`p-4 rounded-lg text-center transition-all h-full min-h-[80px] flex items-center justify-center ${selectedOption === scenario.optionB ? 'bg-amber-500 text-slate-900 ring-2 ring-amber-300' : 'bg-slate-700 hover:bg-slate-600'} disabled:cursor-not-allowed disabled:bg-slate-700/50`}
                            >
                                {scenario.optionB}
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <label htmlFor="stake" className="font-semibold">Stawka:</label>
                            <input
                                id="stake"
                                type="number"
                                value={stake}
                                onChange={(e) => setStake(e.target.value)}
                                disabled={!!resultMessage}
                                className="w-32 p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-800"
                            />
                            <button
                                onClick={handlePlaceBet}
                                disabled={!selectedOption || !!resultMessage}
                                className="px-6 py-2 bg-slate-600 hover:bg-amber-600 rounded-md font-bold text-white transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed"
                            >
                                Postaw zakład!
                            </button>
                        </div>

                        {resultMessage && (
                            <div className={`mt-4 p-4 rounded-lg text-center ${resultMessage.includes('Wygrałeś') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                {resultMessage}
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {betHistory.length > 0 && (
                <div className="bg-slate-800 p-4 md:p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
                    <h2 className="text-2xl font-bold text-amber-400 mb-4">Historia Losowych Betów</h2>
                    <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                         {Object.entries(groupedHistory).map(([date, bets]) => (
                             <div key={date}>
                                <h3 className="text-xl font-semibold text-slate-400 mb-3 pb-2 border-b border-slate-700 sticky top-0 bg-slate-800 py-2">{date}</h3>
                                <div className="space-y-4">
                                    {Array.isArray(bets) && bets.map(bet => {
                                        const isWin = bet.outcome === 'won';
                                        const statusColor = isWin ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10';
                                        const profitText = isWin ? `+${bet.winnings.toFixed(0)}` : `${bet.winnings.toFixed(0)}`;
                                        
                                        return (
                                            <div key={bet.id} className={`p-4 rounded-lg border-l-4 ${statusColor} bg-slate-700`}>
                                                <p className="font-bold text-slate-300">"{bet.question}"</p>
                                                <p>Obstawiono: <span className="font-semibold text-amber-400">{bet.selection}</span></p>
                                                <p>Stawka: <span className="font-semibold">{bet.stake}</span> monet</p>
                                                <p>Wynik: <span className={`font-bold ${isWin ? 'text-green-400' : 'text-red-400'}`}>{profitText} monet</span></p>
                                                <p className="text-xs text-slate-400 mt-1">{bet.timestamp.toLocaleString('pl-PL')}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RandomBettingGame;