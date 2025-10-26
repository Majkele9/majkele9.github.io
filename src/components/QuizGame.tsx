import React, { useState, useEffect } from 'react';

// --- LOCAL FALLBACK QUESTIONS DATABASE ---
const FALLBACK_QUESTIONS = {
  'łatwy': [
    // User-provided + supplemented questions
    { question: "Stolicą Polski jest?", correctAnswer: "Warszawa", incorrectAnswers: ["Kraków", "Gdańsk", "Poznań"] },
    { question: "Ile to jest 7 + 5?", correctAnswer: "12", incorrectAnswers: ["11", "13", "10"] },
    { question: "Jakie jest chemiczne oznaczenie wody?", correctAnswer: "H₂O", incorrectAnswers: ["CO₂", "O₂", "NaCl"] },
    { question: "Kto napisał 'Pan Tadeusz'?", correctAnswer: "Adam Mickiewicz", incorrectAnswers: ["Juliusz Słowacki", "Henryk Sienkiewicz", "Bolesław Prus"] },
    { question: "Jakie morze leży na północy Polski?", correctAnswer: "Bałtyckie", incorrectAnswers: ["Czarne", "Śródziemne", "Północne"] },
    { question: "Kto był pierwszym królem Polski?", correctAnswer: "Bolesław Chrobry", incorrectAnswers: ["Mieszko I", "Kazimierz Wielki", "Władysław Jagiełło"] },
    { question: "Jakie zwierzę jest największym ssakiem na Ziemi?", correctAnswer: "Płetwal błękitny", incorrectAnswers: ["Słoń", "Żyrafa", "Niedźwiedź polarny"] },
    { question: "Ile zawodników liczy drużyna piłkarska na boisku?", correctAnswer: "Jedenastu", incorrectAnswers: ["Dziewięciu", "Siedmiu", "Trzynastu"] },
    { question: "Jak nazywa się najpopularniejszy system operacyjny firmy Microsoft?", correctAnswer: "Windows", incorrectAnswers: ["macOS", "Linux", "Android"] },
    { question: "W którym roku Polska wstąpiła do Unii Europejskiej?", correctAnswer: "2004", incorrectAnswers: ["1999", "2007", "2001"] },
    { question: "Który polski kompozytor napisał 'Etiudy' i 'Mazurki'?", correctAnswer: "Fryderyk Chopin", incorrectAnswers: ["Stanisław Moniuszko", "Karol Szymanowski", "Ignacy Jan Paderewski"] },
    { question: "Jak nazywa się fikcyjny czarodziej z blizną w kształcie błyskawicy?", correctAnswer: "Harry Potter", incorrectAnswers: ["Gandalf", "Merlin", "Dumbledore"] },
    { question: "Jak nazywa się najmniejsze ptaki świata?", correctAnswer: "Kolibry", incorrectAnswers: ["Wróble", "Sikorki", "Jaskółki"] },
    { question: "Jaką częścią mowy jest słowo 'piękny'?", correctAnswer: "Przymiotnik", incorrectAnswers: ["Rzeczownik", "Czasownik", "Przysłówek"] },
    { question: "Jak nazywa się firma, która produkuje iPhone’y?", correctAnswer: "Apple", incorrectAnswers: ["Samsung", "Google", "Microsoft"] },
    { question: "Jakie miasto jest stolicą Francji?", correctAnswer: "Paryż", incorrectAnswers: ["Londyn", "Madryt", "Berlin"] },
    { question: "Kto był pierwszym prezydentem III Rzeczypospolitej Polskiej?", correctAnswer: "Lech Wałęsa", incorrectAnswers: ["Aleksander Kwaśniewski", "Tadeusz Mazowiecki", "Wojciech Jaruzelski"] },
    { question: "Jak nazywa się proces wytwarzania tlenu przez rośliny?", correctAnswer: "Fotosynteza", incorrectAnswers: ["Oddychanie", "Transpiracja", "Chemosynteza"] },
    { question: "Jakie święto obchodzimy 24 grudnia?", correctAnswer: "Wigilię Bożego Narodzenia", incorrectAnswers: ["Wielkanoc", "Nowy Rok", "Boże Ciało"] },
    { question: "Co oznacza skrót 'www' w adresie internetowym?", correctAnswer: "World Wide Web", incorrectAnswers: ["World Web Window", "Wide World Web", "Web World Work"] },
    { question: "Jakiego sportu dotyczy skrót F1?", correctAnswer: "Formuła 1", incorrectAnswers: ["Piłka nożna (Football)", "Koszykówka (FIBA)", "Szachy (FIDE)"] },
    { question: "Kto namalował 'Mona Lisę'?", correctAnswer: "Leonardo da Vinci", incorrectAnswers: ["Michał Anioł", "Vincent van Gogh", "Pablo Picasso"] },
    { question: "Jakie góry znajdują się na południu Polski?", correctAnswer: "Tatry", incorrectAnswers: ["Sudety", "Bieszczady", "Góry Świętokrzyskie"] },
    { question: "Jakie ciało niebieskie jest najbliżej Ziemi?", correctAnswer: "Księżyc", incorrectAnswers: ["Słońce", "Mars", "Wenus"] },
    { question: "Ile to jest 100 : 10?", correctAnswer: "10", incorrectAnswers: ["1", "100", "1000"] },
    { question: "Jakie imię nosi święty patron dzieci, obchodzony 6 grudnia?", correctAnswer: "Mikołaj", incorrectAnswers: ["Piotr", "Paweł", "Jan"] },
    { question: "Jak nazywa się osoba, która pisze wiersze?", correctAnswer: "Poeta", incorrectAnswers: ["Pisarz", "Prozaik", "Dramaturg"] },
    { question: "Który instrument ma klawisze i pedały?", correctAnswer: "Fortepian", incorrectAnswers: ["Skrzypce", "Gitara", "Trąbka"] },
    { question: "Które studio stworzyło film 'Król Lew'?", correctAnswer: "Disney", incorrectAnswers: ["Pixar", "DreamWorks", "Warner Bros."] },
    { question: "W jakim kraju leży Rzym?", correctAnswer: "Włochy", incorrectAnswers: ["Grecja", "Hiszpania", "Francja"] },
    { question: "Jakim przyrządem gra się w tenisa?", correctAnswer: "Rakietą", incorrectAnswers: ["Kijem", "Piłką", "Łyżwą"] },
    { question: "Jakie zwierzę słynie z noszenia domu na plecach?", correctAnswer: "Ślimak", incorrectAnswers: ["Żółw", "Jeż", "Bóbr"] },
    { question: "Jak nazywa się największa platforma wideo w internecie?", correctAnswer: "YouTube", incorrectAnswers: ["Vimeo", "TikTok", "Netflix"] },
    { question: "Jakie kwiaty najczęściej wręcza się z okazji Dnia Kobiet?", correctAnswer: "Tulipany", incorrectAnswers: ["Róże", "Goździki", "Stokrotki"] },
    { question: "Z jakiego kraju pochodził Napoleon Bonaparte?", correctAnswer: "Francja", incorrectAnswers: ["Włochy", "Hiszpania", "Austria"] },
    { question: "Ile boków ma kwadrat?", correctAnswer: "Cztery", incorrectAnswers: ["Trzy", "Pięć", "Sześć"] },
    { question: "Jakim pierwiastkiem jest O w układzie okresowym?", correctAnswer: "Tlen", incorrectAnswers: ["Wodór", "Azot", "Węgiel"] },
    { question: "Jak nazywa się organ, który pompuje krew w ciele człowieka?", correctAnswer: "Serce", incorrectAnswers: ["Płuca", "Wątroba", "Mózg"] },
    { question: "Jakie imię nosił legendarny rycerz z mieczem Excalibur?", correctAnswer: "Król Artur", incorrectAnswers: ["Lancelot", "Robin Hood", "Zawisza Czarny"] },
    { question: "Jakie miasto jest stolicą Niemiec?", correctAnswer: "Berlin", incorrectAnswers: ["Monachium", "Hamburg", "Frankfurt"] },
    { question: "Jak nazywa się sport, w którym zawodnicy biją piłkę kijem?", correctAnswer: "Baseball", incorrectAnswers: ["Hokej", "Golf", "Krykiet"] },
    { question: "Jak nazywa się młode krowy?", correctAnswer: "Cielę", incorrectAnswers: ["Źrebię", "Jagnię", "Prosię"] },
    { question: "Jak nazywa się święto zakochanych obchodzone 14 lutego?", correctAnswer: "Walentynki", incorrectAnswers: ["Dzień Kobiet", "Dzień Matki", "Andrzejki"] },
    { question: "Co oznacza skrót USB?", correctAnswer: "Universal Serial Bus", incorrectAnswers: ["United Serial Bus", "Universal Service Box", "Unified System Block"] },
    { question: "Jaki jest wynik działania 9 × 9?", correctAnswer: "81", incorrectAnswers: ["72", "90", "18"] },
    { question: "Na jakim kontynencie leży Egipt?", correctAnswer: "Afryka", incorrectAnswers: ["Azja", "Europa", "Ameryka Południowa"] },
    { question: "Jak nazywa się słynny agent 007?", correctAnswer: "James Bond", incorrectAnswers: ["Jason Bourne", "Ethan Hunt", "Jack Ryan"] },
    { question: "Jakie urządzenie służy do pomiaru temperatury?", correctAnswer: "Termometr", incorrectAnswers: ["Barometr", "Higrometr", "Wagomierz"] },
    { question: "Jak nazywa się najpopularniejsza wyszukiwarka internetowa?", correctAnswer: "Google", incorrectAnswers: ["Bing", "Yahoo", "DuckDuckGo"] },
    { question: "Jak nazywa się pora roku po zimie?", correctAnswer: "Wiosna", incorrectAnswers: ["Lato", "Jesień", "Przedwiośnie"] },
  ],
  'średni': [
    { question: "W którym roku wybuchła II wojna światowa?", correctAnswer: "1939", incorrectAnswers: ["1914", "1941", "1945"] },
    { question: "Jak nazywa się największe jezioro w Polsce?", correctAnswer: "Śniardwy", incorrectAnswers: ["Mamry", "Hańcza", "Wigry"] },
    { question: "Jak nazywa się proces wytwarzania pokarmu przez rośliny?", correctAnswer: "Fotosynteza", incorrectAnswers: ["Transpiracja", "Oddychanie komórkowe", "Chemosynteza"] },
    { question: "Kto namalował obraz 'Krzyk'?", correctAnswer: "Edvard Munch", incorrectAnswers: ["Vincent van Gogh", "Gustav Klimt", "Salvador Dali"] },
    { question: "Kto jest autorem 'Lalki'?", correctAnswer: "Bolesław Prus", incorrectAnswers: ["Henryk Sienkiewicz", "Stefan Żeromski", "Władysław Reymont"] },
    { question: "Który kompozytor stworzył 'Symfonię nr 9' z 'Odą do radości'?", correctAnswer: "Ludwig van Beethoven", incorrectAnswers: ["Wolfgang Amadeus Mozart", "Jan Sebastian Bach", "Fryderyk Chopin"] },
    { question: "Jak nazywa się język programowania stworzony przez Guido van Rossuma?", correctAnswer: "Python", incorrectAnswers: ["Java", "C++", "JavaScript"] },
    { question: "Ile graczy jest na boisku w jednej drużynie piłki ręcznej?", correctAnswer: "Siedmiu", incorrectAnswers: ["Sześciu", "Pięciu", "Ośmiu"] },
    { question: "Jakie zjawisko opisuje równanie E=mc²?", correctAnswer: "Równoważność masy i energii", incorrectAnswers: ["Prawo powszechnego ciążenia", "Zasada zachowania pędu", "Druga zasada dynamiki"] },
    { question: "Jak nazywa się pierwiastek o symbolu Na?", correctAnswer: "Sód", incorrectAnswers: ["Potas", "Wapń", "Magnez"] },
    { question: "Kto w mitologii greckiej był bogiem morza?", correctAnswer: "Posejdon", incorrectAnswers: ["Zeus", "Hades", "Apollo"] },
    { question: "Kto zagrał główną rolę w filmie 'Forrest Gump'?", correctAnswer: "Tom Hanks", incorrectAnswers: ["Tom Cruise", "Brad Pitt", "Johnny Depp"] },
    { question: "Które miasto jest stolicą Kanady?", correctAnswer: "Ottawa", incorrectAnswers: ["Toronto", "Montreal", "Vancouver"] },
    { question: "Ile wynosi pierwiastek kwadratowy z 49?", correctAnswer: "7", incorrectAnswers: ["6", "8", "4.9"] },
    { question: "Jak nazywa się urządzenie do pomiaru napięcia elektrycznego?", correctAnswer: "Woltomierz", incorrectAnswers: ["Amperomierz", "Omomierz", "Oscyloskop"] },
    { question: "Jaką częścią mowy jest wyraz 'szybko'?", correctAnswer: "Przysłówek", incorrectAnswers: ["Przymiotnik", "Rzeczownik", "Zaimek"] },
    { question: "Kto jest autorem utworu 'Imagine'?", correctAnswer: "John Lennon", incorrectAnswers: ["Paul McCartney", "Bob Dylan", "Freddie Mercury"] },
    { question: "Jak nazywa się proces oddychania bez użycia tlenu?", correctAnswer: "Fermentacja", incorrectAnswers: ["Fotosynteza", "Oddychanie tlenowe", "Nitryfikacja"] },
    { question: "Jak nazywa się największa planeta Układu Słonecznego?", correctAnswer: "Jowisz", incorrectAnswers: ["Saturn", "Neptun", "Uran"] },
    { question: "W którym roku upadł Związek Radziecki?", correctAnswer: "1991", incorrectAnswers: ["1989", "1993", "1985"] },
  ],
  'trudny': [
    { question: "W którym roku rozpoczęła się wojna trzydziestoletnia?", correctAnswer: "1618", incorrectAnswers: ["1648", "1588", "1601"] },
    { question: "Jak nazywał się cesarz rzymski, który podbił Dację?", correctAnswer: "Trajan", incorrectAnswers: ["Oktawian August", "Hadrian", "Marek Aureliusz"] },
    { question: "Jak nazywa się najwyższy szczyt Ameryki Północnej?", correctAnswer: "Denali", incorrectAnswers: ["Mount Logan", "Pico de Orizaba", "Mount Whitney"] },
    { question: "Które jezioro jest najgłębsze na świecie?", correctAnswer: "Bajkał", incorrectAnswers: ["Tanganika", "Morze Kaspijskie", "Wostok"] },
    { question: "Jak nazywa się proces powstawania gamet?", correctAnswer: "Mejoza", incorrectAnswers: ["Mitoza", "Transkrypcja", "Fotosynteza"] },
    { question: "Który narząd człowieka produkuje insulinę?", correctAnswer: "Trzustka", incorrectAnswers: ["Wątroba", "Nadnercza", "Tarczyca"] },
    { question: "Jaki jest główny składnik chemiczny szkła?", correctAnswer: "Krzemionka (SiO₂)", incorrectAnswers: ["Węglan sodu (Na₂CO₃)", "Tlenek wapnia (CaO)", "Tlenek glinu (Al₂O₃)"] },
    { question: "Jakim pierwiastkiem chemicznym jest Au?", correctAnswer: "Złoto", incorrectAnswers: ["Srebro", "Platyna", "Rtęć"] },
    { question: "Jak nazywa się jednostka siły w układzie SI?", correctAnswer: "Niuton", incorrectAnswers: ["Dżul", "Pascal", "Wat"] },
    { question: "Jakie jest pierwsze prawo de Morgana w logice?", correctAnswer: "Negacja koniunkcji jest alternatywą negacji", incorrectAnswers: ["Prawo podwójnego przeczenia", "Prawo wyłączonego środka", "Prawo rozdzielności"] },
  ]
};

type Difficulty = 'łatwy' | 'średni' | 'trudny' | 'mieszany';
type GamePhase = 'menu' | 'playing' | 'gameOver';

interface Player {
  id: number;
  chances: number;
  score: number;
  isActive: boolean; // Is it this player's turn?
  isEliminated: boolean;
}

interface Question {
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
}

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
