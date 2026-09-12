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

const VERSION_EXCLUSIVES={"red-green-blue":{"Red":[23,24,43,44,45,56,57,58,59,123,125],"Blue":[27,28,37,38,52,53,69,70,71,126,127]},"gold-silver":{"Gold":[56,57,58,59,167,168,207,216,217,226],"Silver":[37,38,52,53,165,166,225,227]},"ruby-sapphire":{"Ruby":[273,274,275,303,335,338,383],"Sapphire":[270,271,272,302,336,337,382]},"firered-leafgreen":{"FireRed":[23,24,43,44,45,54,55,58,59,123,125],"LeafGreen":[27,28,37,38,69,70,71,79,80,126,127]},"diamond-pearl":{"Diamond":[86,87,123,198,246,247,248,261,262,304,305,306,352,408,409,434,435,483],"Pearl":[79,80,127,200,228,229,234,371,372,373,410,411,431,432,484]},"heartgold-soulsilver":{"HeartGold":[56,57,58,59,167,168,207,231,232,302,343,344,380],"SoulSilver":[37,38,52,53,165,166,225,226,303,316,317,382]},"black-white":{"Black":[13,14,15,198,228,229,285,286,311,430,546,547,559,560,574,575,576,629,630,641,643],"White":[10,11,12,46,47,200,261,262,312,429,548,549,577,578,579,627,628,642,644]},"x-y":{"X":[120,121,127,228,229,261,262,304,305,306,345,346,347,348,539,684,685,692,693,716],"Y":[90,91,214,246,247,248,309,310,509,510,538,682,683,690,691,717]},"omega-ruby-alpha-sapphire":{"Omega Ruby":[273,274,275,303,335,338,383,539,566,567,692,693],"Alpha Sapphire":[270,271,272,302,336,337,382,538,564,565,690,691]},"sun-moon":{"Sun":[37,38,408,409,546,547,627,628,766,776,791,794,795,798],"Moon":[27,28,410,411,548,549,629,630,765,780,792,793,796,797]},"ultra-sun-ultra-moon":{"Ultra Sun":[37,38,408,409,546,547,627,628,766,776,791,794,795,798,806],"Ultra Moon":[27,28,410,411,548,549,629,630,765,780,792,793,796,797,805]},"sword-shield":{"Sword":[273,274,275,303,338,539,559,560,574,575,576,627,628,633,634,635,684,685,766,776,782,783,784,865,874,888],"Shield":[270,271,272,302,337,538,577,578,579,629,630,704,705,706,765,780,875,876,889]},"brilliant-diamond-shining-pearl":{"Brilliant Diamond":[10,11,12,23,24,58,59,86,87,123,198,207,246,247,248,261,262,273,274,275,303,335,338,352,408,409,434,435,483],"Shining Pearl":[13,14,15,27,28,37,38,79,80,127,200,216,217,228,229,234,270,271,272,302,336,337,410,411,431,432,484]},"scarlet-violet":{"Scarlet":[246,247,248,425,426,434,435,633,634,635,765,874,936,984,985,986,987,988,989,1005,1007],"Violet":[200,316,317,371,372,373,692,693,766,875,877,937,990,991,992,993,994,995,1006,1008]}};
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
const LAST_ROUTE_KEY='my-pokedex-last-route-v1';
function loadLastRoute(){
  try{
    const r=JSON.parse(localStorage.getItem(LAST_ROUTE_KEY)||'null');
    if(!r||!['dashboard','national','home','game'].includes(r.type))return {type:'dashboard',gen:null,game:null};
    if(r.type==='game'&&!games.some(g=>g.id===r.game))return {type:'dashboard',gen:null,game:null};
    return r;
  }catch{return {type:'dashboard',gen:null,game:null}}
}
function saveLastRoute(r){try{localStorage.setItem(LAST_ROUTE_KEY,JSON.stringify(r))}catch{}}
let route=loadLastRoute();
let homeSelection=new Set();
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
    buildGenerationNav();
    await navigate(route);
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
  document.getElementById('markAllHomeBtn').onclick=markAllHome; document.getElementById('unmarkAllHomeBtn').onclick=unmarkAllHome;
  document.getElementById('selectAllVisibleHome').onchange=e=>toggleSelectAllVisibleHome(e.target.checked);
  document.getElementById('selectMissingHomeBtn').onclick=selectMissingVisibleHome;
  document.getElementById('clearHomeSelectionBtn').onclick=clearHomeSelection;
  document.getElementById('sendSelectedHomeBtn').onclick=()=>applySelectedHome(true);
  document.getElementById('removeSelectedHomeBtn').onclick=()=>applySelectedHome(false);
  setupInstallPrompt();
}

