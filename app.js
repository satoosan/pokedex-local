const API='https://pokeapi.co/api/v2';
const IMG=id=>`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
const SHINY_IMG=id=>`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${id}.png`;
const STORAGE='my-pokedex-tracker-v1';
const THEME='my-pokedex-theme-v1';

const gens=[
  {id:1,name:'Gen I',region:'Kanto',range:[1,151]}, {id:2,name:'Gen II',region:'Johto',range:[152,251]},
  {id:3,name:'Gen III',region:'Hoenn',range:[252,386]}, {id:4,name:'Gen IV',region:'Sinnoh',range:[387,493]},
  {id:5,name:'Gen V',region:'Unova',range:[494,649]}, {id:6,name:'Gen VI',region:'Kalos',range:[650,721]},
  {id:7,name:'Gen VII',region:'Alola',range:[722,809]}, {id:8,name:'Gen VIII',region:'Galar / Hisui',range:[810,905]},
  {id:9,name:'Gen IX',region:'Paldea',range:[906,9999]}
];

const games=[
  {id:'red-green-blue',name:'Red / Green / Blue',short:'R/G/B',gen:1,dex:['kanto'],fallback:[1,151]},
  {id:'yellow',name:'Yellow',short:'Yellow',gen:1,dex:['kanto'],fallback:[1,151]},
  {id:'gold-silver',name:'Gold / Silver',short:'G/S',gen:2,dex:['original-johto'],fallback:[1,251]},
  {id:'crystal',name:'Crystal',short:'Crystal',gen:2,dex:['original-johto'],fallback:[1,251]},
  {id:'ruby-sapphire',name:'Ruby / Sapphire',short:'R/S',gen:3,dex:['hoenn'],fallback:[252,386]},
  {id:'emerald',name:'Emerald',short:'Emerald',gen:3,dex:['hoenn'],fallback:[252,386]},
  {id:'firered-leafgreen',name:'FireRed / LeafGreen',short:'FR/LG',gen:3,dex:['kanto'],fallback:[1,151]},
  {id:'diamond-pearl',name:'Diamond / Pearl',short:'D/P',gen:4,dex:['original-sinnoh'],fallback:[387,493]},
  {id:'platinum',name:'Platinum',short:'Platinum',gen:4,dex:['extended-sinnoh'],fallback:[387,493]},
  {id:'heartgold-soulsilver',name:'HeartGold / SoulSilver',short:'HG/SS',gen:4,dex:['updated-johto','original-johto'],fallback:[1,251]},
  {id:'black-white',name:'Black / White',short:'B/W',gen:5,dex:['original-unova'],fallback:[494,649]},
  {id:'black2-white2',name:'Black 2 / White 2',short:'B2/W2',gen:5,dex:['updated-unova'],fallback:[494,649]},
  {id:'x-y',name:'X / Y',short:'X/Y',gen:6,dex:['kalos-central','kalos-coastal','kalos-mountain'],fallback:[650,721]},
  {id:'omega-ruby-alpha-sapphire',name:'Omega Ruby / Alpha Sapphire',short:'OR/AS',gen:6,dex:['updated-hoenn','hoenn'],fallback:[252,386]},
  {id:'sun-moon',name:'Sun / Moon',short:'S/M',gen:7,dex:['original-alola'],fallback:[722,802]},
  {id:'ultra-sun-ultra-moon',name:'Ultra Sun / Ultra Moon',short:'US/UM',gen:7,dex:['updated-alola'],fallback:[722,807]},
  {id:'lets-go',name:"Let's Go Pikachu / Eevee",short:"Let's Go",gen:7,dex:['letsgo-kanto','kanto'],fallback:[1,151]},
  {id:'sword-shield',name:'Sword / Shield',short:'Sw/Sh',gen:8,dex:['galar'],fallback:[810,898]},
  {id:'brilliant-diamond-shining-pearl',name:'Brilliant Diamond / Shining Pearl',short:'BD/SP',gen:8,dex:['original-sinnoh'],fallback:[387,493]},
  {id:'legends-arceus',name:'Pokémon Legends: Arceus',short:'Legends Arceus',gen:8,dex:['hisui'],fallback:[810,905]},
  {id:'scarlet-violet',name:'Scarlet / Violet',short:'S/V',gen:9,dex:['paldea'],fallback:[906,1025]},
  {id:'scarlet-violet-dlc',name:'Scarlet / Violet — DLC',short:'S/V DLC',gen:9,dex:['kitakami','blueberry'],fallback:[906,1025]},
  {id:'legends-za',name:'Pokémon Legends: Z-A',short:'Legends Z-A',gen:9,dex:[],fallback:[650,1025]}
];

let allPokemon=[], currentList=[], state=loadState();
let route={type:'dashboard',gen:null,game:null};
let statusFilter='all', search='', viewMode='cards';
const gameDexCache={};
const dexDataCache={};

function loadState(){
  try{const s=JSON.parse(localStorage.getItem(STORAGE))||{};s.pokemon||={};s.forms||={};s.games||={};s.celebratedGames||={};s.timeline||=[];return s}
  catch{return {pokemon:{},forms:{},games:{},celebratedGames:{},timeline:[]}}
}
function persist(){localStorage.setItem(STORAGE,JSON.stringify(state));renderStats()}
function pstate(id){const s=state.pokemon[id]||(state.pokemon[id]={seen:false,caught:false,shiny:false,home:false,manualCaught:false});if(s.manualCaught===undefined)s.manualCaught=false;return s}
function gameState(gameId,id){state.games[gameId]||={};return state.games[gameId][id]||(state.games[gameId][id]={caught:false})}
function anyGameCaught(id){return Object.values(state.games||{}).some(game=>!!game?.[id]?.caught)}
function recomputeNationalCaught(id){const s=pstate(id);s.caught=!!s.manualCaught||anyGameCaught(id);s.seen=s.caught;return s.caught}
function markNationalCaught(id){const s=pstate(id);s.caught=true;s.seen=true}
function migrateCatchSources(){
  let changed=false;
  Object.entries(state.pokemon||{}).forEach(([id,s])=>{const fromGame=anyGameCaught(id);if(s.manualCaught===undefined){s.manualCaught=!!s.caught&&!fromGame;changed=true}const next=!!s.manualCaught||fromGame;if(s.caught!==next){s.caught=next;changed=true}if(s.seen!==next){s.seen=next;changed=true}});
  Object.values(state.games||{}).forEach(game=>Object.entries(game||{}).forEach(([id,data])=>{if(data?.caught){const s=pstate(Number(id));const next=!!s.manualCaught||true;if(!s.caught){s.caught=next;changed=true}if(s.seen!==next){s.seen=next;changed=true}}}));
  if(changed)localStorage.setItem(STORAGE,JSON.stringify(state));
}
function syncGameCatchesToNational(){migrateCatchSources()}
function recordEvent(type,data={}){state.timeline||=[];state.timeline.unshift({type,at:new Date().toISOString(),...data});state.timeline=state.timeline.slice(0,80)}
function toggleManualCatch(id){const s=pstate(id);s.manualCaught=!s.manualCaught;recomputeNationalCaught(id);if(s.manualCaught)recordEvent('pokemon',{id});return s.caught}
function capitalize(s){return String(s||'').replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
function idFromUrl(url){return Number(url.match(/\/(\d+)\/$/)?.[1]||0)}
function genFor(id){return gens.find(g=>id>=g.range[0]&&id<=g.range[1])||gens.at(-1)}

async function boot(){
  setupUI();
  try{
    const cached=sessionStorage.getItem('pokedex-species');
    const data=cached?JSON.parse(cached):await fetch(`${API}/pokemon-species?limit=2000`).then(r=>r.json());
    if(!cached)sessionStorage.setItem('pokedex-species',JSON.stringify(data));
    allPokemon=data.results.map(x=>({id:idFromUrl(x.url),name:x.name,url:x.url})).filter(x=>x.id>0).sort((a,b)=>a.id-b.id);
    migrateCatchSources();
    buildGenerationNav(); renderDashboard();
    preloadGameDexes().then(()=>{if(route.type==='dashboard')renderDashboard()}).catch(console.warn);
  }catch(e){document.getElementById('loading').textContent='Não consegui acessar a PokéAPI. Confira a internet e recarregue.';console.error(e)}
}

function setupUI(){
  document.body.classList.toggle('dark',localStorage.getItem(THEME)==='dark');
  document.getElementById('themeBtn').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem(THEME,document.body.classList.contains('dark')?'dark':'light')};
  document.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>navigate({type:b.dataset.route}));
  document.getElementById('searchInput').oninput=e=>{search=e.target.value.trim().toLowerCase(); if(route.type!=='dashboard')renderGrid()};
  document.getElementById('statusFilter').onclick=e=>{const b=e.target.closest('button[data-status]');if(!b)return;statusFilter=b.dataset.status;document.querySelectorAll('#statusFilter button').forEach(x=>x.classList.toggle('active',x===b));renderGrid()};
  document.getElementById('viewMode').onclick=e=>{const b=e.target.closest('button[data-viewmode]');if(!b)return;viewMode=b.dataset.viewmode;document.querySelectorAll('#viewMode button').forEach(x=>x.classList.toggle('active',x===b));renderGrid()};
  document.getElementById('exportBtn').onclick=exportBackup; document.getElementById('importInput').onchange=importBackup; document.getElementById('resetSaveBtn').onclick=resetFullSave;
  document.getElementById('closeDialog').onclick=()=>document.getElementById('pokemonDialog').close();
  document.getElementById('closeCelebration').onclick=()=>document.getElementById('celebrationDialog').close();
  document.getElementById('markAllGameBtn').onclick=markAllGameCaught; document.getElementById('unmarkAllGameBtn').onclick=unmarkAllGameCaught;
  setupInstallPrompt();
}

function buildGenerationNav(){
  const el=document.getElementById('generationNav');
  el.innerHTML=gens.map(g=>`<section class="gen-nav-group" data-gen-group="${g.id}"><button class="gen-nav-head" data-gen="${g.id}"><span><strong>${g.name}</strong><small>${g.region}</small></span><span class="chev">⌄</span></button><div class="gen-games">${games.filter(x=>x.gen===g.id).map(x=>`<button class="game-nav" data-game="${x.id}" data-gen="${g.id}">${x.name}</button>`).join('')}</div></section>`).join('');
  el.querySelectorAll('.gen-nav-head').forEach(b=>b.onclick=()=>{const grp=b.closest('.gen-nav-group');const opening=!grp.classList.contains('open');el.querySelectorAll('.gen-nav-group').forEach(x=>x.classList.remove('open'));grp.classList.toggle('open',opening)});
  el.querySelectorAll('.game-nav[data-game]').forEach(b=>b.onclick=e=>{e.stopPropagation();navigate({type:'game',gen:Number(b.dataset.gen),game:b.dataset.game})});
}

async function navigate(next){
  route=next; search='';document.getElementById('searchInput').value='';statusFilter='all';document.querySelectorAll('#statusFilter button').forEach(x=>x.classList.toggle('active',x.dataset.status==='all'));
  document.getElementById('dashboardView').classList.toggle('active-view',next.type==='dashboard');
  document.getElementById('dexView').classList.toggle('active-view',next.type!=='dashboard');
  document.querySelectorAll('.main-nav .nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.route===next.type));
  document.querySelectorAll('.game-nav,.gen-nav-head').forEach(b=>b.classList.remove('active'));
  updateBulkCatchButton();
  if(next.type==='dashboard'){setHeading('PROGRESSO GERAL','Dashboard','');renderDashboard();return}
  if(next.type==='national'){setHeading('NATIONAL DEX','National Dex','Todos os Pokémon em uma única lista.');currentList=allPokemon;renderContext();renderGrid();return}
  if(next.type==='generation'){route={type:'dashboard',gen:null,game:null};setHeading('PROGRESSO GERAL','Dashboard','');document.getElementById('dashboardView').classList.add('active-view');document.getElementById('dexView').classList.remove('active-view');renderDashboard();return}
  if(next.type==='game'){
    const game=games.find(x=>x.id===next.game);setHeading(`GEN ${roman(game.gen)} • JOGO`,game.name,'Marque os Pokémon obtidos especificamente neste jogo.');markNavActive();renderContext();await loadGame(game);renderGrid();
  }
}
function setHeading(eyebrow,title,sub){document.getElementById('eyebrow').textContent=eyebrow;document.getElementById('pageTitle').textContent=title;document.getElementById('pageSubtitle').textContent=sub}
function roman(n){return ['','I','II','III','IV','V','VI','VII','VIII','IX'][n]||n}
function markNavActive(){
  if(route.gen){const grp=document.querySelector(`[data-gen-group="${route.gen}"]`);grp?.classList.add('open');grp?.querySelector('.gen-nav-head')?.classList.add('active')}
  if(route.game)document.querySelector(`.game-nav[data-game="${route.game}"]`)?.classList.add('active');
}

function renderContext(){
  const el=document.getElementById('contextSwitcher');
  if(route.type==='game'){
    const g=gens.find(x=>x.id===route.gen); const list=games.filter(x=>x.gen===route.gen);
    el.innerHTML=`<span class="context-label">${g.name} • ${g.region}</span>${list.map(x=>`<button class="context-chip ${route.game===x.id?'active':''}" data-context-game="${x.id}">${x.short}</button>`).join('')}`;
    el.querySelectorAll('[data-context-game]').forEach(b=>b.onclick=()=>navigate({type:'game',gen:g.id,game:b.dataset.contextGame}));
  }else el.innerHTML='';
}

async function getDexEntries(dex){
  if(dexDataCache[dex])return dexDataCache[dex];
  try{
    const d=await fetch(`${API}/pokedex/${dex}`).then(r=>{if(!r.ok)throw Error(`Dex ${dex}`);return r.json()});
    const list=d.pokemon_entries.map(e=>({id:idFromUrl(e.pokemon_species.url),name:e.pokemon_species.name,url:e.pokemon_species.url,regionalNo:e.entry_number}));
    dexDataCache[dex]=list;return list;
  }catch{return []}
}
async function getGameList(game){
  if(gameDexCache[game.id])return gameDexCache[game.id];
  let entries=[];
  for(const dex of game.dex)entries.push(...await getDexEntries(dex));
  let list;
  if(entries.length){
    const map=new Map();entries.forEach(p=>{if(!map.has(p.id))map.set(p.id,p)});
    list=[...map.values()].sort((a,b)=>(a.regionalNo||9999)-(b.regionalNo||9999));
  }else list=allPokemon.filter(p=>p.id>=game.fallback[0]&&p.id<=game.fallback[1]);
  gameDexCache[game.id]=list;return list;
}
async function preloadGameDexes(){
  await Promise.allSettled(games.map(g=>getGameList(g)));
}
async function loadGame(game){
  document.getElementById('loading').style.display='block';document.getElementById('loading').textContent=`Carregando ${game.name}…`;
  currentList=await getGameList(game);
}

function filteredBase(){
  return currentList.filter(p=>{
    const s=pstate(p.id);const caught=route.type==='game'?gameState(route.game,p.id).caught:s.caught;
    if(search && !p.name.includes(search) && !String(p.id).includes(search))return false;
    if(statusFilter==='missing'&&caught)return false;if(statusFilter==='caught'&&!caught)return false;if(statusFilter==='shiny'&&!s.shiny)return false;return true;
  });
}
function renderGrid(){
  const grid=document.getElementById('pokemonGrid'),list=filteredBase();document.getElementById('loading').style.display='none';
  grid.classList.toggle('box-mode',viewMode==='boxes');
  grid.innerHTML=list.map(cardHTML).join('')||'<div class="empty-state">Nenhum Pokémon encontrado com esses filtros.</div>';
  grid.querySelectorAll('.pokemon-card').forEach(card=>{
    const id=Number(card.dataset.id);
    card.querySelector('.pokemon-main')?.addEventListener('click',()=>openPokemon(id));
    card.querySelector('[data-quick-catch]')?.addEventListener('click',e=>{e.stopPropagation();toggleQuickCatch(id)});
    card.querySelector('[data-share-pokemon]')?.addEventListener('click',e=>{e.stopPropagation();sharePokemon(id)});
  });
  updateSummary();
  updateBulkCatchButton();
}
function cardHTML(p){
  const s=pstate(p.id), gameCaught=route.type==='game'?gameState(route.game,p.id).caught:null, caught=route.type==='game'?gameCaught:s.caught;
  const no=p.regionalNo?String(p.regionalNo).padStart(3,'0'):String(p.id).padStart(4,'0');
  const sourceNote=route.type!=='game'&&caught&&!s.manualCaught&&anyGameCaught(p.id)?'Via jogo':'';
  return `<article class="pokemon-card ${caught?'caught':''}" data-id="${p.id}"><button class="pokemon-main" aria-label="Abrir ${capitalize(p.name)}"><span class="num">#${no}</span>${caught?'<span class="caught-stamp">✓</span>':''}<img loading="lazy" src="${IMG(p.id)}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png'" alt="${p.name}"><h4>${capitalize(p.name)}</h4>${sourceNote?`<small class="source-note">${sourceNote}</small>`:''}<div class="mini-status"><span class="${s.caught?'on':''}" title="Living Dex">●</span><span class="${s.shiny?'on shiny':''}" title="Shiny">✦</span><span class="${s.home?'on home':''}" title="HOME">⌂</span></div></button><div class="card-actions"><button class="catch-check ${caught?'is-checked':''}" data-quick-catch>${caught?'✓ Peguei!':'○ Marcar como pego'}</button>${caught?'<button class="share-mini" data-share-pokemon title="Compartilhar no X">↗ X</button>':''}</div></article>`;
}

