'use strict';

const ronEnglishExams = (() => {
  const choice = (prompt, options, answer, explanation) => ({ kind: 'choice', prompt, options, answer, explanation });
  const tf = (prompt, answer, explanation) => ({ ...choice(prompt, ['True', 'False'], answer, explanation), kind: 'tf' });
  const open = (skill, prompt, answer, alternatives, criteria, explanation) =>
    ({ kind: 'open', skill, prompt, answer, alternatives, criteria, explanation });
  const match = (prompt, options, answer, explanation) => ({ ...choice(prompt, options, answer, explanation), kind: 'match' });
  const word = (prompt, meaning, answer, explanation) => ({ kind: 'word', prompt, meaning, answer, explanation });
  const cloze = (slot, prompt, answer, explanation) => ({ kind: 'cloze', slot, prompt, answer, explanation });
  const translate = (prompt, answer, alternatives, criteria, explanation) =>
    ({ ...open('', prompt, answer, alternatives, criteria, explanation), kind: 'translation' });

  return [
    {
      title: 'A Library That Moves',
      passage: 'Every Thursday, Maya and her friends bring books to a small park near their school. They started their outdoor library after they noticed that some children could not visit the town library before it closed. At first, the friends put the books on a table. One windy afternoon, several books fell into a puddle. The next week, they brought a box with a lid and kept it under a tree. Visitors can borrow one book and return it the following Thursday. Maya also made a notebook where readers can suggest new books. When several children asked for animal stories, she brought a few the next week. Now more children stop to read in the park.',
      cloze: 'Last Thursday, we [1] (go) to the park. While Maya [2] (make) a sign, the wind blew a page away. Right now, two children [3] (run) to the book box. Maya [4] (have) a spare notebook in her bag, so she can give us one whenever we need it.',
      reading: [
        tf('The friends bring books to the park on Thursdays.', 'True', 'במשפט הראשון כתוב שהחברים מביאים ספרים לפארק בכל יום חמישי.'),
        tf('The books fell into a puddle on a windy day.', 'True', 'הטקסט מתאר אחר צהריים עם רוח שבו כמה ספרים נפלו לשלולית.'),
        tf('Visitors can borrow two books at a time.', 'False', 'כל מבקר יכול לשאול ספר אחד ולהחזיר אותו ביום חמישי הבא.'),
        tf('Maya brought animal stories before anyone asked for them.', 'False', 'הילדים ביקשו סיפורים על בעלי חיים תחילה, ומאיה הביאה כמה בשבוע הבא.'),
        open('איתור מידע', 'Where did the friends first put the books?', 'They put the books on a table.', ['On a table.', 'They first put them on a table.'], 'לציין שהספרים היו על שולחן.', 'בתיאור תחילת המיזם כתוב שהחברים הניחו את הספרים על שולחן.'),
        open('איתור מידע', 'When should visitors return a borrowed book?', 'They should return it the following Thursday.', ['The following Thursday.', 'They should return it the next Thursday.'], 'לציין שההחזרה היא ביום חמישי הבא.', 'כלל ההשאלה בטקסט מציין החזרה ביום חמישי הבא.'),
        open('הבנה והסקה', 'Why was a box with a lid a better choice than the table?', 'The lid helped protect the books from the wind.', ['The lid kept the books from blowing away.', 'The box kept the books from falling into a puddle.'], 'לקשר בין המכסה לבין שמירה על הספרים במקום או הגנה עליהם מהרוח ומהשלולית.', 'הרוח הפילה ספרים מהשולחן לשלולית. בשבוע הבא החברים השתמשו בקופסה סגורה כדי למנוע בעיה דומה.'),
        open('הבנה והסקה', 'What shows that Maya paid attention to the readers’ suggestions?', 'She brought animal stories after the children asked for them.', ['She brought the animal stories the children requested.', 'When children asked for animal stories, she brought some.'], 'לציין שהילדים ביקשו סיפורים על בעלי חיים ושמאיה הביאה אותם בעקבות הבקשה.', 'המשפט על סיפורי החיות מדגים שמאיה השתמשה בהצעות הקוראים כדי לבחור ספרים.'),
        open('יישום', 'Another class lends games in a windy yard. What could it copy from the library to keep small pieces safe?', 'It could keep the game pieces in a box with a lid.', ['They could use a box with a lid.', 'They can keep the pieces in a box with a lid.'], 'להציע קופסה או מכל סגור עם מכסה לשמירה על חלקי המשחק.', 'כמו קופסת הספרים בפארק, מכל עם מכסה עוזר לשמור על החלקים כשהרוח נושבת.'),
        open('יישום', 'A club wants to know which games its members would like. What idea could it borrow from Maya?', 'It could use a notebook where members suggest games.', ['It could let members write game suggestions in a notebook.', 'They could make a notebook for game suggestions.'], 'להציע מחברת או דרך כתובה דומה שבה חברי המועדון יציעו משחקים.', 'מאיה נתנה לקוראים מחברת להצעות ובחרה ספרים בהתאם. המועדון יכול להשתמש באותה דרך כדי לבחור משחקים.'),
      ],
      vocabulary: [
        choice('The writer signed copies of her novel. She is the book’s ___.', ['expert', 'stranger', 'author', 'result'], 'author', 'המילה author פירושה מחבר או מחברת. חתימה על עותקי הרומן שכתבה מצביעה על המחברת.'),
        choice('The sign says the ice may break. It is ___ to walk there.', ['dangerous', 'regular', 'awake', 'practical'], 'dangerous', 'סכנת שבירת הקרח מתאימה ל־dangerous, שפירושה מסוכן.'),
        choice('I had never seen the man before. He was ___.', ['in touch with me', 'a complete stranger', 'responsible for me', 'an expert'], 'a complete stranger', 'מי שמעולם לא פגשנו הוא a complete stranger, כלומר אדם זר לגמרי.'),
        match('expert', ['what happens because of an action', 'someone with a lot of skill or knowledge', 'the natural world around us'], 'someone with a lot of skill or knowledge', 'Expert הוא מומחה, אדם שיש לו ידע רב או מיומנות רבה בתחום.'),
        match('result', ['the natural world around us', 'someone with a lot of skill or knowledge', 'what happens because of an action'], 'what happens because of an action', 'Result הוא תוצאה, מה שקורה בעקבות פעולה.'),
        match('environment', ['the natural world around us', 'what happens because of an action', 'someone with a lot of skill or knowledge'], 'the natural world around us', 'Environment היא הסביבה, למשל האוויר, המים, הצמחים ובעלי החיים סביבנו.'),
        word('The bus comes at the same time each week. It is a ___ service.', 'קבוע, סדיר', 'regular', 'הגעה באותה שעה בכל שבוע היא דוגמה לשירות סדיר, regular.'),
        word('The baby is not sleeping. She is ___ and looking at us.', 'ערה', 'awake', 'Awake פירושו ער או ערה. התינוקת אינה ישנה ומסתכלת עלינו.'),
        word('I lost my keys. I am ___ them under the sofa.', 'מחפשת אחר', 'looking for', 'Looking for פירושו מחפשת אחר. אובדן המפתחות מסביר למה מחפשים אותם מתחת לספה.'),
        word('I lock the classroom every afternoon. I am ___ keeping it safe.', 'אחראית על', 'responsible for', 'Responsible for פירושו אחראית על. נעילת הכיתה היא חלק מהאחריות לשמור עליה.'),
      ],
      grammar: [
        choice('Nora usually ___ the books before the library opens.', ['is checking', 'check', 'checks', 'checked'], 'checks', 'Usually מסמן הרגל, ולכן משתמשים ב־Present Simple. עם Nora בגוף שלישי יחיד מוסיפים s ל־check.'),
        choice('The park ___ empty when we arrived yesterday.', ['is', 'were', 'be', 'was'], 'was', 'Yesterday מצביע על עבר, ו־the park ביחיד. צורת העבר של to be ביחיד כאן היא was.'),
        choice('We ___ lunch when it started to rain.', ['were having', 'have', 'was having', 'are having'], 'were having', 'הגשם התחיל בזמן שאכלנו. הפעולה המתמשכת בעבר היא were having. כאן have lunch פירושו לאכול צהריים, ולכן אפשר להשתמש בצורה ממושכת.'),
        choice('I ___ the answer already, so you can ask me.', ['am knowing', 'know', 'knows', 'was knowing'], 'know', 'Know מתאר מצב של ידע. בהקשר הנוכחי משתמשים ב־Present Simple, והצורה עם I היא know.'),
        cloze(1, 'Last Thursday, we ___ to the park. (go)', 'went', 'Last Thursday מצביע על פעולה שהסתיימה בעבר. ל־go יש צורת עבר חריגה, went.'),
        cloze(2, 'While Maya ___ a sign, the wind blew a page away. (make)', 'was making', 'While מציג פעולה שנמשכה כשהרוח העיפה דף. עם Maya משתמשים ב־was, ואת e הסופית של make משמיטים לפני ing.'),
        cloze(3, 'Right now, two children ___ to the book box. (run)', 'are running', 'Right now מציין פעולה שמתרחשת עכשיו. Two children ברבים דורש are, ומכפילים את n ב־running.'),
        cloze(4, 'Maya ___ a spare notebook in her bag. (have)', 'has', 'כאן have מציין בעלות בהווה. עם Maya בגוף שלישי יחיד משתמשים ב־has.'),
        translate('הייתה לי מחברת קטנה בשבוע שעבר.', 'I had a small notebook last week.', ['Last week I had a small notebook.', 'I had a little notebook last week.'], 'לכלול I, את had בעבר, מחברת קטנה, ואת זמן הפעולה last week.', 'בשבוע שעבר מצביע על Past Simple. צורת העבר של have היא had, גם עם I.'),
        translate('אחי קורא ספר עכשיו.', 'My brother is reading a book now.', ['My brother is reading a book right now.', 'Right now my brother is reading a book.'], 'לכלול אח שלי, ספר, עכשיו או כרגע, ואת הצורה is reading.', 'עכשיו מצביע על Present Progressive. My brother ביחיד, ולכן משתמשים ב־is reading.'),
      ],
    },
    {
      title: 'The Quiet Rehearsal',
      passage: 'Last month, Eli’s class prepared a short play for a school event. They usually practiced in the hall after lunch. On Tuesday, another class needed the hall for a test, so the group moved to a small classroom. Eli thought they should cancel practice because there was no space to move around. Dana suggested reading the scenes aloud while everyone stayed in their seats. At first, the actors spoke too quickly. Dana asked them to pause after important lines, and Eli noticed that the story was easier to follow. The group used the same quiet exercise before the real show. Even the students at the back of the hall could understand the story.',
      cloze: 'Yesterday, our class [1] (have) a rehearsal. While the actors [2] (run) through the last scene, the bell rang. At the moment, Dana [3] (make) a list of changes. The group [4] (meet) twice a week to practice together.',
      reading: [
        tf('The class prepared a play for a school event.', 'True', 'משפט הפתיחה מציין שהכיתה הכינה הצגה קצרה לאירוע בבית הספר.'),
        tf('The class always practiced before lunch.', 'False', 'זמן החזרה הרגיל היה אחרי ארוחת הצהריים.'),
        tf('Eli first wanted to cancel the practice in the classroom.', 'True', 'אלי חשב שכדאי לבטל כי לא היה מספיק מקום לנוע.'),
        tf('Dana asked the actors to speak faster.', 'False', 'השחקנים כבר דיברו מהר מדי, ולכן דנה ביקשה שיעצרו לרגע אחרי משפטים חשובים.'),
        open('איתור מידע', 'Why did the group move out of the hall on Tuesday?', 'Another class needed the hall for a test.', ['The hall was needed for another class’s test.', 'Another class had a test in the hall.'], 'לציין שכיתה אחרת הייתה צריכה את האולם למבחן.', 'בתיאור יום שלישי כתוב שכיתה אחרת הייתה זקוקה לאולם למבחן, ולכן הקבוצה עברה לחדר כיתה.'),
        open('איתור מידע', 'Where did the actors sit during Dana’s exercise?', 'They stayed in their seats in the classroom.', ['In their classroom seats.', 'They stayed in their seats.'], 'לציין שהשחקנים נשארו לשבת במקומות שלהם.', 'דנה הציעה להקריא את הסצנות בקול כשכולם נשארים במקומות הישיבה.'),
        open('הבנה והסקה', 'How did pausing after important lines help?', 'It made the story easier to follow.', ['The pauses helped people understand the story.', 'The story was easier to understand.'], 'לקשר בין ההפסקות הקצרות להבנה קלה יותר של הסיפור.', 'מיד לאחר ההצעה לעצור אחרי משפטים חשובים, אלי שם לב שקל יותר לעקוב אחר הסיפור.'),
        open('הבנה והסקה', 'What suggests the group found the quiet exercise worth repeating?', 'They used it again before the real show.', ['They repeated it before the show.', 'The group did the exercise again before the performance.'], 'לציין שהקבוצה השתמשה בתרגיל שוב לפני ההופעה.', 'הבחירה לחזור על התרגיל לקראת ההופעה מעידה שהקבוצה מצאה בו ערך.'),
        open('יישום', 'A group needs to practice a play in a tiny room. How could it use Dana’s idea?', 'The actors could read the scenes aloud while staying in their seats.', ['They can sit and read the scenes aloud.', 'They could read their lines aloud while seated.'], 'להציע קריאה בקול של התפקידים או הסצנות בזמן ישיבה.', 'התרגיל של דנה מאפשר לעבוד על הטקסט בקול גם כשאין מקום לתנועה על במה.'),
        open('יישום', 'Your friend speaks too quickly during a class presentation. What tip from Dana would you give?', 'Pause after important sentences.', ['You should pause after important points.', 'I would tell my friend to pause after key lines.'], 'להציע לעצור לרגע אחרי משפטים או נקודות חשובות.', 'דנה ביקשה מהשחקנים להאט בעזרת עצירות קצרות אחרי משפטים חשובים.'),
      ],
      vocabulary: [
        choice('Everyone may ___ the school race by signing up with the coach.', ['escape from', 'participate in', 'look for', 'stay in touch with'], 'participate in', 'ההרשמה אצל המאמן מאפשרת להשתתף במרוץ. Participate in פירושו להשתתף ב־.'),
        choice('___ the weather report, it will rain after lunch.', ['Even though', 'Out of control', 'According to', 'Looking for'], 'According to', 'According to מציין את מקור המידע. התחזית היא המקור לידיעה על הגשם.'),
        choice('The dog ran through the open gate and managed to ___.', ['study', 'escape', 'result', 'participate'], 'escape', 'הריצה דרך השער הפתוח מתארת בריחה. Escape פירושו לברוח או להימלט.'),
        match('scientist', ['something that is enjoyable', 'someone you do not know', 'a person who studies how things work using evidence'], 'a person who studies how things work using evidence', 'Scientist הוא מדען או מדענית, החוקרים איך דברים פועלים בעזרת ראיות.'),
        match('stranger', ['someone you do not know', 'a person who studies how things work using evidence', 'something that is enjoyable'], 'someone you do not know', 'Stranger פירושו אדם שאינך מכירה.'),
        match('fun', ['someone you do not know', 'something that is enjoyable', 'a person who studies how things work using evidence'], 'something that is enjoyable', 'Fun פירושו הנאה או כיף, משהו שנהנים ממנו.'),
        word('Lior knew the door was open. He was ___ of the problem.', 'מודע', 'aware', 'Aware of פירושו מודע ל־. ליאור ידע על הדלת הפתוחה ולכן היה מודע לבעיה.'),
        word('I still text my old teammates. I am ___ them.', 'בקשר עם', 'in touch with', 'In touch with פירושו בקשר עם. ההודעות לצוות הישן מעידות שהקשר נמשך.'),
        word('Nobody could stop the cart from rolling downhill. It was ___.', 'ללא שליטה', 'out of control', 'Out of control פירושו שיצא משליטה. אף אחד לא הצליח לעצור את העגלה.'),
        word('___ it was cold outside, we played in the yard.', 'למרות ש־', 'even though', 'Even though מחבר בין הקור לבין ההחלטה לשחק בחוץ למרות זאת.'),
      ],
      grammar: [
        choice('I ___ the plan now that you have explained it.', ['am understanding', 'understands', 'understand', 'was understanding'], 'understand', 'Understand מבטא מצב של הבנה. עם I בהווה פשוט משתמשים ב־understand.'),
        choice('Noa ___ to the library after school yesterday.', ['goes', 'went', 'goed', 'is going'], 'went', 'Yesterday מכוון ל־Past Simple. צורת העבר החריגה של go היא went.'),
        choice('Listen! The students ___ their lines right now.', ['are reading', 'was reading', 'reads', 'read'], 'are reading', 'Listen ו־right now מצביעים על פעולה בזמן הדיבור. עם students ברבים משתמשים ב־are reading.'),
        choice('The seats ___ empty when we got there last night.', ['are', 'was', 'be', 'were'], 'were', 'Last night מציין עבר. The seats הוא נושא ברבים, ולכן צורת to be המתאימה היא were.'),
        cloze(1, 'Yesterday, our class ___ a rehearsal. (have)', 'had', 'Yesterday מציין אירוע שהסתיים בעבר. צורת העבר של have היא had.'),
        cloze(2, 'While the actors ___ through the last scene, the bell rang. (run)', 'were running', 'הצלצול קטע פעולה מתמשכת בעבר. עם actors ברבים משתמשים ב־were, ומכפילים את n ב־running.'),
        cloze(3, 'At the moment, Dana ___ a list of changes. (make)', 'is making', 'At the moment מציין פעולה שקורית עכשיו. עם Dana משתמשים ב־is, ומשמיטים את e של make לפני ing.'),
        cloze(4, 'The group ___ twice a week to practice together. (meet)', 'meets', 'Twice a week מתאר שגרה. The group הוא קבוצה אחת, ולכן בצורת Present Simple כאן מוסיפים s ל־meet.'),
        translate('יש לאחותי אופניים כחולים.', 'My sister has a blue bike.', ['My sister has a blue bicycle.', 'My sister owns a blue bike.', 'My sister owns a blue bicycle.'], 'לכלול אחות שלי, אופניים כחולים ובעלות בהווה בעזרת has או owns.', 'יש לה מציין בעלות. My sister ביחיד, ולכן אומרים has או owns בזמן Present Simple.'),
        translate('כשנכנסתי, הם היו באמצע משחק כדורגל.', 'When I came in, they were playing soccer.', ['They were playing soccer when I came in.', 'When I came in, they were playing football.', 'When I entered, they were playing soccer.', 'They were playing football when I entered.'], 'לכלול כניסה שלי בעבר, כדורגל, ואת were playing לתיאור הפעולה שכבר התרחשה.', 'הכניסה היא אירוע קצר בעבר, came in. משחק הכדורגל כבר היה בעיצומו, ולכן משתמשים ב־were playing.'),
      ],
    },
    {
      title: 'The Lunch Line Challenge',
      passage: 'On Mondays, the line at the school cafeteria was so long that Amir often had only five minutes to eat. His class decided to find out why. During one lunch break, they watched the line and saw that many students chose their food only after they reached the counter. The students behind them had to wait. Amir and Yael made a large sign with the lunch choices and put it near the entrance. The next Monday, most students already knew what they wanted when they reached the counter. The line moved faster, but some students could not read the sign from far away. The class decided to print the choices in larger letters.',
      cloze: 'Last Monday, Amir [1] (go) to the cafeteria early. While two students [2] (make) a sign, he counted the people in line. Look! Yael [3] (run) to the entrance with a new poster. She [4] (want) everyone to see it before they reach the counter.',
      reading: [
        tf('Amir often had only five minutes to eat on Mondays.', 'True', 'בפתיחה נאמר שהתור הארוך השאיר לאמיר לעיתים קרובות רק חמש דקות לאכול.'),
        tf('The class studied the line during a lunch break.', 'True', 'התלמידים צפו בתור בהפסקת צהריים כדי להבין למה הוא מתעכב.'),
        tf('Amir and Yael put the sign behind the counter.', 'False', 'את השלט הם שמו ליד הכניסה, כדי שאפשר יהיה לבחור מראש.'),
        tf('Everyone could read the new sign from far away.', 'False', 'כמה תלמידים התקשו לקרוא את השלט מרחוק, ולכן הכיתה בחרה להגדיל את האותיות.'),
        open('איתור מידע', 'What did Amir and Yael put on their sign?', 'They put the lunch choices on it.', ['The lunch choices.', 'They listed the food choices.'], 'לציין שהשלט הציג את אפשרויות האוכל או ארוחת הצהריים.', 'בטקסט נאמר שאמיר ויעל הכינו שלט ובו האפשרויות לארוחת הצהריים.'),
        open('איתור מידע', 'What change did the class decide to make to the sign?', 'They decided to print the choices in larger letters.', ['They decided to use bigger letters.', 'They wanted to make the letters larger.'], 'לציין שהם החליטו להגדיל את האותיות.', 'המשפט האחרון מתאר את ההחלטה להדפיס את האפשרויות באותיות גדולות יותר.'),
        open('הבנה והסקה', 'Why did choosing food at the counter slow down the line?', 'The next students had to wait while each person decided what to order.', ['People behind them had to wait for them to choose.', 'Students took time to decide at the counter, so others had to wait.'], 'להסביר שתלמידים התלבטו כשהגיעו לדלפק ושבינתיים הממתינים מאחור לא יכלו להתקדם.', 'התצפית הראתה שהבחירה נעשתה בדלפק עצמו, ולכן האנשים מאחור המתינו לסיום הבחירה.'),
        open('הבנה והסקה', 'What suggests that putting the choices near the entrance helped?', 'Most students chose before reaching the counter, and the line moved faster.', ['Most students knew what they wanted, so the line moved faster.', 'Students made their choices earlier and the line moved more quickly.'], 'לציין שהתלמידים בחרו לפני שהגיעו לדלפק ושהתור התקדם מהר יותר.', 'בטקסט שני הפרטים מופיעים ברצף ביום שני הבא ומסבירים את השיפור בתור.'),
        open('יישום', 'At a school fair, students take a long time to choose a drink at the counter. What would you do?', 'I would put a list of drinks near the entrance so students could choose before reaching the counter.', ['I would show the drink choices before the counter.', 'Put a sign with the drinks where students can see it before they order.'], 'להציע להציג את אפשרויות השתייה לפני הדלפק כדי לאפשר בחירה מראש.', 'כמו שלט האוכל בסיפור, רשימה שמופיעה לפני הדלפק מעבירה את הבחירה לשלב ההמתנה.'),
        open('יישום', 'Students at the back of a line cannot read an activities poster. What change from the story would help them?', 'Print the activities in larger letters.', ['Use bigger letters on the poster.', 'I would make the letters larger.'], 'להציע להגדיל את האותיות בכרזה כדי שיהיו קריאות מרחוק.', 'זו אותה בעיית קריאות מרחוק שהכיתה פתרה באמצעות אותיות גדולות יותר.'),
      ],
      vocabulary: [
        choice('The robot contest is tomorrow. Our team is ___ it and has built a small robot.', ['looking for', 'taking part in', 'out of control', 'in touch with'], 'taking part in', 'Taking part in פירושו משתתפת ב־. בניית רובוט לקראת התחרות מעידה שהקבוצה משתתפת בה.'),
        choice('The cat jumped away from the loud sound without stopping to think. It acted on ___.', ['result', 'language', 'instinct', 'study'], 'instinct', 'Instinct הוא אינסטינקט, תגובה טבעית ומהירה בלי לעצור ולחשוב.'),
        choice('The ___ wind knocked down several large trees.', ['practical', 'regular', 'awake', 'powerful'], 'powerful', 'Powerful פירושו עוצמתי. הפלת עצים גדולים ממחישה את עוצמת הרוח.'),
        match('thought', ['a way to share ideas with words', 'an idea in your mind', 'useful in real situations'], 'an idea in your mind', 'Thought כמילה המציינת שם עצם פירושה מחשבה, כלומר רעיון שחולף בראש.'),
        match('language', ['an idea in your mind', 'useful in real situations', 'a way to share ideas with words'], 'a way to share ideas with words', 'Language פירושו שפה, דרך לתקשר ולשתף רעיונות במילים.'),
        match('practical', ['useful in real situations', 'a way to share ideas with words', 'an idea in your mind'], 'useful in real situations', 'Practical פירושו מעשי, דבר שאפשר להשתמש בו במצב אמיתי.'),
        word('There is a science test tomorrow, so I need to ___ tonight.', 'ללמוד', 'study', 'Study פירושו ללמוד. המבחן מחר מסביר למה צריך ללמוד הערב.'),
        word('If you cannot decide which club you really want to join, ___ and choose the one you care about most.', 'להקשיב ללב שלך', 'listen to your heart', 'Listen to your heart פירושו להקשיב ללב שלך, כלומר לתת מקום למה שאת מרגישה ורוצה.'),
        word('Ari knows a lot about bikes and can fix any of them. He is an ___ on bicycle repairs.', 'מומחה', 'expert', 'Expert פירושו מומחה. הידע של ארי והיכולת שלו לתקן כל אופניים ממחישים זאת.'),
        word('The dark cave is ___ because rocks can fall from the ceiling.', 'מסוכנת', 'dangerous', 'Dangerous פירושו מסוכן. הסיכון לנפילת סלעים הופך את המערה למסוכנת.'),
      ],
      grammar: [
        choice('Amir usually ___ a snack before basketball practice.', ['have', 'is having', 'had', 'has'], 'has', 'Usually מציין הרגל בהווה. עם Amir ביחיד משתמשים ב־has בזמן Present Simple.'),
        choice('The cafeteria ___ closed when we arrived yesterday.', ['is', 'was', 'were', 'be'], 'was', 'Yesterday מצביע על עבר. Cafeteria ביחיד דורש was, צורת העבר של to be.'),
        choice('Please wait. I ___ lunch at the moment.', ['have', 'am having', 'had', 'was having'], 'am having', 'At the moment מציין פעולה בזמן הדיבור. Have lunch כאן פירושו לאכול ארוחת צהריים, ולכן משתמשים ב־am having.'),
        choice('Yael ___ that the larger sign is easier to read.', ['is believing', 'believe', 'believes', 'was believing'], 'believes', 'Believe מתאר אמונה או דעה. ב־Present Simple עם Yael ביחיד מוסיפים s.'),
        cloze(1, 'Last Monday, Amir ___ to the cafeteria early. (go)', 'went', 'Last Monday מציין פעולה שהסתיימה בעבר. צורת העבר החריגה של go היא went.'),
        cloze(2, 'While two students ___ a sign, he counted the people in line. (make)', 'were making', 'הכנת השלט הייתה בעיצומה כשאמיר ספר את הממתינים. Two students ברבים דורש were, ומשמיטים את e של make לפני ing.'),
        cloze(3, 'Look! Yael ___ to the entrance with a new poster. (run)', 'is running', 'Look מזמין להסתכל על פעולה שקורית עכשיו. עם Yael ביחיד משתמשים ב־is, ומכפילים את n ב־running.'),
        cloze(4, 'She ___ everyone to see it before they reach the counter. (want)', 'wants', 'Want מתאר רצון. בהווה פשוט עם she מוסיפים s לצורת הפועל.'),
        translate('היה לנו רעיון טוב אתמול.', 'We had a good idea yesterday.', ['Yesterday we had a good idea.', 'We had a great idea yesterday.'], 'לכלול we, את had בעבר, רעיון טוב ואת yesterday.', 'אתמול מכוון לעבר פשוט. צורת העבר החריגה של have היא had.'),
        translate('כשאמא הגיעה הביתה, הייתי באמצע הכנת כריך.', 'When Mom got home, I was making a sandwich.', ['I was making a sandwich when Mom got home.', 'When my mom came home, I was making a sandwich.', 'I was making a sandwich when Mum came home.'], 'לכלול את הגעת אמא הביתה בעבר ואת was making a sandwich לציון פעולה שכבר הייתה בעיצומה.', 'הגעת אמא מתוארת כאירוע קצר בעבר, והכנת הכריך היא הפעולה המתמשכת. ב־making משמיטים את e של make.'),
      ],
    },
  ];
})();
