import React, { useState, useEffect, useMemo } from 'react';

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
    { question: "Jaka liczba jest większa: 15 czy 50?", correctAnswer: "50", incorrectAnswers: ["15", "Obie są równe", "Nie da się określić"] },
    { question: "Ile kontynentów jest na Ziemi?", correctAnswer: "Siedem", incorrectAnswers: ["Pięć", "Sześć", "Osiem"] },
    { question: "Która planeta jest nazywana Czerwoną Planetą?", correctAnswer: "Mars", incorrectAnswers: ["Jowisz", "Wenus", "Saturn"] },
    { question: "Co pszczoły produkują z nektaru?", correctAnswer: "Miód", incorrectAnswers: ["Wosk", "Pyłek", "Mleczko pszczele"] },
    { question: "Jak nazywa się stolica Japonii?", correctAnswer: "Tokio", incorrectAnswers: ["Kioto", "Osaka", "Pekin"] },
    { question: "Ile zer ma milion?", correctAnswer: "Sześć", incorrectAnswers: ["Pięć", "Siedem", "Dziewięć"] },
    { question: "Z czego zrobiona jest Statua Wolności?", correctAnswer: "Z miedzi", incorrectAnswers: ["Ze złota", "Z żelaza", "Z brązu"] },
    { question: "Jak nazywa się największa pustynia na świecie?", correctAnswer: "Antarktyda", incorrectAnswers: ["Sahara", "Gobi", "Arabska"] },
    { question: "Ile kolorów ma tęcza?", correctAnswer: "Siedem", incorrectAnswers: ["Sześć", "Osiem", "Pięć"] },
    { question: "W którym mieście znajduje się Krzywa Wieża?", correctAnswer: "W Pizie", incorrectAnswers: ["W Rzymie", "W Wenecji", "We Florencji"] },
    { question: "Który ocean jest największy?", correctAnswer: "Spokojny", incorrectAnswers: ["Atlantycki", "Indyjski", "Arktyczny"] },
    { question: "Jak nazywa się główny składnik powietrza?", correctAnswer: "Azot", incorrectAnswers: ["Tlen", "Dwutlenek węgla", "Wodór"] },
    { question: "Ile nóg ma pająk?", correctAnswer: "Osiem", incorrectAnswers: ["Sześć", "Cztery", "Dziesięć"] },
    { question: "Jakie zwierzę jest królem dżungli?", correctAnswer: "Lew", incorrectAnswers: ["Tygrys", "Słoń", "Goryl"] },
    { question: "Jaki jest największy kraj na świecie pod względem powierzchni?", correctAnswer: "Rosja", incorrectAnswers: ["Kanada", "Chiny", "USA"] },
    { question: "Jak nazywa się najwyższa góra świata?", correctAnswer: "Mount Everest", incorrectAnswers: ["K2", "Kangczendzonga", "Lhotse"] },
    { question: "Ile dni ma luty w roku przestępnym?", correctAnswer: "29", incorrectAnswers: ["28", "30", "31"] },
    { question: "Jak nazywa się pisarz, który stworzył postać Sherlocka Holmesa?", correctAnswer: "Arthur Conan Doyle", incorrectAnswers: ["Agatha Christie", "Edgar Allan Poe", "Charles Dickens"] },
    { question: "Co jest stolicą Australii?", correctAnswer: "Canberra", incorrectAnswers: ["Sydney", "Melbourne", "Perth"] },
    { question: "Który zmysł jest najważniejszy dla nietoperzy do nawigacji?", correctAnswer: "Słuch (echolokacja)", incorrectAnswers: ["Wzrok", "Węch", "Dotyk"] },
    { question: "Jak nazywa się waluta używana w Wielkiej Brytanii?", correctAnswer: "Funt szterling", incorrectAnswers: ["Euro", "Dolar", "Frank"] },
    { question: "Jak nazywa się słynny obraz z uśmiechniętą kobietą w Luwrze?", correctAnswer: "Mona Lisa", incorrectAnswers: ["Dziewczyna z perłą", "Narodziny Wenus", "Dama z gronostajem"] },
    { question: "Które miasto jest znane jako 'Wielkie Jabłko'?", correctAnswer: "Nowy Jork", incorrectAnswers: ["Los Angeles", "Chicago", "Waszyngton"] },
    { question: "Jakie jest oficjalne zwierzę Kanady?", correctAnswer: "Bóbr", incorrectAnswers: ["Niedźwiedź Grizzly", "Łoś", "Wilk"] },
    { question: "W jakim sporcie używa się 'lotki'?", correctAnswer: "W badmintonie", incorrectAnswers: ["W tenisie", "W squashu", "W ping-pongu"] },
    { question: "Który kraj słynie z produkcji zegarków?", correctAnswer: "Szwajcaria", incorrectAnswers: ["Niemcy", "Japonia", "Francja"] },
    { question: "Ile to jest tuzin?", correctAnswer: "12", incorrectAnswers: ["10", "20", "24"] },
    { question: "Jak nazywa się nauka o gwiazdach i planetach?", correctAnswer: "Astronomia", incorrectAnswers: ["Astrologia", "Geologia", "Biologia"] },
    { question: "Kto był pierwszym człowiekiem w kosmosie?", correctAnswer: "Jurij Gagarin", incorrectAnswers: ["Neil Armstrong", "Buzz Aldrin", "John Glenn"] },
    { question: "Z jakiego kraju pochodzi pizza?", correctAnswer: "Włochy", incorrectAnswers: ["Grecja", "USA", "Francja"] },
    { question: "Jak nazywa się rzeka przepływająca przez Warszawę?", correctAnswer: "Wisła", incorrectAnswers: ["Odra", "Warta", "Bug"] },
    { question: "Ile lat ma wiek?", correctAnswer: "100", incorrectAnswers: ["10", "50", "1000"] },
    { question: "Które z tych zwierząt nie jest ssakiem?", correctAnswer: "Pingwin", incorrectAnswers: ["Delfin", "Nietoperz", "Wieloryb"] },
    { question: "Jak nazywa się prezydent USA, który zniósł niewolnictwo?", correctAnswer: "Abraham Lincoln", incorrectAnswers: ["George Washington", "Thomas Jefferson", "Franklin D. Roosevelt"] },
    { question: "W jakim mieście znajduje się wieża Eiffla?", correctAnswer: "W Paryżu", incorrectAnswers: ["W Londynie", "W Berlinie", "W Rzymie"] },
    { question: "Jak nazywa się trójkąt, który ma wszystkie boki równe?", correctAnswer: "Równoboczny", incorrectAnswers: ["Równoramienny", "Różnoboczny", "Prostokątny"] },
    { question: "Jaki kolor ma słońce?", correctAnswer: "Biały", incorrectAnswers: ["Żółty", "Pomarańczowy", "Czerwony"] },
    { question: "Co rośnie na dębie?", correctAnswer: "Żołędzie", incorrectAnswers: ["Kasztany", "Szyszki", "Orzechy"] },
    { question: "Który z tych instrumentów jest dęty?", correctAnswer: "Flet", incorrectAnswers: ["Wiolonczela", "Harfa", "Bęben"] },
    { question: "Jak nazywa się sport, w którym celem jest wbicie piłki do dołka?", correctAnswer: "Golf", incorrectAnswers: ["Polo", "Krykiet", "Bilard"] },
    { question: "W jakim kraju narodziły się Igrzyska Olimpijskie?", correctAnswer: "Grecja", incorrectAnswers: ["Rzym", "Egipt", "Chiny"] },
    { question: "Ile zębów ma dorosły człowiek?", correctAnswer: "32", incorrectAnswers: ["28", "30", "36"] },
    { question: "Jak nazywa się największa wyspa na świecie?", correctAnswer: "Grenlandia", incorrectAnswers: ["Australia", "Borneo", "Madagaskar"] },
    { question: "Z jakiego języka pochodzi słowo 'balet'?", correctAnswer: "Z włoskiego", incorrectAnswers: ["Z francuskiego", "Z rosyjskiego", "Z angielskiego"] },
    { question: "Co bada sejsmolog?", correctAnswer: "Trzęsienia ziemi", incorrectAnswers: ["Wulkany", "Pogodę", "Fale morskie"] },
    { question: "Jakie miasto jest stolicą Rosji?", correctAnswer: "Moskwa", incorrectAnswers: ["Sankt Petersburg", "Nowosybirsk", "Kazań"] },
    { question: "Ile cali ma stopa?", correctAnswer: "12", incorrectAnswers: ["10", "16", "24"] },
    { question: "Kto jest autorem obrazu 'Gwiaździsta noc'?", correctAnswer: "Vincent van Gogh", incorrectAnswers: ["Claude Monet", "Salvador Dalí", "Rembrandt"] },
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
    { question: "Jak nazywa się polska noblistka w dziedzinie literatury z 2018 roku?", correctAnswer: "Olga Tokarczuk", incorrectAnswers: ["Wisława Szymborska", "Czesław Miłosz", "Henryk Sienkiewicz"] },
    { question: "Jakie góry oddzielają Europę od Azji?", correctAnswer: "Ural", incorrectAnswers: ["Kaukaz", "Alpy", "Himalaje"] },
    { question: "Jak nazywa się firma, która stworzyła system Android?", correctAnswer: "Google", incorrectAnswers: ["Apple", "Microsoft", "Samsung"] },
    { question: "Jakie zjawisko odpowiada za powstawanie tęczy?", correctAnswer: "Rozszczepienie światła", incorrectAnswers: ["Odbicie światła", "Dyzfrakcja", "Polaryzacja"] },
    { question: "Jaką wartość pH ma roztwór obojętny?", correctAnswer: "7", incorrectAnswers: ["0", "14", "1"] },
    { question: "Jak nazywała się unia łącząca Polskę i Litwę w 1569 roku?", correctAnswer: "Unia Lubelska", incorrectAnswers: ["Unia w Krewie", "Unia Horodelska", "Unia wileńsko-radomska"] },
    { question: "Kto zdobył Złotą Piłkę w 2021 roku?", correctAnswer: "Lionel Messi", incorrectAnswers: ["Robert Lewandowski", "Jorginho", "Cristiano Ronaldo"] },
    { question: "Który polski reżyser stworzył film 'Pianista'?", correctAnswer: "Roman Polański", incorrectAnswers: ["Andrzej Wajda", "Krzysztof Kieślowski", "Agnieszka Holland"] },
    { question: "Jak nazywa się bohater powieści 'Zbrodnia i kara'?", correctAnswer: "Rodion Raskolnikow", incorrectAnswers: ["Książę Myszkin", "Stawrogin", "Alosza Karamazow"] },
    { question: "Jak nazywał się król bogów w mitologii greckiej?", correctAnswer: "Zeus", incorrectAnswers: ["Posejdon", "Hades", "Ares"] },
    { question: "Ile stopni ma kąt prosty?", correctAnswer: "90", incorrectAnswers: ["45", "180", "360"] },
    { question: "Co oznacza skrót 'HTML'?", correctAnswer: "HyperText Markup Language", incorrectAnswers: ["HighTech Modern Language", "Hyperlink and Text Markup Language", "Home Tool Markup Language"] },
    { question: "Jak nazywa się najbliższa Ziemi gwiazda?", correctAnswer: "Słońce", incorrectAnswers: ["Proxima Centauri", "Alfa Centauri A", "Syriusz"] },
    { question: "Które państwo jest największe pod względem powierzchni na świecie?", correctAnswer: "Rosja", incorrectAnswers: ["Kanada", "Chiny", "Stany Zjednoczone"] },
    { question: "Jak nazywała się polska konstytucja uchwalona w 1791 roku?", correctAnswer: "Konstytucja 3 maja", incorrectAnswers: ["Konstytucja marcowa", "Konstytucja kwietniowa", "Konstytucja PRL"] },
    { question: "Jakim gazem oddychają ryby?", correctAnswer: "Tlenem rozpuszczonym w wodzie", incorrectAnswers: ["Wodorem", "Dwutlenkiem węgla", "Azotem"] },
    { question: "Jak nazywa się urządzenie do pomiaru ciśnienia atmosferycznego?", correctAnswer: "Barometr", incorrectAnswers: ["Termometr", "Higrometr", "Anemometr"] },
    { question: "W jakim mieście znajduje się muzeum Luwr?", correctAnswer: "Paryż", incorrectAnswers: ["Londyn", "Madryt", "Rzym"] },
    { question: "Jakie narządy filtrują krew u człowieka?", correctAnswer: "Nerki", incorrectAnswers: ["Płuca", "Wątroba", "Śledziona"] },
    { question: "Która pustynia jest największa (gorąca) na świecie?", correctAnswer: "Sahara", incorrectAnswers: ["Gobi", "Kalahari", "Arabska"] },
    { question: "Jak nazywa się główna część zdania informująca, co robi podmiot?", correctAnswer: "Orzeczenie", incorrectAnswers: ["Podmiot", "Dopełnienie", "Okolicznik"] },
    { question: "Jak nazywa się pigment nadający kolor skórze człowieka?", correctAnswer: "Melanina", incorrectAnswers: ["Chlorofil", "Hemoglobina", "Karoten"] },
    { question: "Jak nazywał się pierwszy człowiek, który stanął na Księżycu?", correctAnswer: "Neil Armstrong", incorrectAnswers: ["Jurij Gagarin", "Buzz Aldrin", "Michael Collins"] },
    { question: "Jakiego instrumentu używał Fryderyk Chopin?", correctAnswer: "Fortepianu", incorrectAnswers: ["Skrzypiec", "Wiolonczeli", "Organów"] },
    { question: "Jakim symbolem oznacza się żelazo?", correctAnswer: "Fe", incorrectAnswers: ["Au", "Ag", "Pb"] },
    { question: "Jak nazywa się siła przyciągająca ciała do Ziemi?", correctAnswer: "Grawitacja", incorrectAnswers: ["Siła odśrodkowa", "Siła tarcia", "Siła magnetyczna"] },
    { question: "Jak nazywa się popularny sport zimowy na desce?", correctAnswer: "Snowboarding", incorrectAnswers: ["Narciarstwo alpejskie", "Bobsleje", "Łyżwiarstwo figurowe"] },
    { question: "Co oznacza skrót 'AI'?", correctAnswer: "Sztuczna inteligencja", incorrectAnswers: ["Automatyczna informacja", "Analiza internetowa", "Zaawansowana interakcja"] },
    { question: "Jak nazywa się największy księżyc Jowisza?", correctAnswer: "Ganimedes", incorrectAnswers: ["Kallisto", "Io", "Europa"] },
    { question: "Jak nazywa się liczba, która ma tylko dwa dzielniki?", correctAnswer: "Liczba pierwsza", incorrectAnswers: ["Liczba złożona", "Liczba parzysta", "Liczba doskonała"] },
    { question: "Który kontynent jest najmniejszy?", correctAnswer: "Australia", incorrectAnswers: ["Europa", "Ameryka Południowa", "Antarktyda"] },
    { question: "Jak nazywał się król, który zwyciężył pod Wiedniem w 1683?", correctAnswer: "Jan III Sobieski", incorrectAnswers: ["Władysław IV Waza", "Stefan Batory", "Zygmunt III Waza"] },
    { question: "Jak nazywa się układ odpowiedzialny za transport krwi?", correctAnswer: "Układ krwionośny", incorrectAnswers: ["Układ oddechowy", "Układ nerwowy", "Układ trawienny"] },
    { question: "Jak nazywa się zmiana stanu z gazu w ciecz?", correctAnswer: "Skraplanie", incorrectAnswers: ["Parowanie", "Sublimacja", "Krzepnięcie"] },
    { question: "Jak nazywa się system operacyjny stworzony przez Apple?", correctAnswer: "macOS", incorrectAnswers: ["Windows", "Linux", "Android"] },
    { question: "Jak nazywa się naturalny satelita Ziemi?", correctAnswer: "Księżyc", incorrectAnswers: ["Słońce", "Fobos", "Deimos"] },
    { question: "Jak nazywa się najwyższy szczyt Tatr?", correctAnswer: "Gerlach", incorrectAnswers: ["Rysy", "Kasprowy Wierch", "Giewont"] },
    { question: "Kto jest autorem rzeźby 'Dawid'?", correctAnswer: "Michał Anioł", incorrectAnswers: ["Leonardo da Vinci", "Donatello", "Rafael Santi"] },
    { question: "Jak nazywa się tradycyjna japońska sztuka składania papieru?", correctAnswer: "Origami", incorrectAnswers: ["Kaligrafia", "Ikebana", "Sumie"] },
    { question: "Ile wynosi 12 x 12?", correctAnswer: "144", incorrectAnswers: ["122", "132", "154"] },
    { question: "Które państwo ma najwięcej mieszkańców na świecie?", correctAnswer: "Indie", incorrectAnswers: ["Chiny", "USA", "Indonezja"] },
    { question: "W którym roku miała miejsce bitwa pod Grunwaldem?", correctAnswer: "1410", incorrectAnswers: ["1386", "1444", "1525"] },
    { question: "Jak nazywa się jednostka natężenia prądu elektrycznego?", correctAnswer: "Amper", incorrectAnswers: ["Wolt", "Om", "Wat"] },
    { question: "Jakim pierwiastkiem jest symbol Cu?", correctAnswer: "Miedź", incorrectAnswers: ["Cynk", "Cyna", "Srebro"] },
    { question: "Jakie komórki odpowiadają za transport tlenu we krwi?", correctAnswer: "Erytrocyty", incorrectAnswers: ["Leukocyty", "Trombocyty", "Limfocyty"] },
    { question: "Jak nazywa się tradycyjny taniec hiszpański?", correctAnswer: "Flamenco", incorrectAnswers: ["Salsa", "Tango", "Walc"] },
    { question: "Ile minut trwa standardowy mecz piłki nożnej?", correctAnswer: "90", incorrectAnswers: ["80", "100", "120"] },
    { question: "Jak nazywa się planeta najbliższa Słońcu?", correctAnswer: "Merkury", incorrectAnswers: ["Wenus", "Mars", "Ziemia"] },
    { question: "Jak nazywa się rzeka przepływająca przez Londyn?", correctAnswer: "Tamiza", incorrectAnswers: ["Sekwana", "Dunaj", "Tyber"] },
    { question: "Jak nazywa się największy narząd człowieka?", correctAnswer: "Skóra", incorrectAnswers: ["Wątroba", "Mózg", "Płuca"] },
    { question: "W którym roku miał miejsce wybuch Powstania Warszawskiego?", correctAnswer: "1944", incorrectAnswers: ["1939", "1943", "1945"] },
    { question: "Jak nazywa się tradycyjny niemiecki festiwal piwa?", correctAnswer: "Oktoberfest", incorrectAnswers: ["Karneval", "Weihnachtsmarkt", "Schützenfest"] },
    { question: "Jaki jest najtwardszy minerał na Ziemi?", correctAnswer: "Diament", incorrectAnswers: ["Kwarc", "Topaz", "Korund"] },
    { question: "Kto napisał 'Odyseję'?", correctAnswer: "Homer", incorrectAnswers: ["Wergiliusz", "Sofokles", "Platon"] },
    { question: "Jakie miasto jest stolicą Brazylii?", correctAnswer: "Brasília", incorrectAnswers: ["Rio de Janeiro", "São Paulo", "Salvador"] },
    { question: "Jak nazywa się nauka o owadach?", correctAnswer: "Entomologia", incorrectAnswers: ["Ornitologia", "Herpetologia", "Ichtologia"] },
    { question: "Który z tych gazów jest najlżejszy?", correctAnswer: "Wodór", incorrectAnswers: ["Hel", "Tlen", "Azot"] },
    { question: "W którym kraju leży Machu Picchu?", correctAnswer: "Peru", incorrectAnswers: ["Boliwia", "Kolumbia", "Ekwador"] },
    { question: "Jakie państwo jest znane jako 'Kraina Tysiąca Jezior'?", correctAnswer: "Finlandia", incorrectAnswers: ["Szwecja", "Norwegia", "Kanada"] },
    { question: "Kto był pierwszym cesarzem Rzymu?", correctAnswer: "Oktawian August", incorrectAnswers: ["Juliusz Cezar", "Neron", "Kaligula"] },
    { question: "Jak nazywa się proces, w którym żelazo rdzewieje?", correctAnswer: "Utlenianie", incorrectAnswers: ["Redukcja", "Spalanie", "Hydroliza"] },
    { question: "Który z Beatlesów został zamordowany w 1980 roku?", correctAnswer: "John Lennon", incorrectAnswers: ["Paul McCartney", "George Harrison", "Ringo Starr"] },
    { question: "Jak nazywa się stolica Egiptu?", correctAnswer: "Kair", incorrectAnswers: ["Aleksandria", "Giza", "Luksor"] },
    { question: "W jakim sporcie celem jest 'szach-mat'?", correctAnswer: "W szachach", incorrectAnswers: ["W warcabach", "W go", "W brydżu"] },
    { question: "Ile wynosi liczba Pi (w przybliżeniu)?", correctAnswer: "3,14", incorrectAnswers: ["2,71", "1,61", "4,20"] },
    { question: "Który z tych krajów nie należy do Skandynawii?", correctAnswer: "Finlandia", incorrectAnswers: ["Dania", "Szwecja", "Norwegia"] },
    { question: "Jak nazywa się największy ocean na Ziemi?", correctAnswer: "Pacyfik", incorrectAnswers: ["Atlantyk", "Ocean Indyjski", "Ocean Arktyczny"] },
    { question: "Kto wynalazł żarówkę?", correctAnswer: "Thomas Edison", incorrectAnswers: ["Nikola Tesla", "Alexander Graham Bell", "Albert Einstein"] },
    { question: "Jak nazywa się największa kość w ludzkim ciele?", correctAnswer: "Kość udowa", incorrectAnswers: ["Kość ramienna", "Czaszka", "Miednica"] },
    { question: "Który kraj ma kształt buta?", correctAnswer: "Włochy", incorrectAnswers: ["Grecja", "Hiszpania", "Portugalia"] },
    { question: "Jak nazywa się stolica Hiszpanii?", correctAnswer: "Madryt", incorrectAnswers: ["Barcelona", "Sewilla", "Walencja"] },
    { question: "Która religia jest dominująca w Indiach?", correctAnswer: "Hinduizm", incorrectAnswers: ["Buddyzm", "Islam", "Chrześcijaństwo"] },
    { question: "Jak nazywa się najwyższy wodospad na świecie?", correctAnswer: "Salto Angel", incorrectAnswers: ["Wodospad Niagara", "Wodospad Wiktorii", "Wodospad Iguazu"] },
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
    { question: "Kto napisał 'Sto lat samotności'?", correctAnswer: "Gabriel García Márquez", incorrectAnswers: ["Julio Cortázar", "Mario Vargas Llosa", "Jorge Luis Borges"] },
    { question: "Jak nazywa się japońska sztuka teatru lalek?", correctAnswer: "Bunraku", incorrectAnswers: ["Kabuki", "Nō", "Kyōgen"] },
    { question: "Który malarz jest głównym twórcą kubizmu?", correctAnswer: "Pablo Picasso", incorrectAnswers: ["Georges Braque", "Juan Gris", "Fernand Léger"] },
    { question: "Jak nazywa się najjaśniejsza gwiazda w konstelacji Oriona?", correctAnswer: "Rigel", incorrectAnswers: ["Betelgeza", "Bellatrix", "Saiph"] },
    { question: "Co oznacza skrót 'CPU' w informatyce?", correctAnswer: "Central Processing Unit", incorrectAnswers: ["Central Power Unit", "Computer Personal Unit", "Central Peripheral Unit"] },
    { question: "Jak nazywa się protokół przesyłu plików w sieci?", correctAnswer: "FTP", incorrectAnswers: ["HTTP", "SMTP", "TCP"] },
    { question: "Kto był autorem teorii heliocentrycznej?", correctAnswer: "Mikołaj Kopernik", incorrectAnswers: ["Galileusz", "Johannes Kepler", "Isaac Newton"] },
    { question: "Jakie miasto jest stolicą Uzbekistanu?", correctAnswer: "Taszkent", incorrectAnswers: ["Samarkanda", "Buchara", "Astana"] },
    { question: "Jak nazywa się białko magazynujące tlen w mięśniach?", correctAnswer: "Mioglobina", incorrectAnswers: ["Hemoglobina", "Kolagen", "Albumina"] },
    { question: "Które komórki odpowiadają za odporność nabytą swoistą?", correctAnswer: "Limfocyty", incorrectAnswers: ["Neutrofile", "Monocyty", "Eozynofile"] },
    { question: "Jak nazywa się proces rozkładu wody na tlen i wodór?", correctAnswer: "Elektroliza", incorrectAnswers: ["Hydroliza", "Piroliza", "Termoliza"] },
    { question: "Jaka jest liczba atomowa węgla?", correctAnswer: "6", incorrectAnswers: ["12", "14", "8"] },
    { question: "Jak nazywa się jednostka częstotliwości?", correctAnswer: "Herc (Hz)", incorrectAnswers: ["Decybel (dB)", "Radian (rad)", "Kandela (cd)"] },
    { question: "Jak nazywa się zjawisko załamania światła?", correctAnswer: "Refrakcja", incorrectAnswers: ["Refleksja", "Dyfrakcja", "Absorpcja"] },
    { question: "Kto napisał 'Wojnę i pokój'?", correctAnswer: "Lew Tołstoj", incorrectAnswers: ["Fiodor Dostojewski", "Antoni Czechow", "Iwan Turgieniew"] },
    { question: "Który francuski malarz jest głównym twórcą impresjonizmu?", correctAnswer: "Claude Monet", incorrectAnswers: ["Édouard Manet", "Pierre-Auguste Renoir", "Edgar Degas"] },
    { question: "Jak nazywa się największy księżyc Saturna?", correctAnswer: "Tytan", incorrectAnswers: ["Rea", "Japet", "Enceladus"] },
    { question: "Jak nazywa się gwiazda najbliższa Ziemi (poza Słońcem)?", correctAnswer: "Proxima Centauri", incorrectAnswers: ["Alfa Centauri A", "Syriusz", "Barnard's Star"] },
    { question: "Które państwo leży zarówno w Europie, jak i w Azji?", correctAnswer: "Turcja", incorrectAnswers: ["Egipt", "Maroko", "Cypr"] },
    { question: "Jakie jest najwyższe wzniesienie w Afryce?", correctAnswer: "Kilimandżaro", incorrectAnswers: ["Mount Kenya", "Góry Atlas", "Góry Smocze"] },
    { question: "W którym roku podpisano Traktat Wersalski?", correctAnswer: "1919", incorrectAnswers: ["1918", "1920", "1917"] },
    { question: "Jak nazywa się najdłuższa kość w ludzkim ciele?", correctAnswer: "Kość udowa", incorrectAnswers: ["Kość ramienna", "Piszczel", "Strzałka"] },
    { question: "Jak nazywa się proces syntezy białek w komórce?", correctAnswer: "Translacja", incorrectAnswers: ["Transkrypcja", "Replikacja", "Mutacja"] },
    { question: "Jaki jest wzór chemiczny kwasu siarkowego?", correctAnswer: "H₂SO₄", incorrectAnswers: ["HCl", "H₂CO₃", "HNO₃"] },
    { question: "Jak nazywa się pierwiastek o liczbie atomowej 79?", correctAnswer: "Złoto", incorrectAnswers: ["Platyna", "Srebro", "Ołów"] },
    { question: "Jak nazywa się jednostka indukcyjności?", correctAnswer: "Henr", incorrectAnswers: ["Farad", "Tesla", "Weber"] },
    { question: "Ile wynosi logarytm dziesiętny z 1000?", correctAnswer: "3", incorrectAnswers: ["2", "4", "10"] },
    { question: "Jakie są pierwiastki równania x² - 5x + 6 = 0?", correctAnswer: "2 i 3", incorrectAnswers: ["-2 i -3", "1 i 6", "2 i -3"] },
    { question: "Kto napisał 'Braci Karamazow'?", correctAnswer: "Fiodor Dostojewski", incorrectAnswers: ["Lew Tołstoj", "Iwan Turgieniew", "Nikołaj Gogol"] },
    { question: "Który hiszpański artysta stworzył 'Guernicę'?", correctAnswer: "Pablo Picasso", incorrectAnswers: ["Salvador Dalí", "Francisco Goya", "Joan Miró"] },
    { question: "Jak nazywa się planeta nazywana 'Czerwoną Planetą'?", correctAnswer: "Mars", incorrectAnswers: ["Wenus", "Jowisz", "Merkury"] },
    { question: "Jak nazywa się galaktyka, w której znajduje się Ziemia?", correctAnswer: "Droga Mleczna", incorrectAnswers: ["Galaktyka Andromedy", "Wielki Obłok Magellana", "Galaktyka Trójkąta"] },
    { question: "Co oznacza skrót 'RAM'?", correctAnswer: "Random Access Memory", incorrectAnswers: ["Read-Only Memory", "Real-time Application Memory", "Rapid Action Memory"] },
    { question: "Jak nazywa się protokół bezpiecznego przesyłania danych w WWW?", correctAnswer: "HTTPS", incorrectAnswers: ["HTTP", "FTP", "SSH"] },
    { question: "Jak nazywał się ostatni władca dynastii Romanowów w Rosji?", correctAnswer: "Mikołaj II", incorrectAnswers: ["Aleksander III", "Piotr I Wielki", "Katarzyna II Wielka"] },
    { question: "Kto był liderem rewolucji kubańskiej w 1959 roku?", correctAnswer: "Fidel Castro", incorrectAnswers: ["Che Guevara", "Fulgencio Batista", "Camilo Cienfuegos"] },
    { question: "Jakie państwo ma najwięcej wysp na świecie?", correctAnswer: "Szwecja", incorrectAnswers: ["Indonezja", "Finlandia", "Kanada"] },
    { question: "Która pustynia jest największa (ogólnie) na świecie?", correctAnswer: "Antarktyczna", incorrectAnswers: ["Arktyczna", "Sahara", "Gobi"] },
    { question: "Jakie komórki wytwarzają przeciwciała?", correctAnswer: "Limfocyty B", incorrectAnswers: ["Limfocyty T", "Makrofagi", "Granulocyty"] },
    { question: "Jak nazywa się największy narząd wewnętrzny człowieka?", correctAnswer: "Wątroba", incorrectAnswers: ["Płuca", "Mózg", "Serce"] },
    { question: "Jaki pierwiastek ma symbol Hg?", correctAnswer: "Rtęć", incorrectAnswers: ["Srebro", "Ołów", "Cyna"] },
    { question: "Jak nazywa się przyrząd do pomiaru prędkości wiatru?", correctAnswer: "Anemometr", incorrectAnswers: ["Barometr", "Wiatrowskaz", "Higrometr"] },
    { question: "Jak nazywa się jednostka energii w układzie SI?", correctAnswer: "Dżul", incorrectAnswers: ["Kaloria", "Wat", "Niuton"] },
    { question: "Jakie są pierwiastki równania x² + x - 6 = 0?", correctAnswer: "-3 i 2", incorrectAnswers: ["3 i -2", "1 i -6", "-1 i 6"] },
    { question: "Kto jest autorem powieści 'Duma i uprzedzenie'?", correctAnswer: "Jane Austen", incorrectAnswers: ["Siostry Brontë", "George Eliot", "Virginia Woolf"] },
    { question: "Który niemiecki kompozytor jest autorem 'Symfonii losu'?", correctAnswer: "Ludwig van Beethoven", incorrectAnswers: ["Jan Sebastian Bach", "Wolfgang Amadeus Mozart", "Richard Wagner"] },
    { question: "Jak nazywa się naturalny satelita Marsa o większej średnicy?", correctAnswer: "Fobos", incorrectAnswers: ["Deimos", "Europa", "Tytan"] },
    { question: "Co oznacza skrót 'URL'?", correctAnswer: "Uniform Resource Locator", incorrectAnswers: ["Universal Reference Link", "Uniform Record Linker", "Universal Resource Link"] },
    { question: "Czym jest 'martwa natura' w malarstwie?", correctAnswer: "Przedstawienie przedmiotów nieożywionych", incorrectAnswers: ["Pejzaż bez ludzi", "Portret zmarłej osoby", "Scena historyczna"] },
    { question: "Co to jest 'Czarne złoto'?", correctAnswer: "Ropa naftowa", incorrectAnswers: ["Węgiel", "Złoto", "Obsydian"] },
    { question: "Jakie państwo jest najgęściej zaludnione na świecie?", correctAnswer: "Monako", incorrectAnswers: ["Singapur", "Watykan", "Malta"] },
    { question: "Co bada herpetologia?", correctAnswer: "Płazy i gady", incorrectAnswers: ["Ryby", "Ptaki", "Pajęczaki"] },
    { question: "W którym roku człowiek po raz pierwszy wylądował na Księżycu?", correctAnswer: "1969", incorrectAnswers: ["1961", "1972", "1957"] },
    { question: "Jak nazywa się teoria, że kontynenty się poruszają?", correctAnswer: "Tektonika płyt", incorrectAnswers: ["Teoria ewolucji", "Teoria względności", "Teoria wielkiego wybuchu"] },
    { question: "Kto napisał 'Folwark zwierzęcy'?", correctAnswer: "George Orwell", incorrectAnswers: ["Aldous Huxley", "Ray Bradbury", "William Golding"] },
    { question: "Jak nazywa się stolica Argentyny?", correctAnswer: "Buenos Aires", incorrectAnswers: ["Santiago", "Bogota", "Lima"] },
    { question: "Co to jest pH?", correctAnswer: "Miara kwasowości lub zasadowości roztworu", incorrectAnswers: ["Miara gęstości", "Miara temperatury", "Miara ciśnienia"] },
    { question: "W jakim kraju znajduje się Wielki Mur?", correctAnswer: "W Chinach", incorrectAnswers: ["W Indiach", "W Japonii", "W Mongolii"] },
    { question: "Jak nazywa się największa komórka w ludzkim ciele?", correctAnswer: "Komórka jajowa", incorrectAnswers: ["Neuron", "Komórka mięśniowa", "Komórka tłuszczowa"] },
    { question: "Który z tych instrumentów jest perkusyjny?", correctAnswer: "Ksylofon", incorrectAnswers: ["Altówka", "Klarnet", "Akordeon"] },
    { question: "Jak nazywa się proces, w którym lód zamienia się bezpośrednio w parę wodną?", correctAnswer: "Sublimacja", incorrectAnswers: ["Parowanie", "Topnienie", "Kondensacja"] },
    { question: "Kto był bogiem wojny w mitologii rzymskiej?", correctAnswer: "Mars", incorrectAnswers: ["Jowisz", "Neptun", "Pluton"] },
    { question: "Jak nazywa się trójkąt, w którym jeden z kątów ma 90 stopni?", correctAnswer: "Prostokątny", incorrectAnswers: ["Ostrokątny", "Rozwartokątny", "Równoboczny"] },
    { question: "Która część rośliny jest odpowiedzialna za pobieranie wody?", correctAnswer: "Korzeń", incorrectAnswers: ["Łodyga", "Liść", "Kwiat"] },
    { question: "Kto jest autorem słów do polskiego hymnu narodowego?", correctAnswer: "Józef Wybicki", incorrectAnswers: ["Adam Mickiewicz", "Jan Kochanowski", "Cyprian Kamil Norwid"] },
    { question: "Jak nazywa się największy staw w ciele człowieka?", correctAnswer: "Staw kolanowy", incorrectAnswers: ["Staw biodrowy", "Staw ramienny", "Staw skokowy"] },
    { question: "W jakim mieście znajduje się słynna opera La Scala?", correctAnswer: "W Mediolanie", incorrectAnswers: ["W Rzymie", "W Wenecji", "W Neapolu"] },
    { question: "Jak nazywa się waluta Japonii?", correctAnswer: "Jen", incorrectAnswers: ["Juan", "Won", "Rupia"] },
    { question: "Która witamina jest produkowana w skórze pod wpływem słońca?", correctAnswer: "Witamina D", incorrectAnswers: ["Witamina C", "Witamina A", "Witamina B12"] },
    { question: "Jak nazywa się stolica Turcji?", correctAnswer: "Ankara", incorrectAnswers: ["Stambuł", "Izmir", "Bursa"] },
    { question: "Jak nazywa się nauka o języku?", correctAnswer: "Językoznawstwo", incorrectAnswers: ["Literatura", "Filozofia", "Historia"] },
    { question: "Ile wynosi prędkość światła w próżni (w przybliżeniu)?", correctAnswer: "300 000 km/s", incorrectAnswers: ["150 000 km/s", "1 000 000 km/s", "30 000 km/s"] },
    { question: "Kto namalował 'Słoneczniki'?", correctAnswer: "Vincent van Gogh", incorrectAnswers: ["Paul Gauguin", "Paul Cézanne", "Claude Monet"] },
    { question: "Jak nazywa się największy gatunek kota?", correctAnswer: "Tygrys syberyjski", incorrectAnswers: ["Lew afrykański", "Jaguar", "Puma"] },
    { question: "Które miasto było stolicą Polski przed Warszawą?", correctAnswer: "Kraków", incorrectAnswers: ["Gniezno", "Poznań", "Płock"] },
    { question: "Jak nazywa się badanie snu?", correctAnswer: "Polisomnografia", incorrectAnswers: ["Elektroencefalografia", "Kardiografia", "Tomografia"] },
    { question: "Co to jest 'aurora borealis'?", correctAnswer: "Zorza polarna", incorrectAnswers: ["Zaćmienie słońca", "Deszcz meteorów", "Czarna dziura"] },
    { question: "Który kraj jest największym producentem kawy na świecie?", correctAnswer: "Brazylia", incorrectAnswers: ["Wietnam", "Kolumbia", "Etiopia"] },
    { question: "Jak nazywa się czwarty stan skupienia materii?", correctAnswer: "Plazma", incorrectAnswers: ["Ciecz", "Gaz", "Ciało stałe"] },
    { question: "Kto napisał 'Proces'?", correctAnswer: "Franz Kafka", incorrectAnswers: ["Albert Camus", "Jean-Paul Sartre", "Hermann Hesse"] },
    { question: "Jaki jest najdłuższy nerw w ludzkim ciele?", correctAnswer: "Nerw kulszowy", incorrectAnswers: ["Nerw wzrokowy", "Nerw błędny", "Nerw trójdzielny"] },
    { question: "Jak nazywa się stolica Szwajcarii?", correctAnswer: "Berno", incorrectAnswers: ["Zurych", "Genewa", "Bazylea"] },
    { question: "W którym oceanie leży Trójkąt Bermudzki?", correctAnswer: "Atlantyckim", incorrectAnswers: ["Spokojnym", "Indyjskim", "Arktycznym"] },
    { question: "Jak nazywa się nauka o grzybach?", correctAnswer: "Mykologia", incorrectAnswers: ["Botanika", "Zoologia", "Bakteriologia"] },
    { question: "Która rzeka jest najdłuższa na świecie?", correctAnswer: "Nil", incorrectAnswers: ["Amazonka", "Jangcy", "Missisipi"] },
    { question: "Kto skomponował 'Cztery pory roku'?", correctAnswer: "Antonio Vivaldi", incorrectAnswers: ["Wolfgang Amadeus Mozart", "Jan Sebastian Bach", "Ludwig van Beethoven"] },
    { question: "Jak nazywa się lęk przed otwartą przestrzenią?", correctAnswer: "Agorafobia", incorrectAnswers: ["Klaustrofobia", "Arachnofobia", "Akrofobia"] },
  ]
};
// --- END OF DATABASE ---

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
