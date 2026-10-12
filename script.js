const toast = document.getElementById('toast');
let activeDialog;
function notify(message) {
  if (activeDialog) activeDialog.remove();
  const overlay = document.createElement('div');
  overlay.className = 'answer-overlay';
  overlay.innerHTML = '<section class="answer-dialog" role="dialog" aria-modal="true" aria-label="Абай кеңесі"><button class="answer-close" aria-label="Жабу">×</button><div class="answer-mark">✦</div><h2>Абай кеңесі</h2><p class="answer-message"></p><button class="answer-ok">Түсіндім</button></section>';
  overlay.querySelector('.answer-message').textContent = message;
  const close = () => { overlay.remove(); activeDialog = null; };
  overlay.querySelector('.answer-close').addEventListener('click', close);
  overlay.querySelector('.answer-ok').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function esc(e){ if(e.key === 'Escape'){close();document.removeEventListener('keydown',esc);} });
  document.body.appendChild(overlay);
  activeDialog = overlay;
  overlay.querySelector('.answer-ok').focus();
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

const navSections = {
  situations: [],
  code: [],
  works: ['worksLibrary'],
  dna: [],
  challenge: [],
  about: ['aboutAbai','valuesSection'],
  quiz: ['quizSection']
};
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    const section = item.dataset.section;
    const titles = {
      home: ['Жағдайыңды таңда', 'Саған жақын өмірлік жағдайды таңда, Абай ойы саған жол көрсетеді.'],
      situations: ['Жағдайыңды таңда', 'Төмендегі жағдайлардың бірін таңдап, кеңес ал.'],
      code: ['Абай коды', 'Талап, еңбек және қайрат туралы карточканы таңда.'],
      works: ['Абай шығармасы', 'Оқуға ұсынылған шығарманы таңдап, түсіндірмесін оқы.'],
      dna: ['ДНҚ тексеру', 'Бұл — үлгілік көрсеткіштер. Олар нақты ғылыми өлшем емес.'],
      challenge: ['Сен не істер едің?', 'Келесі сұрақты көру үшін көрсеткі батырмасын бас.'],
      about: ['Абай әлемі', 'Абайдың өмірі және бес асыл ісі туралы оқы.'],
      quiz: ['Өзіңді тексер', 'Абай мұрасы туралы шағын тестті орында.']
    };
    document.querySelector('.welcome-row h1').textContent = titles[section][0];
    document.querySelector('.welcome-row p').textContent = titles[section][1];
    document.querySelectorAll('.deep-dive').forEach(el => el.classList.remove('is-visible'));
    (navSections[section] || []).forEach(id => document.getElementById(id)?.classList.add('is-visible'));
    const targets = {
      home: 'mainContent', situations: 'mainContent', code: 'codePanel', dna: 'dnaPanel',
      challenge: 'challengePanel', works: 'worksLibrary', about: 'aboutAbai', quiz: 'quizSection'
    };
    const target = document.getElementById(targets[section] || 'mainContent');
    if (section === 'home' || section === 'situations') window.scrollTo({top:0,behavior:'smooth'});
    else target?.scrollIntoView({behavior:'smooth',block:'start'});
  });
});
document.querySelectorAll('.top-actions button').forEach((button, index) => {
  const messages = ['Іздеу мүмкіндігі кейін қосылады.', 'Қазір жаңа хабарлама жоқ.', 'Профиль бөлімі кейін қосылады.'];
  button.addEventListener('click', () => notify(messages[index]));
});