function updateBulkCatchButton(){
  const wrap=document.getElementById('gameBulkActions'),markBtn=document.getElementById('markAllGameBtn'),unmarkBtn=document.getElementById('unmarkAllGameBtn');
  if(!wrap||!markBtn||!unmarkBtn)return;
  const isGame=route.type==='game';wrap.classList.toggle('hidden',!isGame);
  if(!isGame)return;
  const total=currentList.length,done=currentList.filter(p=>gameState(route.game,p.id).caught).length;
  const complete=total>0&&done===total;
  markBtn.disabled=complete;
  markBtn.classList.toggle('complete',complete);
  markBtn.textContent=complete?'✓ Todos já foram pegos!':`✓ Marcar todos como pegos (${total-done})`;
  unmarkBtn.disabled=done===0;
  unmarkBtn.textContent=done===0?'↺ Nenhum marcado':`↺ Desmarcar todos (${done})`;
}
function markAllGameCaught(){
  if(route.type!=='game'||!currentList.length)return;
  const game=games.find(g=>g.id===route.game);const missing=currentList.filter(p=>!gameState(route.game,p.id).caught);
  if(!missing.length)return;
  const ok=confirm(`Marcar ${missing.length} Pokémon restantes de ${game.name} como pegos?`);
  if(!ok)return;
  missing.forEach(p=>{gameState(route.game,p.id).caught=true;recomputeNationalCaught(p.id)});
  recordEvent('bulk',{game:route.game,count:missing.length});persist();renderGrid();checkGameCompletion(route.game);
}

