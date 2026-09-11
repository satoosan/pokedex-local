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
let statusFilter='all', search='';
const gameDexCache={};
const dexDataCache={};

function loadState(){
  try{const s=JSON.parse(localStorage.getItem(STORAGE))||{};s.pokemon||={};s.forms||={};s.games||={};s.celebratedGames||={};return s}
  catch{return {pokemon:{},forms:{},games:{},celebratedGames:{}}}
}
function persist(){localStorage.setItem(STORAGE,JSON.stringify(state));renderStats()}
function pstate(id){return state.pokemon[id]||(state.pokemon[id]={seen:false,caught:false,shiny:false,home:false})}
function gameState(gameId,id){state.games[gameId]||={};return state.games[gameId][id]||(state.games[gameId][id]={caught:false})}
function markNationalCaught(id){const s=pstate(id);s.caught=true;s.seen=true}
function syncGameCatchesToNational(){let changed=false;Object.values(state.games||{}).forEach(game=>{Object.entries(game||{}).forEach(([id,data])=>{if(data?.caught){const s=pstate(Number(id));if(!s.caught||!s.seen){s.caught=true;s.seen=true;changed=true}}})});if(changed)localStorage.setItem(STORAGE,JSON.stringify(state))}
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
    syncGameCatchesToNational();
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
  document.getElementById('exportBtn').onclick=exportBackup; document.getElementById('importInput').onchange=importBackup;
  document.getElementById('closeDialog').onclick=()=>document.getElementById('pokemonDialog').close();
  document.getElementById('closeCelebration').onclick=()=>document.getElementById('celebrationDialog').close();
  document.getElementById('markAllGameBtn').onclick=markAllGameCaught;
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
  return `<article class="pokemon-card ${caught?'caught':''}" data-id="${p.id}"><button class="pokemon-main" aria-label="Abrir ${capitalize(p.name)}"><span class="num">#${no}</span>${caught?'<span class="caught-stamp">✓</span>':''}<img loading="lazy" src="${IMG(p.id)}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png'" alt="${p.name}"><h4>${capitalize(p.name)}</h4><div class="mini-status"><span class="${s.caught?'on':''}" title="Living Dex">●</span><span class="${s.shiny?'on shiny':''}" title="Shiny">✦</span><span class="${s.home?'on home':''}" title="HOME">⌂</span></div></button><div class="card-actions"><button class="catch-check ${caught?'is-checked':''}" data-quick-catch>${caught?'✓ Peguei!':'○ Marcar como pego'}</button>${caught?'<button class="share-mini" data-share-pokemon title="Compartilhar no X">↗ X</button>':''}</div></article>`;
}

function updateBulkCatchButton(){
  const btn=document.getElementById('markAllGameBtn');if(!btn)return;
  const isGame=route.type==='game';btn.classList.toggle('hidden',!isGame);
  if(!isGame)return;
  const total=currentList.length,done=currentList.filter(p=>gameState(route.game,p.id).caught).length;
  const complete=total>0&&done===total;
  btn.disabled=complete;
  btn.classList.toggle('complete',complete);
  btn.textContent=complete?'✓ Todos já foram pegos!':`✓ Marcar todos como pegos (${total-done})`;
}

function markAllGameCaught(){
  if(route.type!=='game'||!currentList.length)return;
  const game=games.find(g=>g.id===route.game);const missing=currentList.filter(p=>!gameState(route.game,p.id).caught);
  if(!missing.length)return;
  const ok=confirm(`Marcar ${missing.length} Pokémon restantes de ${game.name} como pegos?`);
  if(!ok)return;
  missing.forEach(p=>{gameState(route.game,p.id).caught=true;markNationalCaught(p.id)});
  persist();renderGrid();checkGameCompletion(route.game);
}

function toggleQuickCatch(id){
  if(route.type==='game'){const gs=gameState(route.game,id);gs.caught=!gs.caught;if(gs.caught)markNationalCaught(id);persist();renderGrid();if(gs.caught)checkGameCompletion(route.game)}
  else{const s=pstate(id);s.caught=!s.caught;if(s.caught)s.seen=true;persist();renderGrid()}
}
function updateSummary(){
  const base=currentList;const done=route.type==='game'?base.filter(p=>gameState(route.game,p.id).caught).length:base.filter(p=>pstate(p.id).caught).length;const total=base.length,pct=total?done/total*100:0;
  const label=route.type==='national'?'National Dex':games.find(g=>g.id===route.game)?.name||'Dex';
  document.getElementById('dexLabel').textContent=label;document.getElementById('dexSummary').textContent=`${done} / ${total}`;document.getElementById('dexRemaining').textContent=done===total&&total?'Completa! 🏆':`${Math.max(0,total-done)} faltando`;document.getElementById('dexBar').style.width=`${pct}%`;
}