function buildGenerationNav(){
  const el=document.getElementById('generationNav');
  el.innerHTML=gens.map(g=>`<section class="gen-nav-group" data-gen-group="${g.id}"><button class="gen-nav-head" data-gen="${g.id}"><span><strong>${g.name}</strong><small>${g.region}</small></span><span class="chev">⌄</span></button><div class="gen-games">${games.filter(x=>x.gen===g.id).map(x=>`<button class="game-nav" data-game="${x.id}" data-gen="${g.id}">${x.name}</button>`).join('')}</div></section>`).join('');
  el.querySelectorAll('.gen-nav-head').forEach(b=>b.onclick=()=>{const grp=b.closest('.gen-nav-group');const opening=!grp.classList.contains('open');el.querySelectorAll('.gen-nav-group').forEach(x=>x.classList.remove('open'));grp.classList.toggle('open',opening)});
  el.querySelectorAll('.game-nav[data-game]').forEach(b=>b.onclick=e=>{e.stopPropagation();navigate({type:'game',gen:Number(b.dataset.gen),game:b.dataset.game})});
}

async function navigate(next){
  if(route?.type==='home'&&next.type!=='home')homeSelection.clear();route=next;saveLastRoute(route); search='';document.getElementById('searchInput').value='';statusFilter='all';document.querySelectorAll('#statusFilter button').forEach(x=>x.classList.toggle('active',x.dataset.status==='all'));const caughtFilter=document.querySelector('#statusFilter [data-status="caught"]');if(caughtFilter)caughtFilter.textContent=next.type==='home'?'No HOME':'Peguei';
  document.getElementById('dashboardView').classList.toggle('active-view',next.type==='dashboard');
  document.getElementById('dexView').classList.toggle('active-view',next.type!=='dashboard');
  document.querySelectorAll('.main-nav .nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.route===next.type));
  document.querySelectorAll('.game-nav,.gen-nav-head').forEach(b=>b.classList.remove('active'));
  updateBulkCatchButton();updateHomeSelectionBar();
  if(next.type==='dashboard'){setHeading('PROGRESSO GERAL','Dashboard','');renderDashboard();return}
  if(next.type==='national'){setHeading('NATIONAL DEX','National Dex','Todos os Pokémon em uma única lista.');currentList=allPokemon;renderContext();renderGrid();return}
  if(next.type==='home'){setHeading('POKÉMON HOME','Coleção no HOME','Marque exatamente quais Pokémon você já enviou ao Pokémon HOME.');currentList=allPokemon;renderContext();renderGrid();return}
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

function exclusiveInfo(gameId,id){const g=VERSION_EXCLUSIVES[gameId];if(!g)return null;for(const [version,ids] of Object.entries(g))if(ids.includes(Number(id)))return {version};return null}
function exclusiveBadge(gameId,id){const x=exclusiveInfo(gameId,id);return x?`<span class="version-exclusive">🔒 Exclusivo de ${x.version}</span>`:''}



function filterPokemonList(list){
  return list.filter(p=>{
    const s=pstate(p.id);
    const caught=route.type==='game'?gameState(route.game,p.id).caught:route.type==='home'?s.home:s.caught;
    if(search && !p.name.includes(search) && !String(p.id).includes(search))return false;
    if(statusFilter==='missing'&&caught)return false;
    if(statusFilter==='caught'&&!caught)return false;
    if(statusFilter==='shiny'&&!s.shiny)return false;
    if(statusFilter==='exclusive'&&!(route.type==='game'&&exclusiveInfo(route.game,p.id)))return false;
    return true;
  });
}
function bindPokemonGrid(grid){
  grid.querySelectorAll('.pokemon-card').forEach(card=>{
    const id=Number(card.dataset.id);
    card.querySelector('.pokemon-main')?.addEventListener('click',()=>openPokemon(id));
    card.querySelector('[data-quick-catch]')?.addEventListener('click',e=>{e.stopPropagation();toggleQuickCatch(id)});
    card.querySelector('[data-home-select]')?.addEventListener('change',e=>{e.stopPropagation();toggleHomeSelection(Number(card.dataset.id),e.target.checked)});
    card.querySelector('.home-select-box')?.addEventListener('click',e=>e.stopPropagation());
    card.querySelector('[data-share-pokemon]')?.addEventListener('click',e=>{e.stopPropagation();sharePokemon(id)});
  });
}

function filteredBase(){return filterPokemonList(currentList)}
function renderGrid(){
  const grid=document.getElementById('pokemonGrid'),list=filteredBase();document.getElementById('loading').style.display='none';
  grid.classList.toggle('box-mode',viewMode==='boxes');
  grid.innerHTML=list.map(cardHTML).join('')||'<div class="empty-state">Nenhum Pokémon encontrado com esses filtros.</div>';
  bindPokemonGrid(grid);
  updateSummary();
  updateBulkCatchButton();
}
function cardHTML(p){
  const s=pstate(p.id), gameCaught=route.type==='game'?gameState(route.game,p.id).caught:null, caught=route.type==='game'?gameCaught:route.type==='home'?s.home:s.caught;
  const no=p.regionalNo?String(p.regionalNo).padStart(3,'0'):String(p.id).padStart(4,'0');
  const sourceNote=route.type!=='game'&&caught&&!s.manualCaught&&anyGameCaught(p.id)?'Via jogo':'';
  const actionLabel=route.type==='home'?(s.home?'✓ Está no HOME':'○ Mandar para o HOME'):(caught?'✓ Peguei!':'○ Marcar como pego');
  const shareButton=route.type!=='home'&&caught?'<button class="share-mini" data-share-pokemon title="Compartilhar no X">↗ X</button>':'';
  return `<article class="pokemon-card ${caught?'caught':''} ${route.type==='home'&&s.home?'home-card':''} ${route.type==='home'&&homeSelection.has(p.id)?'selected-for-home':''}" data-id="${p.id}">${route.type==='home'?`<label class="home-select-box" title="Selecionar para ação em lote"><input type="checkbox" data-home-select ${homeSelection.has(p.id)?'checked':''}><span></span></label>`:''}<button class="pokemon-main" aria-label="Abrir ${capitalize(p.name)}"><span class="num">#${no}</span>${caught?'<span class="caught-stamp">✓</span>':''}<img loading="lazy" src="${IMG(p.id)}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png'" alt="${p.name}"><h4>${capitalize(p.name)}</h4>${sourceNote?`<small class="source-note">${sourceNote}</small>`:''}${route.type==='game'?exclusiveBadge(route.game,p.id):''}<div class="mini-status"><span class="${s.caught?'on':''}" title="Living Dex">●</span><span class="${s.shiny?'on shiny':''}" title="Shiny">✦</span><span class="${s.home?'on home':''}" title="HOME">⌂</span></div></button><div class="card-actions"><button class="catch-check ${caught?'is-checked':''} ${route.type==='home'?'home-check':''}" data-quick-catch>${actionLabel}</button>${shareButton}</div></article>`;
}

function updateBulkCatchButton(){
  const gameWrap=document.getElementById('gameBulkActions'),markBtn=document.getElementById('markAllGameBtn'),unmarkBtn=document.getElementById('unmarkAllGameBtn');
  const homeWrap=document.getElementById('homeBulkActions'),homeMark=document.getElementById('markAllHomeBtn'),homeUnmark=document.getElementById('unmarkAllHomeBtn');

  const isGame=route.type==='game',isHome=route.type==='home';
  gameWrap?.classList.toggle('hidden',!isGame);
  homeWrap?.classList.toggle('hidden',!isHome);

  if(isGame&&markBtn&&unmarkBtn){
    const total=currentList.length,done=currentList.filter(p=>gameState(route.game,p.id).caught).length;
    const complete=total>0&&done===total;
    markBtn.disabled=complete;
    markBtn.classList.toggle('complete',complete);
    markBtn.textContent=complete?'✓ Todos já foram pegos!':`✓ Marcar todos como pegos (${total-done})`;
    unmarkBtn.disabled=done===0;
    unmarkBtn.textContent=done===0?'↺ Nenhum marcado':`↺ Desmarcar todos (${done})`;
  }

  if(isHome&&homeMark&&homeUnmark){
    const total=currentList.length,done=currentList.filter(p=>pstate(p.id).home).length;
    const complete=total>0&&done===total;
    homeMark.disabled=complete;
    homeMark.classList.toggle('complete',complete);
    homeMark.textContent=complete?'⌂ Todos já estão no HOME!':`⌂ Mandar todos para o HOME (${total-done})`;
    homeUnmark.disabled=done===0;
    homeUnmark.textContent=done===0?'↺ Nenhum no HOME':`↺ Tirar todos do HOME (${done})`;
  }
}



function getVisibleHomePokemon(){
  const q=search.trim().toLowerCase();
  return currentList.filter(p=>{
    const s=pstate(p.id);
    if(q && !(p.name.includes(q)||String(p.id).includes(q))) return false;
    if(statusFilter==='missing' && s.home) return false;
    if(statusFilter==='caught' && !s.home) return false;
    if(statusFilter==='shiny' && !s.shiny) return false;
    return true;
  });
}
function updateHomeSelectionBar(){
  const bar=document.getElementById('homeSelectionBar');
  const count=document.getElementById('homeSelectionCount');
  const master=document.getElementById('selectAllVisibleHome');
  const send=document.getElementById('sendSelectedHomeBtn');
  const remove=document.getElementById('removeSelectedHomeBtn');
  const isHome=route.type==='home';
  bar?.classList.toggle('hidden',!isHome);
  if(!isHome)return;

  const visible=getVisibleHomePokemon();
  const selectedVisible=visible.filter(p=>homeSelection.has(p.id));
  if(count) count.textContent=`${homeSelection.size} selecionado${homeSelection.size===1?'':'s'}`;
  if(master){
    master.checked=visible.length>0 && selectedVisible.length===visible.length;
    master.indeterminate=selectedVisible.length>0 && selectedVisible.length<visible.length;
  }
  if(send) send.disabled=homeSelection.size===0;
  if(remove) remove.disabled=homeSelection.size===0;
}
function toggleHomeSelection(id,checked){
  if(checked) homeSelection.add(id); else homeSelection.delete(id);
  updateHomeSelectionBar();
}
function toggleSelectAllVisibleHome(checked){
  const visible=getVisibleHomePokemon();
  visible.forEach(p=>checked?homeSelection.add(p.id):homeSelection.delete(p.id));
  renderGrid();
}
function selectMissingVisibleHome(){
  const visible=getVisibleHomePokemon();
  visible.filter(p=>!pstate(p.id).home).forEach(p=>homeSelection.add(p.id));
  renderGrid();
}
function clearHomeSelection(){
  homeSelection.clear();
  renderGrid();
}
function applySelectedHome(value){
  const ids=[...homeSelection];
  if(!ids.length)return;
  const verb=value?'mandar':'tirar';
  const prep=value?'para o':'do';
  if(!confirm(`Tem certeza que deseja ${verb} ${ids.length} Pokémon selecionado${ids.length===1?'':'s'} ${prep} HOME?`))return;
  ids.forEach(id=>{pstate(id).home=value});
  recordEvent(value?'home-selection-add':'home-selection-remove',{count:ids.length});
  persist();
  homeSelection.clear();
  renderGrid();
}
function dedupePokemonList(list){
  const m=new Map();
  (list||[]).forEach(p=>{if(!m.has(p.id))m.set(p.id,p)});
  return [...m.values()];
}

function markAllHome(){
  if(route.type!=='home'||!currentList.length)return;
  const missing=currentList.filter(p=>!pstate(p.id).home);
  if(!missing.length)return;
  if(!confirm(`Mandar os ${missing.length} Pokémon restantes para o HOME?\n\nIsso marcará todos os Pokémon desta lista como presentes no Pokémon HOME.`))return;
  missing.forEach(p=>{pstate(p.id).home=true});
  recordEvent('home-bulk',{count:missing.length});
  persist();renderGrid();
}
function unmarkAllHome(){
  if(route.type!=='home'||!currentList.length)return;
  const marked=currentList.filter(p=>pstate(p.id).home);
  if(!marked.length)return;
  if(!confirm(`Tirar os ${marked.length} Pokémon marcados do HOME?\n\nIsso altera somente o status HOME. Sua National/Living Dex e o progresso dos jogos não serão apagados.`))return;
  marked.forEach(p=>{pstate(p.id).home=false});
  recordEvent('home-bulk-remove',{count:marked.length});
  persist();renderGrid();
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
  }else if(route.type==='home'){
    const s=pstate(id);s.home=!s.home;persist();renderGrid();
  }else{toggleManualCatch(id);persist();renderGrid()}
}
function updateSummary(){
  const base=currentList;
  const done=route.type==='game'?base.filter(p=>gameState(route.game,p.id).caught).length:route.type==='home'?base.filter(p=>pstate(p.id).home).length:base.filter(p=>pstate(p.id).caught).length;
  const total=base.length,pct=total?done/total*100:0;
  const label=route.type==='national'?'National Dex':route.type==='home'?'Pokémon HOME':games.find(g=>g.id===route.game)?.name||'Dex';
  document.getElementById('dexLabel').textContent=label;
  document.getElementById('dexSummary').textContent=`${done} / ${total}`;
  document.getElementById('dexRemaining').textContent=route.type==='home'?(done===total&&total?'Tudo no HOME! ⌂':`${Math.max(0,total-done)} fora do HOME`):(done===total&&total?'Completa! 🏆':`${Math.max(0,total-done)} faltando`);
  document.getElementById('dexBar').style.width=`${pct}%`;
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



const EVO_ITEM_LABELS={
'fire-stone':'Pedra de Fogo','water-stone':'Pedra da Água','thunder-stone':'Pedra do Trovão',
'leaf-stone':'Pedra da Folha','moon-stone':'Pedra da Lua','sun-stone':'Pedra do Sol',
'shiny-stone':'Pedra Brilhante','dusk-stone':'Pedra do Anoitecer','dawn-stone':'Pedra do Amanhecer',
'ice-stone':'Pedra de Gelo','kings-rock':"King's Rock",'metal-coat':'Metal Coat','dragon-scale':'Dragon Scale',
'up-grade':'Up-Grade','dubious-disc':'Dubious Disc','protector':'Protector','electirizer':'Electirizer',
'magmarizer':'Magmarizer','reaper-cloth':'Reaper Cloth','razor-claw':'Razor Claw','razor-fang':'Razor Fang',
'prism-scale':'Prism Scale','sachet':'Sachet','whipped-dream':'Whipped Dream','oval-stone':'Oval Stone',
'linking-cord':'Linking Cord','sweet-apple':'Sweet Apple','tart-apple':'Tart Apple',
'cracked-pot':'Cracked Pot','chipped-pot':'Chipped Pot'
};
function evoItem(v){return EVO_ITEM_LABELS[v]||prettySlug(v||'item')}
function evoMethod(detail={}){
  const t=detail.trigger?.name||'';
  const parts=[];
  let main='';
  if(t==='trade') main=detail.held_item?`Troca segurando ${evoItem(detail.held_item.name)}`:'Troca';
  else if(t==='use-item') main=`Usar ${evoItem(detail.item?.name)}`;
  else if(t==='level-up') main=detail.min_level!=null?`Subir para o nível ${detail.min_level}`:'Subir de nível';
  else if(t==='shed') main='Ao evoluir Nincada com espaço na equipe e Poké Ball';
  else if(t==='spin') main='Girar o personagem após cumprir a condição';
  else if(t==='three-critical-hits') main='Conseguir 3 golpes críticos em uma batalha';
  else if(t==='take-damage') main='Receber dano e cumprir a condição especial';
  else main=prettySlug(t||'condição especial');

  if(detail.held_item && t!=='trade')parts.push(`segurando ${evoItem(detail.held_item.name)}`);
  if(detail.min_happiness!=null)parts.push(`amizade ≥ ${detail.min_happiness}`);
  if(detail.min_affection!=null)parts.push(`afeição ≥ ${detail.min_affection}`);
  if(detail.min_beauty!=null)parts.push(`beleza ≥ ${detail.min_beauty}`);
  if(detail.time_of_day)parts.push(detail.time_of_day==='day'?'durante o dia':detail.time_of_day==='night'?'durante a noite':prettySlug(detail.time_of_day));
  if(detail.known_move?.name)parts.push(`conhecendo ${prettySlug(detail.known_move.name)}`);
  if(detail.known_move_type?.name)parts.push(`conhecendo golpe do tipo ${capitalize(detail.known_move_type.name)}`);
  if(detail.location?.name)parts.push(`em ${locationLabel(detail.location.name)}`);
  if(detail.needs_overworld_rain)parts.push('com chuva no mundo');
  if(detail.turn_upside_down)parts.push('com o console de cabeça para baixo');
  if(detail.gender===1)parts.push('fêmea');
  if(detail.gender===2)parts.push('macho');
  if(detail.relative_physical_stats===1)parts.push('Ataque > Defesa');
  if(detail.relative_physical_stats===0)parts.push('Ataque = Defesa');
  if(detail.relative_physical_stats===-1)parts.push('Ataque < Defesa');
  if(detail.party_species?.name)parts.push(`com ${capitalize(detail.party_species.name)} na equipe`);
  if(detail.party_type?.name)parts.push(`com Pokémon do tipo ${capitalize(detail.party_type.name)} na equipe`);
  if(detail.trade_species?.name)parts.push(`trocado por ${capitalize(detail.trade_species.name)}`);
  return main+(parts.length?` • ${parts.join(' • ')}`:'');
}
function evolutionEdgesFromChain(chain){
  const edges=[];
  const walk=node=>{
    for(const child of node?.evolves_to||[]){
      const details=(child.evolution_details||[]);
      edges.push({from:node.species?.name,to:child.species?.name,methods:details.length?details.map(evoMethod):['Condição especial']});
      walk(child);
    }
  };
  walk(chain?.chain);return edges;
}
function renderEvolutionTab(ctx){
  const edges=ctx.evolutionEdges||[];
  const related=edges.filter(e=>e.from===ctx.p.name||e.to===ctx.p.name);
  if(!related.length)return `<div class="evo-empty"><div class="obtain-icon">🧬</div><h3>Sem evolução direta</h3><p>${capitalize(ctx.p.name)} não possui uma evolução anterior/próxima catalogada nesta cadeia, ou é uma forma especial.</p></div>`;
  return `<div class="evo-head"><p class="eyebrow">EVOLUÇÃO</p><h3>Como ${capitalize(ctx.p.name)} evolui</h3><p class="muted">Mostra nível, troca, item, pedra e condições especiais conforme a cadeia da PokéAPI.</p></div><div class="evo-list">${related.map(e=>`<div class="evo-step"><div class="evo-species"><strong>${capitalize(e.from)}</strong><span>→</span><strong>${capitalize(e.to)}</strong></div>${e.methods.map(m=>`<div class="evo-method">🧬 ${m}</div>`).join('')}</div>`).join('')}</div>`;
}

async function openPokemon(id){
  const dlg=document.getElementById('pokemonDialog'),content=document.getElementById('dialogContent'),p=allPokemon.find(x=>x.id===id),s=pstate(id);content.innerHTML='<p class="muted">Carregando detalhes…</p>';dlg.showModal();
  let species=null,forms=[],pokemonData=null,evolution=[],evolutionEdges=[],encounters=[];try{species=await fetch(`${API}/pokemon-species/${id}`).then(r=>r.json());pokemonData=await fetch(`${API}/pokemon/${id}`).then(r=>r.json());forms=await Promise.all((species.varieties||[]).slice(0,30).map(async v=>{try{return await fetch(v.pokemon.url).then(r=>r.json())}catch{return null}}));if(species?.evolution_chain?.url){const chain=await fetch(species.evolution_chain.url).then(r=>r.json());const walk=n=>{if(!n)return;evolution.push(n.species?.name);(n.evolves_to||[]).forEach(walk)};walk(chain.chain);evolutionEdges=evolutionEdgesFromChain(chain)}try{encounters=await fetch(`${API}/pokemon/${id}/encounters`).then(r=>r.ok?r.json():[])}catch{encounters=[]}}catch{}
  const g=genFor(id);
  const types=(pokemonData?.types||[]).map(t=>capitalize(t.type.name));const meta=[types.join(' / '),pokemonData?`${(pokemonData.height/10).toFixed(1)} m`:null,pokemonData?`${(pokemonData.weight/10).toFixed(1)} kg`:null].filter(Boolean);
  content.innerHTML=`<div class="poke-profile"><img src="${IMG(id)}" alt="${p.name}"><div><p class="eyebrow">#${String(id).padStart(4,'0')} • ${g.name} • ${g.region}</p><h2>${capitalize(p.name)}</h2><div class="poke-meta">${meta.map(x=>`<span>${x}</span>`).join('')}</div><p class="muted">${evolution.length>1?`Linha evolutiva: ${evolution.map(capitalize).join(' → ')}`:'Tudo desse Pokémon fica aqui: coleção, formas, shiny, jogos e HOME.'}</p></div></div><div class="detail-tabs"><button class="active" data-tab="living">● Living Dex</button><button data-tab="forms">◇ Form Dex</button><button data-tab="shiny">✦ Shiny Dex</button><button data-tab="games">⌖ Jogos / Regional</button><button data-tab="evolution">🧬 Evolução</button><button data-tab="obtain">📍 Onde obter</button><button data-tab="home">⌂ HOME</button></div><div id="tabPanel"></div>`;
  const ctx={id,p,s,species,forms:forms.filter(Boolean),pokemonData,evolution,evolutionEdges,encounters};const show=tab=>{content.querySelectorAll('.detail-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));renderPokemonTab(ctx,tab)};content.querySelectorAll('.detail-tabs button').forEach(b=>b.onclick=()=>show(b.dataset.tab));show('living');
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
  if(tab==='evolution')panel.innerHTML=renderEvolutionTab(ctx);
  if(tab==='obtain')panel.innerHTML=renderObtainTab(ctx);
  if(tab==='home')panel.innerHTML=`<div class="detail-card"><div><p class="eyebrow">POKÉMON HOME</p><h3>Já foi enviado ao HOME?</h3><p class="muted">Controle sua coleção central separadamente.</p></div><button class="mega-check ${s.home?'checked':''}" id="toggleHome">${s.home?'✓ Está no HOME':'○ Ainda não enviei'}</button></div>`;
  if(tab==='forms')panel.innerHTML=`<div><p class="muted">Marque cada forma ou variação que você já possui.</p><div class="form-list">${forms.length?forms.map(f=>{const key=f.name,img=f.sprites?.other?.home?.front_default||f.sprites?.front_default||IMG(id);return `<label class="form-item ${state.forms[key]?'checked':''}"><input class="formCheck" data-form="${key}" type="checkbox" ${state.forms[key]?'checked':''}><img src="${img}" alt=""><span><strong>${capitalize(f.name)}</strong><small>${state.forms[key]?'✓ Obtida':'Faltando'}</small></span></label>`}).join(''):'<div class="empty-state">Nenhuma forma extra encontrada para este Pokémon.</div>'}</div></div>`;
  if(tab==='games'){
    const relevant=games.filter(g=>id>=g.fallback[0]&&id<=g.fallback[1] || g.gen===genFor(id).id);
    panel.innerHTML=`<div><p class="muted">Marque em quais jogos você já obteve este Pokémon. A marcação é independente por jogo.</p><div class="game-status-list">${relevant.map(g=>{const gs=gameState(g.id,id),ex=exclusiveInfo(g.id,id);return `<button class="game-status ${gs.caught?'checked':''}" data-game-toggle="${g.id}"><span><strong>${g.name}</strong><small>Gen ${roman(g.gen)}${ex?` • 🔒 Exclusivo de ${ex.version}`:''}</small></span><b>${gs.caught?'✓ Peguei':'○ Falta'}</b></button>`}).join('')}</div></div>`;
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
  localStorage.removeItem(LAST_ROUTE_KEY);
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