function unmarkAllGameCaught(){
  if(route.type!=='game'||!currentList.length)return;
  const game=games.find(g=>g.id===route.game),caught=currentList.filter(p=>gameState(route.game,p.id).caught);
  if(!caught.length)return;
  const ok=confirm(`Desmarcar os ${caught.length} Pokémon marcados em ${game.name}?\n\nA National Dex será recalculada. Pokémon que também foram obtidos em outro jogo continuarão marcados nela.`);
  if(!ok)return;
  caught.forEach(p=>{gameState(route.game,p.id).caught=false;recomputeNationalCaught(p.id)});
  state.celebratedGames[route.game]=false;
  recordEvent('bulk-remove',{game:route.game,count:caught.length});persist();renderGrid();
}

function toggleQuickCatch(id){
  if(route.type==='game'){
    const gs=gameState(route.game,id);gs.caught=!gs.caught;recomputeNationalCaught(id);if(gs.caught)recordEvent('pokemon',{id,game:route.game});else if(!gameProgress(route.game).complete)state.celebratedGames[route.game]=false;persist();renderGrid();if(gs.caught)checkGameCompletion(route.game)
  }else{toggleManualCatch(id);persist();renderGrid()}
}
function updateSummary(){
  const base=currentList;const done=route.type==='game'?base.filter(p=>gameState(route.game,p.id).caught).length:base.filter(p=>pstate(p.id).caught).length;const total=base.length,pct=total?done/total*100:0;
  const label=route.type==='national'?'National Dex':games.find(g=>g.id===route.game)?.name||'Dex';
  document.getElementById('dexLabel').textContent=label;document.getElementById('dexSummary').textContent=`${done} / ${total}`;document.getElementById('dexRemaining').textContent=done===total&&total?'Completa! 🏆':`${Math.max(0,total-done)} faltando`;document.getElementById('dexBar').style.width=`${pct}%`;
}