function renderDashboard(){renderStats();renderGameCards();renderGoals()}
function renderStats(){
  const vals={seen:0,caught:0,shiny:0,home:0};allPokemon.forEach(p=>{const s=pstate(p.id);Object.keys(vals).forEach(k=>vals[k]+=s[k]?1:0)});Object.keys(vals).forEach(k=>{const e=document.getElementById(`${k}Stat`);if(e)e.textContent=vals[k]});const total=allPokemon.length,pct=total?Math.round(vals.caught/total*100):0;document.getElementById('mainRing').style.setProperty('--p',`${pct*3.6}deg`);document.getElementById('mainPercent').textContent=`${pct}%`;document.getElementById('mainProgressText').textContent=`${vals.caught} / ${total} na Living Dex`;
}
function renderGameCards(){
  const el=document.getElementById('generationCards');
  el.innerHTML=gens.map(g=>`<section class="dashboard-gen"><div class="dashboard-gen-head"><span class="gen-badge">${g.name}</span><div><strong>${g.region}</strong><small>${games.filter(x=>x.gen===g.id).length} ${games.filter(x=>x.gen===g.id).length===1?'jogo':'jogos'}</small></div></div><div class="dashboard-game-grid">${games.filter(x=>x.gen===g.id).map(game=>{const pr=gameProgress(game.id),pct=pr.total?Math.round(pr.done/pr.total*100):0;return `<button class="dashboard-game-card ${pr.complete?'complete':''}" data-open-game="${game.id}" data-gen="${g.id}"><div><strong>${pr.complete?'🏆 ':''}${game.name}</strong><small>${pr.complete?'Pokédex completa!':'Continuar Pokédex'}</small></div><div class="gen-progress"><b>${pct}%</b><span>${pr.done}/${pr.total}</span></div></button>`}).join('')}</div></section>`).join('');
  el.querySelectorAll('[data-open-game]').forEach(b=>b.onclick=()=>navigate({type:'game',gen:Number(b.dataset.gen),game:b.dataset.openGame}));
}
function renderGoals(){const total=allPokemon.length,c=allPokemon.filter(p=>pstate(p.id).caught).length,sh=allPokemon.filter(p=>pstate(p.id).shiny).length,ho=allPokemon.filter(p=>pstate(p.id).home).length,forms=Object.values(state.forms).filter(Boolean).length,completed=games.filter(g=>gameProgress(g.id).complete).length;document.getElementById('goalCards').innerHTML=`<div class="goal-card"><strong>● Living Dex</strong><small>${c}/${total} espécies</small></div><div class="goal-card"><strong>✦ Shiny Dex</strong><small>${sh}/${total} shinies</small></div><div class="goal-card"><strong>◇ Form Dex</strong><small>${forms} formas extras</small></div><div class="goal-card"><strong>⌂ Pokémon HOME</strong><small>${ho}/${total} enviados</small></div><div class="goal-card"><strong>🏆 Jogos completos</strong><small>${completed}/${games.length} Pokédex concluídas</small></div>`}

