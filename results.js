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
async function rankList(target){target.textContent='랭킹을 불러오는 중…';try{const rows=await getRanks();target.replaceChildren();for(const r of rows.slice(0,50)){const li=document.createElement('li');li.textContent=r.n+' · '+String(r.m).toUpperCase()+' · STAGE '+r.v+' · '+Number(r.s).toLocaleString();target.append(li)}if(!rows.length)target.textContent='첫 기록을 남겨보세요!'}catch{target.textContent='랭킹을 불러오지 못했어요. 잠시 후 다시 열어주세요.'}}
function showRank(){openDialog('<div class="phSet-c"><h2 class="phOvH phOvRk">RANKING</h2><p class="rank-note">슈팅팡 온라인 랭킹</p><ol id="rankList" style="max-height:45vh;overflow:auto;text-align:left;line-height:2;font-size:12px"></ol><button class="dialog-close" data-close aria-label="닫기">×</button></div>');rankList(el('rankList'))}
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
