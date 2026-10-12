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
      challenge: ['Сен не істер едің?', 'Келесі сұрақты көру үшін көрсеткі батырмасын бас.'],
      about: ['Абай әлемі', 'Абайдың өмірі, қара сөздері және асыл істері туралы оқы.'],
      quiz: ['Өзіңді тексер', 'Абай мұрасы туралы шағын тестті орында.']
    };
    const info = sections[item.dataset.section];
    document.querySelector('.welcome-row h1').textContent = info[0];
    document.querySelector('.welcome-row p').textContent = info[1];
    if (item.dataset.section === 'dna') document.getElementById('dnaPanel').scrollIntoView({behavior:'smooth', block:'center'});
    else if (item.dataset.section === 'code') document.getElementById('codePanel').scrollIntoView({behavior:'smooth', block:'center'});
    else if (item.dataset.section === 'works') document.getElementById('worksPanel').scrollIntoView({behavior:'smooth', block:'center'});
    else if (item.dataset.section === 'challenge') document.getElementById('challengePanel').scrollIntoView({behavior:'smooth', block:'center'});
    else if (item.dataset.section === 'about') document.getElementById('aboutAbai').scrollIntoView({behavior:'smooth', block:'start'});
    else if (item.dataset.section === 'quiz') document.getElementById('quizSection').scrollIntoView({behavior:'smooth', block:'start'});
    else window.scrollTo({top:0, behavior:'smooth'});
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