async function openPokemon(id){
  const dlg=document.getElementById('pokemonDialog'),content=document.getElementById('dialogContent'),p=allPokemon.find(x=>x.id===id),s=pstate(id);content.innerHTML='<p class="muted">Carregando detalhes…</p>';dlg.showModal();
  let species=null,forms=[];try{species=await fetch(`${API}/pokemon-species/${id}`).then(r=>r.json());forms=await Promise.all((species.varieties||[]).slice(0,30).map(async v=>{try{return await fetch(v.pokemon.url).then(r=>r.json())}catch{return null}}))}catch{}
  const g=genFor(id);
  content.innerHTML=`<div class="poke-profile"><img src="${IMG(id)}" alt="${p.name}"><div><p class="eyebrow">#${String(id).padStart(4,'0')} • ${g.name} • ${g.region}</p><h2>${capitalize(p.name)}</h2><p class="muted">Tudo desse Pokémon fica aqui: coleção, formas, shiny, jogos e HOME.</p></div></div><div class="detail-tabs"><button class="active" data-tab="living">● Living Dex</button><button data-tab="forms">◇ Form Dex</button><button data-tab="shiny">✦ Shiny Dex</button><button data-tab="games">⌖ Jogos / Regional</button><button data-tab="home">⌂ HOME</button></div><div id="tabPanel"></div>`;
  const ctx={id,p,s,species,forms:forms.filter(Boolean)};const show=tab=>{content.querySelectorAll('.detail-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));renderPokemonTab(ctx,tab)};content.querySelectorAll('.detail-tabs button').forEach(b=>b.onclick=()=>show(b.dataset.tab));show('living');
}
function renderPokemonTab(ctx,tab){
  const panel=document.getElementById('tabPanel'),{id,p,s,forms}=ctx;
  if(tab==='living')panel.innerHTML=`<div class="detail-card"><div><p class="eyebrow">LIVING DEX</p><h3>Tenho ${capitalize(p.name)} na coleção?</h3><p class="muted">Use isso para sua Living Dex global.</p></div><button class="mega-check ${s.caught?'checked':''}" id="toggleLiving">${s.caught?'✓ Sim, já tenho':'○ Ainda falta'}</button></div>`;
  if(tab==='shiny')panel.innerHTML=`<div class="detail-card shiny-card"><img class="detail-sprite" src="${SHINY_IMG(id)}" alt="Shiny ${p.name}"><div><p class="eyebrow">SHINY DEX</p><h3>Shiny ${capitalize(p.name)}</h3><p class="muted">Marque separado da Living Dex normal.</p></div><button class="mega-check ${s.shiny?'checked':''}" id="toggleShiny">${s.shiny?'✦ Shiny obtido!':'○ Ainda falta o shiny'}</button></div>`;
  if(tab==='home')panel.innerHTML=`<div class="detail-card"><div><p class="eyebrow">POKÉMON HOME</p><h3>Já foi enviado ao HOME?</h3><p class="muted">Controle sua coleção central separadamente.</p></div><button class="mega-check ${s.home?'checked':''}" id="toggleHome">${s.home?'✓ Está no HOME':'○ Ainda não enviei'}</button></div>`;
  if(tab==='forms')panel.innerHTML=`<div><p class="muted">Marque cada forma ou variação que você já possui.</p><div class="form-list">${forms.length?forms.map(f=>{const key=f.name,img=f.sprites?.other?.home?.front_default||f.sprites?.front_default||IMG(id);return `<label class="form-item ${state.forms[key]?'checked':''}"><input class="formCheck" data-form="${key}" type="checkbox" ${state.forms[key]?'checked':''}><img src="${img}" alt=""><span><strong>${capitalize(f.name)}</strong><small>${state.forms[key]?'✓ Obtida':'Faltando'}</small></span></label>`}).join(''):'<div class="empty-state">Nenhuma forma extra encontrada para este Pokémon.</div>'}</div></div>`;
  if(tab==='games'){
    const relevant=games.filter(g=>id>=g.fallback[0]&&id<=g.fallback[1] || g.gen===genFor(id).id);
    panel.innerHTML=`<div><p class="muted">Marque em quais jogos você já obteve este Pokémon. A marcação é independente por jogo.</p><div class="game-status-list">${relevant.map(g=>{const gs=gameState(g.id,id);return `<button class="game-status ${gs.caught?'checked':''}" data-game-toggle="${g.id}"><span><strong>${g.name}</strong><small>Gen ${roman(g.gen)}</small></span><b>${gs.caught?'✓ Peguei':'○ Falta'}</b></button>`}).join('')}</div></div>`;
  }
  document.getElementById('toggleLiving')?.addEventListener('click',()=>{s.caught=!s.caught;if(s.caught)s.seen=true;persist();renderPokemonTab(ctx,'living');if(route.type!=='dashboard')renderGrid()});
  document.getElementById('toggleShiny')?.addEventListener('click',()=>{s.shiny=!s.shiny;persist();renderPokemonTab(ctx,'shiny');if(route.type!=='dashboard')renderGrid()});
  document.getElementById('toggleHome')?.addEventListener('click',()=>{s.home=!s.home;persist();renderPokemonTab(ctx,'home')});
  panel.querySelectorAll?.('.formCheck').forEach(i=>i.addEventListener('change',e=>{state.forms[i.dataset.form]=e.target.checked;persist();renderPokemonTab(ctx,'forms')}));
  panel.querySelectorAll?.('[data-game-toggle]').forEach(b=>b.onclick=()=>{const gs=gameState(b.dataset.gameToggle,id);gs.caught=!gs.caught;if(gs.caught)markNationalCaught(id);persist();renderPokemonTab(ctx,'games');if(gs.caught)checkGameCompletion(b.dataset.gameToggle)});
}

function gameProgress(gameId){const g=games.find(x=>x.id===gameId),list=gameDexCache[gameId]||allPokemon.filter(p=>p.id>=g.fallback[0]&&p.id<=g.fallback[1]);const done=list.filter(p=>!!state.games?.[gameId]?.[p.id]?.caught).length;const complete=list.length>0&&done===list.length;return{done,total:list.length,complete}}
function checkGameCompletion(gameId){const pr=gameProgress(gameId);if(!pr.complete||state.celebratedGames[gameId])return;state.celebratedGames[gameId]=new Date().toISOString();persist();showCelebration(gameId,pr.total)}
function showCelebration(gameId,total){const game=games.find(g=>g.id===gameId),dlg=document.getElementById('celebrationDialog');document.getElementById('celebrationContent').innerHTML=`<div class="celebration-wrap"><div class="trophy">🏆</div><p class="eyebrow">100% COMPLETA</p><h2>PARABÉNS! 🎉</h2><p>Você completou a Pokédex de <strong>${game.name}</strong> com <strong>${total}/${total}</strong> Pokémon!</p><div class="confetti-line">✦ ● ★ ✦ ● ★ ✦</div><div class="celebration-actions"><button class="primary-action" id="shareGameX">Compartilhar no X</button><button class="secondary-action" id="copyGamePost">Copiar texto</button></div></div>`;dlg.showModal();document.getElementById('shareGameX').onclick=()=>openXPost(gameCompletionText(game,total));document.getElementById('copyGamePost').onclick=()=>copyShareText(gameCompletionText(game,total))}
function gameCompletionText(game,total){return `🏆 Pokédex completa! Consegui registrar todos os ${total} Pokémon de ${game.name}!\n\nMais uma Dex 100% concluída ✨ #Pokemon #Pokedex`}
function pokemonShareText(id){const p=allPokemon.find(x=>x.id===id),where=route.type==='game'?` em ${games.find(g=>g.id===route.game)?.name}`:'';return `✅ Peguei ${capitalize(p?.name)} (#${String(id).padStart(4,'0')})${where}!\n\nMais um pra Pokédex ✨ #Pokemon #Pokedex`}
function openXPost(text){window.open(`https://x.com/intent/post?text=${encodeURIComponent(text)}`,'_blank','noopener,noreferrer')}
function sharePokemon(id){openXPost(pokemonShareText(id))}
async function copyShareText(text){try{await navigator.clipboard.writeText(text);alert('Texto copiado! ✨')}catch{prompt('Copie o texto:',text)}}

function normalizedState(raw){
  const source=raw?.state||raw;
  if(!source||typeof source!=='object'||Array.isArray(source))throw new Error('Formato de backup inválido.');
  const out={pokemon:{},forms:{},games:{},celebratedGames:{}};
  if(source.pokemon&&typeof source.pokemon==='object')out.pokemon=source.pokemon;
  if(source.forms&&typeof source.forms==='object')out.forms=source.forms;
  if(source.games&&typeof source.games==='object')out.games=source.games;
  if(source.celebratedGames&&typeof source.celebratedGames==='object')out.celebratedGames=source.celebratedGames;
  return out;
}
function exportBackup(){
  const payload={app:'My Pokédex Tracker',version:4,exportedAt:new Date().toISOString(),state};
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
    state=imported;syncGameCatchesToNational();persist();renderDashboard();if(route.type!=='dashboard')renderGrid();alert('Backup importado com sucesso! ✨');
  }catch(err){console.error(err);alert('Esse arquivo não parece ser um backup válido da Pokédex.')}};
  r.readAsText(file);e.target.value='';
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