function renderDashboard(){renderStats();renderGameCards();renderGoals();renderTimeline()}
function renderStats(){
  const vals={seen:0,caught:0,shiny:0,home:0};allPokemon.forEach(p=>{const s=pstate(p.id);Object.keys(vals).forEach(k=>vals[k]+=s[k]?1:0)});Object.keys(vals).forEach(k=>{const e=document.getElementById(`${k}Stat`);if(e)e.textContent=vals[k]});const total=allPokemon.length,pct=total?Math.round(vals.caught/total*100):0;document.getElementById('mainRing').style.setProperty('--p',`${pct*3.6}deg`);document.getElementById('mainPercent').textContent=`${pct}%`;document.getElementById('mainProgressText').textContent=`${vals.caught} / ${total} na Living Dex`;
}
function renderGameCards(){
  const el=document.getElementById('generationCards');
  el.innerHTML=gens.map(g=>`<section class="dashboard-gen"><div class="dashboard-gen-head"><span class="gen-badge">${g.name}</span><div><strong>${g.region}</strong><small>${games.filter(x=>x.gen===g.id).length} ${games.filter(x=>x.gen===g.id).length===1?'jogo':'jogos'}</small></div></div><div class="dashboard-game-grid">${games.filter(x=>x.gen===g.id).map(game=>{const pr=gameProgress(game.id),pct=pr.total?Math.round(pr.done/pr.total*100):0;return `<button class="dashboard-game-card ${pr.complete?'complete':''}" data-open-game="${game.id}" data-gen="${g.id}"><div><strong>${pr.complete?'🏆 ':''}${game.name}</strong><small>${pr.complete?'Pokédex completa!':'Continuar Pokédex'}</small></div><div class="gen-progress"><b>${pct}%</b><span>${pr.done}/${pr.total}</span></div></button>`}).join('')}</div></section>`).join('');
  el.querySelectorAll('[data-open-game]').forEach(b=>b.onclick=()=>navigate({type:'game',gen:Number(b.dataset.gen),game:b.dataset.openGame}));
}
function renderGoals(){
  const total=allPokemon.length,c=allPokemon.filter(p=>pstate(p.id).caught).length,sh=allPokemon.filter(p=>pstate(p.id).shiny).length,completed=games.filter(g=>gameProgress(g.id).complete).length;
  const achievements=[
    ['🌱','Primeiro parceiro',c>=1,'Capture seu primeiro Pokémon'],
    ['🥉','Colecionador',c>=100,'100 Pokémon na Living Dex'],
    ['🥈','Veterano',c>=500,'500 Pokémon na Living Dex'],
    ['🥇','National Master',total>0&&c===total,'Complete a National Dex'],
    ['✨','Brilhou!',sh>=1,'Registre seu primeiro shiny'],
    ['🌟','Shiny Hunter',sh>=100,'Registre 100 shinies'],
    ['🏆','Mestre de jogo',completed>=1,'Complete uma Pokédex de jogo'],
    ['👑','Lenda',completed===games.length&&games.length>0,'Complete todos os jogos']
  ];
  document.getElementById('goalCards').innerHTML=achievements.map(([icon,name,on,desc])=>`<div class="achievement ${on?'unlocked':'locked'}"><span>${on?icon:'◌'}</span><div><strong>${name}</strong><small>${on?'✓ Desbloqueada':desc}</small></div></div>`).join('');
}
function renderTimeline(){
  const el=document.getElementById('timelineCards');if(!el)return;const items=(state.timeline||[]).slice(0,8);
  el.innerHTML=items.length?items.map(ev=>{const d=new Date(ev.at),when=d.toLocaleDateString('pt-BR',{day:'2-digit',month:'short'});if(ev.type==='game')return `<div class="timeline-item"><span>🏆</span><div><strong>${games.find(g=>g.id===ev.game)?.name||'Pokédex'} completa</strong><small>${when}</small></div></div>`;if(ev.type==='bulk')return `<div class="timeline-item"><span>✓</span><div><strong>${ev.count} Pokémon marcados de uma vez</strong><small>${games.find(g=>g.id===ev.game)?.short||''} • ${when}</small></div></div>`;if(ev.type==='bulk-remove')return `<div class="timeline-item"><span>↺</span><div><strong>${ev.count} Pokémon desmarcados</strong><small>${games.find(g=>g.id===ev.game)?.short||''} • ${when}</small></div></div>`;const p=allPokemon.find(x=>x.id===Number(ev.id));return `<div class="timeline-item"><span>${pstate(Number(ev.id)).shiny?'✨':'●'}</span><div><strong>${capitalize(p?.name||'Pokémon')} registrado</strong><small>${ev.game?(games.find(g=>g.id===ev.game)?.short+' • '):''}${when}</small></div></div>`}).join(''):'<div class="timeline-empty">Suas próximas capturas vão aparecer aqui. ✨</div>';
}


