


import React, { useState, useMemo, useEffect } from 'react';

type BetStatus = 'pending' | 'won' | 'lost';

interface Player {
    name: string;
    odds: string;
}

interface PlacedBet {
    id: number;
    players: Player[];
    selection: string;
    stake: number;
    potentialReturn: number;
    status: BetStatus;
    timestamp: Date;
    note?: string;
}

const BettingGame: React.FC = () => {
    const [numberOfPlayers, setNumberOfPlayers] = useState(2);
    const [players, setPlayers] = useState<Player[]>(() => Array.from({ length: 2 }, () => ({ name: '', odds: '' })));
    const [stake, setStake] = useState<string>('10');
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
    const [betNote, setBetNote] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    const [betHistory, setBetHistory] = useState<PlacedBet[]>(() => {
        try {
            const savedHistory = localStorage.getItem('piwneBetyHistory');
            if (savedHistory) {
                const parsedHistory = JSON.parse(savedHistory);
                // FIX: Property 'map' does not exist on type 'unknown'. This can happen when localStorage data is not an array,
                // or when an object within the array is malformed (e.g., missing the 'players' array).
                // We ensure parsedHistory is an array and filter its contents to be safe.
                if (Array.isArray(parsedHistory)) {
                    return parsedHistory.filter(bet => Array.isArray(bet?.players)).map((bet: any) => ({
                        ...bet,
                        timestamp: new Date(bet.timestamp)
                    }));
                }
            }
        } catch (error) {
            console.error("Błąd podczas wczytywania historii zakładów:", error);
        }
        return [];
    });

    useEffect(() => {
        try {
            localStorage.setItem('piwneBetyHistory', JSON.stringify(betHistory));
        } catch (error) {
            console.error("Błąd podczas zapisywania historii zakładów:", error);
        }
    }, [betHistory]);


    const handlePlayerCountChange = (count: number) => {
        setNumberOfPlayers(count);
        setPlayers(Array.from({ length: count }, (_, i) => players[i] || { name: '', odds: '' }));
        setSelectedPlayer(null);
    };

    const handlePlayerChange = (index: number, field: keyof Player, value: string) => {
        const newPlayers = [...players];
        newPlayers[index][field] = value;
        setPlayers(newPlayers);
    };
    
    const handleRandomizeOdds = () => {
        const newPlayers = players.map(player => ({
            ...player,
            odds: (Math.random() * 4 + 1.1).toFixed(2)
        }));
        setPlayers(newPlayers);
    };

    const handlePlaceBet = () => {
        if (!selectedPlayer || !stake || parseFloat(stake) <= 0) {
            alert("Proszę wybrać stronę i podać prawidłową stawkę.");
            return;
        }
        const selectedPlayerData = players.find(p => p.name === selectedPlayer);
        if (!selectedPlayerData) return;

        const numericStake = parseFloat(stake);
        const numericOdds = parseFloat(selectedPlayerData.odds);
        const potentialReturn = numericStake * numericOdds;

        const newBet: PlacedBet = {
            id: Date.now(),
            players,
            selection: selectedPlayer,
            stake: numericStake,
            potentialReturn,
            status: 'pending',
            timestamp: new Date(),
            note: betNote.trim() || undefined,
        };
        setBetHistory(prevHistory => [newBet, ...prevHistory]);
        setBetNote('');
        setSelectedPlayer(null);
        setStake('10');
    };

    const handleBetStatusChange = (id: number, status: 'won' | 'lost') => {
        setBetHistory(betHistory.map(bet => bet.id === id ? { ...bet, status } : bet));
    };
    
    const toggleSortOrder = () => {
        setSortOrder(prevOrder => prevOrder === 'desc' ? 'asc' : 'desc');
    };

    const potentialReturn = useMemo(() => {
        const selectedPlayerData = players.find(p => p.name === selectedPlayer);
        const numericStake = parseFloat(stake);
        if (selectedPlayerData && numericStake > 0) {
            const numericOdds = parseFloat(selectedPlayerData.odds);
            if (numericOdds > 0) {
                return (numericStake * numericOdds).toFixed(2);
            }
        }
        return '0.00';
    }, [selectedPlayer, stake, players]);

    const sortedHistory = useMemo(() => {
        return [...betHistory].sort((a, b) => {
            if (sortOrder === 'desc') {
                return b.timestamp.getTime() - a.timestamp.getTime();
            }
            return a.timestamp.getTime() - b.timestamp.getTime();
        });
    }, [betHistory, sortOrder]);

    const groupedHistory = useMemo(() => {
        const groups: { [date: string]: PlacedBet[] } = {};
        sortedHistory.forEach(bet => {
            const dateKey = bet.timestamp.toLocaleDateString('pl-PL');
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(bet);
        });
        return groups;
    }, [sortedHistory]);


    return (
        <div className="space-y-8">
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-amber-400 mb-4">Stwórz Mecz</h2>
                <div className="mb-4">
                    <span className="mr-4 font-semibold">Liczba uczestników:</span>
                    {[2, 3, 4].map(count => (
                        <button
                            key={count}
                            onClick={() => handlePlayerCountChange(count)}
                            className={`px-4 py-2 mr-2 rounded ${numberOfPlayers === count ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 hover:bg-slate-600'}`}
                        >
                            {count}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {players.map((player, index) => (
                        <div key={index} className="space-y-2">
                            <input
                                type="text"
                                placeholder={`Nazwa Gracza ${index + 1}`}
                                value={player.name}
                                onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                                className="w-full p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            <input
                                type="number"
                                placeholder="Kurs"
                                value={player.odds}
                                onChange={(e) => handlePlayerChange(index, 'odds', e.target.value)}
                                className="w-full p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    ))}
                </div>
                 <button onClick={handleRandomizeOdds} className="w-full mb-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md font-semibold transition-colors">
                    Losuj kursy
                </button>

                <h3 className="text-xl font-semibold text-amber-400 mt-6 mb-2">Wybierz Zwycięzcę</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {players.filter(p => p.name && p.odds).map((player, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedPlayer(player.name)}
                            className={`p-4 rounded-lg text-center transition-all ${selectedPlayer === player.name ? 'bg-amber-500 text-slate-900 ring-2 ring-amber-300' : 'bg-slate-700 hover:bg-slate-600'}`}
                        >
                            <span className="font-bold block">{player.name}</span>
                            <span className="text-lg">{parseFloat(player.odds).toFixed(2)}</span>
                        </button>
                    ))}
                </div>

                {selectedPlayer && (
                    <div className="bg-slate-700 p-4 rounded-lg mt-4">
                        <h3 className="text-lg font-bold text-amber-400">Twój Kupon</h3>
                        <p>Wybrana strona: <span className="font-bold">{selectedPlayer}</span></p>
                        
                        <textarea
                            value={betNote}
                            onChange={(e) => setBetNote(e.target.value)}
                            placeholder="Dodaj notatkę do zakładu (opcjonalnie)..."
                            className="w-full mt-3 p-2 bg-slate-600 rounded border border-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            rows={2}
                        />

                        <div className="flex items-center space-x-4 mt-3">
                            <input
                                type="number"
                                value={stake}
                                onChange={(e) => setStake(e.target.value)}
                                className="w-32 p-2 bg-slate-600 rounded border border-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            <button onClick={handlePlaceBet} className="px-6 py-2 bg-amber-600 hover:bg-amber-500 rounded-md font-bold text-white transition-colors">
                                Postaw Zakład!
                            </button>
                        </div>
                        <p className="mt-2">Potencjalna wygrana: <span className="font-bold">{potentialReturn} PLN</span></p>
                    </div>
                )}
            </div>

            {betHistory.length > 0 && (
                <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-amber-400">Historia Zakładów</h2>
                        <button 
                            onClick={toggleSortOrder}
                            className="px-3 py-1 text-sm bg-slate-600 hover:bg-slate-500 rounded-md font-semibold transition-colors"
                            title={`Zmień sortowanie na ${sortOrder === 'desc' ? 'najstarsze' : 'najnowsze'}`}
                            aria-label={`Zmień sortowanie na ${sortOrder === 'desc' ? 'najstarsze' : 'najnowsze'}`}
                        >
                            Sortuj: {sortOrder === 'desc' ? 'Najnowsze' : 'Najstarsze'}
                        </button>
                    </div>
                    <div className="space-y-6">
                        {Object.entries(groupedHistory).map(([date, bets]) => (
                             <div key={date}>
                                <h3 className="text-xl font-semibold text-slate-400 mb-3 pb-2 border-b border-slate-700">{date}</h3>
                                <div className="space-y-4">
                                    {/* FIX: Ensure `bets` is an array before mapping to prevent runtime errors from malformed localStorage data. */}
                                    {Array.isArray(bets) && bets.map(bet => {
                                        const statusColor = {
                                            pending: 'border-slate-700',
                                            won: 'border-green-500/50 bg-green-500/10',
                                            lost: 'border-red-500/50 bg-red-500/10',
                                        };
                                        const profit = (bet.potentialReturn - bet.stake).toFixed(2);
                                        return (
                                            <div key={bet.id} className={`p-4 rounded-lg border-l-4 ${statusColor[bet.status]} bg-slate-700`}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        {/* FIX: Ensure bet.players is an array before mapping to prevent runtime errors from malformed localStorage data. */}
                                                        <p className="font-bold">{Array.isArray(bet.players) ? bet.players.map(p => p.name).join(' vs ') : ''}</p>
                                                        <p>Obstawiono: <span className="font-semibold text-amber-400">{bet.selection}</span></p>
                                                        <p>Stawka: {bet.stake.toFixed(2)} PLN</p>
                                                        <p>
                                                            Status: {bet.status === 'won' ? `Wygrana: ${bet.potentialReturn.toFixed(2)} PLN (Zysk: ${profit} PLN)` : bet.status === 'lost' ? `Przegrana: -${bet.stake.toFixed(2)} PLN` : 'Oczekujący'}
                                                        </p>
                                                         {bet.note && (
                                                            <div className="mt-2 p-2 bg-slate-600/50 rounded-md">
                                                                <p className="text-sm text-slate-300 italic">"{bet.note}"</p>
                                                            </div>
                                                        )}
                                                        <p className="text-xs text-slate-400 mt-2">{bet.timestamp.toLocaleString()}</p>
                                                    </div>
                                                    {bet.status === 'pending' && (
                                                        <div className="flex space-x-2">
                                                            <button onClick={() => handleBetStatusChange(bet.id, 'won')} className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-sm font-bold">Wygrany</button>
                                                            <button onClick={() => handleBetStatusChange(bet.id, 'lost')} className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm font-bold">Przegrany</button>
                                                        </div>
                                                    )}
                                                </div>
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

export default BettingGame;