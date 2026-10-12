const toast = document.getElementById('toast');
let toastTimer;
function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
}

document.querySelectorAll('.tile').forEach(tile => {
  tile.addEventListener('click', () => {
    const message = tile.dataset.message;
    document.getElementById('explainText').textContent = message;
    notify(message);
  });
});

document.querySelectorAll('.code-row').forEach(row => {
  row.addEventListener('click', () => {
    document.getElementById('explainText').textContent = row.dataset.description;
    notify(`${row.dataset.code}: ${row.dataset.description}`);
  });
});

const questions = [
  'Сен бүгін қандай кішкентай қадам жасай аласың?',
  'Біреуге көмектесу үшін бүгін не істей аласың?',
  'Қай пайдалы әдетті осы аптада бастайсың?',
  'Бос уақытыңның 15 минутын қалай пайдалы өткізесің?',
  'Қиындыққа кездессең, кімнен кеңес сұрай аласың?'
];
let questionIndex = 0;
document.getElementById('nextQuestion').addEventListener('click', () => {
  questionIndex = (questionIndex + 1) % questions.length;
  document.getElementById('challengeText').textContent = questions[questionIndex];
});

document.getElementById('quoteButton').addEventListener('click', () => {
  notify('«Ғылым таппай мақтанба» — Абайдың жастарға арналған өлеңі. Ақын талап, еңбек, терең ой, қанағат пен рақымды бағалауға шақырады.');
});

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    const sections = {
      home: ['Басты бет', 'Қош келдің! Өзіңе керекті бөлімді таңда.'],
      situations: ['Жағдайыңды таңда', 'Төмендегі жағдайлардың бірін басып, Абай ойына негізделген кеңесті оқы.'],
      code: ['Абай коды', 'Талап, еңбек және қайрат туралы карточканы таңдап көр.'],
      works: ['Абай шығармасы', '«Ғылым таппай мақтанба» өлеңінің идеясын ашу үшін карточканы бас.'],
      dna: ['ДНҚ тексеру', 'Бұл — үлгілік көрсеткіштер. Олар нақты ғылыми өлшем емес.'],
      challenge: ['Сен не істер едің?', 'Келесі сұрақты көру үшін көрсеткі батырмасын бас.']
    };
    const info = sections[item.dataset.section];
    document.querySelector('.welcome-row h1').textContent = info[0];
    document.querySelector('.welcome-row p').textContent = info[1];
    if (item.dataset.section === 'dna') document.getElementById('dnaPanel').scrollIntoView({behavior:'smooth', block:'center'});
    else if (item.dataset.section === 'code') document.getElementById('codePanel').scrollIntoView({behavior:'smooth', block:'center'});
    else if (item.dataset.section === 'works') document.getElementById('worksPanel').scrollIntoView({behavior:'smooth', block:'center'});
    else if (item.dataset.section === 'challenge') document.getElementById('challengePanel').scrollIntoView({behavior:'smooth', block:'center'});
    else window.scrollTo({top:0, behavior:'smooth'});
  });
});

document.querySelectorAll('.top-actions button').forEach((button, index) => {
  const messages = ['Іздеу мүмкіндігі кейін қосылады.', 'Қазір жаңа хабарлама жоқ.', 'Профиль бөлімі кейін қосылады.'];
  button.addEventListener('click', () => notify(messages[index]));
});
