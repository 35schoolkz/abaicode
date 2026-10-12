const toast = document.getElementById('toast');

/* Learning progress and saved quotations */
const learnStore={get(k,d){try{return JSON.parse(localStorage.getItem('abaicode_'+k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem('abaicode_'+k,JSON.stringify(v))}catch(e){}}};
let learnState=learnStore.get('progress',{xp:0,done:0,streak:0,last:''});
function updateLearn(){document.getElementById('xpValue').textContent=learnState.xp+' XP';document.getElementById('doneValue').textContent=learnState.done;document.getElementById('streakValue').textContent=learnState.streak+' күн';document.getElementById('levelSeal').textContent=String(Math.floor(learnState.xp/50)+1).padStart(2,'0');document.getElementById('xpBar').style.width=(learnState.xp%50/50*100)+'%';document.getElementById('xpCaption').textContent=(50-learnState.xp%50)+' XP қалды — келесі деңгейге жақындадың!';const root=document.getElementById('achievementList');root.innerHTML='';[['Алғашқы қадам',learnState.done>=1],['Білім іздеуші',learnState.xp>=30],['Ойшыл',learnState.xp>=50]].forEach(([n,ok])=>{const s=document.createElement('span');s.className='achievement '+(ok?'unlocked':'');s.textContent=(ok?'🏅 ':'🔒 ')+n;root.appendChild(s)})}
function awardXP(n){learnState.xp+=n;learnState.done++;learnStore.set('progress',learnState);updateLearn()}
document.getElementById('checkinButton').addEventListener('click',()=>{const today=new Date().toISOString().slice(0,10);if(learnState.last===today){notify('Бүгінгі қадамың белгіленген. Ертең жалғастыр!');return}const y=new Date(Date.now()-86400000).toISOString().slice(0,10);learnState.streak=learnState.last===y?learnState.streak+1:1;learnState.last=today;awardXP(10);notify('Жарайсың! +10 XP жинадың.')});
const quoteData=[['«Ғылым таппай мақтанба»','Білім мен мінез туралы'],['«Адамзаттың бәрін сүй, бауырым деп»','Адамгершілік туралы'],['«Пайда ойлама, ар ойла»','Ар мен адалдық туралы'],['«Әсемпаз болма әрнеге»','Мақсат пен пайдалы іс туралы']];
let quotePos=0;
function displayQuote(){const q=quoteData[quotePos];document.getElementById('quoteDayText').textContent=q[0];document.getElementById('quoteDayAuthor').textContent='Абай Құнанбайұлы · '+q[1]}
document.getElementById('nextQuoteButton').addEventListener('click',()=>{quotePos=(quotePos+1)%quoteData.length;displayQuote()});
const gameQs=[{q:'Абай қай жылы дүниеге келді?',o:['1845 жылы','1855 жылы','1904 жылы'],a:0},{q:'Бес асыл істің бірі қайсы?',o:['Өсек','Талап','Еріншектік'],a:1},{q:'Абайдың шын есімі қандай?',o:['Ибраһим','Мұхтар','Шоқан'],a:0},{q:'Қара сөздерде не туралы айтылады?',o:['Тек спорт','Адам, білім және мінез','Ауа райы'],a:1},{q:'Абай нені жоғары бағалады?',o:['Бос мақтанды','Жалқаулықты','Білім мен еңбекті'],a:2}];
let gIndex=0,gAnswered=false;
function drawGame(){const q=gameQs[gIndex];document.getElementById('gameQuestionCount').textContent=(gIndex+1)+' / '+gameQs.length;document.getElementById('gameQuestion').textContent=q.q;document.getElementById('gameFeedback').textContent='Дұрыс жауапқа +10 XP';const root=document.getElementById('gameOptions');root.innerHTML='';gAnswered=false;gameQs[gIndex].o.forEach((t,i)=>{const b=document.createElement('button');b.textContent=t;b.addEventListener('click',()=>{if(gAnswered)return;gAnswered=true;[...root.children].forEach((el,j)=>{el.disabled=true;if(j===q.a)el.classList.add('correct');else if(j===i)el.classList.add('incorrect')});if(i===q.a){document.getElementById('gameFeedback').textContent='Дұрыс! +10 XP';awardXP(10)}else document.getElementById('gameFeedback').textContent='Келесіде тағы байқап көр!';document.getElementById('gameNextButton').disabled=false});root.appendChild(b)});document.getElementById('gameNextButton').disabled=true;document.getElementById('gameNextButton').textContent=gIndex===gameQs.length-1?'Қайта бастау ↻':'Келесі сұрақ →'}
document.getElementById('startGameButton').addEventListener('click',()=>{gIndex=0;document.getElementById('gameQuiz').hidden=false;drawGame()});
document.getElementById('gameNextButton').addEventListener('click',()=>{gIndex=(gIndex+1)%gameQs.length;drawGame()});
updateLearn();displayQuote();
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

const movableIds = ['codePanel','worksPanel','challengePanel','aboutAbai','valuesSection','worksLibrary','quizSection','gamesSection'];
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
    about: ['Абай туралы', 'Абай Құнанбайұлының өмір жолы, шығармашылығы және тарихи мұрасы.']
  };
  const heading = document.querySelector('.welcome-row h1');
  const subtitle = document.querySelector('.welcome-row p');
  heading.textContent = (titles[section] || titles.home)[0];
  subtitle.textContent = (titles[section] || titles.home)[1];

  if (section === 'home') {
    dashboard.hidden = false;
    document.getElementById('progressPanel').hidden = false;
    document.getElementById('quoteOfDay').hidden = false;
    tabContent.hidden = true;
    window.scrollTo({top:0, behavior:'smooth'});
    return;
  }
  dashboard.hidden = true;
  document.getElementById('progressPanel').hidden = true;
  document.getElementById('quoteOfDay').hidden = true;
  tabContent.hidden = false;
  const add = id => {
    const slot = originalSlots[id];
    if (!slot) return;
    tabContent.appendChild(slot.node);
    slot.node.classList.add('is-visible');
  };
  if (section === 'values') { add('codePanel'); add('valuesSection'); }
  if (section === 'works') { add('worksPanel'); add('worksLibrary'); }
  if (section === 'practice') { add('challengePanel'); add('quizSection'); add('gamesSection'); }
  if (section === 'about') add('aboutAbai');
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

const quizLevels = [
  {name:'Бастаушы',tag:'БАСТАУШЫ',questions:[
    {q:'Абай Құнанбайұлы қай жылы дүниеге келді?',options:['1835 жылы','1845 жылы','1855 жылы','1904 жылы'],correct:1,why:'Абай 1845 жылы дүниеге келген.'},
    {q:'Абайдың азан шақырып қойған есімі қандай?',options:['Ибраһим','Мұхтар','Әлихан','Шоқан'],correct:0,why:'Абайдың шын есімі — Ибраһим. «Абай» есімі кейін кең тараған.'},
    {q:'Абай қай халықтың ұлы ақыны және ойшылы?',options:['Қырғыз халқының','Өзбек халқының','Қазақ халқының','Татар халқының'],correct:2,why:'Абай — қазақтың ұлы ақыны, ойшылы, ағартушысы.'},
    {q:'Абай қай жылы дүниеден өтті?',options:['1895 жылы','1904 жылы','1914 жылы','1845 жылы'],correct:1,why:'Абай 1904 жылы дүниеден өтті.'},
    {q:'Абайдың негізгі мұраларының бірі қайсы?',options:['Қара сөздер','Манас эпосы','Кодекс Куманикус','Оғызнама'],correct:0,why:'«Қара сөздер» — Абайдың философиялық прозалық мұрасы.'}
  ]},
  {name:'Ізденуші',tag:'ЖЕҢІЛ',questions:[
    {q:'«Ғылым таппай мақтанба» өлеңінде неге ұмтылу насихатталады?',options:['Бос мақтанға','Білімге және жақсы мінезге','Даңқ үшін таласуға','Уақытты бос өткізуге'],correct:1,why:'Абай білімді, еңбекті және жақсы мінезді жоғары қояды.'},
    {q:'Бес асыл істің қатарына қайсысы кіреді?',options:['Өсек','Еріншектік','Рақым','Мақтаншақтық'],correct:2,why:'Бес асыл іс: талап, еңбек, терең ой, қанағат, рақым.'},
    {q:'Абайдың бес дұшпанының бірі қайсы?',options:['Талап','Қанағат','Терең ой','Өсек'],correct:3,why:'Өсек, өтірік, мақтаншақтық, еріншектік және бекер мал шашу — бес дұшпан.'},
    {q:'Абайдың «Қара сөздері» қандай шығарма түріне жатады?',options:['Философиялық прозаға','Тек ертегіге','Саяхат күнделігіне','Драмаға'],correct:0,why:'Қара сөздерде адам, мінез, білім және қоғам туралы ойлар айтылады.'},
    {q:'Абайдың әкесі кім?',options:['Бөжей','Құнанбай','Байсал','Жиренше'],correct:1,why:'Абайдың әкесі — Құнанбай Өскенбайұлы.'}
  ]},
  {name:'Білгір',tag:'ОРТАША',questions:[
    {q:'Абайдың «Жетінші қара сөзінде» қандай мәселе қозғалады?',options:['Балалықтағы білуге құмарлық пен жан құмары','Соғыс тактикасы','Егіншілік тәсілдері','Сауда бағалары'],correct:0,why:'Жетінші сөзде тән құмары мен жан құмары, білуге ұмтылу туралы ой қозғалады.'},
    {q:'«Бес нәрседен қашық бол, бес нәрсеге асық бол» деген ой қай өлеңмен байланысты?',options:['Қыс','Сегіз аяқ','Ғылым таппай мақтанба','Желсіз түнде жарық ай'],correct:2,why:'Бұл ой «Ғылым таппай мақтанба» өлеңіндегі бес асыл іс пен бес дұшпанға қатысты.'},
    {q:'Абай шығармаларында жиі көтерілетін құндылықтар жиынтығын таңда.',options:['Өсек пен орынсыз мақтан','Білім, еңбек, әділет және адамгершілік','Жалқаулық пен надандық','Тек байлық жинау'],correct:1,why:'Абай білімге, еңбекке, әділетке және адамгершілікке үндейді.'},
    {q:'Абай орыс әдебиетінен кімдердің шығармаларын қазақшаға аударған?',options:['Пушкин, Лермонтов, Крылов','Толстой ғана','Гоголь мен Чехов қана','Ешкімнің шығармасын аудармаған'],correct:0,why:'Абай Пушкин, Лермонтов және Крылов шығармаларын аударған.'},
    {q:'«Қанағат» ұғымына қай түсінік жақын?',options:['Барды бағалап, шектен шықпау','Әрқашан өзгемен жарысу','Мақтану үшін әрекет ету','Өзгені кінәлау'],correct:0,why:'Қанағат — барды бағалау және қалауды ақылмен басқару.'}
  ]},
  {name:'Зерттеуші',tag:'ҚИЫН',questions:[
    {q:'Абайдың «толық адам» идеясына ең жақын сипаттама қайсы?',options:['Тек көп дүние жинаған адам','Ақыл, қайрат, жүрек үйлесімін ұстанған адам','Басқалардан үстем болуға тырысқан адам','Қателігін мойындамайтын адам'],correct:1,why:'Абай танымында ақыл, қайрат пен жүрек үйлесімі маңызды орын алады.'},
    {q:'Абайдың он жетінші қара сөзінде қай қасиеттер өзара таласады?',options:['Талап, еңбек, қанағат','Ақыл, қайрат, жүрек','Өсек, өтірік, мақтан','Жаз, күз, қыс'],correct:1,why:'Он жетінші қара сөзде ақыл, қайрат және жүрек туралы ғибратты әңгіме берілген.'},
    {q:'Абайдың табиғат лирикасына жататын шығарманы тап.',options:['Қара сөздер','Ғылым таппай мақтанба','Қыс','Әсемпаз болма әрнеге'],correct:2,why:'«Қыс» өлеңінде ақын табиғатты жанды бейнедей суреттейді.'},
    {q:'Абайдың ағартушылық ойының негізгі мақсатына қайсысы сай?',options:['Халықты білім мен саналы еңбекке үндеу','Оқуды қажетсіз санау','Дәстүрлі білімнің бәрін жоққа шығару','Тек билікке ұмтылу'],correct:0,why:'Абай халықтың білімді, еңбекқор, әділетті әрі саналы болуын қалаған.'},
    {q:'Абайдың қара сөздерін оқудың пайдалы тәсілі қайсы?',options:['Мағынасын түсінбей жаттау','Тек соңғы сөйлемін оқу','Негізгі ойды тауып, өмірмен байланыстыру','Тек атауларын есте сақтау'],correct:2,why:'Негізгі ойды түсініп, оны өмірмен байланыстыру мәтінді терең меңгеруге көмектеседі.'}
  ]},
  {name:'Абайтанушы',tag:'САРАПШЫ',questions:[
    {q:'Он жетінші қара сөздегі таласта жүрек қандай ұстанымды қорғайды?',options:['Мейірім, рақым және адамға жанашырлықты','Тек пайда табуды','Қаталдықты бәрінен жоғары қоюды','Білімнен бас тартуды'],correct:0,why:'Жүрек мейірім, рақым және адамгершілік қасиеттерін алға тартады.'},
    {q:'«Пайда ойлама, ар ойла» деген өсиет нені білдіреді?',options:['Кез келген мүмкіндіктен бас тарту','Материалдық пайдадан ар-намыс пен адалдықты жоғары қою','Еңбек етпеу','Өзгенің пікірін елемеу'],correct:1,why:'Бұл өсиет ар-ұят пен адалдықты жеке пайдадан жоғары қоюға шақырады.'},
    {q:'Абайдың орыс және Еуропа әдебиетімен танысуы қандай ықпал етті?',options:['Дүниетанымын кеңейтіп, аудармашылық еңбегін байытты','Шығармашылықтан толық бас тарттырды','Тек табиғат туралы жаздырды','Қазақ тілін қолданбауына әкелді'],correct:0,why:'Әртүрлі әдебиет пен ойларды тану Абайдың дүниетанымын кеңейткен.'},
    {q:'Абайдың өлеңдеріндегі бес дұшпан мен бес асыл істі қатар көрсету тәсілі нені күшейтеді?',options:['Жақсы мен жаман мінезді салыстырып, таңдаудың маңызын','Табиғат көрінісін ғана','Оқиғаның уақытын','Кейіпкерлер санын'],correct:0,why:'Қарама-қарсы қою арқылы ақын оқырманға қандай мінезден қашып, қай қасиетті дамыту керегін ұғындырады.'},
    {q:'Абай мұрасын бүгінгі өмірде қолданудың ең терең үлгісі қайсы?',options:['Дәйексөздерді ғана жаттау','Басқаны сынап, өзіңді өзгертпеу','Білім іздеп, мінезіңді саралап, әділет пен мейірімді іс жүзінде көрсету','Өз пікіріңді дәлелсіз дұрыс санау'],correct:2,why:'Абай мұрасы өзін-өзі тәрбиелеуге, білімге, әділетке және рақымға күнделікті әрекетпен ұмтылуға үндейді.'}
  ]}
];
const quizStoreKey='abaicode_quiz_levels';
let quizProgress;
try{quizProgress=JSON.parse(localStorage.getItem(quizStoreKey))||{unlocked:0,completed:[]}}catch(e){quizProgress={unlocked:0,completed:[]}}
quizProgress.unlocked=Math.max(0,Math.min(4,Number(quizProgress.unlocked)||0));
if(!Array.isArray(quizProgress.completed))quizProgress.completed=[];
let currentLevel=0,quizIndex=0,quizAnswered=false,levelFailed=false,levelFinished=false,selectedAnswer=null;
const levelIcons=['✦','❋','◇','✺','♛'];
function saveQuizProgress(){try{localStorage.setItem(quizStoreKey,JSON.stringify(quizProgress))}catch(e){}}
function drawLevelRoad(){
 const road=document.getElementById('levelRoad');road.innerHTML='';
 quizLevels.forEach((level,i)=>{
  const b=document.createElement('button');b.type='button';b.className='level-stop'+(i===currentLevel?' current':'')+(quizProgress.completed.includes(i)?' completed':'')+(i>quizProgress.unlocked?' locked':'');b.disabled=i>quizProgress.unlocked;
  b.innerHTML='<span class="level-stop-icon">'+(i>quizProgress.unlocked?'🔒':(quizProgress.completed.includes(i)?'✓':levelIcons[i]))+'</span><strong>'+String(i+1).padStart(2,'0')+'</strong><small>'+level.name+'</small>';
  b.addEventListener('click',()=>{if(i<=quizProgress.unlocked){currentLevel=i;quizIndex=0;levelFailed=false;levelFinished=false;drawLevelRoad();renderQuiz();}});
  road.appendChild(b);
 });
}
function renderQuiz(){
 const level=quizLevels[currentLevel],q=level.questions[quizIndex],options=document.getElementById('quizOptions');
 quizAnswered=false;levelFailed=false;levelFinished=false;selectedAnswer=null;
 document.getElementById('quizCount').textContent=(currentLevel+1)+'-ДЕҢГЕЙ · '+(quizIndex+1)+' / '+level.questions.length+' СҰРАҚ';
 document.getElementById('quizDifficulty').textContent=level.tag;
 document.getElementById('quizQuestion').textContent=q.q;
 document.getElementById('levelQuizProgress').style.width=((quizIndex/level.questions.length)*100)+'%';
 document.getElementById('quizFeedback').textContent='Жауаптардың бірін таңда.';
 options.innerHTML='';
 q.options.forEach((option,index)=>{const b=document.createElement('button');b.type='button';b.textContent=option;b.className='level-option';b.addEventListener('click',()=>{if(quizAnswered||levelFailed||levelFinished)return;selectedAnswer=index;quizAnswered=true;[...options.children].forEach((el,j)=>{el.classList.toggle('selected',j===index)});document.getElementById('quizFeedback').textContent='Таңдауың белгіленді. Тексеруге дайын болсаң, батырманы бас.';document.getElementById('nextQuiz').disabled=false;document.getElementById('nextQuiz').innerHTML='Жауапты тексеру <span>→</span>';});options.appendChild(b)});
 document.getElementById('nextQuiz').disabled=true;
 document.getElementById('nextQuiz').innerHTML='Жауапты тексеру <span>→</span>';
}
function showQuizResult(){
 const q=quizLevels[currentLevel].questions[quizIndex],options=[...document.getElementById('quizOptions').children],next=document.getElementById('nextQuiz');
 options.forEach((el,i)=>{el.disabled=true;if(i===q.correct)el.classList.add('correct');else if(i===selectedAnswer)el.classList.add('incorrect')});
 document.getElementById('levelQuizProgress').style.width=(((quizIndex+1)/quizLevels[currentLevel].questions.length)*100)+'%';
 if(selectedAnswer!==q.correct){
  levelFailed=true;document.getElementById('quizFeedback').textContent='Бұл жолы дұрыс болмады. '+q.why+' Деңгейді қайта бастау керек.';
  next.disabled=false;next.innerHTML='Деңгейді қайта өту <span>↻</span>';return;
 }
 document.getElementById('quizFeedback').textContent='Дұрыс! '+q.why;
 if(quizIndex<quizLevels[currentLevel].questions.length-1){next.disabled=false;next.innerHTML='Келесі сұрақ <span>→</span>';}
 else{
  levelFinished=true;
  if(!quizProgress.completed.includes(currentLevel)){quizProgress.completed.push(currentLevel);if(currentLevel<quizLevels.length-1)quizProgress.unlocked=Math.max(quizProgress.unlocked,currentLevel+1);saveQuizProgress();awardXP(50);}
  drawLevelRoad();
  document.getElementById('quizFeedback').textContent='Керемет! 5 сұрақтың бәріне дұрыс жауап бердің. '+(currentLevel===quizLevels.length-1?'Сен барлық деңгейді аяқтадың — нағыз Абайтанушысың!': 'Келесі деңгей ашылды! +50 XP');
  next.disabled=false;next.innerHTML=currentLevel===quizLevels.length-1?'Қайтадан ойнау <span>↻</span>':'Келесі деңгейге өту <span>✦</span>';
 }
}
document.getElementById('nextQuiz').addEventListener('click',()=>{
 if(levelFailed){quizIndex=0;renderQuiz();return;}
 if(levelFinished){if(currentLevel<quizLevels.length-1){currentLevel++;quizIndex=0;drawLevelRoad();renderQuiz();}else{currentLevel=0;quizIndex=0;drawLevelRoad();renderQuiz();}return;}
 if(!quizAnswered)return;
 if(selectedAnswer===null)return;
 if(document.getElementById('nextQuiz').textContent.includes('тексеру')){showQuizResult();return;}
 if(quizIndex<quizLevels[currentLevel].questions.length-1){quizIndex++;renderQuiz();}
});
drawLevelRoad();renderQuiz();

// Search the learning page using the header search control.
document.querySelectorAll('.top-actions button').forEach((button,index)=>{
  if(index===0){button.onclick=()=>{const term=prompt('Нені іздегің келеді? (мысалы: еңбек, қара сөздер, талап)');if(!term)return;const found=[...document.querySelectorAll('h1,h2,h3,.tile,.code-row,.value-card,.work-item')].find(el=>el.textContent.toLocaleLowerCase('kk').includes(term.toLocaleLowerCase('kk')));if(found){found.scrollIntoView({behavior:'smooth',block:'center'});found.focus?.();notify(`«${term}» бойынша бөлім табылды.`);}else notify(`«${term}» бойынша бөлім табылмады. Басқа сөзбен іздеп көр.`);};}
});
