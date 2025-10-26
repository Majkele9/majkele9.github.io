import React, { useState } from 'react';

const TeamDrafter: React.FC = () => {
    const [players, setPlayers] = useState<string[]>(Array(18).fill(''));
    const [teams, setTeams] = useState<{ teamA: string[], teamB: string[] } | null>(null);

    const handlePlayerNameChange = (index: number, name: string) => {
        const newPlayers = [...players];
        newPlayers[index] = name;
        setPlayers(newPlayers);
    };

    const handleDraft = () => {
        const participatingPlayers = players.filter(p => p.trim() !== '');
        if (participatingPlayers.length < 2) {
            alert('Wprowadź co najmniej dwóch graczy.');
            return;
        }

        // Tasowanie graczy (algorytm Fisher-Yates)
        const shuffledPlayers = [...participatingPlayers];
        for (let i = shuffledPlayers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
        }

        const teamA: string[] = [];
        const teamB: string[] = [];

        shuffledPlayers.forEach((player, index) => {
            if (index % 2 === 0) {
                teamA.push(player);
            } else {
                teamB.push(player);
            }
        });

        setTeams({ teamA, teamB });
    };

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-amber-400 mb-2">Losowanie Drużyn</h2>
            <p className="text-slate-400 mb-6">Wpisz imiona lub pseudonimy graczy, a następnie wylosuj składy.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                {players.map((player, index) => (
                    <input
                        key={index}
                        type="text"
                        placeholder={`Gracz ${index + 1}`}
                        value={player}
                        onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                        className="w-full p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                ))}
            </div>

            <button
                onClick={handleDraft}
                className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-md font-bold text-white transition-colors text-lg"
            >
                Losuj Drużyny
            </button>

            {teams && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-700 p-4 rounded-lg">
                        <h3 className="text-xl font-bold text-amber-300 mb-3 text-center">Drużyna A</h3>
                        <ul className="space-y-2 text-center">
                            {teams.teamA.map((player, index) => (
                                <li key={index} className="bg-slate-600 p-2 rounded-md">{player}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-slate-700 p-4 rounded-lg">
                        <h3 className="text-xl font-bold text-amber-300 mb-3 text-center">Drużyna B</h3>
                        <ul className="space-y-2 text-center">
                            {teams.teamB.map((player, index) => (
                                <li key={index} className="bg-slate-600 p-2 rounded-md">{player}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamDrafter;