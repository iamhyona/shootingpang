const GOF={
    A: ['01110','10001','10001','11111','10001','10001','10001'],
    B: ['11110','10001','10001','11110','10001','10001','11110'],
    C: ['01111','10000','10000','10000','10000','10000','01111'],
    D: ['11110','10001','10001','10001','10001','10001','11110'],
    E: ['11111','10000','10000','11110','10000','10000','11111'],
    G: ['01110','10001','10000','10111','10001','10001','01111'],
    I: ['111','010','010','010','010','010','111'],
    L: ['10000','10000','10000','10000','10000','10000','11111'],
    M: ['10001','11011','10101','10101','10001','10001','10001'],
    N: ['10001','11001','10101','10011','10001','10001','10001'],
    O: ['01110','10001','10001','10001','10001','10001','01110'],
    P: ['11110','10001','10001','11110','10000','10000','10000'],
    R: ['11110','10001','10001','11110','10100','10010','10001'],
    S: ['01111','10000','10000','01110','00001','00001','11110'],
    T: ['11111','00100','00100','00100','00100','00100','00100'],
    U: ['10001','10001','10001','10001','10001','10001','01110'],
    V: ['10001','10001','10001','10001','10001','01010','00100'],
    W: ['10001','10001','10001','10101','10101','10101','01010'],
    Y: ['10001','10001','01010','00100','00100','00100','00100'],
    '!': ['1','1','1','1','1','0','1'],
    ' ': ['00','00','00','00','00','00','00'],
  '1':['00100','01100','10100','00100','00100','00100','11111'],' ':['00','00','00','00','00','00','00']};
function phDots(text,color,cls){const C=10,D=8.4,R=2.2;let x=0,on='',off='';[...text].forEach(ch=>{const g=GOF[ch]||GOF[' '];g.forEach((row,y)=>[...row].forEach((b,cx)=>{const r=`<rect x="${(x+cx)*C}" y="${y*C}" width="${D}" height="${D}" rx="${R}"`;if(b==='1')on+=r+'/>';else off+=r+'/>'}));x+=g[0].length+1});
  return `<svg class="${cls||''}" viewBox="0 0 ${(x-1)*C-(C-D)} ${7*C-(C-D)}" aria-label="${text}"><g fill="rgba(255,255,255,.07)">${off}</g><g fill="${color||'#f4fff0'}">${on}</g></svg>`}

let registered=false;
const RANK_URL='https://script.google.com/macros/s/AKfycbzkdjVleobj98oyxlC77cUf5txCRiSB6D1zgRWU56pX22ElXAx9R8xFRGnV0nKAUbwC/exec';
async function getRanks(){const response=await fetch(RANK_URL+'?g=shootingpang&_='+Date.now(),{cache:'no-store'});if(!response.ok)throw Error('network');const data=await response.json();if(!Array.isArray(data.top))throw Error('response');return data.top;}
function drawRankRows(target,rows){target.replaceChildren();for(const [index,r] of rows.slice(0,50).entries()){const li=document.createElement('li'),rank=document.createElement('em'),name=document.createElement('span'),badge=document.createElement('i'),points=document.createElement('b');rank.textContent=index+1;name.className='nm';name.textContent=r.n;name.title=r.n;const mode=String(r.m).toLowerCase();badge.className='lvb '+({easy:'e',normal:'n',hard:'h',master:'m'}[mode]||'');badge.textContent=mode.toUpperCase();badge.setAttribute('aria-label','난도 '+mode);points.textContent=Number(r.s).toLocaleString();li.append(rank,name,badge,points);target.append(li)}if(!rows.length)target.innerHTML='<li class="empty">첫 기록을 남겨보세요!</li>'}
async function rankList(target){target.innerHTML='<li class="empty">랭킹을 불러오는 중…</li>';try{drawRankRows(target,await getRanks())}catch{target.innerHTML='<li class="empty">랭킹을 불러오지 못했어요.<br>잠시 후 다시 열어주세요.</li>'}}
/* 2026-11-01: 난이도별 랭킹 탭 — 난이도마다 판 구성이 달라 한 목록에 섞으면 EASY가 유리했음 (기존 기록은 저장된 난이도로 그대로 나눔) */
let rankLv=null,rankRows=null;
function drawRankTab(){const t=el('rankList');if(!t)return;document.querySelectorAll('#rankTabs button').forEach(b=>{b.classList.toggle('on',b.dataset.l===rankLv);b.setAttribute('aria-pressed',b.dataset.l===rankLv)});if(rankRows)drawRankRows(t,rankRows.filter(r=>String(r.m).toLowerCase()===rankLv).sort((a,b)=>Number(b.s)-Number(a.s)))}
function showRank(){rankLv=typeof difficulty==='string'&&LEVELS[difficulty]?difficulty:'easy';openDialog('<section id="rankOv" class="phOvP shooting-rank"><h2 class="phOvH phOvRk">RANKING</h2><div class="phLvTabs" id="rankTabs">'+['easy','normal','hard','master'].map(l=>'<button type="button" class="lv-'+l[0]+'" data-l="'+l+'" aria-label="'+l.toUpperCase()+' 랭킹">'+l[0].toUpperCase()+'</button>').join('')+'</div><div class="rk"><ol id="rankList" aria-label="슈팅팡 온라인 랭킹"></ol></div><button class="phOvX" data-close aria-label="닫기">×</button></section>');
 document.querySelectorAll('#rankTabs button').forEach(b=>b.onclick=()=>{rankLv=b.dataset.l;drawRankTab()});
 const t=el('rankList');t.innerHTML='<li class="empty">랭킹을 불러오는 중…</li>';rankRows=null;drawRankTab();getRanks().then(rows=>{rankRows=rows;drawRankTab()}).catch(()=>{t.innerHTML='<li class="empty">랭킹을 불러오지 못했어요.<br>잠시 후 다시 열어주세요.</li>'})}
const rankStyle=document.createElement('style');rankStyle.textContent=`
#dialog:has(.shooting-rank){background:#090a10;max-width:496px;left:50%;transform:translateX(-50%);width:calc(100% - 24px);top:46px;bottom:16px;padding:20px 12px}
.shooting-rank{display:flex;flex-direction:column;align-items:center;width:100%;max-height:100%;padding:20px 0}.shooting-rank .rk{flex:0 1 auto;min-height:0}.shooting-rank ol{list-style:none}.shooting-rank .nm{text-overflow:ellipsis}.shooting-rank .lvb{display:inline-flex;align-items:center;justify-content:center;font:700 8px Silkscreen,monospace;font-style:normal;letter-spacing:.04em;padding:2px 4px 1px;height:15px;border-radius:3px;color:#0a0c1d;background:#9aa3c7;line-height:1;white-space:nowrap;flex-shrink:0}.shooting-rank .lvb.e{background:#f2b000}.shooting-rank .lvb.n{background:#00a8e0}.shooting-rank .lvb.h{background:#e8284f}.shooting-rank .lvb.m{background:#8a3cf0;color:#fff}
html body #rankOv .rk li{gap:7px!important}html body #rankOv .rk li .nm{display:block!important;overflow:visible!important;white-space:normal!important;overflow-wrap:anywhere;line-height:1.5!important;text-overflow:clip}html body #rankOv .rk li>b{flex:0 0 auto;font-variant-numeric:tabular-nums}html body #rankOv .rk li.empty{display:block!important;border:0!important;padding:28px 0!important;color:#8b8fa8;font:13px/1.6 Galmuri11;text-align:center}
.shooting-rank .phLvTabs{display:flex;gap:8px;justify-content:center;margin:0 auto 10px}.shooting-rank .phLvTabs>button{width:44px;height:32px;flex:0 0 auto;box-sizing:border-box;border-radius:8px;padding:0;font:700 13px Silkscreen,monospace;background:transparent;border:2px solid var(--lvb);color:var(--lvt);cursor:pointer}.shooting-rank .phLvTabs>button.on{background:var(--lvb);color:#111}.shooting-rank .lv-e{--lvb:#f2b000;--lvt:#ffd84d}.shooting-rank .lv-n{--lvb:#00a8e0;--lvt:#7fd9ff}.shooting-rank .lv-h{--lvb:#e8284f;--lvt:#ff8aa0}.shooting-rank .lv-m{--lvb:#8a3cf0;--lvt:#c9a6ff}
@media(max-width:360px){html body #rankOv .rk li{padding:9px 3px!important;gap:6px!important}}
`;document.head.append(rankStyle);
function showEnd(){registered=false;el('result').hidden=true;const ov=el('overOv');ov.hidden=false;el('endTitle').innerHTML=phDots(state==='complete'?'ALL CLEAR!':'GAME OVER','#f4fff0','phGoT');el('endScore').textContent=score.toLocaleString();el('endStage').textContent=stage;el('endMode').textContent=difficulty.toUpperCase();el('endNote').textContent=state==='complete'?'모든 스테이지를 클리어했어요!':'다음에는 더 멀리, 팡!';el('nameSave').disabled=score<=0;el('nameSave').textContent='OK';el('nameStatus').textContent=score>0?'이름을 남겨 온라인 랭킹에 등록하세요':'점수를 얻으면 랭킹에 등록할 수 있어요';try{el('playerName').value=localStorage.getItem('shooting-pang-name')||localStorage.getItem('pang-name')||''}catch{}}
let sending=false;
el('nameForm').onsubmit=async e=>{e.preventDefault();if(registered||sending||score<=0)return;const name=el('playerName').value.replace(/[<>=+@-]/g,'').trim().slice(0,8)||'익명';const record={name,score,stage,mode:difficulty};sending=true;el('nameSave').disabled=true;el('nameStatus').textContent='온라인 랭킹에 등록 중…';try{
 const rows=await getRanks();
 if(!rows.some(r=>r.n===name&&r.s===record.score&&r.v===record.stage&&r.m===record.mode)){
  const q=new URLSearchParams({g:'shootingpang',a:'add',n:name,s:record.score,v:record.stage,m:record.mode});
  const response=await fetch(RANK_URL+'?'+q);if(!response.ok||(await response.json()).ok!==true)throw Error('save');
 }
 registered=true;try{localStorage.setItem('shooting-pang-name',name)}catch{}el('nameSave').textContent='SAVED';el('nameStatus').textContent='온라인 랭킹에 등록했어요';
 }catch{el('nameSave').disabled=false;el('nameStatus').textContent='등록을 확인하지 못했어요. 다시 눌러주세요.'}finally{sending=false}};
el('endRetry').onclick=()=>{el('overOv').hidden=true;init()};el('endHome').onclick=()=>{el('overOv').hidden=true;home()};el('endRank').onclick=showRank;el('ranking').onclick=showRank;el('rankPause').onclick=showRank;