async function openPokemon(id){
  const dlg=document.getElementById('pokemonDialog'),content=document.getElementById('dialogContent'),p=allPokemon.find(x=>x.id===id),s=pstate(id);content.innerHTML='<p class="muted">Carregando detalhes…</p>';dlg.showModal();
  let species=null,forms=[],pokemonData=null,evolution=[],encounters=[];try{species=await fetch(`${API}/pokemon-species/${id}`).then(r=>r.json());pokemonData=await fetch(`${API}/pokemon/${id}`).then(r=>r.json());forms=await Promise.all((species.varieties||[]).slice(0,30).map(async v=>{try{return await fetch(v.pokemon.url).then(r=>r.json())}catch{return null}}));if(species?.evolution_chain?.url){const chain=await fetch(species.evolution_chain.url).then(r=>r.json());const walk=n=>{if(!n)return;evolution.push(n.species?.name);(n.evolves_to||[]).forEach(walk)};walk(chain.chain)}try{encounters=await fetch(`${API}/pokemon/${id}/encounters`).then(r=>r.ok?r.json():[])}catch{encounters=[]}}catch{}
  const g=genFor(id);
  const types=(pokemonData?.types||[]).map(t=>capitalize(t.type.name));const meta=[types.join(' / '),pokemonData?`${(pokemonData.height/10).toFixed(1)} m`:null,pokemonData?`${(pokemonData.weight/10).toFixed(1)} kg`:null].filter(Boolean);
  content.innerHTML=`<div class="poke-profile"><img src="${IMG(id)}" alt="${p.name}"><div><p class="eyebrow">#${String(id).padStart(4,'0')} • ${g.name} • ${g.region}</p><h2>${capitalize(p.name)}</h2><div class="poke-meta">${meta.map(x=>`<span>${x}</span>`).join('')}</div><p class="muted">${evolution.length>1?`Linha evolutiva: ${evolution.map(capitalize).join(' → ')}`:'Tudo desse Pokémon fica aqui: coleção, formas, shiny, jogos e HOME.'}</p></div></div><div class="detail-tabs"><button class="active" data-tab="living">● Living Dex</button><button data-tab="forms">◇ Form Dex</button><button data-tab="shiny">✦ Shiny Dex</button><button data-tab="games">⌖ Jogos / Regional</button><button data-tab="obtain">📍 Onde obter</button><button data-tab="home">⌂ HOME</button></div><div id="tabPanel"></div>`;
  const ctx={id,p,s,species,forms:forms.filter(Boolean),pokemonData,evolution,encounters};const show=tab=>{content.querySelectorAll('.detail-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));renderPokemonTab(ctx,tab)};content.querySelectorAll('.detail-tabs button').forEach(b=>b.onclick=()=>show(b.dataset.tab));show('living');
}

const VERSION_LABELS={red:'Red',blue:'Blue',yellow:'Yellow',gold:'Gold',silver:'Silver',crystal:'Crystal',ruby:'Ruby',sapphire:'Sapphire',emerald:'Emerald',firered:'FireRed',leafgreen:'LeafGreen',diamond:'Diamond',pearl:'Pearl',platinum:'Platinum',heartgold:'HeartGold',soulsilver:'SoulSilver',black:'Black',white:'White','black-2':'Black 2','white-2':'White 2',x:'X',y:'Y','omega-ruby':'Omega Ruby','alpha-sapphire':'Alpha Sapphire',sun:'Sun',moon:'Moon','ultra-sun':'Ultra Sun','ultra-moon':'Ultra Moon','lets-go-pikachu':"Let's Go Pikachu",'lets-go-eevee':"Let's Go Eevee",sword:'Sword',shield:'Shield','brilliant-diamond':'Brilliant Diamond','shining-pearl':'Shining Pearl','legends-arceus':'Legends: Arceus',scarlet:'Scarlet',violet:'Violet'};
const METHOD_LABELS={walk:'🌿 Grama / andando','old-rod':'🎣 Old Rod','good-rod':'🎣 Good Rod','super-rod':'🎣 Super Rod',surf:'🌊 Surf','rock-smash':'🪨 Rock Smash',headbutt:'🌳 Headbutt','dark-grass':'🌿 Grama escura','grass-spots':'🌿 Grama','cave-spots':'🕳️ Caverna','bridge-spots':'🌉 Ponte','super-rod-spots':'🎣 Super Rod','yellow-flowers':'🌼 Flores amarelas','purple-flowers':'🌸 Flores roxas','red-flowers':'🌺 Flores vermelhas','rough-terrain':'⛰️ Terreno',gift:'🎁 Presente','gift-egg':'🥚 Ovo presente','only-one':'⭐ Encontro especial','sos-encounter':'📣 SOS','bubbling-spots':'💧 Ponto borbulhante','roaming-grass':'🐾 Roaming'};
function prettySlug(v=''){return v.split('-').map(w=>w?capitalize(w):w).join(' ')}
function versionLabel(v){return VERSION_LABELS[v]||prettySlug(v)}
function locationLabel(v=''){return v.replace(/-area$/,'').replace(/^(kanto|johto|hoenn|sinnoh|unova|kalos|alola)-/,'').split('-').map(w=>capitalize(w)).join(' ')}
function encounterRows(encounters){const rows=[];for(const area of encounters||[])for(const vd of area.version_details||[]){const methods=new Map();for(const d of vd.encounter_details||[]){const m=d.method?.name||'special',cur=methods.get(m)||{min:999,max:0,chance:0,conditions:new Set()};cur.min=Math.min(cur.min,d.min_level??999);cur.max=Math.max(cur.max,d.max_level??0);cur.chance+=Number(d.chance||0);(d.condition_values||[]).forEach(c=>cur.conditions.add(prettySlug(c.name)));methods.set(m,cur)}for(const [method,d] of methods)rows.push({version:vd.version?.name||'unknown',location:area.location_area?.name||'unknown',method,min:d.min===999?null:d.min,max:d.max||null,chance:d.chance,conditions:[...d.conditions]})}return rows}
function renderObtainTab(ctx){
 const rows=encounterRows(ctx.encounters);
 if(!rows.length)return `<div class="obtain-empty"><div class="obtain-icon">📦</div><h3>Nenhum encontro selvagem listado</h3><p>A base não retornou uma localização selvagem para <strong>${capitalize(ctx.p.name)}</strong>. Isso não quer dizer automaticamente “só por transferência”: pode ser evolução, breeding, presente, troca, evento ou conteúdo ainda não catalogado.</p><div class="obtain-warning">⚠️ Eventos históricos e cadeias de transferência ainda não são completos nesta versão. O app prefere mostrar “não catalogado” a inventar uma origem.</div></div>`;
 const by=new Map();rows.forEach(r=>{if(!by.has(r.version))by.set(r.version,[]);by.get(r.version).push(r)});
 const blocks=[...by.entries()].sort((a,b)=>versionLabel(a[0]).localeCompare(versionLabel(b[0]))).map(([v,rs])=>`<details class="obtain-version" open><summary><strong>${versionLabel(v)}</strong><span>${rs.length} registro${rs.length===1?'':'s'}</span></summary><div class="obtain-rows">${rs.slice(0,100).map(r=>{const lv=r.min!=null?`Lv. ${r.min}${r.max&&r.max!==r.min?`–${r.max}`:''}`:'Nível variável',chance=r.chance?` • chance ${r.chance}%`:'';return `<div class="obtain-row"><div><strong>📍 ${locationLabel(r.location)}</strong><span>${METHOD_LABELS[r.method]||`🎯 ${prettySlug(r.method)}`} • ${lv}${chance}</span>${r.conditions.length?`<small>${r.conditions.join(' • ')}</small>`:''}</div></div>`}).join('')}</div></details>`).join('');
 return `<div class="obtain-head"><div><p class="eyebrow">ONDE OBTER</p><h3>Encontros conhecidos de ${capitalize(ctx.p.name)}</h3><p class="muted">Agrupados por versão, com método, nível e condições quando disponíveis.</p></div><span class="obtain-count">${rows.length} registros</span></div>${blocks}<div class="obtain-warning">ℹ️ A V7 cobre principalmente encontros catalogados pela PokéAPI. Distribuições/eventos, presentes especiais e transferências históricas podem estar ausentes.</div>`;
}

function renderPokemonTab(ctx,tab){
  const panel=document.getElementById('tabPanel'),{id,p,s,forms}=ctx;
  if(tab==='living')panel.innerHTML=`<div class="detail-card"><div><p class="eyebrow">LIVING DEX</p><h3>Tenho ${capitalize(p.name)} na coleção?</h3><p class="muted">Use isso para sua Living Dex global.</p></div><button class="mega-check ${s.caught?'checked':''}" id="toggleLiving">${s.caught?'✓ Sim, já tenho':'○ Ainda falta'}</button></div>`;
  if(tab==='shiny')panel.innerHTML=`<div class="detail-card shiny-card"><img class="detail-sprite" src="${SHINY_IMG(id)}" alt="Shiny ${p.name}"><div><p class="eyebrow">SHINY DEX</p><h3>Shiny ${capitalize(p.name)}</h3><p class="muted">Marque separado da Living Dex normal.</p></div><button class="mega-check ${s.shiny?'checked':''}" id="toggleShiny">${s.shiny?'✦ Shiny obtido!':'○ Ainda falta o shiny'}</button></div>`;
  if(tab==='obtain')panel.innerHTML=renderObtainTab(ctx);
  if(tab==='home')panel.innerHTML=`<div class="detail-card"><div><p class="eyebrow">POKÉMON HOME</p><h3>Já foi enviado ao HOME?</h3><p class="muted">Controle sua coleção central separadamente.</p></div><button class="mega-check ${s.home?'checked':''}" id="toggleHome">${s.home?'✓ Está no HOME':'○ Ainda não enviei'}</button></div>`;
  if(tab==='forms')panel.innerHTML=`<div><p class="muted">Marque cada forma ou variação que você já possui.</p><div class="form-list">${forms.length?forms.map(f=>{const key=f.name,img=f.sprites?.other?.home?.front_default||f.sprites?.front_default||IMG(id);return `<label class="form-item ${state.forms[key]?'checked':''}"><input class="formCheck" data-form="${key}" type="checkbox" ${state.forms[key]?'checked':''}><img src="${img}" alt=""><span><strong>${capitalize(f.name)}</strong><small>${state.forms[key]?'✓ Obtida':'Faltando'}</small></span></label>`}).join(''):'<div class="empty-state">Nenhuma forma extra encontrada para este Pokémon.</div>'}</div></div>`;
  if(tab==='games'){
    const relevant=games.filter(g=>id>=g.fallback[0]&&id<=g.fallback[1] || g.gen===genFor(id).id);
    panel.innerHTML=`<div><p class="muted">Marque em quais jogos você já obteve este Pokémon. A marcação é independente por jogo.</p><div class="game-status-list">${relevant.map(g=>{const gs=gameState(g.id,id);return `<button class="game-status ${gs.caught?'checked':''}" data-game-toggle="${g.id}"><span><strong>${g.name}</strong><small>Gen ${roman(g.gen)}</small></span><b>${gs.caught?'✓ Peguei':'○ Falta'}</b></button>`}).join('')}</div></div>`;
  }
  document.getElementById('toggleLiving')?.addEventListener('click',()=>{toggleManualCatch(id);persist();renderPokemonTab(ctx,'living');if(route.type!=='dashboard')renderGrid()});
  document.getElementById('toggleShiny')?.addEventListener('click',()=>{s.shiny=!s.shiny;persist();renderPokemonTab(ctx,'shiny');if(route.type!=='dashboard')renderGrid()});
  document.getElementById('toggleHome')?.addEventListener('click',()=>{s.home=!s.home;persist();renderPokemonTab(ctx,'home')});
  panel.querySelectorAll?.('.formCheck').forEach(i=>i.addEventListener('change',e=>{state.forms[i.dataset.form]=e.target.checked;persist();renderPokemonTab(ctx,'forms')}));
  panel.querySelectorAll?.('[data-game-toggle]').forEach(b=>b.onclick=()=>{const gs=gameState(b.dataset.gameToggle,id);gs.caught=!gs.caught;recomputeNationalCaught(id);if(gs.caught)recordEvent('pokemon',{id,game:b.dataset.gameToggle});else if(!gameProgress(b.dataset.gameToggle).complete)state.celebratedGames[b.dataset.gameToggle]=false;persist();renderPokemonTab(ctx,'games');if(route.type!=='dashboard')renderGrid();if(gs.caught)checkGameCompletion(b.dataset.gameToggle)});
}

function gameProgress(gameId){const g=games.find(x=>x.id===gameId),list=gameDexCache[gameId]||allPokemon.filter(p=>p.id>=g.fallback[0]&&p.id<=g.fallback[1]);const done=list.filter(p=>!!state.games?.[gameId]?.[p.id]?.caught).length;const complete=list.length>0&&done===list.length;return{done,total:list.length,complete}}
function checkGameCompletion(gameId){const pr=gameProgress(gameId);if(!pr.complete||state.celebratedGames[gameId])return;state.celebratedGames[gameId]=new Date().toISOString();recordEvent('game',{game:gameId});persist();showCelebration(gameId,pr.total)}
function showCelebration(gameId,total){const game=games.find(g=>g.id===gameId),dlg=document.getElementById('celebrationDialog');document.getElementById('celebrationContent').innerHTML=`<div class="celebration-wrap"><div class="trophy">🏆</div><p class="eyebrow">100% COMPLETA</p><h2>PARABÉNS! 🎉</h2><p>Você completou a Pokédex de <strong>${game.name}</strong> com <strong>${total}/${total}</strong> Pokémon!</p><div class="confetti-line">✦ ● ★ ✦ ● ★ ✦</div><div class="celebration-actions"><button class="primary-action" id="shareGameX">Compartilhar no X</button><button class="secondary-action" id="copyGamePost">Copiar texto</button><button class="secondary-action" id="downloadGameCard">Baixar card PNG</button></div></div>`;dlg.showModal();document.getElementById('shareGameX').onclick=()=>openXPost(gameCompletionText(game,total));document.getElementById('copyGamePost').onclick=()=>copyShareText(gameCompletionText(game,total));document.getElementById('downloadGameCard').onclick=()=>downloadShareCard(game,total)}

function downloadShareCard(game,total){
  const c=document.createElement('canvas');c.width=1200;c.height=630;const x=c.getContext('2d');
  const grad=x.createLinearGradient(0,0,1200,630);grad.addColorStop(0,'#111827');grad.addColorStop(1,'#202a42');x.fillStyle=grad;x.fillRect(0,0,1200,630);
  x.fillStyle='#ef4d5f';x.beginPath();x.arc(1030,145,85,0,Math.PI*2);x.fill();x.fillStyle='#111827';x.beginPath();x.arc(1030,145,55,0,Math.PI*2);x.fill();x.fillStyle='#ffffff';x.font='700 36px system-ui';x.fillText('MY POKÉDEX',70,90);x.font='900 68px system-ui';x.fillText('🏆 Pokédex Completa!',70,210);x.font='700 42px system-ui';x.fillText(game.name,70,285);x.fillStyle='#b8c1d2';x.font='500 28px system-ui';x.fillText('Sua jornada chegou a 100%.',70,340);x.fillStyle='#ffffff';x.font='900 74px system-ui';x.fillText(`${total} / ${total}`,70,455);x.fillStyle='#29b47d';x.font='800 34px system-ui';x.fillText('100% CONCLUÍDA',70,510);x.fillStyle='#9ca7bd';x.font='500 24px system-ui';x.fillText('#Pokemon  #Pokedex',70,570);
  const a=document.createElement('a');a.download=`pokedex-${game.id}-completa.png`;a.href=c.toDataURL('image/png');a.click();
}

function gameCompletionText(game,total){return `🏆 Pokédex completa! Consegui registrar todos os ${total} Pokémon de ${game.name}!\n\nMais uma Dex 100% concluída ✨ #Pokemon #Pokedex`}
function pokemonShareText(id){const p=allPokemon.find(x=>x.id===id),where=route.type==='game'?` em ${games.find(g=>g.id===route.game)?.name}`:'';return `✅ Peguei ${capitalize(p?.name)} (#${String(id).padStart(4,'0')})${where}!\n\nMais um pra Pokédex ✨ #Pokemon #Pokedex`}
function openXPost(text){window.open(`https://x.com/intent/post?text=${encodeURIComponent(text)}`,'_blank','noopener,noreferrer')}
function sharePokemon(id){openXPost(pokemonShareText(id))}
async function copyShareText(text){try{await navigator.clipboard.writeText(text);alert('Texto copiado! ✨')}catch{prompt('Copie o texto:',text)}}

function normalizedState(raw){
  const source=raw?.state||raw;
  if(!source||typeof source!=='object'||Array.isArray(source))throw new Error('Formato de backup inválido.');
  const out={pokemon:{},forms:{},games:{},celebratedGames:{},timeline:[]};
  if(source.pokemon&&typeof source.pokemon==='object')out.pokemon=source.pokemon;
  if(source.forms&&typeof source.forms==='object')out.forms=source.forms;
  if(source.games&&typeof source.games==='object')out.games=source.games;
  if(source.celebratedGames&&typeof source.celebratedGames==='object')out.celebratedGames=source.celebratedGames;
  if(Array.isArray(source.timeline))out.timeline=source.timeline.slice(0,80);
  return out;
}
function exportBackup(){
  const payload={app:'My Pokédex Tracker',version:6.1,exportedAt:new Date().toISOString(),state};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download=`my-pokedex-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),500);
}
function importBackup(e){
  const file=e.target.files[0];if(!file)return;
  const r=new FileReader();
  r.onload=()=>{try{
    const parsed=JSON.parse(r.result);
    const imported=normalizedState(parsed);
    const pokemonCount=Object.keys(imported.pokemon).length;
    const gameCount=Object.keys(imported.games).length;
    if(!confirm(`Importar este backup?\n\nPokémon com dados: ${pokemonCount}\nJogos com progresso: ${gameCount}\n\nSeu progresso atual será substituído.`))return;
    state=imported;migrateCatchSources();persist();renderDashboard();if(route.type!=='dashboard')renderGrid();alert('Backup importado com sucesso! ✨');
  }catch(err){console.error(err);alert('Esse arquivo não parece ser um backup válido da Pokédex.')}};
  r.readAsText(file);e.target.value='';
}

function resetFullSave(){
  const first=confirm('Zerar TODO o seu save da My Pokédex?\n\nIsso apagará:\n• National / Living Dex\n• progresso de todos os jogos\n• Form Dex\n• Shinies\n• Pokémon HOME\n• conquistas e timeline\n\nEssa ação não pode ser desfeita sem um backup.');
  if(!first)return;
  const second=confirm('Última confirmação: deseja realmente apagar todo o progresso?\n\nDica: exporte um backup antes se quiser guardar uma cópia.');
  if(!second)return;
  localStorage.removeItem(STORAGE);
  state={pokemon:{},forms:{},games:{},celebratedGames:{},timeline:[]};
  route={type:'dashboard',gen:null,game:null};
  search='';statusFilter='all';
  document.getElementById('searchInput').value='';
  document.querySelectorAll('#statusFilter button').forEach(x=>x.classList.toggle('active',x.dataset.status==='all'));
  document.getElementById('pokemonDialog')?.close();
  document.getElementById('celebrationDialog')?.close();
  persist();buildGenerationNav();navigate({type:'dashboard'});
  alert('Save zerado. Sua Pokédex começou do zero novamente. 🌱');
}

let deferredInstallPrompt=null;
function setupInstallPrompt(){
  const btn=document.getElementById('installBtn');
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;btn?.classList.remove('hidden')});
  btn?.addEventListener('click',async()=>{if(!deferredInstallPrompt)return;deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;btn.classList.add('hidden')});
  window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;btn?.classList.add('hidden')});
}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(err=>console.warn('Service worker:',err)))}
boot();
