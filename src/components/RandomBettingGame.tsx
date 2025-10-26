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

// --- BAZA PYTAŃ ---
// Można dowolnie rozszerzać pulę pytań dla każdej kategorii.
const SCENARIOS_DATABASE: { [key: string]: RandomBetScenario[] } = {
    'Absurdalne': [
        { question: "Czy jeśli zombie ugryzie wampira, to powstanie wampir-zombie czy zombie-wampir?", optionA: "Wampir-zombie, bo apetyt na mózgi jest silniejszy.", optionB: "Zombie-wampir, bo będzie narzekał na jakość krwi." },
        { question: "Gdyby zwierzęta mogły mówić, które z nich byłoby najbardziej irytujące?", optionA: "Gołębie, ciągle prosiłyby o okruszki.", optionB: "Mewy, bo krzyczałyby o wszystko." },
        { question: "Co by się stało, gdyby grawitacja na Ziemi zmniejszyła się o połowę?", optionA: "Wszyscy bylibyśmy lepsi w koszykówkę.", optionB: "Spadające tosty rzadziej lądowałyby masłem w dół." },
        { question: "Czy syreny płacą podatki w podwodnym królestwie?", optionA: "Tak, w muszelkach.", optionB: "Nie, mają ulgę na ogon." },
        { question: "Jaki byłby najgorszy smak chipsów, jaki można wymyślić?", optionA: "Pasta do zębów z miętą.", optionB: "Mokra karma dla psa." },
        { question: "Gdybyś mógł mieć supermoc, która jest kompletnie bezużyteczna, co by to było?", optionA: "Zdolność rozmawiania z karpiami.", optionB: "Moc zmieniania koloru skarpetek siłą woli." },
        { question: "Która czynność jest bardziej podejrzana: jedzenie banana bokiem czy picie mleka prosto z kartonu na ulicy?", optionA: "Jedzenie banana bokiem.", optionB: "Picie mleka z kartonu." },
        { question: "Czy roboty marzą o elektrycznych owcach?", optionA: "Tak, w rozdzielczości 4K.", optionB: "Nie, marzą o darmowym Wi-Fi." },
        { question: "Co jest dziwniejsze: kot przynoszący martwą mysz w prezencie czy człowiek dający kotu zabawkową mysz?", optionA: "Prezent od kota.", optionB: "Prezent dla kota." },
        { question: "Gdyby rośliny doniczkowe mogły się mścić za zaniedbanie, jak by to robiły?", optionA: "Zrzuciłyby liście na ulubiony dywan.", optionB: "Celowo rosłyby w stronę, gdzie zasłaniają telewizor." },
    ],
    'Sport': [
        { question: "Ile złotych medali olimpijskich w chodzie sportowym zdobył Robert Korzeniowski?", optionA: "Cztery", optionB: "Trzy", correctOption: 'A' },
        { question: "W którym roku Polska reprezentacja w piłce nożnej zajęła 3. miejsce na Mistrzostwach Świata?", optionA: "1982", optionB: "1978", correctOption: 'A' },
        { question: "Jak nazywa się jedyna Polka, która zdobyła Wimbledon w grze pojedynczej?", optionA: "Iga Świątek", optionB: "Agnieszka Radwańska", correctOption: 'B' }, // Radwańska wygrała juniorski
        { question: "Który skoczek narciarski jako pierwszy w historii przekroczył barierę 250 metrów?", optionA: "Peter Prevc", optionB: "Johan Remen Evensen", correctOption: 'B' },
        { question: "Jak nazywa się rzut w koszykówce, za który można zdobyć 3 punkty?", optionA: "Rzut osobisty", optionB: "Rzut z dystansu", correctOption: 'B' },
        { question: "Ile trwa tercja w hokeju na lodzie?", optionA: "20 minut", optionB: "15 minut", correctOption: 'A' },
        { question: "Które z tych miast nigdy nie organizowało letnich igrzysk olimpijskich?", optionA: "Madryt", optionB: "Helsinki", correctOption: 'A' },
        { question: "W jakiej dyscyplinie sportu legendą jest Michael Jordan?", optionA: "Koszykówka", optionB: "Baseball", correctOption: 'A' },
        { question: "Ile wynosi dystans maratonu?", optionA: "42,195 km", optionB: "40,550 km", correctOption: 'A' },
        { question: "W jakim kraju odbyły się pierwsze nowożytne Igrzyska Olimpijskie w 1896 roku?", optionA: "Grecja", optionB: "Francja", correctOption: 'A' },
    ],
    'Historia': [
        { question: "W którym roku odbył się chrzest Polski?", optionA: "966", optionB: "1025", correctOption: 'A' },
        { question: "Kto był pierwszym królem Polski?", optionA: "Mieszko I", optionB: "Bolesław Chrobry", correctOption: 'B' },
        { question: "Bitwa pod Grunwaldem miała miejsce w roku:", optionA: "1410", optionB: "1525", correctOption: 'A' },
        { question: "Jak nazywała się unia, która połączyła Polskę i Litwę w jedno państwo w 1569 roku?", optionA: "Unia Lubelska", optionB: "Unia w Krewie", correctOption: 'A' },
        { question: "Kto był ostatnim królem Polski?", optionA: "August II Mocny", optionB: "Stanisław August Poniatowski", correctOption: 'B' },
        { question: "W którym roku wybuchła II wojna światowa?", optionA: "1939", optionB: "1941", correctOption: 'A' },
        { question: "Jak nazywał się przywódca powstania kościuszkowskiego?", optionA: "Tadeusz Kościuszko", optionB: "Józef Poniatowski", correctOption: 'A' },
        { question: "Kto był pierwszym prezydentem USA?", optionA: "Thomas Jefferson", optionB: "George Washington", correctOption: 'B' },
        { question: "Upadek Muru Berlińskiego, symboliczny koniec zimnej wojny, miał miejsce w roku:", optionA: "1989", optionB: "1991", correctOption: 'A' },
        { question: "Jak nazywał się statek, którym Kolumb dopłynął do Ameryki?", optionA: "Santa Maria", optionB: "Mayflower", correctOption: 'A' },
    ],
    'Nauka': [
        { question: "Która planeta w Układzie Słonecznym jest największa?", optionA: "Jowisz", optionB: "Saturn", correctOption: 'A' },
        { question: "Jak nazywa się proces, w którym rośliny przekształcają światło słoneczne w energię?", optionA: "Fotosynteza", optionB: "Chemosynteza", correctOption: 'A' },
        { question: "Jaki jest chemiczny symbol złota?", optionA: "Ag", optionB: "Au", correctOption: 'B' },
        { question: "Ile wynosi prędkość światła w próżni?", optionA: "ok. 300 000 km/s", optionB: "ok. 150 000 km/s", correctOption: 'A' },
        { question: "Jak nazywa się siła przyciągająca obiekty w kierunku Ziemi?", optionA: "Grawitacja", optionB: "Magnetyzm", correctOption: 'A' },
        { question: "Który z tych gazów jest najlżejszy?", optionA: "Hel", optionB: "Wodór", correctOption: 'B' },
        { question: "Jak nazywa się jednostka mocy w układzie SI?", optionA: "Dżul", optionB: "Wat", correctOption: 'B' },
        { question: "Co bada entomologia?", optionA: "Ptaki", optionB: "Owady", correctOption: 'B' },
        { question: "Jak nazywa się największy organ ludzkiego ciała?", optionA: "Wątroba", optionB: "Skóra", correctOption: 'B' },
        { question: "Z ilu kości składa się szkielet dorosłego człowieka?", optionA: "206", optionB: "256", correctOption: 'A' },
    ],
    'Technologia': [
        { question: "Co oznacza skrót 'HTTP'?", optionA: "HyperText Transfer Protocol", optionB: "High-Tech Transfer Protocol", correctOption: 'A' },
        { question: "Kto jest współzałożycielem firmy Microsoft?", optionA: "Steve Jobs", optionB: "Bill Gates", correctOption: 'B' },
        { question: "Jak nazywa się popularny język programowania, stworzony przez Google, często używany do tworzenia aplikacji mobilnych?", optionA: "Swift", optionB: "Kotlin", correctOption: 'B' },
        { question: "Co jest podstawową jednostką informacji w informatyce?", optionA: "Bit", optionB: "Bajt", correctOption: 'A' },
        { question: "Jak nazywała się pierwsza na świecie sieć komputerowa, poprzedniczka internetu?", optionA: "ARPANET", optionB: "NSFNET", correctOption: 'A' },
        { question: "Która firma produkuje procesory z serii 'Ryzen'?", optionA: "Intel", optionB: "AMD", correctOption: 'B' },
        { question: "Jaką nazwę nosi system operacyjny firmy Apple dla telefonów iPhone?", optionA: "macOS", optionB: "iOS", correctOption: 'B' },
        { question: "Co oznacza skrót 'GPS'?", optionA: "Global Positioning System", optionB: "General Path System", correctOption: 'A' },
        { question: "Jak nazywa się technologia bezprzewodowej komunikacji na krótkie odległości, używana np. w słuchawkach?", optionA: "Wi-Fi", optionB: "Bluetooth", correctOption: 'B' },
        { question: "Która z tych firm nie jest primarnie producentem smartfonów?", optionA: "Xiaomi", optionB: "NVIDIA", correctOption: 'B' },
    ],
    'Popkultura': [
        { question: "Który zespół wydał album 'The Dark Side of the Moon'?", optionA: "Pink Floyd", optionB: "Led Zeppelin", correctOption: 'A' },
        { question: "Kto wyreżyserował film 'Pulp Fiction'?", optionA: "Steven Spielberg", optionB: "Quentin Tarantino", correctOption: 'B' },
        { question: "Jak nazywa się główny bohater serii gier 'The Witcher'?", optionA: "Geralt z Rivii", optionB: "Jaskier", correctOption: 'A' },
        { question: "W którym serialu pojawia się postać Waltera White'a?", optionA: "The Sopranos", optionB: "Breaking Bad", correctOption: 'B' },
        { question: "Kto jest autorem sagi 'Pieśń Lodu i Ognia', na podstawie której powstał serial 'Gra o Tron'?", optionA: "J.R.R. Tolkien", optionB: "George R.R. Martin", correctOption: 'B' },
        { question: "Jak nazywa się fikcyjne miasto, w którym mieszka Batman?", optionA: "Metropolis", optionB: "Gotham City", correctOption: 'B' },
        { question: "Która piosenkarka jest znana jako 'Królowa Popu'?", optionA: "Madonna", optionB: "Beyoncé", correctOption: 'A' },
        { question: "W grze 'Minecraft', z jakiego surowca tworzy się najtrwalsze narzędzia?", optionA: "Diament", optionB: "Netheryt", correctOption: 'B' },
        { question: "Jak nazywa się statek kosmiczny Hana Solo w 'Gwiezdnych Wojnach'?", optionA: "Sokół Millennium", optionB: "Gwiezdny Niszczyciel", correctOption: 'A' },
        { question: "Który film zdobył Oscara za najlepszy film w 2020 roku?", optionA: "Parasite", optionB: "Joker", correctOption: 'A' },
    ],
    'Rynki finansowe/Kryptowaluty': [
        { question: "Jak nazywa się proces tworzenia nowych Bitcoinów?", optionA: "Kopanie (Mining)", optionB: "Drukowanie (Printing)", correctOption: 'A' },
        { question: "Która kryptowaluta jest drugą co do wielkości pod względem kapitalizacji rynkowej po Bitcoinie?", optionA: "Ripple (XRP)", optionB: "Ethereum (ETH)", correctOption: 'B' },
        { question: "Co to jest 'hossa' na giełdzie?", optionA: "Okres spadków cen akcji.", optionB: "Okres wzrostów cen akcji.", correctOption: 'B' },
        { question: "Jak nazywa się zjawisko gwałtownego i niekontrolowanego wzrostu cen?", optionA: "Deflacja", optionB: "Hiperinflacja", correctOption: 'B' },
        { question: "Kto jest anonimowym twórcą Bitcoina?", optionA: "Satoshi Nakamoto", optionB: "Vitalik Buterin", correctOption: 'A' },
        { question: "Co oznacza skrót 'NFT'?", optionA: "Non-Fungible Token", optionB: "New Financial Technology", correctOption: 'A' },
        { question: "Jak nazywa się główny indeks giełdowy w Polsce?", optionA: "WIG20", optionB: "DAX", correctOption: 'A' },
        { question: "Co to jest 'dywidenda'?", optionA: "Część zysku firmy wypłacana akcjonariuszom.", optionB: "Podatek od zysków kapitałowych.", correctOption: 'A' },
        { question: "Jak nazywa się technologia leżąca u podstaw większości kryptowalut?", optionA: "Blockchain", optionB: "Cloud computing", correctOption: 'A' },
        { question: "Co to jest 'shortowanie' (krótka sprzedaż) akcji?", optionA: "Kupowanie akcji z nadzieją na wzrost ceny.", optionB: "Sprzedawanie pożyczonych akcji z nadzieją na spadek ceny.", correctOption: 'B' },
    ],
    'Transport': [
        { question: "Który z tych samochodów jest produkowany przez firmę z Niemiec?", optionA: "Ferrari", optionB: "Porsche", correctOption: 'B' },
        { question: "Jak nazywa się najszybszy seryjnie produkowany pociąg pasażerski na świecie?", optionA: "Shanghai Maglev", optionB: "TGV", correctOption: 'A' },
        { question: "Która firma lotnicza jest największa na świecie pod względem wielkości floty?", optionA: "Ryanair", optionB: "American Airlines", correctOption: 'B' },
        { question: "Jak nazywa się największy na świecie samolot transportowy, zniszczony podczas wojny w Ukrainie?", optionA: "An-225 Mrija", optionB: "Airbus A380", correctOption: 'A' },
        { question: "W którym mieście działa najstarsza linia metra na świecie?", optionA: "W Londynie", optionB: "W Paryżu", correctOption: 'A' },
        { question: "Jak nazywa się słynny luksusowy pociąg kursujący między Paryżem a Stambułem?", optionA: "Trans-Siberian Express", optionB: "Orient Express", correctOption: 'B' },
        { question: "Która marka jest znana z produkcji motocykli 'Harley-Davidson'?", optionA: "Japońska", optionB: "Amerykańska", correctOption: 'B' },
        { question: "Co oznacza skrót 'TIR' na ciężarówkach?", optionA: "Transport International Routier", optionB: "Truck in Road", correctOption: 'A' },
        { question: "Jak nazywał się największy statek pasażerski, który zatonął w 1912 roku?", optionA: "Titanic", optionB: "Britannic", correctOption: 'A' },
        { question: "Który kraj jest znany z marki samochodów 'Volvo'?", optionA: "Niemcy", optionB: "Szwecja", correctOption: 'B' },
    ],
    'NSFW': [
        { question: "Czy ananas na pizzy to zbrodnia przeciwko ludzkości?", optionA: "Oczywiście, że tak.", optionB: "To kulinarny majstersztyk." },
        { question: "Co jest gorsze: skarpety do sandałów czy krawat do koszuli z krótkim rękawem?", optionA: "Skarpety do sandałów.", optionB: "Krawat do koszuli." },
        { question: "Czy wlewanie mleka do miski przed płatkami śniadaniowymi jest normalne?", optionA: "Absolutnie nie.", optionB: "Tylko tak jest poprawnie." },
        { question: "Kto ma zawsze rację w związku?", optionA: "Ten, kto głośniej krzyczy.", optionB: "Ten, kto ma pilota od telewizora." },
        { question: "Jaki jest ostateczny dowód na to, że weekend się skończył?", optionA: "Dźwięk budzika w poniedziałek.", optionB: "Uczucie egzystencjalnej pustki w niedzielę wieczorem." },
        { question: "Co jest bardziej prawdopodobne: kosmici lądujący w Białym Domu czy znalezienie dwóch identycznych płatków śniegu?", optionA: "Kosmici w Białym Domu.", optionB: "Identyczne płatki śniegu." },
        { question: "Czy 'jeszcze jedno piwo' to zawsze dobry pomysł?", optionA: "Tak, bez wyjątku.", optionB: "Pytanie retoryczne." },
        { question: "Jaka jest najgorsza odpowiedź na 'Kocham Cię'?", optionA: "'Dzięki, ja ciebie też lubię.'", optionB: "'Aha.'" },
        { question: "Czy czytanie cudzych wiadomości jest gorsze niż zjedzenie ostatniego kawałka pizzy bez pytania?", optionA: "Czytanie wiadomości.", optionB: "Zjedzenie pizzy." },
        { question: "Kiedy oficjalnie stajesz się stary?", optionA: "Gdy zaczynasz narzekać na hałas.", optionB: "Gdy cieszysz się, że plany zostały odwołane." },
    ],
     'default': [
        { question: "Jak nazywa się stolica Australii?", optionA: "Sydney", optionB: "Canberra", correctOption: 'B' },
        { question: "Który pierwiastek chemiczny ma symbol 'Fe'?", optionA: "Złoto", optionB: "Żelazo", correctOption: 'B' }
    ]
};

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const SWAP_COST = 20;
const BONUS_THRESHOLD = 5;
const BONUS_AMOUNT = 250;
const CATEGORIES = Object.keys(SCENARIOS_DATABASE).filter(k => k !== 'default');


