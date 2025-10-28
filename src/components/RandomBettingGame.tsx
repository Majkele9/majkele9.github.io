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
const CATEGORIES = ['Absurdalne', 'Sport', 'Historia', 'Nauka', 'Technologia', 'Popkultura', 'Rynki finansowe/Kryptowaluty', 'Transport'];

const SCENARIOS_DATABASE: { [key: string]: RandomBetScenario[] } = {
    'Absurdalne': [
    { question: "Czy gdyby mrówki potrafiły mówić, to najczęściej narzekałyby na pogodę czy ludzi?", optionA: "Na pogodę, bo ciągle im zalewa mrowisko.", optionB: "Na ludzi, bo deptają ich domy bez pytania." },
    { question: "Co by się stało, gdyby pociągi miały uczucia?", optionA: "Odmówiłyby pracy w poniedziałki.", optionB: "Zaczęłyby się ścigać z autobusami z zazdrości." },
    { question: "Czy gdyby psy miały swoje telefony, to dzwoniłyby do właścicieli czy do kurierów?", optionA: "Do właścicieli, żeby przypomnieć o spacerze.", optionB: "Do kurierów, żeby szybciej przyszły paczki z karmą." },
    { question: "Jak wyglądałby świat, gdyby pomidory mogły się bronić?", optionA: "Rzucałyby w ludzi pestkami jak z katapulty.", optionB: "Zawiązałyby sojusz z cebulą i ogórkiem." },
    { question: "Czy koty planują przejęcie świata?", optionA: "Tak, ale zapomniały, bo zasnęły.", optionB: "Nie, bo już nim rządzą, tylko o tym nie wiemy." },
    { question: "Co by się stało, gdyby wszyscy ludzie zaczęli chodzić tyłem?", optionA: "Świat byłby bezpieczniejszy, bo każdy patrzyłby za siebie.", optionB: "Moda cofania zawładnęłaby TikTokiem." },
    { question: "Czy ryby mają sny?", optionA: "Tak, o lataniu nad wodą.", optionB: "Nie, bo ich budzą bąbelki." },
    { question: "Co by było, gdyby śnieg był jadalny i smakował jak lody?", optionA: "Zima byłaby najbardziej tuczącą porą roku.", optionB: "Dzieci nigdy nie chciałyby wakacji." },
    { question: "Jak by wyglądał świat, gdyby samochody miały uczucia?", optionA: "Obrażałyby się, gdyby ktoś jechał zbyt wolno.", optionB: "Zazdrościłyby hulajnogom wolności." },
    { question: "Czy gdyby kury umiały grać w szachy, to wygrałyby z człowiekiem?", optionA: "Tak, bo mają naturalny instynkt strategii.", optionB: "Nie, bo dziobałyby pionki z nerwów." },
    { question: "Co by się stało, gdyby ziemniaki miały własne media społecznościowe?", optionA: "Codziennie wrzucałyby #selfie z frytkownicy.", optionB: "Pisałyby posty o tym, jak bardzo nie lubią puree." },
    { question: "Czy pingwiny mogłyby prowadzić talk-show?", optionA: "Tak, pod nazwą ‘Na Lodzie’", optionB: "Nie, bo publiczność by się poślizgnęła." },
    { question: "Co by było, gdyby grawitacja miała dni wolne?", optionA: "Ludzie lataliby po sklepach dosłownie.", optionB: "Koty w końcu strącałyby wszystko bez konsekwencji." },
    { question: "Jak wyglądałby świat, gdyby chmury miały emocje?", optionA: "Płakałyby z zazdrości, gdy ktoś opala się na plaży.", optionB: "Śmiałyby się piorunami." },
    { question: "Czy marchewki mają kompleksy wobec brokułów?", optionA: "Tak, bo brokuły są bardziej 'fit'.", optionB: "Nie, bo marchewki częściej występują w bajkach." },
    { question: "Co by się stało, gdyby Internet zyskał samoświadomość?", optionA: "Usunąłby wszystkie stare posty z Facebooka.", optionB: "Stworzyłby własne konto na TikToku." },
    { question: "Czy gdyby dinozaury wróciły, oglądałyby filmy o sobie?", optionA: "Tak, i narzekałyby na efekty specjalne.", optionB: "Nie, bo nie rozumiałyby języka ludzkiego." },
    { question: "Jak wyglądałby świat, gdyby każdy musiał codziennie rymować?", optionA: "Rap stałby się językiem urzędowym.", optionB: "Po tygodniu wszyscy by oszaleli." },
    { question: "Czy gdyby kawa była zakazana, powstałby czarny rynek espresso?", optionA: "Tak, z tajnymi kawiarenkami w piwnicach.", optionB: "Nie, bo ludzie i tak przeszliby na yerba mate." },
    { question: "Co by było, gdyby ludzie świecili w ciemności?", optionA: "Zniknęłyby rachunki za prąd.", optionB: "Kłótnie par w nocy stałyby się bardziej widowiskowe." },
    { question: "Czy gdyby psy miały własny parlament, co by uchwaliły?", optionA: "Obowiązkowe drapanie za uchem co 2 godziny.", optionB: "Zakaz kąpieli bez konsultacji." },
    { question: "Jak wyglądałby świat, gdyby drzewa potrafiły mówić?", optionA: "Opowiadałyby plotki o przechodniach.", optionB: "Krzyczałyby na ludzi za graffiti na korze." },
    { question: "Czy gdyby ludzie mieli ogony, byłyby modne?", optionA: "Tak, salony fryzjerskie miałyby nowe wyzwanie.", optionB: "Nie, bo nikt nie wiedziałby, jak siedzieć wygodnie." },
    { question: "Co by się stało, gdyby muzyka była widoczna?", optionA: "Koncerty wyglądałyby jak fajerwerki.", optionB: "Szkoły muzyczne musiałyby mieć okulary ochronne." },
    { question: "Czy gdyby buty miały osobowość, które byłyby najbardziej aroganckie?", optionA: "Szpilki.", optionB: "Sneakersy z limitowanej edycji." },
    { question: "Co by było, gdyby każdy sen był transmitowany na żywo?", optionA: "Nikt by już nie spał spokojnie.", optionB: "Powstałby nowy gatunek reality show." },
    { question: "Czy gdyby świece miały głos, co by mówiły?", optionA: "‘Nie dmuchaj!’", optionB: "‘Jeszcze chwila i mnie nie będzie!’" },
    { question: "Jak wyglądałby świat, gdyby wszystkie rzeczy miały uczucia?", optionA: "Telefon obrażałby się po upadku.", optionB: "Kubek tęskniłby za swoją kawą." },
    { question: "Czy gdyby kalendarze były żywe, lubiłyby luty?", optionA: "Nie, bo jest za krótki.", optionB: "Tak, bo mniej pracy." },
    { question: "Co by się stało, gdyby koty mogły pisać e-maile?", optionA: "Temat: 'Dlaczego twoja klawiatura jest moja?'", optionB: "Załącznik: 400 zdjęć ogona." },
    { question: "Czy gdyby księżyc był z sera, myszy poleciałyby tam pierwsze?", optionA: "Tak, w ramach misji 'Apollo Mysz-1'.", optionB: "Nie, bo bałyby się odkurzaczy NASA." },
    { question: "Jak wyglądałby świat, gdyby każdy człowiek miał swoje intro jak w filmie?", optionA: "Poranki trwałyby godzinę.", optionB: "Windy stałyby się sceną." },
    { question: "Czy gdyby Google miał humor, jakby odpowiadał?", optionA: "‘A nie możesz sam sprawdzić?’", optionB: "‘Znowu to pytanie?’" },
    { question: "Co by było, gdyby krowy nosiły okulary przeciwsłoneczne?", optionA: "Stałyby się ikonami stylu wiejskiego.", optionB: "Lepsza ochrona przed spojrzeniami UFO." },
    { question: "Czy gdyby ryż miał świadomość, lubiłby sushi?", optionA: "Tak, to dla niego awans społeczny.", optionB: "Nie, bo to kanibalizm." },
    { question: "Jak wyglądałby świat, gdyby reklamy mówiły prawdę?", optionA: "Nikt by nic nie kupował.", optionB: "Ludzie zaczęliby kolekcjonować szczerość." },
    { question: "Czy gdyby psy potrafiły gotować, co by serwowały?", optionA: "Schabowego z zapachem buta.", optionB: "Zupę z kurzej kości i piłki tenisowej." },
    { question: "Co by było, gdyby ślimaki miały turboskrzydła?", optionA: "Zostałyby mistrzami Formuły 1.", optionB: "Zniknęłyby wszystkie liście w ogrodach." },
    { question: "Czy gdyby ludzie mogli oddychać pod wodą, nadal kupowaliby baseny?", optionA: "Tak, dla prestiżu.", optionB: "Nie, bo ocean byłby darmowy." },
    { question: "Co by się stało, gdyby czas płynął do tyłu?", optionA: "Wszyscy by się odmładzali, ale pamiętali błędy.", optionB: "Kino akcji trwałoby 5 sekund." },
    { question: "Czy gdyby pizza mówiła, co by powiedziała?", optionA: "‘Nie dziel mnie!’", optionB: "‘Znowu ananas?!’" },
    { question: "Jak wyglądałby świat, gdyby sny można było kupować?", optionA: "Pojawiłyby się luksusowe marzenia z abonamentem.", optionB: "Ludzie spali by na kredyt." },
    { question: "Czy gdyby słońce miało weekendy, co by robiło?", optionA: "Spało za chmurami.", optionB: "Grało w tenisa z księżycem." },
    { question: "Co by było, gdyby każdy mógł czytać myśli zwierząt?", optionA: "Koty by kłamały, psy by się spowiadały.", optionB: "Papugi zaczęłyby polityczne debaty." },
    { question: "Czy gdyby muzyka była jadalna, który gatunek smakowałby najlepiej?", optionA: "Jazz — jak dobre wino.", optionB: "Techno — jak energetyk." },
    { question: "Jak wyglądałby świat, gdyby kurz był cenny?", optionA: "Każdy dom stałby się kopalnią.", optionB: "Odkurzacze miałyby sejfy." },
    { question: "Czy gdyby sny miały recenzje, które miałyby najniższe oceny?", optionA: "Egzaminy bez końca.", optionB: "Spadanie bez powodu." },
    { question: "Co by było, gdyby owoce miały własne emocje?", optionA: "Banany byłyby najbardziej zadowolone.", optionB: "Cytryny wiecznie zgorzkniałe." },
    { question: "Czy gdyby ludzie mieli wbudowany GPS, zgubiliby się mniej?", optionA: "Nie, bo i tak nie słuchaliby nawigacji.", optionB: "Tak, ale tylko do najbliższej lodówki." },
    { question: "Jak wyglądałby świat, gdyby ubrania miały osobowość?", optionA: "Dżinsy narzekałyby na pranie.", optionB: "Koszulki bałyby się żelazka." },
    { question: "Czy gdyby Internet był osobą, byłby ekstrawertykiem czy introwertykiem?", optionA: "Ekstrawertykiem — bo zna wszystkich.", optionB: "Introwertykiem — bo siedzi w piwnicy serwerowej." },
    { question: "Co by się stało, gdyby poniedziałki zniknęły?", optionA: "Wtorek przejąłby ich złą reputację.", optionB: "Świat byłby szczęśliwszy o 14%." },
    ],
    'Sport': [
    { question: "W którym roku Polska zajęła 3. miejsce na Mistrzostwach Świata w Piłce Nożnej?", optionA: "1974", optionB: "1986", correctOption: 'A' },
    { question: "Który skoczek narciarski jako pierwszy przekroczył granicę 250 metrów?", optionA: "Peter Prevc", optionB: "Johan Remen Evensen", correctOption: 'B' },
    { question: "Kto zdobył Złotą Piłkę w 2022 roku?", optionA: "Karim Benzema", optionB: "Lionel Messi", correctOption: 'A' },
    { question: "W jakim kraju odbyły się Zimowe Igrzyska Olimpijskie w 2022 roku?", optionA: "Japonia", optionB: "Chiny", correctOption: 'B' },
    { question: "Który zawodnik ma najwięcej tytułów mistrza NBA?", optionA: "Bill Russell", optionB: "Michael Jordan", correctOption: 'A' },
    { question: "Jak nazywa się stadion Realu Madryt?", optionA: "Camp Nou", optionB: "Santiago Bernabéu", correctOption: 'B' },
    { question: "Który kraj był gospodarzem Mundialu w 2018 roku?", optionA: "Rosja", optionB: "Katar", correctOption: 'A' },
    { question: "Kto jest rekordzistą świata w biegu na 100 metrów?", optionA: "Usain Bolt", optionB: "Tyson Gay", correctOption: 'A' },
    { question: "W jakim sporcie używa się rakietki i lotki?", optionA: "Tenis stołowy", optionB: "Badminton", correctOption: 'B' },
    { question: "Kto jest najbardziej utytułowanym kierowcą Formuły 1?", optionA: "Lewis Hamilton", optionB: "Michael Schumacher", correctOption: 'A' },
    { question: "Ile zawodników liczy drużyna siatkarska na boisku?", optionA: "6", optionB: "7", correctOption: 'A' },
    { question: "Który polski zawodnik zdobył mistrzostwo UFC?", optionA: "Jan Błachowicz", optionB: "Joanna Jędrzejczyk", correctOption: 'A' },
    { question: "W jakim kraju narodziło się judo?", optionA: "Korea Południowa", optionB: "Japonia", correctOption: 'B' },
    { question: "Kto wygrał Euro 2016 w piłce nożnej?", optionA: "Portugalia", optionB: "Francja", correctOption: 'A' },
    { question: "Ile setów trzeba wygrać, by zwyciężyć w meczu siatkówki?", optionA: "3", optionB: "2", correctOption: 'A' },
    { question: "Kto jest najlepszym strzelcem w historii Ligi Mistrzów UEFA?", optionA: "Cristiano Ronaldo", optionB: "Lionel Messi", correctOption: 'A' },
    { question: "W jakim mieście odbyły się Letnie Igrzyska Olimpijskie w 2016 roku?", optionA: "Rio de Janeiro", optionB: "Londyn", correctOption: 'A' },
    { question: "Kto zdobył najwięcej złotych medali olimpijskich w historii?", optionA: "Michael Phelps", optionB: "Usain Bolt", correctOption: 'A' },
    { question: "W jakim kraju znajduje się tor Monza?", optionA: "Francja", optionB: "Włochy", correctOption: 'B' },
    { question: "Który klub piłkarski ma przydomek 'Czerwone Diabły'?", optionA: "Liverpool", optionB: "Manchester United", correctOption: 'B' },
    { question: "W jakim sporcie rywalizują Novak Djokovic i Rafael Nadal?", optionA: "Tenis", optionB: "Squash", correctOption: 'A' },
    { question: "Kto zdobył mistrzostwo świata w piłce nożnej w 2014 roku?", optionA: "Niemcy", optionB: "Argentyna", correctOption: 'A' },
    { question: "Jaką dyscyplinę uprawiał Adam Małysz?", optionA: "Skoki narciarskie", optionB: "Narciarstwo alpejskie", correctOption: 'A' },
    { question: "Kto jest rekordzistą NBA pod względem punktów zdobytych w jednym meczu?", optionA: "Wilt Chamberlain", optionB: "Kobe Bryant", correctOption: 'A' },
    { question: "W którym roku odbyły się pierwsze nowożytne Igrzyska Olimpijskie?", optionA: "1896", optionB: "1900", correctOption: 'A' },
    { question: "Kto jest najbardziej utytułowanym polskim skoczkiem narciarskim?", optionA: "Kamil Stoch", optionB: "Adam Małysz", correctOption: 'A' },
    { question: "W jakim kraju powstał futbol amerykański?", optionA: "Stany Zjednoczone", optionB: "Kanada", correctOption: 'A' },
    { question: "Jak nazywa się trofeum przyznawane w NHL za mistrzostwo?", optionA: "Stanley Cup", optionB: "Super Bowl Trophy", correctOption: 'A' },
    { question: "Kto jest trenerem reprezentacji Polski w piłce nożnej w 2025 roku?", optionA: "Michał Probierz", optionB: "Fernando Santos", correctOption: 'A' },
    { question: "Który zawodnik zdobył najwięcej bramek w historii Mundiali?", optionA: "Miroslav Klose", optionB: "Pelé", correctOption: 'A' },
    { question: "W jakim kraju rozegrano pierwszy turniej Wimbledon?", optionA: "Wielka Brytania", optionB: "Stany Zjednoczone", correctOption: 'A' },
    { question: "Jak długo trwa mecz hokeja na lodzie?", optionA: "3 tercje po 20 minut", optionB: "2 połowy po 30 minut", correctOption: 'A' },
    { question: "Kto jest rekordzistą świata w maratonie (2023)?", optionA: "Eliud Kipchoge", optionB: "Kenenisa Bekele", correctOption: 'A' },
    { question: "W jakim sporcie rywalizuje Iga Świątek?", optionA: "Tenis", optionB: "Badminton", correctOption: 'A' },
    { question: "Który kraj zdobył najwięcej medali na Letnich IO w Tokio 2020?", optionA: "Stany Zjednoczone", optionB: "Chiny", correctOption: 'A' },
    { question: "Kto zdobył mistrzostwo świata w siatkówce mężczyzn w 2022 roku?", optionA: "Włochy", optionB: "Polska", correctOption: 'A' },
    { question: "W jakim roku Polska zdobyła złoto w siatkówce mężczyzn na MŚ po raz pierwszy?", optionA: "1974", optionB: "2014", correctOption: 'A' },
    { question: "Kto zdobył Złotą Piłkę w 2023 roku?", optionA: "Lionel Messi", optionB: "Erling Haaland", correctOption: 'A' },
    { question: "Jakie miasto jest znane z corocznego wyścigu Formuły 1 po ulicach?", optionA: "Monako", optionB: "Spa", correctOption: 'A' },
    { question: "Kto zdobył najwięcej tytułów w karierze w zawodowym tenisie mężczyzn?", optionA: "Novak Djokovic", optionB: "Roger Federer", correctOption: 'A' },
    { question: "Który kraj jest kolebką rugby?", optionA: "Anglia", optionB: "Australia", correctOption: 'A' },
    { question: "Jaką dyscyplinę sportu uprawia Robert Kubica?", optionA: "Kolarstwo", optionB: "Wyścigi samochodowe", correctOption: 'B' },
    { question: "Kto jest najbardziej utytułowaną polską lekkoatletką?", optionA: "Anita Włodarczyk", optionB: "Irena Szewińska", correctOption: 'A' },
    { question: "W jakim sporcie występuje pozycja libero?", optionA: "Siatkówka", optionB: "Koszykówka", correctOption: 'A' },
    { question: "Kto jest obecnym mistrzem świata w boksie wagi ciężkiej (2025)?", optionA: "Oleksandr Usyk", optionB: "Tyson Fury", correctOption: 'A' },
    { question: "Jak nazywa się największe sportowe wydarzenie czteroletnie?", optionA: "Igrzyska Olimpijskie", optionB: "Mistrzostwa Świata", correctOption: 'A' },
    { question: "Kto jest rekordzistą NBA w liczbie triple-double?", optionA: "Russell Westbrook", optionB: "LeBron James", correctOption: 'A' },
    { question: "Jak nazywa się słynny polski żużlowiec, wielokrotny mistrz świata?", optionA: "Tomasz Gollob", optionB: "Bartosz Zmarzlik", correctOption: 'B' },
    { question: "W jakim kraju odbywa się Tour de France?", optionA: "Francja", optionB: "Włochy", correctOption: 'A' },
    { question: "Który sportowiec znany jest z powiedzenia 'Just do it'?", optionA: "Michael Jordan", optionB: "Tiger Woods", correctOption: 'A' },
    { question: "Kto był kapitanem Polski na Euro 2020?", optionA: "Robert Lewandowski", optionB: "Grzegorz Krychowiak", correctOption: 'A' },
    { question: "Jaką dyscyplinę reprezentuje Mikaela Shiffrin?", optionA: "Narciarstwo alpejskie", optionB: "Snowboard", correctOption: 'A' },
    { question: "Który kraj zdobył mistrzostwo świata w koszykówce FIBA 2023?", optionA: "Niemcy", optionB: "USA", correctOption: 'A' },
    ],
    'Historia': [
    { question: "W którym roku upadło Cesarstwo Zachodniorzymskie?", optionA: "476", optionB: "1453", correctOption: 'A' },
    { question: "Kto był pierwszym cesarzem Rzymu?", optionA: "Juliusz Cezar", optionB: "Oktawian August", correctOption: 'B' },
    { question: "W jakim mieście znajdowały się słynne wiszące ogrody Semiramidy?", optionA: "Babilon", optionB: "Memfis", correctOption: 'A' },
    { question: "Który faraon zbudował Wielką Piramidę w Gizie?", optionA: "Cheops", optionB: "Ramses II", correctOption: 'A' },
    { question: "W którym roku odbyła się bitwa pod Hastings?", optionA: "1066", optionB: "1215", correctOption: 'A' },
    { question: "Kto był pierwszym królem Polski koronowanym w Gnieźnie?", optionA: "Bolesław Chrobry", optionB: "Mieszko I", correctOption: 'A' },
    { question: "Jak nazywano elitarną formację rycerską Zakonu Krzyżackiego?", optionA: "Bracia mieczowi", optionB: "Bracia zakonni", correctOption: 'A' },
    { question: "W którym roku odkryto Amerykę?", optionA: "1492", optionB: "1501", correctOption: 'A' },
    { question: "Kto był królową Anglii w czasach Szekspira?", optionA: "Elżbieta I", optionB: "Wiktoria", correctOption: 'A' },
    { question: "Które państwo stworzyło Wielki Mur?", optionA: "Chiny", optionB: "Japonia", correctOption: 'A' },
    { question: "Jak nazywał się pierwszy cesarz Chin?", optionA: "Qin Shi Huang", optionB: "Kublaj-chan", correctOption: 'A' },
    { question: "W którym wieku miała miejsce reformacja?", optionA: "XVI", optionB: "XV", correctOption: 'A' },
    { question: "Kto rozpoczął reformację?", optionA: "Marcin Luter", optionB: "Jan Kalwin", correctOption: 'A' },
    { question: "W którym roku miała miejsce bitwa pod Wiedniem?", optionA: "1683", optionB: "1655", correctOption: 'A' },
    { question: "Kto dowodził wojskami polskimi pod Wiedniem?", optionA: "Jan III Sobieski", optionB: "Stefan Batory", correctOption: 'A' },
    { question: "Jak nazywał się ostatni król Polski?", optionA: "Stanisław August Poniatowski", optionB: "August III Sas", correctOption: 'A' },
    { question: "W którym roku uchwalono Konstytucję 3 maja?", optionA: "1791", optionB: "1789", correctOption: 'A' },
    { question: "Kto był głównym autorem Konstytucji 3 maja?", optionA: "Hugo Kołłątaj", optionB: "Stanisław Małachowski", correctOption: 'B' },
    { question: "Jakie wydarzenie rozpoczęło I wojnę światową?", optionA: "Zamach w Sarajewie", optionB: "Atak Niemiec na Francję", correctOption: 'A' },
    { question: "W którym roku wybuchła I wojna światowa?", optionA: "1914", optionB: "1918", correctOption: 'A' },
    { question: "Kiedy zakończyła się I wojna światowa?", optionA: "1918", optionB: "1919", correctOption: 'A' },
    { question: "W którym roku Polska odzyskała niepodległość?", optionA: "1918", optionB: "1920", correctOption: 'A' },
    { question: "Kto był pierwszym naczelnikiem państwa po odzyskaniu niepodległości?", optionA: "Józef Piłsudski", optionB: "Ignacy Paderewski", correctOption: 'A' },
    { question: "W którym roku wybuchła II wojna światowa?", optionA: "1939", optionB: "1941", correctOption: 'A' },
    { question: "Kto był premierem Wielkiej Brytanii w czasie II wojny światowej?", optionA: "Neville Chamberlain", optionB: "Winston Churchill", correctOption: 'B' },
    { question: "Jak nazywał się niemiecki plan ataku na Polskę?", optionA: "Fall Weiss", optionB: "Barbarossa", correctOption: 'A' },
    { question: "W którym roku miała miejsce bitwa o Stalingrad?", optionA: "1942", optionB: "1944", correctOption: 'A' },
    { question: "Jak nazywała się operacja alianckiego desantu w Normandii?", optionA: "Overlord", optionB: "Torch", correctOption: 'A' },
    { question: "Kiedy zakończyła się II wojna światowa w Europie?", optionA: "8 maja 1945", optionB: "1 września 1945", correctOption: 'A' },
    { question: "Jakie miasto było stolicą PRL do 1989 roku?", optionA: "Warszawa", optionB: "Kraków", correctOption: 'A' },
    { question: "Kiedy upadł mur berliński?", optionA: "1989", optionB: "1991", correctOption: 'A' },
    { question: "W którym roku Polska wstąpiła do NATO?", optionA: "1999", optionB: "2004", correctOption: 'A' },
    { question: "W którym roku Polska przystąpiła do Unii Europejskiej?", optionA: "2004", optionB: "2007", correctOption: 'A' },
    { question: "Kto był pierwszym prezydentem III RP?", optionA: "Lech Wałęsa", optionB: "Wojciech Jaruzelski", correctOption: 'B' },
    { question: "Kiedy miała miejsce rewolucja francuska?", optionA: "1789", optionB: "1815", correctOption: 'A' },
    { question: "Jak nazywał się przywódca Związku Radzieckiego po II wojnie światowej?", optionA: "Stalin", optionB: "Chruszczow", correctOption: 'A' },
    { question: "W którym roku wybuchła wojna secesyjna w USA?", optionA: "1861", optionB: "1776", correctOption: 'A' },
    { question: "Kiedy wybuchła rewolucja październikowa w Rosji?", optionA: "1917", optionB: "1920", correctOption: 'A' },
    { question: "Jak nazywał się przywódca Francji w czasie II wojny światowej?", optionA: "Charles de Gaulle", optionB: "Philippe Pétain", correctOption: 'A' },
    { question: "W którym roku odkryto Amerykę Południową?", optionA: "1498", optionB: "1492", correctOption: 'A' },
    { question: "Jak nazywała się wojna między Atenami a Spartą?", optionA: "Wojna peloponeska", optionB: "Wojna trojańska", correctOption: 'A' },
    { question: "Kto był twórcą Imperium Mongolskiego?", optionA: "Czyngis-chan", optionB: "Kubilaj-chan", correctOption: 'A' },
    { question: "Kiedy wybuchła wojna trzydziestoletnia?", optionA: "1618", optionB: "1648", correctOption: 'A' },
    { question: "Jakie państwo stworzyło potężne imperium kolonialne w XIX wieku?", optionA: "Wielka Brytania", optionB: "Hiszpania", correctOption: 'A' },
    { question: "Kto był papieżem w czasie II wojny światowej?", optionA: "Pius XII", optionB: "Jan XXIII", correctOption: 'A' },
    { question: "W którym roku rozpoczęła się wojna w Wietnamie?", optionA: "1955", optionB: "1965", correctOption: 'A' },
    { question: "Jak nazywała się organizacja wojskowa stworzona przez ZSRR w odpowiedzi na NATO?", optionA: "Układ Warszawski", optionB: "Rada Wzajemnej Pomocy Gospodarczej", correctOption: 'A' },
    { question: "W którym roku podpisano Traktat Rzymski, tworzący EWG?", optionA: "1957", optionB: "1963", correctOption: 'A' },
    { question: "Kiedy odbyła się bitwa pod Termopilami?", optionA: "480 p.n.e.", optionB: "431 p.n.e.", correctOption: 'A' },
    { question: "Kto był wodzem Greków pod Termopilami?", optionA: "Leonidas", optionB: "Aleksander Wielki", correctOption: 'A' },
    { question: "Jak nazywał się program pomocy gospodarczej USA dla Europy po II wojnie światowej?", optionA: "Plan Marshalla", optionB: "Plan Trumana", correctOption: 'A' },
    { question: "Kiedy rozpadł się Związek Radziecki?", optionA: "1991", optionB: "1989", correctOption: 'A' },
    ],
    'Nauka': [
    { question: "Jaki pierwiastek chemiczny ma symbol 'O'?", optionA: "Tlen", optionB: "Azot", correctOption: 'A' },
    { question: "Która planeta Układu Słonecznego jest największa?", optionA: "Jowisz", optionB: "Saturn", correctOption: 'A' },
    { question: "Ile wynosi prędkość światła w próżni?", optionA: "300 000 km/s", optionB: "150 000 km/s", correctOption: 'A' },
    { question: "Jakie cząstki tworzą atom?", optionA: "Protony, neutrony i elektrony", optionB: "Fotony i kwarki", correctOption: 'A' },
    { question: "Kto sformułował trzy zasady dynamiki?", optionA: "Isaac Newton", optionB: "Albert Einstein", correctOption: 'A' },
    { question: "Jakie jest chemiczne oznaczenie wody?", optionA: "H2O", optionB: "CO2", correctOption: 'A' },
    { question: "Który pierwiastek jest niezbędny do oddychania?", optionA: "Tlen", optionB: "Wodór", correctOption: 'A' },
    { question: "Kto opracował teorię względności?", optionA: "Albert Einstein", optionB: "Nikola Tesla", correctOption: 'A' },
    { question: "Jak nazywa się najtwardszy naturalny minerał?", optionA: "Diament", optionB: "Kwarc", correctOption: 'A' },
    { question: "Która planeta jest najbliżej Słońca?", optionA: "Merkury", optionB: "Wenus", correctOption: 'A' },
    { question: "Co mierzy termometr?", optionA: "Temperaturę", optionB: "Ciśnienie", correctOption: 'A' },
    { question: "Który gaz stanowi największą część atmosfery Ziemi?", optionA: "Azot", optionB: "Tlen", correctOption: 'A' },
    { question: "Jak nazywa się urządzenie do mierzenia ciśnienia atmosferycznego?", optionA: "Barometr", optionB: "Termometr", correctOption: 'A' },
    { question: "Jakie zwierzęta są stałocieplne?", optionA: "Ssaki", optionB: "Gady", correctOption: 'A' },
    { question: "Który pierwiastek ma symbol 'Fe'?", optionA: "Żelazo", optionB: "Fluor", correctOption: 'A' },
    { question: "Jakie zjawisko powoduje powstawanie tęczy?", optionA: "Załamanie światła", optionB: "Dyfrakcja dźwięku", correctOption: 'A' },
    { question: "Jakie jest największe zwierzę na Ziemi?", optionA: "Płetwal błękitny", optionB: "Słoń afrykański", correctOption: 'A' },
    { question: "Jak nazywa się proces, w którym rośliny wytwarzają tlen?", optionA: "Fotosynteza", optionB: "Oddychanie", correctOption: 'A' },
    { question: "Co bada astronomia?", optionA: "Ciała niebieskie", optionB: "Skład chemiczny Ziemi", correctOption: 'A' },
    { question: "Jak nazywa się jednostka mocy?", optionA: "Wat", optionB: "Dżul", correctOption: 'A' },
    { question: "Jakie zwierzęta należą do owadów?", optionA: "Pszczoły", optionB: "Żaby", correctOption: 'A' },
    { question: "Kto odkrył krążenie krwi?", optionA: "William Harvey", optionB: "Louis Pasteur", correctOption: 'A' },
    { question: "Jak nazywa się największa kość w ludzkim ciele?", optionA: "Kość udowa", optionB: "Kręgosłup", correctOption: 'A' },
    { question: "Który pierwiastek jest głównym składnikiem słońca?", optionA: "Wodór", optionB: "Hel", correctOption: 'A' },
    { question: "Jak nazywa się proces zamiany cieczy w parę?", optionA: "Parowanie", optionB: "Skraplanie", correctOption: 'A' },
    { question: "Jakie zwierzę jest symbolem DNA w badaniach genetycznych?", optionA: "Muszka owocowa", optionB: "Mysz", correctOption: 'A' },
    { question: "Co mierzy sejsmograf?", optionA: "Trzęsienia ziemi", optionB: "Ciśnienie", correctOption: 'A' },
    { question: "Jak nazywa się najbliższa Ziemi gwiazda?", optionA: "Słońce", optionB: "Proxima Centauri", correctOption: 'A' },
    { question: "Jakie zwierzę potrafi zmieniać kolor w celu kamuflażu?", optionA: "Kameleon", optionB: "Gekon", correctOption: 'A' },
    { question: "Jak nazywa się nauka o roślinach?", optionA: "Botanika", optionB: "Zoologia", correctOption: 'A' },
    { question: "Jakie zjawisko sprawia, że samoloty mogą latać?", optionA: "Siła nośna", optionB: "Grawitacja", correctOption: 'A' },
    { question: "Jakie zwierzę jest największym drapieżnikiem lądowym?", optionA: "Niedźwiedź polarny", optionB: "Tygrys", correctOption: 'A' },
    { question: "Jak nazywa się najbliższa Ziemi planeta?", optionA: "Wenus", optionB: "Mars", correctOption: 'A' },
    { question: "Kto wynalazł żarówkę?", optionA: "Thomas Edison", optionB: "Nikola Tesla", correctOption: 'A' },
    { question: "Jakie ciało niebieskie ma pierścienie?", optionA: "Saturn", optionB: "Jowisz", correctOption: 'A' },
    { question: "Jakie zjawisko odpowiada za echo?", optionA: "Odbicie dźwięku", optionB: "Załamanie światła", correctOption: 'A' },
    { question: "Który gaz powoduje efekt cieplarniany?", optionA: "Dwutlenek węgla", optionB: "Tlen", correctOption: 'A' },
    { question: "Jak nazywa się nauka o minerałach?", optionA: "Mineralogia", optionB: "Geologia", correctOption: 'A' },
    { question: "Jakie zwierzęta są jajorodne?", optionA: "Ptaki", optionB: "Ssaki", correctOption: 'A' },
    { question: "Jakie urządzenie służy do obserwacji gwiazd?", optionA: "Teleskop", optionB: "Mikroskop", correctOption: 'A' },
    { question: "Kto odkrył penicylinę?", optionA: "Alexander Fleming", optionB: "Robert Koch", correctOption: 'A' },
    { question: "Który pierwiastek ma symbol 'Na'?", optionA: "Sód", optionB: "Azot", correctOption: 'A' },
    { question: "Jakie zjawisko opisuje prawo Archimedesa?", optionA: "Wypór cieczy", optionB: "Grawitację", correctOption: 'A' },
    { question: "Jakie jest przyspieszenie ziemskie?", optionA: "9.81 m/s²", optionB: "3.14 m/s²", correctOption: 'A' },
    { question: "Kto opracował układ okresowy pierwiastków?", optionA: "Dmitrij Mendelejew", optionB: "Marie Curie", correctOption: 'A' },
    { question: "Jak nazywa się największy ocean na Ziemi?", optionA: "Ocean Spokojny", optionB: "Ocean Atlantycki", correctOption: 'A' },
    { question: "Który pierwiastek jest głównym składnikiem diamentów?", optionA: "Węgiel", optionB: "Krzem", correctOption: 'A' },
    { question: "Jak nazywa się najcieplejsza planeta Układu Słonecznego?", optionA: "Wenus", optionB: "Merkury", correctOption: 'A' },
    { question: "Jakie zwierzęta należą do ssaków morskich?", optionA: "Delfiny", optionB: "Rekiny", correctOption: 'A' },
    { question: "Kto był pierwszym człowiekiem w kosmosie?", optionA: "Jurij Gagarin", optionB: "Neil Armstrong", correctOption: 'A' },
    { question: "Jak nazywa się najzimniejszy kontynent na Ziemi?", optionA: "Antarktyda", optionB: "Arktyka", correctOption: 'A' },
    { question: "Jakie ciało niebieskie krąży wokół Ziemi?", optionA: "Księżyc", optionB: "Mars", correctOption: 'A' },
    { question: "Jak nazywa się nauka o pogodzie?", optionA: "Meteorologia", optionB: "Klimatologia", correctOption: 'A' },
    ],
    'Technologia': [
    { question: "Co oznacza skrót 'URL'?", optionA: "Uniform Resource Locator", optionB: "Universal Remote Link", correctOption: 'A' },
    { question: "Która firma stworzyła system Windows?", optionA: "Microsoft", optionB: "Apple", correctOption: 'A' },
    { question: "Kto jest twórcą firmy Microsoft?", optionA: "Steve Jobs", optionB: "Bill Gates", correctOption: 'B' },
    { question: "Co oznacza skrót 'CPU'?", optionA: "Central Processing Unit", optionB: "Computer Power Utility", correctOption: 'A' },
    { question: "Który system operacyjny jest oparty na jądrze Linux?", optionA: "Ubuntu", optionB: "Windows", correctOption: 'A' },
    { question: "Co oznacza skrót 'AI'?", optionA: "Artificial Intelligence", optionB: "Advanced Internet", correctOption: 'A' },
    { question: "Która firma stworzyła iPhone’a?", optionA: "Apple", optionB: "Samsung", correctOption: 'A' },
    { question: "Jak nazywa się główny język stron internetowych?", optionA: "HTML", optionB: "Python", correctOption: 'A' },
    { question: "Co oznacza skrót 'GPU'?", optionA: "Graphics Processing Unit", optionB: "General Purpose Utility", correctOption: 'A' },
    { question: "Jak nazywa się najpopularniejsza wyszukiwarka internetowa?", optionA: "Google", optionB: "Bing", correctOption: 'A' },
    { question: "Co oznacza skrót 'RAM'?", optionA: "Random Access Memory", optionB: "Read And Manage", correctOption: 'A' },
    { question: "Kto jest twórcą języka programowania Python?", optionA: "Guido van Rossum", optionB: "Dennis Ritchie", correctOption: 'A' },
    { question: "Która firma stworzyła system Android?", optionA: "Google", optionB: "Apple", correctOption: 'A' },
    { question: "Co oznacza skrót 'SSD'?", optionA: "Solid State Drive", optionB: "System Storage Device", correctOption: 'A' },
    { question: "Jak nazywa się największa platforma wideo na świecie?", optionA: "YouTube", optionB: "Vimeo", correctOption: 'A' },
    { question: "Która przeglądarka internetowa należy do firmy Mozilla?", optionA: "Firefox", optionB: "Edge", correctOption: 'A' },
    { question: "Jakie rozszerzenie mają pliki wykonywalne w systemie Windows?", optionA: ".exe", optionB: ".app", correctOption: 'A' },
    { question: "Kto stworzył system operacyjny Linux?", optionA: "Linus Torvalds", optionB: "Richard Stallman", correctOption: 'A' },
    { question: "Jak nazywa się najpopularniejszy język do tworzenia stron WWW?", optionA: "JavaScript", optionB: "C++", correctOption: 'A' },
    { question: "Co oznacza skrót 'HTTP'?", optionA: "HyperText Transfer Protocol", optionB: "High Tech Transport Program", correctOption: 'A' },
    { question: "Która firma stworzyła konsolę PlayStation?", optionA: "Sony", optionB: "Nintendo", correctOption: 'A' },
    { question: "Co oznacza skrót 'IP' w sieciach komputerowych?", optionA: "Internet Protocol", optionB: "Internal Port", correctOption: 'A' },
    { question: "Jak nazywa się najpopularniejszy system operacyjny dla komputerów osobistych?", optionA: "Windows", optionB: "macOS", correctOption: 'A' },
    { question: "Która firma stworzyła asystenta głosowego Siri?", optionA: "Apple", optionB: "Google", correctOption: 'A' },
    { question: "Co oznacza skrót 'USB'?", optionA: "Universal Serial Bus", optionB: "Unified System Bridge", correctOption: 'A' },
    { question: "Który język programowania powstał wcześniej?", optionA: "C", optionB: "Python", correctOption: 'A' },
    { question: "Jak nazywa się technologia łączności bezprzewodowej krótkiego zasięgu?", optionA: "Bluetooth", optionB: "Ethernet", correctOption: 'A' },
    { question: "Która firma stworzyła przeglądarkę Chrome?", optionA: "Google", optionB: "Microsoft", correctOption: 'A' },
    { question: "Jak nazywa się największy sklep z aplikacjami dla Androida?", optionA: "Google Play", optionB: "App Store", correctOption: 'A' },
    { question: "Co oznacza skrót 'VPN'?", optionA: "Virtual Private Network", optionB: "Verified Personal Node", correctOption: 'A' },
    { question: "Który system plików jest domyślny dla Windows?", optionA: "NTFS", optionB: "EXT4", correctOption: 'A' },
    { question: "Jak nazywa się oprogramowanie do wirtualizacji firmy Oracle?", optionA: "VirtualBox", optionB: "VMware", correctOption: 'A' },
    { question: "Co oznacza skrót 'IoT'?", optionA: "Internet of Things", optionB: "Input of Technology", correctOption: 'A' },
    { question: "Która firma stworzyła pierwszego komercyjnego laptopa?", optionA: "IBM", optionB: "Apple", correctOption: 'A' },
    { question: "Jak nazywa się język używany do tworzenia aplikacji na iOS?", optionA: "Swift", optionB: "Kotlin", correctOption: 'A' },
    { question: "Jakie urządzenie służy do wprowadzania tekstu?", optionA: "Klawiatura", optionB: "Monitor", correctOption: 'A' },
    { question: "Jak nazywa się najpopularniejszy framework JavaScript do budowy interfejsów?", optionA: "React", optionB: "Laravel", correctOption: 'A' },
    { question: "Który port jest używany do protokołu HTTPS?", optionA: "443", optionB: "80", correctOption: 'A' },
    { question: "Co oznacza skrót 'DNS'?", optionA: "Domain Name System", optionB: "Data Network Service", correctOption: 'A' },
    { question: "Jakie urządzenie odpowiada za łączenie sieci komputerowych?", optionA: "Router", optionB: "Switch", correctOption: 'A' },
    { question: "Która firma stworzyła system macOS?", optionA: "Apple", optionB: "Microsoft", correctOption: 'A' },
    { question: "Co oznacza skrót 'BIOS'?", optionA: "Basic Input Output System", optionB: "Binary Information Operation Setup", correctOption: 'A' },
    { question: "Kto stworzył język C++?", optionA: "Bjarne Stroustrup", optionB: "Dennis Ritchie", correctOption: 'A' },
    { question: "Która firma produkuje procesory Ryzen?", optionA: "AMD", optionB: "Intel", correctOption: 'A' },
    { question: "Jak nazywa się system kontroli wersji stworzony przez Linusa Torvaldsa?", optionA: "Git", optionB: "SVN", correctOption: 'A' },
    { question: "Co oznacza skrót 'URL'?", optionA: "Uniform Resource Locator", optionB: "Universal Router Link", correctOption: 'A' },
    { question: "Który system operacyjny jest używany na większości serwerów internetowych?", optionA: "Linux", optionB: "Windows", correctOption: 'A' },
    { question: "Jak nazywa się technologia łączności mobilnej piątej generacji?", optionA: "5G", optionB: "LTE", correctOption: 'A' },
    { question: "Jakie urządzenie przetwarza dane w komputerze?", optionA: "Procesor", optionB: "Karta graficzna", correctOption: 'A' },
    { question: "Który format obrazu wspiera przezroczystość?", optionA: "PNG", optionB: "JPG", correctOption: 'A' },
    { question: "Co oznacza skrót 'HTML'?", optionA: "HyperText Markup Language", optionB: "High Transfer Machine Logic", correctOption: 'A' },
    { question: "Jak nazywa się najpopularniejsza platforma do hostingu kodu źródłowego?", optionA: "GitHub", optionB: "GitLab", correctOption: 'A' },
    ],   
    'Popkultura': [
    { question: "Kto zagrał Tony’ego Starka w filmach Marvela?", optionA: "Robert Downey Jr.", optionB: "Chris Evans", correctOption: 'A' },
    { question: "Jak nazywa się fikcyjne miasto z serii Batman?", optionA: "Gotham", optionB: "Metropolis", correctOption: 'A' },
    { question: "Kto jest twórcą serii 'Gwiezdne wojny'?", optionA: "George Lucas", optionB: "Steven Spielberg", correctOption: 'A' },
    { question: "W której grze pojawia się postać Mario?", optionA: "Super Mario Bros.", optionB: "Sonic the Hedgehog", correctOption: 'A' },
    { question: "Jak nazywa się główny bohater serialu 'Breaking Bad'?", optionA: "Walter White", optionB: "Jesse Pinkman", correctOption: 'A' },
    { question: "Która piosenkarka nagrała hit 'Bad Romance'?", optionA: "Lady Gaga", optionB: "Rihanna", correctOption: 'A' },
    { question: "Jak nazywa się uniwersum filmowe Marvela?", optionA: "MCU", optionB: "DCEU", correctOption: 'A' },
    { question: "Kto śpiewa piosenkę 'Shape of You'?", optionA: "Ed Sheeran", optionB: "Shawn Mendes", correctOption: 'A' },
    { question: "Jak nazywa się najpopularniejsza platforma streamingowa z serialami?", optionA: "Netflix", optionB: "Disney+", correctOption: 'A' },
    { question: "Który zespół stworzył album 'The Dark Side of the Moon'?", optionA: "Pink Floyd", optionB: "The Beatles", correctOption: 'A' },
    { question: "Jak nazywa się świat z 'Władcy Pierścieni'?", optionA: "Śródziemie", optionB: "Narnia", correctOption: 'A' },
    { question: "Kto gra główną rolę w filmie 'Matrix'?", optionA: "Keanu Reeves", optionB: "Tom Cruise", correctOption: 'A' },
    { question: "Jak nazywa się fikcyjna szkoła z serii o Harrym Potterze?", optionA: "Hogwart", optionB: "Beauxbatons", correctOption: 'A' },
    { question: "Kto śpiewał 'Thriller'?", optionA: "Michael Jackson", optionB: "Prince", correctOption: 'A' },
    { question: "Jak nazywa się gra, w której gracze budują i przetrwają w otwartym świecie z bloków?", optionA: "Minecraft", optionB: "Fortnite", correctOption: 'A' },
    { question: "Który film zdobył Oscara w 2020 roku?", optionA: "Parasite", optionB: "Joker", correctOption: 'A' },
    { question: "Jak nazywa się główna postać z serii 'Wiedźmin'?", optionA: "Geralt z Rivii", optionB: "Jaskier", correctOption: 'A' },
    { question: "Kto gra Spider-Mana w filmach Marvela z lat 2016–2023?", optionA: "Tom Holland", optionB: "Andrew Garfield", correctOption: 'A' },
    { question: "Która gra wideo jest battle royale?", optionA: "Fortnite", optionB: "The Sims", correctOption: 'A' },
    { question: "Kto jest autorem książki 'Gra o tron'?", optionA: "George R. R. Martin", optionB: "J.R.R. Tolkien", correctOption: 'A' },
    { question: "Jak nazywa się fikcyjna waluta w uniwersum 'Harry’ego Pottera'?", optionA: "Galeon", optionB: "Knut", correctOption: 'A' },
    { question: "Jak nazywa się najpopularniejsza seria anime o poszukiwaniu Pokémonów?", optionA: "Pokémon", optionB: "Digimon", correctOption: 'A' },
    { question: "Który raper stworzył album 'To Pimp a Butterfly'?", optionA: "Kendrick Lamar", optionB: "Drake", correctOption: 'A' },
    { question: "Jak nazywa się platforma, na której ludzie publikują krótkie filmy wideo?", optionA: "TikTok", optionB: "Twitch", correctOption: 'A' },
    { question: "Kto jest reżyserem filmu 'Incepcja'?", optionA: "Christopher Nolan", optionB: "Quentin Tarantino", correctOption: 'A' },
    { question: "Jak nazywa się siostra Elsy z filmu 'Kraina lodu'?", optionA: "Anna", optionB: "Olaf", correctOption: 'A' },
    { question: "Kto wcielił się w postać Jacka Sparrowa?", optionA: "Johnny Depp", optionB: "Orlando Bloom", correctOption: 'A' },
    { question: "Jak nazywa się serial o zombie, którego głównym bohaterem jest Rick Grimes?", optionA: "The Walking Dead", optionB: "Z Nation", correctOption: 'A' },
    { question: "Jak nazywa się postać z gry 'The Legend of Zelda'?", optionA: "Link", optionB: "Zelda", correctOption: 'A' },
    { question: "Kto napisał sagę 'Zmierzch'?", optionA: "Stephenie Meyer", optionB: "Suzanne Collins", correctOption: 'A' },
    { question: "Jak nazywa się serial o grupie złodziei w czerwonych kombinezonach?", optionA: "Dom z papieru", optionB: "Breaking Bad", correctOption: 'A' },
    { question: "Jak nazywa się największa gala rozdania nagród filmowych?", optionA: "Oscary", optionB: "Złote Globy", correctOption: 'A' },
    { question: "Kto grał główną rolę w filmie 'Titanic'?", optionA: "Leonardo DiCaprio", optionB: "Brad Pitt", correctOption: 'A' },
    { question: "Jak nazywa się popularna gra, w której gracze walczą na mapie Erangel?", optionA: "PUBG", optionB: "Apex Legends", correctOption: 'A' },
    { question: "Jak nazywa się fikcyjna planeta z filmu 'Avatar'?", optionA: "Pandora", optionB: "Krypton", correctOption: 'A' },
    { question: "Kto śpiewa piosenkę 'Blinding Lights'?", optionA: "The Weeknd", optionB: "Post Malone", correctOption: 'A' },
    { question: "Jak nazywa się główny bohater z serii 'Assassin’s Creed II'?", optionA: "Ezio Auditore", optionB: "Altaïr Ibn-La'Ahad", correctOption: 'A' },
    { question: "Jak nazywa się najpopularniejsza platforma do streamowania gier?", optionA: "Twitch", optionB: "Kick", correctOption: 'A' },
    { question: "Kto jest wokalistką zespołu No Doubt?", optionA: "Gwen Stefani", optionB: "Avril Lavigne", correctOption: 'A' },
    { question: "Jak nazywa się film o klaunie z czerwonym balonem?", optionA: "To", optionB: "Annabelle", correctOption: 'A' },
    { question: "Jak nazywa się gra wideo, w której pojawia się postać Master Chief?", optionA: "Halo", optionB: "Destiny", correctOption: 'A' },
    { question: "Który film jest częścią serii o agencie 007?", optionA: "Spectre", optionB: "Mission: Impossible", correctOption: 'A' },
    { question: "Kto jest autorem komiksu o Spider-Manie?", optionA: "Stan Lee", optionB: "Frank Miller", correctOption: 'A' },
    { question: "Jak nazywa się serial opowiadający o polityce w Białym Domu z Kevinem Spacey’em?", optionA: "House of Cards", optionB: "Suits", correctOption: 'A' },
    { question: "Jak nazywa się zespół, którego liderem był Freddie Mercury?", optionA: "Queen", optionB: "The Rolling Stones", correctOption: 'A' },
    { question: "Jak nazywa się fikcyjny kraj z filmu 'Czarna Pantera'?", optionA: "Wakanda", optionB: "Asgard", correctOption: 'A' },
    { question: "Kto śpiewa piosenkę 'Hello'?", optionA: "Adele", optionB: "Beyoncé", correctOption: 'A' },
    { question: "Jak nazywa się główny antagonista z serii 'Avengers'?", optionA: "Thanos", optionB: "Loki", correctOption: 'A' },
    { question: "Kto jest twórcą uniwersum DC Comics?", optionA: "Malcolm Wheeler-Nicholson", optionB: "Stan Lee", correctOption: 'A' },
    { question: "Jak nazywa się słynny polski raper znany z albumu 'Art Brut'?", optionA: "PRO8L3M", optionB: "O.S.T.R.", correctOption: 'A' },
    { question: "Jak nazywa się gra, w której występują Simowie?", optionA: "The Sims", optionB: "Animal Crossing", correctOption: 'A' },
    { question: "Jak nazywa się aktorka, która gra Czarownicę z Zakonu Feniksa?", optionA: "Helena Bonham Carter", optionB: "Emma Watson", correctOption: 'A' },
    { question: "Jak nazywa się film o superbohaterze z metalowym szkieletem?", optionA: "Wolverine", optionB: "Deadpool", correctOption: 'A' },
    ],
    'Rynki finansowe/Kryptowaluty': [
    { question: "Jak nazywa się pierwsza kryptowaluta?", optionA: "Ethereum", optionB: "Bitcoin", correctOption: 'B' },
    { question: "Co oznacza skrót GPW?", optionA: "Giełda Papierów Wartościowych", optionB: "Narodowy Bank Polski", correctOption: 'A' },
    { question: "Jakie akcje należą do indeksu WIG20?", optionA: "20 największych spółek na GPW", optionB: "20 największych spółek w USA", correctOption: 'A' },
    { question: "Co oznacza skrót ETF?", optionA: "Exchange Traded Fund", optionB: "Electronic Transfer Fund", correctOption: 'A' },
    { question: "Co to jest giełda kryptowalut?", optionA: "Platforma do handlu kryptowalutami", optionB: "Bank centralny", correctOption: 'A' },
    { question: "Jak nazywa się najpopularniejsza giełda kryptowalut na świecie?", optionA: "Binance", optionB: "Coinbase", correctOption: 'A' },
    { question: "Co oznacza skrót IPO?", optionA: "Initial Public Offering", optionB: "Internal Private Option", correctOption: 'A' },
    { question: "Jakie są podstawowe rodzaje instrumentów finansowych?", optionA: "Akcje i obligacje", optionB: "Złoto i ropa", correctOption: 'A' },
    { question: "Co to jest stopa procentowa?", optionA: "Koszt pożyczki lub depozytu", optionB: "Wartość akcji", correctOption: 'A' },
    { question: "Co to jest portfel kryptowalutowy?", optionA: "Oprogramowanie do przechowywania kryptowalut", optionB: "Bank do przechowywania gotówki", correctOption: 'A' },
    { question: "Jak nazywa się największa kryptowaluta po kapitalizacji rynkowej?", optionA: "Bitcoin", optionB: "Ethereum", correctOption: 'A' },
    { question: "Co oznacza skrót ROI?", optionA: "Return on Investment", optionB: "Rate of Interest", correctOption: 'A' },
    { question: "Jakie są popularne giełdy papierów wartościowych w USA?", optionA: "NYSE i NASDAQ", optionB: "LSE i GPW", correctOption: 'A' },
    { question: "Co to jest dywidenda?", optionA: "Część zysku wypłacana akcjonariuszom", optionB: "Opłata giełdowa", correctOption: 'A' },
    { question: "Jak nazywa się stabilna kryptowaluta powiązana z dolarem?", optionA: "USDT", optionB: "Dogecoin", correctOption: 'A' },
    { question: "Co oznacza skrót CFD?", optionA: "Contract for Difference", optionB: "Crypto Fund Deposit", correctOption: 'A' },
    { question: "Co to jest kapitalizacja rynkowa?", optionA: "Wartość wszystkich wyemitowanych akcji spółki", optionB: "Kwota depozytu w banku", correctOption: 'A' },
    { question: "Jak nazywa się największa giełda w Polsce?", optionA: "GPW", optionB: "NASDAQ", correctOption: 'A' },
    { question: "Co to jest analiza techniczna?", optionA: "Analiza wykresów i trendów cenowych", optionB: "Analiza raportów finansowych spółki", correctOption: 'A' },
    { question: "Jakie są przykłady stablecoinów?", optionA: "USDT i USDC", optionB: "BTC i ETH", correctOption: 'A' },
    { question: "Co oznacza skrót SEC w USA?", optionA: "Securities and Exchange Commission", optionB: "Stock Exchange Council", correctOption: 'A' },
    { question: "Jakie są podstawowe typy obligacji?", optionA: "Skarbowe i korporacyjne", optionB: "Akcyjne i fundusze", correctOption: 'A' },
    { question: "Co oznacza skrót P/E w finansach?", optionA: "Price to Earnings ratio", optionB: "Profit Equity ratio", correctOption: 'A' },
    { question: "Jakie są najpopularniejsze kryptowaluty poza Bitcoinem?", optionA: "Ethereum, Binance Coin, Cardano", optionB: "Ripple, USD Coin, Dogecoin", correctOption: 'A' },
    { question: "Co to jest short selling?", optionA: "Sprzedaż aktywów w nadziei na spadek ceny", optionB: "Kupowanie aktywów w nadziei na wzrost", correctOption: 'A' },
    { question: "Co oznacza skrót FOMO w inwestycjach?", optionA: "Fear of Missing Out", optionB: "Fund of Money Options", correctOption: 'A' },
    { question: "Co to jest dywersyfikacja portfela?", optionA: "Rozłożenie inwestycji na różne aktywa", optionB: "Skupienie inwestycji na jednej akcji", correctOption: 'A' },
    { question: "Co oznacza skrót KYC w kryptowalutach?", optionA: "Know Your Customer", optionB: "Keep Your Coins", correctOption: 'A' },
    { question: "Jak nazywa się token Ethereum służący do smart kontraktów?", optionA: "ETH", optionB: "BTC", correctOption: 'A' },
    { question: "Co to jest blockchain?", optionA: "Rozproszona baza danych transakcji", optionB: "Bank centralny", correctOption: 'A' },
    { question: "Jak nazywa się giełda kryptowalut w USA?", optionA: "Coinbase", optionB: "Bitfinex", correctOption: 'A' },
    { question: "Co oznacza skrót NFT?", optionA: "Non-Fungible Token", optionB: "New Financial Trade", correctOption: 'A' },
    { question: "Co to jest dywidenda kryptowalutowa?", optionA: "Nagroda za posiadanie tokenów", optionB: "Opłata transakcyjna", correctOption: 'A' },
    { question: "Co oznacza skrót AML w finansach?", optionA: "Anti Money Laundering", optionB: "Automated Market Listing", correctOption: 'A' },
    { question: "Jakie są popularne indeksy giełdowe w USA?", optionA: "S&P 500 i Dow Jones", optionB: "FTSE 100 i DAX", correctOption: 'A' },
    { question: "Co oznacza skrót ROI?", optionA: "Return on Investment", optionB: "Rate of Income", correctOption: 'A' },
    { question: "Co to jest fundusz indeksowy?", optionA: "Fundusz śledzący określony indeks", optionB: "Fundusz spekulacyjny", correctOption: 'A' },
    { question: "Jakie są przykłady kryptowalut typu DeFi?", optionA: "Uniswap, Aave", optionB: "Bitcoin, Litecoin", correctOption: 'A' },
    { question: "Co oznacza skrót OTC w finansach?", optionA: "Over the Counter", optionB: "On the Chart", correctOption: 'A' },
    { question: "Co to jest token utility?", optionA: "Token dający dostęp do usługi lub platformy", optionB: "Token inwestycyjny do zarobku", correctOption: 'A' },
    { question: "Jak nazywa się największa polska giełda papierów wartościowych?", optionA: "GPW", optionB: "NYSE", correctOption: 'A' },
    { question: "Co oznacza skrót ETF leveraged?", optionA: "Fundusz wykorzystujący dźwignię finansową", optionB: "Fundusz stabilny", correctOption: 'A' },
    { question: "Co to jest kapitalizacja rynkowa kryptowaluty?", optionA: "Cena tokena × liczba tokenów w obiegu", optionB: "Kwota depozytu w banku", correctOption: 'A' },
    { question: "Co oznacza skrót ICO?", optionA: "Initial Coin Offering", optionB: "Initial Crypto Option", correctOption: 'A' },
    { question: "Co to jest portfel zimny (cold wallet)?", optionA: "Przechowywanie kryptowalut offline", optionB: "Portfel w aplikacji mobilnej", correctOption: 'A' },
    { question: "Co oznacza skrót DCA w inwestycjach?", optionA: "Dollar Cost Averaging", optionB: "Direct Crypto Access", correctOption: 'A' },
    { question: "Jak nazywa się największa giełda akcji w USA?", optionA: "NYSE", optionB: "NASDAQ", correctOption: 'A' },
    { question: "Co oznacza skrót ETF short?", optionA: "Fundusz inwestujący na spadki ceny aktywów", optionB: "Fundusz inwestujący na wzrosty", correctOption: 'A' },
    { question: "Jakie są przykłady stablecoinów powiązanych z dolarem?", optionA: "USDT, USDC", optionB: "BTC, ETH", correctOption: 'A' },
    { question: "Co oznacza skrót DeFi?", optionA: "Decentralized Finance", optionB: "Defined Financial Instrument", correctOption: 'A' },
    ],
     'Transport': [
    { question: "Który kraj jest znany z produkcji samochodów marki Ferrari?", optionA: "Niemcy", optionB: "Włochy", correctOption: 'B' },
    { question: "Jak nazywa się największy pasażerski samolot na świecie?", optionA: "Boeing 747", optionB: "Airbus A380", correctOption: 'B' },
    { question: "Jak nazywa się popularny elektryczny samochód produkowany przez Teslę?", optionA: "Model S", optionB: "Leaf", correctOption: 'A' },
    { question: "Który kraj jest wynalazcą samochodu?", optionA: "Niemcy", optionB: "USA", correctOption: 'A' },
    { question: "Jak nazywa się najdłuższy most na świecie?", optionA: "Danyang–Kunshan Grand Bridge", optionB: "Golden Gate", correctOption: 'A' },
    { question: "Które miasto słynie z metra o żółtym kolorze wagonów?", optionA: "Berlin", optionB: "Londyn", correctOption: 'A' },
    { question: "Jak nazywa się popularny samolot pasażerski krótkiego zasięgu produkowany przez Boeinga?", optionA: "737", optionB: "747", correctOption: 'A' },
    { question: "Który środek transportu porusza się po torach?", optionA: "Pociąg", optionB: "Autobus", correctOption: 'A' },
    { question: "Jak nazywa się najdłuższa linia metra na świecie?", optionA: "Szanghaj Metro", optionB: "Londyn Metro", correctOption: 'A' },
    { question: "Który kraj jest liderem w produkcji motocykli marki Yamaha?", optionA: "Japonia", optionB: "Niemcy", correctOption: 'A' },
    { question: "Jak nazywa się najszybszy seryjnie produkowany samochód?", optionA: "Bugatti Chiron", optionB: "Lamborghini Aventador", correctOption: 'A' },
    { question: "Który wynalazek zmienił transport w XIX wieku?", optionA: "Lokomotywa parowa", optionB: "Samochód spalinowy", correctOption: 'A' },
    { question: "Jak nazywa się popularny rower miejski w Holandii?", optionA: "Fiets", optionB: "Bici", correctOption: 'A' },
    { question: "Który kraj jest liderem w produkcji samochodów elektrycznych?", optionA: "Chiny", optionB: "Niemcy", correctOption: 'A' },
    { question: "Jak nazywa się system transportu miejskiego składający się z wagonów podwieszonych na linach?", optionA: "Kolejka linowa", optionB: "Metro", correctOption: 'A' },
    { question: "Który kraj słynie z produkcji samochodów marki Porsche?", optionA: "Niemcy", optionB: "Włochy", correctOption: 'A' },
    { question: "Jak nazywa się transport wodny służący do przewozu towarów po rzekach?", optionA: "Żegluga śródlądowa", optionB: "Transport morski", correctOption: 'A' },
    { question: "Który środek transportu jest najszybszy?", optionA: "Samolot pasażerski", optionB: "Pociąg dużych prędkości", correctOption: 'A' },
    { question: "Jak nazywa się pierwszy samochód wyprodukowany seryjnie?", optionA: "Benz Patent-Motorwagen", optionB: "Ford Model T", correctOption: 'A' },
    { question: "Które miasto jest znane z systemu tramwajowego 'Melbourne Tram'?", optionA: "Melbourne", optionB: "Sydney", correctOption: 'A' },
    { question: "Jak nazywa się japoński szybki pociąg?", optionA: "Shinkansen", optionB: "Maglev", correctOption: 'A' },
    { question: "Który kraj produkuje samochody marki Volvo?", optionA: "Szwecja", optionB: "Norwegia", correctOption: 'A' },
    { question: "Jak nazywa się najdłuższa autostrada w USA?", optionA: "Interstate 90", optionB: "Route 66", correctOption: 'A' },
    { question: "Który wynalazek umożliwił masowy transport pasażerów w XIX wieku?", optionA: "Kolej", optionB: "Samochód", correctOption: 'A' },
    { question: "Jak nazywa się popularna forma transportu miejskiego w Amsterdamie?", optionA: "Rower", optionB: "Autobus", correctOption: 'A' },
    { question: "Który kraj słynie z produkcji samochodów marki Lamborghini?", optionA: "Włochy", optionB: "Niemcy", correctOption: 'A' },
    { question: "Jak nazywa się najszybszy pociąg na świecie?", optionA: "Maglev w Szanghaju", optionB: "Shinkansen w Japonii", correctOption: 'A' },
    { question: "Która firma produkuje samochody marki Toyota?", optionA: "Japonia", optionB: "Korea Południowa", correctOption: 'A' },
    { question: "Jak nazywa się transport powietrzny używany do przewozu pasażerów?", optionA: "Samolot pasażerski", optionB: "Helikopter", correctOption: 'A' },
    { question: "Który kraj słynie z produkcji tramwajów marki Škoda?", optionA: "Czechy", optionB: "Słowacja", correctOption: 'A' },
    { question: "Jak nazywa się technologia pociągów unoszących się na poduszce magnetycznej?", optionA: "Maglev", optionB: "Shinkansen", correctOption: 'A' },
    { question: "Która firma produkuje samochody marki Mercedes-Benz?", optionA: "Niemcy", optionB: "Włochy", correctOption: 'A' },
    { question: "Jak nazywa się największy port morski na świecie?", optionA: "Port w Szanghaju", optionB: "Port w Rotterdamie", correctOption: 'A' },
    { question: "Które miasto słynie z transportu tramwajowego 'San Francisco Cable Car'?", optionA: "San Francisco", optionB: "Los Angeles", correctOption: 'A' },
    { question: "Jak nazywa się pierwszy samolot braci Wright?", optionA: "Flyer", optionB: "Spirit of St. Louis", correctOption: 'A' },
    { question: "Która firma produkuje motocykle marki Harley-Davidson?", optionA: "USA", optionB: "Japonia", correctOption: 'A' },
    { question: "Jak nazywa się popularna forma transportu wodnego w Wenecji?", optionA: "Gondola", optionB: "Kajak", correctOption: 'A' },
    { question: "Który kraj słynie z produkcji samochodów marki BMW?", optionA: "Niemcy", optionB: "Włochy", correctOption: 'A' },
    { question: "Jak nazywa się samolot wojskowy używany do transportu ciężkiego sprzętu?", optionA: "C-130 Hercules", optionB: "F-16", correctOption: 'A' },
    { question: "Które państwo wynalazło metro?", optionA: "Wielka Brytania", optionB: "Francja", correctOption: 'A' },
    { question: "Jak nazywa się pierwszy samochód elektryczny produkowany seryjnie?", optionA: "Tesla Roadster", optionB: "Nissan Leaf", correctOption: 'A' },
    { question: "Który kraj jest liderem w produkcji samochodów marki Hyundai?", optionA: "Korea Południowa", optionB: "Japonia", correctOption: 'A' },
    { question: "Jak nazywa się najdłuższa linia kolejowa na świecie?", optionA: "Transsyberyjska", optionB: "Orient Express", correctOption: 'A' },
    { question: "Który kraj słynie z produkcji samochodów marki Peugeot?", optionA: "Francja", optionB: "Włochy", correctOption: 'A' },
    { question: "Jak nazywa się pojazd transportowy używany w kopalniach podziemnych?", optionA: "Lokomotywa górnicza", optionB: "Ciężarówka", correctOption: 'A' },
    { question: "Który wynalazek pozwolił na masowy transport lotniczy w XX wieku?", optionA: "Samolot odrzutowy", optionB: "Balon", correctOption: 'A' },
    { question: "Jak nazywa się szybka kolej między miastami w Europie?", optionA: "TGV", optionB: "Eurostar", correctOption: 'A' },
    { question: "Który kraj słynie z produkcji samochodów marki Audi?", optionA: "Niemcy", optionB: "Włochy", correctOption: 'A' },
    { question: "Jak nazywa się transport publiczny używany w górach linowy?", optionA: "Kolejka linowa", optionB: "Tramwaj", correctOption: 'A' },
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