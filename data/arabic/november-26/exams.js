'use strict';

const ronArabicExams = (() => {
  const letters = {
    ا: 'אליף', ر: 'רא', ز: 'זאי', د: 'דאל', و: 'ואו', ذ: 'ד׳אל',
    ب: 'בא', ن: 'נון', ت: 'תא', ي: 'יא', م: 'מים', ل: 'לאם', س: 'סין', ف: 'פא',
  };
  const shapes = {
    ا: ['ا', 'ـا'], ر: ['ر', 'ـر'], ز: ['ز', 'ـز'], د: ['د', 'ـد'], و: ['و', 'ـو'], ذ: ['ذ', 'ـذ'],
    ب: ['ب', 'بـ', 'ـبـ', 'ـب'], ن: ['ن', 'نـ', 'ـنـ', 'ـن'], ت: ['ت', 'تـ', 'ـتـ', 'ـت'],
    ي: ['ي', 'يـ', 'ـيـ', 'ـي'], م: ['م', 'مـ', 'ـمـ', 'ـم'], ل: ['ل', 'لـ', 'ـلـ', 'ـل'],
    س: ['س', 'سـ', 'ـسـ', 'ـس'], ف: ['ف', 'فـ', 'ـفـ', 'ـف'],
  };
  const vowels = [
    ['פתחה', 'َ', 'קו מעל האות שמסמן a קצר, בדומה לפתח.'],
    ['כסרה', 'ِ', 'קו מתחת לאות שמסמן i קצר, בדומה לחיריק.'],
    ['דמה', 'ُ', 'סימן מעל האות שמסמן u קצר, בדומה לקובוץ.'],
    ['סוכון', 'ْ', 'עיגול קטן מעל האות שמציין שאין תנועה אחריה.'],
  ];
  const choice = (prompt, options, answer, explanation, glyph = '') =>
    ({ kind: 'choice', prompt, options, answer, explanation, glyph });
  const identify = (letter, form, distractors, hint, position) => {
    const options = [...distractors].map(item => letters[item]);
    options.splice(position, 0, letters[letter]);
    return choice('איזו אות מופיעה כאן?', options, letters[letter], hint, shapes[letter][form]);
  };
  const join = (first, second, position) => {
    const connects = shapes[first].length === 4;
    const options = ['כן', 'לא'];
    if (position) options.reverse();
    return choice('האם האות הראשונה מתחברת לאות שאחריה?', options, connects ? 'כן' : 'לא',
      connects ? letters[first] + ' מתחברת לאות שאחריה. את הרצף קוראים מימין לשמאל.'
        : letters[first] + ' אינה מתחברת לאות שאחריה, גם כשהיא מתחברת לאות שלפניה.',
      first + ' · ' + second);
  };
  const shape = (letter, position, order) => {
    const positionText = ['לבדה', 'בתחילת רצף, מחוברת להמשך', 'באמצע רצף, מחוברת משני הצדדים', 'בסוף רצף, מחוברת לאות שלפניה'];
    return choice('בחרי את צורת ' + letters[letter] + ' ' + positionText[position] + '.',
      order.map(i => shapes[letter][i]), shapes[letter][position],
      'קווי החיבור מראים לאילו אותיות הצורה נצמדת. כאן ' + letters[letter] + ' מופיעה ' + positionText[position] + '.');
  };
  const type = (sequence, explanation) => ({
    kind: 'arabicText', prompt: 'כתבי את האותיות ברצף אחד לפי הסדר, בלי רווחים ובלי ניקוד.',
    glyph: [...sequence].map(letter => letters[letter]).join(' ← '), answer: sequence, explanation,
  });
  const hand = (letter, form, where, criteria) => ({
    kind: 'handwriting', prompt: 'כתבי במחברת את האות ' + letters[letter] + ' ' + where + '.',
    answer: shapes[letter][form], criteria, explanation: 'השווי את גוף האות, הנקודות וקווי החיבור לצורה שבדוגמה.',
  });
  const nameMark = (letter, mark, order) => choice('איזה סימן ניקוד מופיע על האות?',
    order.map(i => vowels[i][0]), vowels[mark][0], vowels[mark][2], letter + vowels[mark][1]);
  const addMark = (letter, mark) => ({
    kind: 'arabicMark', prompt: 'כתבי את האות ' + letters[letter] + ' והוסיפי לה ' + vowels[mark][0] + '.',
    glyph: letter, answer: letter + vowels[mark][1], explanation: vowels[mark][2],
  });
  const sound = (letter, mark, sound, options) => choice('איזו תנועה שומעים אחרי העיצור?',
    options, sound, vowels[mark][2], letter + vowels[mark][1]);
  const hamza = (mark, correct, options) => choice('בחרי אליף עם המזה ועם ' + mark + '.',
    options, correct, 'בתחילת מילה, המזה עם כסרה נכתבת מתחת לאליף. עם פתחה או דמה, המזה נכתבת מעל לאליף.');

  return {
    keyboard: { letters: Object.entries(letters), marks: vowels.map(([name, symbol]) => [symbol, name]) },
    exams: [
      {
        title: 'מבחן תרגול ראשון',
        recognition: [
          identify('ب', 1, 'نتي', 'לבא נקודה אחת מתחת לקו. כאן רואים את צורת תחילת הרצף.', 1),
          identify('ر', 1, 'زدذ', 'לרא צורה מעוקלת בלי נקודה. הקו מימין מחבר אותה לאות שלפניה.', 3),
          identify('ي', 3, 'بنت', 'בצורת הדפוס של יא יש שתי נקודות מתחת לגוף האות.', 0),
          identify('م', 2, 'فسل', 'למים אמצעית יש גוף קטן בין שני קווי החיבור וללא נקודות.', 2),
          identify('ا', 0, 'لود', 'אליף עומדת כקו אנכי. בצורתה הבודדת אין לה קו חיבור.', 2),
          join('د', 'ن', 0),
          join('ل', 'ف', 1),
        ],
        writing: [
          shape('ن', 1, [3, 0, 1, 2]),
          shape('ف', 3, [3, 1, 2, 0]),
          type('باب', 'בא הראשונה מתחברת לאליף. האליף אינה מתחברת לבא שאחריה.'),
          type('درس', 'סדר האותיות הוא דאל, רא וסין. דאל ורא עוצרות כל אחת את החיבור לאות שאחריה.'),
          type('فيل', 'פא ויא מתחברות לאות שאחריהן, ולכן שלוש האותיות יוצרות רצף מחובר.'),
          hand('ذ', 0, 'כשהיא עומדת לבדה', 'כתבי גוף בצורת דאל והוסיפי נקודה אחת מעליו.'),
          hand('ت', 2, 'בצורה האמצעית, מחוברת משני הצדדים', 'שתי נקודות מעל האות וקווי חיבור מימין ומשמאל.'),
        ],
        marks: [
          nameMark('ب', 0, [1, 0, 3, 2]), nameMark('ف', 1, [3, 2, 0, 1]),
          nameMark('ر', 3, [0, 3, 1, 2]), sound('ن', 2, 'u', ['i', 'u', 'a', 'בלי תנועה']),
          addMark('م', 2), hamza('כסרה', 'إِ', ['أُ', 'أَ', 'إِ']),
        ],
      },
      {
        title: 'מבחן תרגול שני',
        recognition: [
          identify('ت', 1, 'بني', 'לתא שתי נקודות מעל גוף האות.', 2),
          identify('ز', 1, 'رذو', 'זאי דומה לרא, עם נקודה אחת מעליה.', 0),
          identify('س', 3, 'ملف', 'לסין בדפוס שלוש שיניים. בצורת הסוף רואים גם את הקערה בצד שמאל.', 3),
          identify('و', 0, 'رزد', 'לואו ראש מעוגל וזנב שיורד מתחת לקו.', 1),
          identify('ن', 0, 'بتي', 'לנון הבודדת קערה ונקודה אחת מעליה.', 3),
          join('ا', 'م', 1),
          join('ي', 'ت', 0),
        ],
        writing: [
          shape('م', 2, [1, 3, 0, 2]),
          shape('ي', 3, [2, 3, 0, 1]),
          type('ولد', 'ואו אינה מתחברת ללאם שאחריה. לאם מתחברת לדאל שבסוף.'),
          type('بيت', 'בא מתחברת ליא, ויא מתחברת לתא הסופית. שימי לב למיקום הנקודות.'),
          type('سلم', 'סין מתחברת ללאם, ולאם מתחברת למים הסופית.'),
          hand('ر', 0, 'כשהיא עומדת לבדה', 'קו מעוקל שיורד שמאלה מן השורה. לרא אין נקודה.'),
          hand('ب', 3, 'בסוף רצף, מחוברת לאות שלפניה', 'כתבי את גוף הבא עם נקודה אחת מתחת וקו חיבור מצד ימין.'),
        ],
        marks: [
          nameMark('س', 1, [2, 0, 1, 3]), nameMark('ل', 2, [2, 3, 0, 1]),
          nameMark('د', 0, [1, 3, 2, 0]), sound('م', 3, 'בלי תנועה', ['u', 'i', 'בלי תנועה', 'a']),
          addMark('ت', 3), hamza('פתחה', 'أَ', ['إِ', 'أَ', 'أُ']),
        ],
      },
      {
        title: 'מבחן תרגול שלישי',
        recognition: [
          identify('ذ', 1, 'درز', 'לד׳אל גוף כמו דאל ונקודה אחת מעליו.', 1),
          identify('ف', 1, 'مبت', 'לפא ראש מעוגל ונקודה אחת מעליו.', 3),
          identify('ل', 3, 'اسم', 'ללאם סופית קו אנכי גבוה וקרס בתחתית, והיא מחוברת מימין.', 0),
          identify('د', 0, 'ذرز', 'לדאל גוף זוויתי קצר בלי נקודה.', 2),
          identify('ي', 2, 'بنت', 'ליא אמצעית שתי נקודות מתחת וקו חיבור בכל צד.', 1),
          join('و', 'ب', 0),
          join('س', 'م', 1),
        ],
        writing: [
          shape('س', 1, [2, 3, 1, 0]),
          shape('ل', 3, [1, 0, 2, 3]),
          type('نور', 'נון מתחברת לוואו. ואו אינה מתחברת לרא שאחריה.'),
          type('زيت', 'זאי אינה מתחברת ליא שאחריה. יא מתחברת לתא הסופית.'),
          type('بنت', 'בא, נון ותא מתחברות ברצף. הבא מנוקדת בנקודה מתחת, הנון בנקודה מעל והתא בשתי נקודות מעל.'),
          hand('ز', 0, 'כשהיא עומדת לבדה', 'כתבי את גוף הרא והוסיפי נקודה אחת מעליו.'),
          hand('م', 2, 'בצורה האמצעית, מחוברת משני הצדדים', 'כתבי את הגוף הקטן של המים וחברי אותו בקו מימין ומשמאל.'),
        ],
        marks: [
          nameMark('ن', 3, [0, 2, 3, 1]), nameMark('ي', 2, [1, 2, 3, 0]),
          nameMark('ب', 1, [1, 0, 2, 3]), sound('ف', 0, 'a', ['a', 'בלי תנועה', 'u', 'i']),
          addMark('ز', 0), hamza('דמה', 'أُ', ['أُ', 'إِ', 'أَ']),
        ],
      },
    ],
  };
})();