const RandomBettingGame: React.FC = () => {
    const [balance, setBalance] = useState<number>(() => {
        const savedBalance = localStorage.getItem('piwneBetyRandomBalance');
        return savedBalance ? JSON.parse(savedBalance) : 1000;
    });
    const [scenario, setScenario] = useState<RandomBetScenario | null>(null);
    const [scenarioQueue, setScenarioQueue] = useState<RandomBetScenario[]>([]);
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

    const loadNewScenarios = useCallback((category: string) => {
        const questionsForCategory = SCENARIOS_DATABASE[category] || SCENARIOS_DATABASE['default'];
        const shuffled = shuffleArray(questionsForCategory);
        const [firstScenario, ...rest] = shuffled;
        
        setScenarioQueue(rest);
        setScenario(firstScenario);
        setSelectedOption(null);
        setResultMessage(null);
    }, []);

    useEffect(() => {
        loadNewScenarios(selectedCategory);
    }, [selectedCategory, loadNewScenarios]);


    const getNextScenario = useCallback(() => {
        if (scenarioQueue.length > 0) {
            const [nextScenario, ...rest] = scenarioQueue;
            setScenario(nextScenario);
            setScenarioQueue(rest);
            setSelectedOption(null);
            setResultMessage(null);
            return true;
        }
        return false;
    }, [scenarioQueue]);


    const handleSwapBet = () => {
        if (balance >= SWAP_COST && !resultMessage) {
            if (!getNextScenario()) {
                 loadNewScenarios(selectedCategory);
            }
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

        const isFactBased = 'correctOption' in scenario;
        let isWin: boolean;
        let winningOption: string;
        
        if (!isFactBased) {
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

        setTimeout(() => {
            if (!getNextScenario()) {
                loadNewScenarios(selectedCategory);
            }
        }, 3000);
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