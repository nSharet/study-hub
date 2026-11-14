'use strict';

function createRonExam({ language, label, direction, exams, sections, keyboard }) {
  const arabic = language === 'arabic';
  const student = '#/ron';
  const grade = student + '/grade-8';
  const subject = grade + '/' + language;
  const menu = subject + '/november-26';
  const trail = [['רון', student], ['כיתה ח׳', grade], [label, subject], ['מבחן נובמבר 26', menu]];
  const instructions = {
    tf: 'סמני אם המשפט נכון או לא נכון לפי הקטע.',
    open: 'עני באנגלית במשפט אחד או שניים לפי הקטע.',
    choice: 'בחרי את האפשרות המתאימה למשפט.',
    match: 'בחרי את ההגדרה שמתאימה למילה.',
    word: 'בחרי את המשמעות בעברית והקלידי באנגלית את המילה או הביטוי החסרים.',
    cloze: 'השלימי את צורת הפועל בחסר המודגש. הקלידי גם את פועל העזר אם הוא נדרש.',
    translation: 'תרגמי את המשפט לאנגלית.',
    handwriting: 'כתבי ביד והשווי לדוגמה אחרי ההגשה.',
    arabicText: 'אפשר להשתמש במקלדת הערבית שבמסך.',
    arabicMark: 'אפשר להשתמש במקלדת הערבית שבמסך.',
  };
  const labels = { correct: 'נכון', wrong: 'שגוי', missing: 'לא נענתה', pending: 'נדרשת בדיקה עצמית' };
  const filters = { all: 'כל השאלות', wrong: 'שגויות', missing: 'חסרות', pending: 'לבדיקה עצמית' };
  const route = number => menu + '/exam-' + number;
  const key = number => 'study-hub-ron-' + language + '-november-26-' + number;
  const empty = () => ({ index: 0, answers: {}, submitted: false, checks: {} });
  const footer = () => '<footer>התשובות וההתקדמות נשמרות בדפדפן במכשיר הזה.</footer>';
  const isArabicText = value => /\p{Script=Arabic}/u.test(value);
  const foreign = value => `<span dir="${direction}" lang="${arabic ? 'ar' : 'en'}">${esc(value)}</span>`;
  const formatAnswer = value => arabic && !isArabicText(value) ? esc(value) : foreign(value);
  const numberLabel = number => 'מבחן ' + number;
  const examTrail = number => [...trail, [numberLabel(number)]];
  const fraction = (value, total) => `<bdi dir="ltr">${value} / ${total}</bdi>`;

  function load(number) {
    try {
      return JSON.parse(localStorage.getItem(key(number))) || empty();
    } catch {
      return empty();
    }
  }

  function save(number, attempt) {
    try {
      localStorage.setItem(key(number), JSON.stringify(attempt));
    } catch {
      const notice = app.querySelector('#english-storage');
      if (notice) notice.hidden = false;
    }
  }

  function normalize(value) {
    return value.toLowerCase().normalize('NFKC')
      .replace(/[’‘]/g, "'")
      .replace(/(\p{L})'(\p{L})/gu, '$1\u0001$2')
      .replace(/\p{P}/gu, ' ').replace(/\u0001/g, "'").trim().replace(/\s+/g, ' ');
  }

  function answered(question, response) {
    return Boolean(response?.text?.trim() && (question.kind !== 'word' || response.meaning));
  }

  function status(question, response, check) {
    if (!answered(question, response)) return 'missing';
    if (question.kind === 'word' && response.meaning !== question.meaning) return 'wrong';
    if (question.kind === 'handwriting') return check === undefined ? 'pending' : check ? 'correct' : 'wrong';
    if (arabic) return response.text.trim().normalize('NFC') === question.answer.normalize('NFC') ? 'correct' : 'wrong';
    if ([question.answer, ...(question.alternatives || [])].some(answer => normalize(answer) === normalize(response.text))) {
      return 'correct';
    }
    if (!question.criteria) return 'wrong';
    if (check === undefined) return 'pending';
    return check ? 'correct' : 'wrong';
  }

  function score(questions, attempt) {
    return questions.reduce((totals, question, index) => {
      const result = status(question, attempt.answers[index], attempt.checks[index]);
      if (result === 'correct') totals[question.section.key].points += question.section.points;
      if (result === 'pending') totals[question.section.key].pending += question.section.points;
      return totals;
    }, Object.fromEntries(sections.map(section => [section.key, { points: 0, pending: 0 }])));
  }

  function card(title, href, description, badge = '') {
    return `<a class="card link" href="${href}">${badge ? `<span class="badge">${badge}</span>` : ''}<h3>${title}</h3><p class="muted">${description}</p><strong>כניסה ←</strong></a>`;
  }

  function renderPage(path) {
    if (path === student) {
      app.innerHTML = crumbs([trail[0]]) + `<h1>רון</h1><p class="intro">בחרי כיתה</p><div class="grid">${card('כיתה ח׳', grade, 'לבחירת מקצוע בכיתה ח׳')}</div>`;
    } else if (path === grade) {
      app.innerHTML = crumbs(trail.slice(0, 2)) + `<h1>כיתה ח׳</h1><p class="intro">בחרי מקצוע</p><div class="grid">${card('אנגלית', subject, 'הבנת הנקרא, אוצר מילים ודקדוק')}${card('ערבית', grade + '/arabic', 'זיהוי אותיות, כתיבה וניקוד')}</div>`;
    } else if (path === subject) {
      app.innerHTML = crumbs(trail.slice(0, 3)) + `<h1>${label}</h1><div class="grid">${card('הכנה למבחן ' + label + ' נובמבר 26', menu, 'שלושה מבחני הכנה ברמת כיתה ח׳', '3 מבחני הכנה')}</div>`;
    } else {
      app.innerHTML = crumbs(trail) + `<div class="eyebrow">${label} · כיתה ח׳</div>
        <h1>הכנה למבחן ${label} נובמבר 26</h1>
        <p class="intro">${arabic ? 'בכל מבחן 20 שאלות בזיהוי אותיות, כתיבה וניקוד. הכיני מחברת לשתי שאלות כתיבה ביד.'
          : 'שלושה מבחנים באותה רמה. בכל מבחן 30 שאלות בהבנת הנקרא, באוצר מילים ובדקדוק.'} התשובות והציון מופיעים אחרי ההגשה.</p>
        <div class="grid">${exams.map((exam, index) => {
          const number = index + 1;
          const attempt = load(number);
          const badge = attempt.submitted ? 'תוצאות שמורות' : Object.keys(attempt.answers).length ? 'טיוטה שמורה' : (arabic ? '20' : '30') + ' שאלות · 100 נקודות';
          return card(exam.name || numberLabel(number), route(number), arabic ? esc(exam.title) : foreign(exam.title), badge);
        }).join('')}</div>` + footer();
    }
  }

  function optionsHtml(options, selected, attribute, english) {
    return `<div class="answers"${english ? ' dir="ltr" lang="en"' : ''}>${options.map((option, index) =>
      `<button type="button" class="answer${option === selected ? ' selected' : ''}" ${attribute}="${index}" aria-pressed="${option === selected}">${arabic && isArabicText(option) ? foreign(option) : esc(option)}</button>`).join('')}</div>`;
  }

  function saveWarning() {
    return '<p class="notice" id="english-storage" role="status" hidden>הדפדפן לא הצליח לשמור את הניסיון. אפשר להמשיך כל עוד הדף פתוח.</p>';
  }

  function reading(exam, open) {
    return `<details class="english-passage"${open ? ' open' : ''}><summary>קטע הקריאה</summary>
      <h3 dir="ltr" lang="en">${esc(exam.title)}</h3><p dir="ltr" lang="en">${esc(exam.passage)}</p></details>`;
  }

  function clozeText(exam, slot) {
    return esc(exam.cloze).replace(/\[(\d)\]/g, (_, n) =>
      Number(n) === slot ? `<mark>[${n}] ___</mark>` : `<b>[${n}]</b> ___`);
  }

  function questionHtml(exam, question, response, bank) {
    const promptDirection = arabic || question.kind === 'translation' ? '' : ' dir="ltr" lang="en"';
    let input = '';
    if (question.options) {
      input = optionsHtml(question.options, response.text, 'data-english-option', !arabic);
    } else if (question.kind === 'handwriting') {
      input = `<label><input type="checkbox" id="arabic-written"${response.text ? ' checked' : ''}> כתבתי במחברת</label>`;
    } else if (arabic) {
      input = `<label for="english-text">התשובה שלך בערבית</label>
        <input id="english-text" type="text" dir="rtl" lang="ar" autocomplete="off" spellcheck="false" value="${esc(response.text)}">
        ${arabicKeyboard(question, exam.letters)}`;
    } else {
      const long = Boolean(question.criteria);
      const attributes = 'id="english-text" dir="ltr" lang="en" autocomplete="off" spellcheck="false" autocapitalize="off" autocorrect="off"';
      const field = long ? `<textarea ${attributes} rows="3">${esc(response.text || '')}</textarea>`
        : `<input ${attributes} type="text" value="${esc(response.text || '')}">`;
      input = (question.kind === 'word' ? `<fieldset class="english-bank"><legend>בנק מילים בעברית</legend>${optionsHtml(bank, response.meaning, 'data-english-meaning', false)}</fieldset>` : '')
        + `<label for="english-text">התשובה שלך באנגלית</label>${field}`;
    }

    return `<section class="question" aria-labelledby="english-prompt">
      <div class="eyebrow">${question.skill ? esc(question.skill) + ' · ' : ''}${instructions[question.kind] || 'בחרי את התשובה המתאימה.'}</div>
      ${question.kind === 'cloze'
        ? `<h2 id="english-prompt" tabindex="-1">השלמה ${question.slot} מתוך 4</h2><p class="english-cloze" dir="ltr" lang="en">${clozeText(exam, question.slot)}</p>`
        : `<h2 id="english-prompt" tabindex="-1"${promptDirection}>${esc(question.prompt)}</h2>`}
      ${glyphHtml(question)}
      ${input}
    </section>`;
  }

  function renderAttempt(number, exam, questions, attempt, focusQuestion = false) {
    if (attempt.submitted) {
      renderResults(number, exam, questions, attempt);
      return;
    }

    const { index } = attempt;
    const question = questions[index];
    const response = attempt.answers[index] || { text: '' };
    const bank = (exam.vocabulary || []).filter(item => item.kind === 'word').map(item => item.meaning).sort((a, b) => a.localeCompare(b, 'he'));
    const total = questions.length;
    const isAnswered = (item, i) => answered(item, attempt.answers[i]);
    const count = questions.filter(isAnswered).length;
    const jump = (i) => `<button type="button" class="${isAnswered(questions[i], i) ? 'done ' : ''}${index === i ? 'current' : ''}"
      data-english-jump="${i}" aria-label="שאלה ${i + 1}, ${isAnswered(questions[i], i) ? 'נענתה' : 'לא נענתה'}"${index === i ? ' aria-current="step"' : ''}>${i + 1}</button>`;
    app.innerHTML = crumbs(examTrail(number)) + `<div class="english-exam${arabic ? ' arabic-exam' : ''}">
      <div class="topline"><strong>${exam.name || numberLabel(number)} · ${question.section.label}</strong><span>שאלה ${index + 1} מתוך ${total}</span></div>
      <div id="english-progress-text" class="muted">נענו ${count} מתוך ${total}</div>
      <div id="english-progress" class="progress" role="progressbar" aria-valuenow="${count}" aria-valuemin="0" aria-valuemax="${total}" aria-label="שאלות שנענו"><i style="width:${count / total * 100}%"></i></div>
      ${question.section.key === 'reading' ? reading(exam, index === 0) : ''}
      ${questionHtml(exam, question, response, bank)}
      <div class="actions">
        <button type="button" class="btn" id="english-prev"${index === 0 ? ' disabled' : ''}>→ הקודמת</button>
        <button type="button" class="btn primary" id="english-next"${index === total - 1 ? ' disabled' : ''}>הבאה ←</button>
      </div>
      <details class="english-jump"><summary>מעבר ישיר בין שאלות</summary>
        ${sections.map(section => `<div class="english-jump-section"><strong>${section.label}</strong>
          <div class="qnav">${questions.map((item, i) => item.section === section ? jump(i) : '').join('')}</div></div>`).join('')}
      </details>
      <div class="actions"><button type="button" class="btn primary" id="english-submit">סיימתי</button><a class="btn" href="${menu}">חזרה למבחנים</a></div>
      ${saveWarning()}
    </div>` + footer();

    const get = id => document.getElementById(id);
    function updateResponse() {
      if (response.text.trim() || response.meaning) attempt.answers[index] = response;
      else delete attempt.answers[index];
      save(number, attempt);
      const answeredCount = questions.filter(isAnswered).length;
      const progress = get('english-progress');
      get('english-progress-text').textContent = `נענו ${answeredCount} מתוך ${total}`;
      progress.setAttribute('aria-valuenow', answeredCount);
      progress.firstElementChild.style.width = `${answeredCount / total * 100}%`;
      const current = app.querySelector('[aria-current="step"]');
      const done = isAnswered(question, index);
      current.classList.toggle('done', done);
      current.setAttribute('aria-label', `שאלה ${index + 1}, ${done ? 'נענתה' : 'לא נענתה'}`);
    }

    function move(next) {
      attempt.index = next;
      save(number, attempt);
      renderAttempt(number, exam, questions, attempt, true);
      scrollTo(0, 0);
    }

    function bindOptions(attribute, options, field) {
      const buttons = [...app.querySelectorAll(`[${attribute}]`)];
      buttons.forEach((button, i) => {
        button.onclick = () => {
          response[field] = options[i];
          buttons.forEach(option => {
            option.classList.toggle('selected', option === button);
            option.setAttribute('aria-pressed', option === button);
          });
          updateResponse();
        };
      });
    }

    if (question.options) bindOptions('data-english-option', question.options, 'text');
    if (question.kind === 'word') bindOptions('data-english-meaning', bank, 'meaning');
    if (get('english-text')) get('english-text').oninput = event => {
      response.text = event.target.value;
      updateResponse();
    };
    if (arabic) bindArabicInput(get, response, updateResponse);
    get('english-prev').onclick = () => move(index - 1);
    get('english-next').onclick = () => move(index + 1);
    app.querySelectorAll('[data-english-jump]').forEach(button => {
      button.onclick = () => move(Number(button.dataset.englishJump));
    });
    get('english-submit').onclick = () => {
      const missing = total - questions.filter(isAnswered).length;
      if (!confirm(missing ? `נותרו ${missing} שאלות ללא תשובה מלאה. להגיש בכל זאת? לחצי על ביטול כדי לחזור למבחן.`
        : 'כל השאלות נענו. להגיש את המבחן ולקבל תוצאות?')) return;
      attempt.submitted = true;
      save(number, attempt);
      renderResults(number, exam, questions, attempt);
      get('english-result-heading').focus({ preventScroll: true });
      scrollTo(0, 0);
    };
    if (focusQuestion) get('english-prompt').focus({ preventScroll: true });
  }

  function glyphHtml(question) {
    if (!question.glyph) return '';
    return `<p class="arabic-glyph">${question.kind === 'arabicText' ? esc(question.glyph) : foreign(question.glyph)}</p>`;
  }

  function arabicKeyboard(question, allowedLetters) {
    const marking = question.kind === 'arabicMark';
    const letters = keyboard.letters.filter(([letter]) => !allowedLetters || allowedLetters.includes(letter));
    const keys = marking ? [...letters.filter(([letter]) => letter === question.glyph), ...keyboard.marks] : letters;
    return `<div class="arabic-keyboard" aria-label="מקלדת ערבית" dir="rtl">
      ${keys.map(([symbol, name]) => `<button type="button" class="btn" data-arabic-key="${esc(symbol)}"
        aria-label="${esc(name)}">${foreign(/\p{M}/u.test(symbol) ? '◌' + symbol : symbol)}</button>`).join('')}
      <button type="button" class="btn" data-arabic-key="" aria-label="מחיקת התו הקודם">⌫</button>
    </div>`;
  }

  function bindArabicInput(get, response, updateResponse) {
    const written = get('arabic-written');
    if (written) written.onchange = () => {
      response.text = written.checked ? 'כתבתי במחברת' : '';
      updateResponse();
    };
    const input = get('english-text');
    if (!input) return;
    app.querySelectorAll('[data-arabic-key]').forEach(button => {
      button.onclick = () => {
        const symbol = button.dataset.arabicKey;
        const start = input.selectionStart ?? input.value.length;
        const end = input.selectionEnd ?? start;
        const from = !symbol && start === end ? Math.max(0, start - 1) : start;
        input.setRangeText(symbol, from, end, 'end');
        response.text = input.value;
        updateResponse();
      };
    });
  }

  function scoreHtml(questions, attempt) {
    const totals = score(questions, attempt);
    const values = Object.values(totals);
    const points = values.reduce((sum, section) => sum + section.points, 0);
    const pending = values.reduce((sum, section) => sum + section.pending, 0);
    return `<strong>${pending ? 'ציון זמני' : 'ציון סופי'}</strong>
      <div class="score">${fraction(points, 100)}</div>
      ${pending ? `<p>נקבעו <strong>${points} נקודות</strong>. עוד <strong>${pending} נקודות</strong> פתוחות לבדיקה עצמית.</p>` : ''}
      <div class="english-section-scores">${sections.map(section => {
        const result = totals[section.key];
        const maximum = questions.filter(question => question.section === section).length * section.points;
        return `<div><span>${section.label}</span><strong>${fraction(result.points, maximum)}</strong>
          ${result.pending ? `<small>${result.pending} נק׳ לבדיקה עצמית</small>` : ''}</div>`;
      }).join('')}</div>`;
  }

  function resultLabel(question, index, result) {
    const tone = result === 'correct' ? 'good' : result === 'wrong' ? 'bad' : 'muted';
    return `שאלה ${index + 1} · ${question.section.label} · <span class="${tone}">${labels[result]}</span>
      <span class="muted">· ${result === 'pending' ? `${question.section.points} נק׳ פתוחות` : fraction(result === 'correct' ? question.section.points : 0, question.section.points)}</span>`;
  }

  function reviewQuestion(question, index, attempt) {
    const response = attempt.answers[index];
    const result = status(question, response, attempt.checks[index]);
    const canCheck = question.criteria && (result === 'pending' || attempt.checks[index] !== undefined);
    return `<details data-english-result="${result}" data-english-review="${index}">
      <summary>${resultLabel(question, index, result)}</summary>
      <p${arabic || question.kind === 'translation' ? '' : ' dir="ltr" lang="en"'}><strong>${esc(question.prompt)}</strong></p>
      ${glyphHtml(question)}
      <p>התשובה שלך — ${response?.text?.trim() ? formatAnswer(response.text) : question.kind === 'handwriting' ? 'לא סומן שנכתבה תשובה במחברת' : 'לא הוקלדה תשובה'}${question.kind === 'word' ? ` · משמעות שבחרת — ${esc(response?.meaning || 'לא נבחרה')}` : ''}</p>
      <p>${question.criteria ? 'תשובה אפשרית' : 'התשובה הנכונה'} — <strong>${formatAnswer(question.answer)}</strong>${question.kind === 'word' ? ' · ' + esc(question.meaning) : ''}</p>
      <p class="muted">${esc(question.explanation)}</p>
      ${question.criteria ? `<p><strong>מה צריך להופיע בתשובה</strong> — ${esc(question.criteria)}</p>` : ''}
      ${canCheck ? `<div class="actions english-self-check" aria-label="בדיקה עצמית">
        <button type="button" class="btn" data-english-check="yes" aria-pressed="${attempt.checks[index] === true}">עומדת בקריטריונים</button>
        <button type="button" class="btn" data-english-check="no" aria-pressed="${attempt.checks[index] === false}">לא עומדת בקריטריונים</button>
      </div>` : ''}
    </details>`;
  }

  function renderResults(number, exam, questions, attempt) {
    app.innerHTML = crumbs([...trail, [numberLabel(number), route(number)], ['תוצאות']]) + `<div class="english-exam${arabic ? ' arabic-exam' : ''}">
      <div class="eyebrow">${numberLabel(number)} · ${label}</div><h1 id="english-result-heading" tabindex="-1">תוצאות המבחן</h1>
      <section class="card" id="english-score" aria-live="polite">${scoreHtml(questions, attempt)}</section>
      <section class="review">
        <h2>סקירת תשובות</h2>
        ${exam.passage ? reading(exam, false) : ''}
        <div class="actions english-filters" aria-label="סינון שאלות">${Object.entries(filters).map(([value, label]) =>
          `<button type="button" class="btn" data-english-filter="${value}" aria-pressed="${value === 'all'}">${label}</button>`).join('')}</div>
        <p id="english-filter-empty" role="status" hidden>אין שאלות בסינון הזה.</p>
        ${questions.map((question, index) => reviewQuestion(question, index, attempt)).join('')}
      </section>
      <div class="actions"><button type="button" class="btn primary" id="english-reset">ניסיון חדש</button><a class="btn" href="${menu}">לכל המבחנים</a></div>
      ${saveWarning()}
    </div>` + footer();

    const rows = [...app.querySelectorAll('[data-english-review]')];
    const filterButtons = [...app.querySelectorAll('[data-english-filter]')];
    let activeFilter = 'all';

    function applyFilter() {
      rows.forEach(row => row.hidden = activeFilter !== 'all' && row.dataset.englishResult !== activeFilter);
      document.getElementById('english-filter-empty').hidden = rows.some(row => !row.hidden);
    }

    filterButtons.forEach(button => {
      button.onclick = () => {
        activeFilter = button.dataset.englishFilter;
        filterButtons.forEach(item => item.setAttribute('aria-pressed', item === button));
        applyFilter();
      };
    });

    rows.forEach((row, index) => {
      const buttons = [...row.querySelectorAll('[data-english-check]')];
      buttons.forEach(button => {
        button.onclick = () => {
          attempt.checks[index] = button.dataset.englishCheck === 'yes';
          save(number, attempt);
          const result = status(questions[index], attempt.answers[index], attempt.checks[index]);
          row.dataset.englishResult = result;
          row.querySelector('summary').innerHTML = resultLabel(questions[index], index, result);
          buttons.forEach(item => item.setAttribute('aria-pressed', item === button));
          document.getElementById('english-score').innerHTML = scoreHtml(questions, attempt);
          applyFilter();
          if (row.hidden) filterButtons.find(item => item.dataset.englishFilter === activeFilter).focus();
        };
      });
    });

    document.getElementById('english-reset').onclick = () => {
      if (!confirm('לאפס את התשובות והציון של המבחן הזה ולהתחיל ניסיון חדש?')) return;
      const next = empty();
      save(number, next);
      renderAttempt(number, exam, questions, next, true);
      scrollTo(0, 0);
    };
  }

  function render(path) {
    if ([subject, menu].includes(path) || (!arabic && [student, grade].includes(path))) {
      renderPage(path);
      return true;
    }
    const number = exams.findIndex((_, i) => route(i + 1) === path) + 1;
    if (!number) return false;
    const exam = exams[number - 1];
    const questions = sections.flatMap(section => exam[section.key].map(question => ({ ...question, section })));
    renderAttempt(number, exam, questions, load(number));
    return true;
  }

  return { render };
}

const RonEnglish = createRonExam({
  language: 'english', label: 'אנגלית', direction: 'ltr', exams: ronEnglishExams,
  sections: [
    { key: 'reading', label: 'הבנת הנקרא', points: 3 },
    { key: 'vocabulary', label: 'אוצר מילים', points: 3.5 },
    { key: 'grammar', label: 'דקדוק', points: 3.5 },
  ],
});
const RonArabic = typeof ronArabicExams === 'undefined' ? null : createRonExam({
  language: 'arabic', label: 'ערבית', direction: 'rtl', exams: ronArabicExams.exams,
  keyboard: ronArabicExams.keyboard,
  sections: [
    { key: 'recognition', label: 'זיהוי אותיות', points: 5 },
    { key: 'writing', label: 'כתיבה וחיבור', points: 5 },
    { key: 'marks', label: 'תנועות וסימנים', points: 5 },
  ],
});
