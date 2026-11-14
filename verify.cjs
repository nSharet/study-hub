const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync('index.html','utf8'),data=JSON.parse(html.match(/<script id="quiz-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
assert.equal(data.length,8);assert.equal(data.flatMap(s=>s.questions).length,120);const ids=new Set();for(const s of data)for(const q of s.questions){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert(q.options.includes(q.answer));assert(q.explanation.length>25);assert(!ids.has(q.id));ids.add(q.id)}
const embedded = Object.fromEntries([...html.matchAll(/<script id="([^"]+)" type="application\/json">([\s\S]*?)<\/script>/g)]
  .map(([, id, json]) => [id, json]));
const nodes = {};
const storage = {};
const element = id => nodes[id] ||= {
  textContent: embedded[id] || '', innerHTML: '', querySelectorAll: () => [], value: '', checked: true,
};
const ctx = { document: { getElementById: element }, localStorage: {
  getItem: key => storage[key], setItem: (key, value) => storage[key] = value,
}, location: { hash: '#/' }, addEventListener: () => {}, scrollTo: () => {}, confirm: () => true, console, Date, Math };
vm.createContext(ctx);
for (const [, src, inline] of html.matchAll(/<script(?: src="([^"]+)")?>([\s\S]*?)<\/script>/g)) {
  vm.runInContext(src ? fs.readFileSync(src.split('?')[0], 'utf8') : inline, ctx);
}
vm.runInContext(`start(0);session.questions.forEach(q=>session.answers[q.id]=q.answer);finish();if(session.score!==100||saved.wrong.length!==0)throw Error('perfect score');mode='exam';start(1);session.answers[session.questions[0].id]=session.questions[0].answer;renderQuestion();if(app.innerHTML.includes('class="feedback'))throw Error('exam answer leaked');finish();if(session.score!==7||saved.wrong.length!==14)throw Error('partial score');mode='practice';start(-2,all.filter(q=>saved.wrong.includes(q.id)));if(session.questions.length!==14)throw Error('retry bank');session.answers[session.questions[0].id]=session.questions[0].answer;renderQuestion();if(!app.innerHTML.includes('class="feedback'))throw Error('practice feedback');persist();if(!JSON.parse(localStorage.getItem(KEY)).active)throw Error('save');home();if(!app.innerHTML.includes('#/adar'))throw Error('child navigation');subjects();if(!app.innerHTML.includes('#/adar/literature'))throw Error('subject navigation');subject();if(!app.innerHTML.includes('#/adar/civics/october-27'))throw Error('exam navigation');`,ctx);
vm.runInContext(`for(let k=4;k<8;k++){mix=true;start(k);if(session.questions.length!==15)throw Error('advanced count');if(![0,5,10].every(i=>session.questions[i].challenge==='עוגן'))throw Error('confidence balance');}menu();if(!app.innerHTML.includes('רמה גבוהה מאוד')||!app.innerHTML.includes('בוחן ח׳'))throw Error('advanced labels');`,ctx);
console.log('PASS: 120 unique questions; valid choices; grading; exam hides feedback; practice feedback; mistakes; progress persistence; subject/exam navigation.');

const english = vm.runInContext('ronEnglishExams', ctx);
const distribution = {
  reading: { tf: 4, open: 6 },
  vocabulary: { choice: 3, match: 3, word: 4 },
  grammar: { choice: 4, cloze: 4, translation: 2 },
};
const prompts = new Set();
assert.equal(english.length, 3);
for (const exam of english) {
  const words = exam.passage.trim().split(/\s+/).length;
  assert(words >= 100 && words <= 130);
  assert.deepStrictEqual([...exam.cloze.matchAll(/\[(\d)\]/g)].map(([, slot]) => Number(slot)), [1, 2, 3, 4]);
  for (const [section, counts] of Object.entries(distribution)) {
    const observed = {};
    for (const question of exam[section]) {
      observed[question.kind] = (observed[question.kind] || 0) + 1;
      assert(!prompts.has(question.prompt), question.prompt);
      prompts.add(question.prompt);
      assert(question.answer && question.explanation);
      if (question.options) {
        assert(question.options.includes(question.answer));
        assert.equal(new Set(question.options).size, question.options.length);
      }
      if (['open', 'translation'].includes(question.kind)) {
        assert(question.criteria && question.alternatives.length >= 2);
      }
    }
    assert.deepStrictEqual(observed, counts);
  }
  for (const skill of ['איתור מידע', 'הבנה והסקה', 'יישום']) {
    assert.equal(exam.reading.filter(question => question.skill === skill).length, 2);
  }
  assert.equal(new Set(exam.vocabulary.filter(question => question.kind === 'word').map(question => question.meaning)).size, 4);
}
const targets = new Set(english.flatMap(exam => exam.vocabulary.map(question =>
  question.kind === 'match' ? question.prompt : question.answer.toLowerCase())));
for (const target of [
  'regular', 'aware', 'awake', 'stranger', 'expert', 'author', 'looking for', 'a complete stranger',
  'listen to your heart', 'dangerous', 'in touch with', 'out of control', 'participate in', 'even though',
  'according to', 'result', 'responsible for', 'taking part in', 'study', 'instinct', 'thought', 'escape',
  'environment', 'scientist', 'fun', 'language', 'powerful', 'practical',
]) {
  assert(targets.has(target), target);
}
console.log('PASS: 3 English exams, 90 questions, section distributions, passages, and vocabulary coverage.');

const englishMenu = '#/ron/grade-8/english/november-26';
const app = element('app');
const normalizedExample = text => '  ' + text.toUpperCase().replace(/ /g, '  ') + '!  ';
for (const [i, exam] of english.entries()) {
  const number = i + 1;
  const route = englishMenu + '/exam-' + number;
  const key = 'study-hub-ron-english-november-26-' + number;
  const questions = [...exam.reading, ...exam.vocabulary, ...exam.grammar];
  const render = () => {
    ctx.location.hash = route;
    vm.runInContext('render()', ctx);
  };

  render();
  assert.match(app.innerHTML, /שאלה 1 מתוך 30/);
  assert(!app.innerHTML.includes('סקירת תשובות'));
  const attempt = { index: 0, submitted: true, checks: {}, answers: Object.fromEntries(
    questions.map((question, index) => [index, {
      text: normalizedExample(question.alternatives?.[0] ?? question.answer), meaning: question.meaning,
    }]),
  ) };
  const results = () => {
    storage[key] = JSON.stringify(attempt);
    render();
    return app.innerHTML;
  };
  let html = results();
  assert.match(html, /100 \/ 100/);
  assert.match(html, /30 \/ 30/);
  assert.equal((html.match(/35 \/ 35/g) || []).length, 2);
  assert.equal((html.match(/data-english-result="correct"/g) || []).length, 30);

  attempt.answers[4].text = 'A different answer that requires checking.';
  delete attempt.answers[5];
  attempt.answers[16].meaning = exam.vocabulary[7].meaning;
  attempt.answers[24].text = 'spelling error';
  html = results();
  assert.match(html, /ציון זמני/);
  assert.match(html, /87 \/ 100/);
  assert.equal((html.match(/data-english-result="wrong"/g) || []).length, 2);
  assert.equal((html.match(/data-english-result="missing"/g) || []).length, 1);
  assert.equal((html.match(/data-english-result="pending"/g) || []).length, 1);
  attempt.checks[4] = true;
  html = results();
  assert.match(html, /ציון סופי/);
  assert.match(html, /90 \/ 100/);
  attempt.checks[4] = false;
  assert.match(results(), /87 \/ 100/);
}
console.log('PASS: direct links, no in-exam feedback, 100/100 on every exam, and scoring for blank, incorrect, and self-checked answers.');

const arabic = vm.runInContext('ronArabicExams', ctx);
const arabicMenu = '#/ron/grade-8/arabic/november-26';
const renderAt = path => {
  ctx.location.hash = path;
  vm.runInContext('render()', ctx);
  return app.innerHTML;
};
assert.match(renderAt('#/ron/grade-8'), /#\/ron\/grade-8\/arabic/);
assert.match(renderAt('#/ron/grade-8/arabic'), /הכנה למבחן ערבית נובמבר 26/);
assert.equal((renderAt(arabicMenu).match(/\/exam-[123]/g) || []).length, 3);
assert.equal(arabic.exams.length, 4);
assert.match(renderAt(arabicMenu), /מבחן ממוקד · שש אותיות/);
const focused = arabic.exams[3];
assert.match(app.innerHTML, /50 שאלות/);
assert.equal(focused.letters, 'تملسفع');
for (const question of [...focused.recognition, ...focused.writing, ...focused.marks]) {
  const displayed = [question.glyph || '', question.answer, ...(question.options || [])].join(' ');
  for (const symbol of displayed.match(/\p{Script=Arabic}/gu) || []) {
    assert('تملسفعأإ'.includes(symbol), symbol);
  }
}
const focusedKey = 'study-hub-ron-arabic-november-26-4-v2';
const oldFocusedKey = 'study-hub-ron-arabic-november-26-4';
storage[oldFocusedKey] = JSON.stringify({ index: 19, submitted: true, answers: {}, checks: {} });
assert.match(renderAt(arabicMenu + '/exam-4'), /שאלה 1 מתוך 50/);
assert.equal((app.innerHTML.match(/data-english-jump=/g) || []).length, 50);
storage[focusedKey] = JSON.stringify({ index: 18, submitted: false, answers: {}, checks: {} });
assert.equal((renderAt(arabicMenu + '/exam-4').match(/data-arabic-key="[^"]+"/g) || []).length, 6);
delete storage[focusedKey];
assert(JSON.parse(storage[oldFocusedKey]).submitted);
for (const [i, exam] of arabic.exams.entries()) {
  const route = arabicMenu + '/exam-' + (i + 1);
  const key = exam === focused ? focusedKey : 'study-hub-ron-arabic-november-26-' + (i + 1);
  const questions = [...exam.recognition, ...exam.writing, ...exam.marks];
  const handwriting = questions.filter(question => question.kind === 'handwriting').length;
  const points = exam.pointsPerQuestion || 5;
  assert.equal(questions.length, exam === focused ? 50 : 20);
  assert.equal(handwriting, exam === focused ? 4 : 2);
  assert(renderAt(route).includes('שאלה 1 מתוך ' + questions.length));
  assert(!app.innerHTML.includes(questions[0].explanation));

  const attempt = { index: questions.findIndex(question => question.kind === 'arabicMark'), submitted: false, checks: {}, answers: {} };
  storage[key] = JSON.stringify(attempt);
  assert.match(renderAt(route), /aria-label="מקלדת ערבית"/);
  assert.match(app.innerHTML, /data-arabic-key="َ"/);

  for (const [index, question] of questions.entries()) {
    if (question.options) {
      assert(question.options.includes(question.answer));
      assert.equal(new Set(question.options).size, question.options.length);
    }
    attempt.answers[index] = { text: question.kind === 'handwriting' ? 'כתבתי במחברת' : question.answer };
  }
  attempt.submitted = true;
  storage[key] = JSON.stringify(attempt);
  assert(renderAt(route).includes((100 - handwriting * points) + ' / 100'));
  assert.equal((app.innerHTML.match(/data-english-result="pending"/g) || []).length, handwriting);

  for (const [index, question] of questions.entries()) {
    if (question.kind === 'handwriting') attempt.checks[index] = true;
  }
  storage[key] = JSON.stringify(attempt);
  assert.match(renderAt(route), /100 \/ 100/);
  if (exam === focused) {
    assert.equal((app.innerHTML.match(/32 \/ 32/g) || []).length, 2);
    assert.match(app.innerHTML, /36 \/ 36/);
  }
  attempt.answers[attempt.index].text = attempt.answers[attempt.index].text.replace(/\p{M}/gu, '');
  storage[key] = JSON.stringify(attempt);
  assert(renderAt(route).includes((100 - points) + ' / 100'));
  assert.equal((app.innerHTML.match(/data-english-result="wrong"/g) || []).length, 1);
}
console.log('PASS: 4 Arabic exams, direct links, delayed feedback, exact vowel grading, handwritten self-check, and 100/100.');
