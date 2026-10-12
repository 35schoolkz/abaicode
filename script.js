const toast = document.getElementById('toast');

/* Learning progress and saved quotations */
const learnStore={get(k,d){try{return JSON.parse(localStorage.getItem('abaicode_'+k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem('abaicode_'+k,JSON.stringify(v))}catch(e){}}};
let learnState=learnStore.get('progress',{xp:0,done:0,streak:0,last:''});
function updateLearn(){document.getElementById('xpValue').textContent=learnState.xp+' XP';document.getElementById('doneValue').textContent=learnState.done;document.getElementById('streakValue').textContent=learnState.streak+' күн';document.getElementById('levelSeal').textContent=String(Math.floor(learnState.xp/50)+1).padStart(2,'0');document.getElementById('xpBar').style.width=(learnState.xp%50/50*100)+'%';document.getElementById('xpCaption').textContent=(50-learnState.xp%50)+' XP қалды — келесі деңгейге жақындадың!';const root=document.getElementById('achievementList');root.innerHTML='';[['Алғашқы қадам',learnState.done>=1],['Білім іздеуші',learnState.xp>=30],['Ойшыл',learnState.xp>=50]].forEach(([n,ok])=>{const s=document.createElement('span');s.className='achievement '+(ok?'unlocked':'');s.textContent=(ok?'🏅 ':'🔒 ')+n;root.appendChild(s)})}
function awardXP(n){learnState.xp+=n;learnState.done++;learnStore.set('progress',learnState);updateLearn()}
document.getElementById('checkinButton').addEventListener('click',()=>{const today=new Date().toISOString().slice(0,10);if(learnState.last===today){notify('Бүгінгі қадамың белгіленген. Ертең жалғастыр!');return}const y=new Date(Date.now()-86400000).toISOString().slice(0,10);learnState.streak=learnState.last===y?learnState.streak+1:1;learnState.last=today;awardXP(10);notify('Жарайсың! +10 XP жинадың.')});
const quoteData=[['«Ғылым таппай мақтанба»','Білім мен мінез туралы'],['«Адамзаттың бәрін сүй, бауырым деп»','Адамгершілік туралы'],['«Пайда ойлама, ар ойла»','Ар мен адалдық туралы'],['«Әсемпаз болма әрнеге»','Мақсат пен пайдалы іс туралы']];
let quotePos=0;
function displayQuote(){const q=quoteData[quotePos];document.getElementById('quoteDayText').textContent=q[0];document.getElementById('quoteDayAuthor').textContent='Абай Құнанбайұлы · '+q[1];const fav=learnStore.get('favorites',[]);document.getElementById('saveQuoteButton').textContent=fav.includes(q[0])?'♥ Сақталған':'♡ Таңдаулыға сақтау'}
function displayFavorites(){const root=document.getElementById('favoritesList'),items=learnStore.get('favorites',[]);root.innerHTML='';if(!items.length){root.innerHTML='<p class="empty-favorites">Әзірге сақталған дәйексөз жоқ. Ұнаған ойды сақтап көр.</p>';return}items.forEach((q,i)=>{const row=document.createElement('div');row.className='favorite-item';const quote=document.createElement('blockquote');quote.textContent=q;const del=document.createElement('button');del.textContent='Өшіру';del.addEventListener('click',()=>{const next=learnStore.get('favorites',[]);next.splice(i,1);learnStore.set('favorites',next);displayFavorites();displayQuote()});row.append(quote,del);root.appendChild(row)})}
document.getElementById('saveQuoteButton').addEventListener('click',()=>{const q=quoteData[quotePos][0];let f=learnStore.get('favorites',[]);f=f.includes(q)?f.filter(x=>x!==q):[...f,q];learnStore.set('favorites',f);displayQuote();displayFavorites()});
document.getElementById('nextQuoteButton').addEventListener('click',()=>{quotePos=(quotePos+1)%quoteData.length;displayQuote()});
const gameQs=[{q:'Абай қай жылы дүниеге келді?',o:['1845 жылы','1855 жылы','1904 жылы'],a:0},{q:'Бес асыл істің бірі қайсы?',o:['Өсек','Талап','Еріншектік'],a:1},{q:'Абайдың шын есімі қандай?',o:['Ибраһим','Мұхтар','Шоқан'],a:0},{q:'Қара сөздерде не туралы айтылады?',o:['Тек спорт','Адам, білім және мінез','Ауа райы'],a:1},{q:'Абай нені жоғары бағалады?',o:['Бос мақтанды','Жалқаулықты','Білім мен еңбекті'],a:2}];
let gIndex=0,gAnswered=false;
function drawGame(){const q=gameQs[gIndex];document.getElementById('gameQuestionCount').textContent=(gIndex+1)+' / '+gameQs.length;document.getElementById('gameQuestion').textContent=q.q;document.getElementById('gameFeedback').textContent='Дұрыс жауапқа +10 XP';const root=document.getElementById('gameOptions');root.innerHTML='';gAnswered=false;gameQs[gIndex].o.forEach((t,i)=>{const b=document.createElement('button');b.textContent=t;b.addEventListener('click',()=>{if(gAnswered)return;gAnswered=true;[...root.children].forEach((el,j)=>{el.disabled=true;if(j===q.a)el.classList.add('correct');else if(j===i)el.classList.add('incorrect')});if(i===q.a){document.getElementById('gameFeedback').textContent='Дұрыс! +10 XP';awardXP(10)}else document.getElementById('gameFeedback').textContent='Келесіде тағы байқап көр!';document.getElementById('gameNextButton').disabled=false});root.appendChild(b)});document.getElementById('gameNextButton').disabled=true;document.getElementById('gameNextButton').textContent=gIndex===gameQs.length-1?'Қайта бастау ↻':'Келесі сұрақ →'}
document.getElementById('startGameButton').addEventListener('click',()=>{gIndex=0;document.getElementById('gameQuiz').hidden=false;drawGame()});
document.getElementById('gameNextButton').addEventListener('click',()=>{gIndex=(gIndex+1)%gameQs.length;drawGame()});
updateLearn();displayQuote();displayFavorites();
const readToggle=document.createElement('button');readToggle.className='language-toggle';readToggle.type='button';readToggle.textContent='Aa · ОҚУ РЕЖИМІ';document.querySelector('.top-banner').appendChild(readToggle);readToggle.addEventListener('click',()=>{document.body.classList.toggle('reading-mode');readToggle.textContent=document.body.classList.contains('reading-mode')?'Aa · ҚАЛЫПТЫ РЕЖИМ':'Aa · ОҚУ РЕЖИМІ'});

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

const dailyTips = [
  {title:'Талап', tip:'Бүгін бір пәннен өзің түсінбеген тақырыпты таңда.', step:'Алғашқы қадам: 10 минут оқы да, түсінгеніңді өз сөзіңмен 3 сөйлемге жаз.'},
  {title:'Еңбек', tip:'Үлкен тапсырманы кішкентай бөліктерге бөл.', step:'Алғашқы қадам: тізім жаса, ең жеңіл бөлігін қазір орында және біткенін белгіле.'},
  {title:'Терең ой', tip:'Жауап бермес бұрын асықпай ойлан.', step:'Алғашқы қадам: өзіңнен «Бұл ақпарат рас па? Дәлелім қандай?» деп сұра.'},
  {title:'Қанағат', tip:'Уақытың мен қолыңдағы мүмкіндікті бағала.', step:'Алғашқы қадам: бүгін пайдалы болған бір нәрсені жазып, уақытыңды неге жұмсағаныңды қара.'},
  {title:'Рақым', tip:'Бүгін бір адамға шын көңілмен көмектес.', step:'Алғашқы қадам: досыңды тыңда, үйдегілерге көмектес немесе біреуге жылы сөз айт.'}
];
let dailyTipIndex = -1;
document.getElementById('dailyAction').addEventListener('click', () => {
  dailyTipIndex = (dailyTipIndex + 1) % dailyTips.length;
  const current = dailyTips[dailyTipIndex];
  const title = document.getElementById('dailyTipText');
  const step = document.getElementById('dailyStep');
  title.textContent = current.title + ': ' + current.tip;
  step.textContent = current.step;
  step.hidden = false;
  const panel = document.getElementById('dailyPanel');
  panel.classList.remove('tip-updated');
  void panel.offsetWidth;
  panel.classList.add('tip-updated');
  const button = document.getElementById('dailyAction');
  button.innerHTML = dailyTipIndex === dailyTips.length - 1
    ? 'Қайтадан бастау <span>↻</span>'
    : 'Келесі кеңес <span>→</span>';
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

// Real tab navigation: move the existing interactive panels into the selected tab,
// keeping their event listeners intact instead of leaving them below the dashboard.
const dashboard = document.querySelector('.dashboard-grid');
const tabContent = document.createElement('section');
tabContent.id = 'tabContent';
tabContent.className = 'tab-content';
dashboard.insertAdjacentElement('afterend', tabContent);

const movableIds = ['codePanel','worksPanel','challengePanel','aboutAbai','valuesSection','worksLibrary','quizSection','gamesSection','favoritesSection'];
const originalSlots = {};
movableIds.forEach(id => {
  const node = document.getElementById(id);
  if (!node) return;
  const marker = document.createComment('original position for ' + id);
  node.parentNode.insertBefore(marker, node);
  originalSlots[id] = { node, marker };
});
function restorePanels() {
  Object.values(originalSlots).forEach(({node,marker}) => {
    if (marker.parentNode) marker.parentNode.insertBefore(node, marker.nextSibling);
    node.classList.remove('is-visible');
  });
  tabContent.replaceChildren();
}
function openTab(section) {
  restorePanels();
  const titles = {
    home: ['Басты бет', 'Абайдың ойларын күнделікті өмірде қолдануға арналған қысқа жолсерік.'],
    values: ['Абай құндылықтары', 'Талап, еңбек, терең ой, қанағат және рақым: мағынасы мен өмірдегі мысалдары.'],
    works: ['Абай шығармалары', 'Өлеңдер мен қара сөздердің негізгі ойын оқып, бүгінгі өмірмен байланыстырып көр.'],
    practice: ['Практика және тест', 'Өмірлік сұрақтарға жауап беріп, біліміңді шағын тест арқылы тексер.'],
    about: ['Абай туралы', 'Абай Құнанбайұлының өмір жолы, шығармашылығы және тарихи мұрасы.'],
    games: ['Ойындар мен жетістіктер', 'Ойнап үйрен, XP жина және жаңа жетістіктер аш.'],
    favorites: ['Таңдаулы дәйексөздер', 'Сақтаған ойларыңды кез келген уақытта қайта оқы.']
  };
  const heading = document.querySelector('.welcome-row h1');
  const subtitle = document.querySelector('.welcome-row p');
  heading.textContent = (titles[section] || titles.home)[0];
  subtitle.textContent = (titles[section] || titles.home)[1];

  if (section === 'home') {
    dashboard.hidden = false;
    tabContent.hidden = true;
    window.scrollTo({top:0, behavior:'smooth'});
    return;
  }
  dashboard.hidden = true;
  tabContent.hidden = false;
  const add = id => {
    const slot = originalSlots[id];
    if (!slot) return;
    tabContent.appendChild(slot.node);
    slot.node.classList.add('is-visible');
  };
  if (section === 'values') { add('codePanel'); add('valuesSection'); }
  if (section === 'works') { add('worksPanel'); add('worksLibrary'); }
  if (section === 'practice') { add('challengePanel'); add('quizSection'); }
  if (section === 'about') add('aboutAbai');
  if (section === 'games') add('gamesSection');
  if (section === 'favorites') { add('favoritesSection'); displayFavorites(); }
  tabContent.scrollIntoView({behavior:'smooth', block:'start'});
}
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    openTab(item.dataset.section);
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