// Expandable learning content and interactive quiz
const valueTips = {
  'Талап': 'Талап — алға қойған мақсатыңа жету үшін іздену. Бүгін бір жаңа нәрсе үйреніп көр.',
  'Еңбек': 'Еңбек — нәтижеге апаратын күнделікті әрекет. Үлкен жұмысты шағын қадамдарға бөл.',
  'Терең ой': 'Терең ой — асықпай ойланып, ақпаратты тексеріп, шешімнің салдарын бағалау.',
  'Қанағат': 'Қанағат — барды бағалау және өз қалауыңды ақылмен басқару.',
  'Рақым': 'Рақым — адамдарға мейіріммен қарау, көмектесу және өзгенің жағдайын түсінуге тырысу.'
};
document.querySelectorAll('.value-card').forEach(card => card.addEventListener('click', () => {
  const value = card.dataset.value;
  document.getElementById('explainText').textContent = valueTips[value];
  notify(`${value}: ${valueTips[value]}`);
}));
document.querySelectorAll('.work-item').forEach(item => item.addEventListener('click', () => {
  notify(`${item.dataset.work}. ${item.dataset.detail}`);
}));

const quizQuestions = [
  {q:'Абайдың «Ғылым таппай мақтанба» өлеңінде неге ұмтылу айтылады?', options:['Тек атақ пен байлыққа','Білімге, еңбекке және жақсы мінезге','Уақытты бос өткізуге'], correct:1, explanation:'Дұрыс! Абай талап, еңбек, терең ой, қанағат және рақымды бағалауға шақырады.'},
  {q:'Абайдың қара сөздерінде қандай тақырыптар қозғалады?', options:['Тек спорт ережелері','Тек саяхат бағыттары','Білім, мінез, еңбек және адамгершілік'], correct:2, explanation:'Дұрыс! Қара сөздер адамды өзін тануға және жақсы қасиеттерді дамытуға үндейді.'},
  {q:'Қиын тапсырмаға тап болсаң, қай әрекет Абай идеяларына жақын?', options:['Бірден бас тарту','Жоспар құрып, еңбек етіп, көмек сұрау','Басқаға орындату'], correct:1, explanation:'Дұрыс! Талап пен еңбек қиындықты біртіндеп жеңуге көмектеседі.'}
];
let quizIndex = 0;
let quizAnswered = false;
function renderQuiz(){
  const q=quizQuestions[quizIndex];
  document.getElementById('quizCount').textContent=`СҰРАҚ ${quizIndex+1} / ${quizQuestions.length}`;
  document.getElementById('quizQuestion').textContent=q.q;
  document.getElementById('quizFeedback').textContent='Жауаптардың бірін таңда.';
  const options=document.getElementById('quizOptions'); options.innerHTML=''; quizAnswered=false;
  q.options.forEach((option,index)=>{const b=document.createElement('button');b.textContent=option;b.dataset.correct=String(index===q.correct);b.addEventListener('click',()=>{
    if(quizAnswered)return;quizAnswered=true;
    [...options.children].forEach((el,i)=>{el.disabled=true;if(i===q.correct)el.classList.add('correct');else if(i===index)el.classList.add('incorrect');});
    document.getElementById('quizFeedback').textContent=index===q.correct?q.explanation:'Бұл жауап дұрыс емес. Жасыл түспен белгіленген жауапты есте сақтап көр.';
    document.getElementById('nextQuiz').disabled=false;
  });options.appendChild(b);});
  const next=document.getElementById('nextQuiz');next.disabled=true;next.innerHTML=quizIndex===quizQuestions.length-1?'Қайта бастау <span>↻</span>':'Келесі сұрақ <span>→</span>';
}
document.getElementById('nextQuiz').addEventListener('click',()=>{quizIndex=(quizIndex+1)%quizQuestions.length;renderQuiz();});
renderQuiz();

// Search the learning page using the header search control.
document.querySelectorAll('.top-actions button').forEach((button,index)=>{
  if(index===0){button.onclick=()=>{const term=prompt('Нені іздегің келеді? (мысалы: еңбек, қара сөздер, талап)');if(!term)return;const found=[...document.querySelectorAll('h1,h2,h3,.tile,.code-row,.value-card,.work-item')].find(el=>el.textContent.toLocaleLowerCase('kk').includes(term.toLocaleLowerCase('kk')));if(found){found.scrollIntoView({behavior:'smooth',block:'center'});found.focus?.();notify(`«${term}» бойынша бөлім табылды.`);}else notify(`«${term}» бойынша бөлім табылмады. Басқа сөзбен іздеп көр.`);};}
});
