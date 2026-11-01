// Original artwork © 박현아
const COL={1:['#e8352e','#ff8a73','#a8170f'],2:['#efe6cf','#fffdf4','#b9a98a'],3:['#3e8fe6','#9fd3ff','#1c58ad'],4:['#f6a51e','#ffe08a','#c06a00'],5:['#e264c4','#ffc0ee','#a32c8a'],6:['#6cc644','#d2f5a6','#3a8a24'],7:['#3fc9b0','#b4f5e6','#178a74'],8:['#8a4fe0','#d4b8ff','#5a26a8'],10:['#a8683a','#ecc196','#6e3f1c'],9:['#7c818a','#c3c8d0','#4a4f57']}; /* 9: 대전 방해 블록 */
const star=(cx,cy,R,r)=>'M'+[...Array(10)].map((_,k)=>{const a=-Math.PI/2+k*Math.PI/5,q=k%2?r:R;return (cx+q*Math.cos(a)).toFixed(2)+' '+(cy+q*Math.sin(a)).toFixed(2)}).join(' L')+'Z';
const hexa=(cx,cy,R)=>'M'+[...Array(6)].map((_,k)=>{const a=Math.PI/6+k*Math.PI/3;return (cx+R*Math.cos(a)).toFixed(2)+' '+(cy+R*Math.sin(a)).toFixed(2)}).join(' L')+'Z';
const SH={1:'<path d="M20 35.5C7.5 29 3.2 22.5 3.2 15.2C3.2 8.6 7.6 4.2 13 4.2C16.3 4.2 18.7 6 20 8.6C21.3 6 23.7 4.2 27 4.2C32.4 4.2 36.8 8.6 36.8 15.2C36.8 22.5 32.5 29 20 35.5Z"/>',
2:'<circle cx="20" cy="10.5" r="9"/><circle cx="29.5" cy="20" r="9"/><circle cx="20" cy="29.5" r="9"/><circle cx="10.5" cy="20" r="9"/><rect x="8" y="8" width="24" height="24" rx="7"/>',
3:'<path d="M20 4C27 11.5 36.5 16.5 36.5 25C36.5 32.6 29.6 37 20 37C10.4 37 3.5 32.6 3.5 25C3.5 16.5 13 11.5 20 4Z"/>',
4:'<path d="'+star(20,21.3,16.2,11.6)+'"/>',5:'<path d="'+hexa(20,20.3,16.2)+'"/>',
6:'<path d="M20 15.5C21.2 10.5 24.6 6.6 31 5.6C31.6 11.8 27.6 15.4 22 16.3Z"/><path d="M20 15.5C18.8 11.6 15.6 8.6 9.6 8.4C9.6 13.6 13.6 16.4 18.4 16.5Z"/><rect x="4.5" y="14.5" width="31" height="22" rx="11"/>',
7:'<rect x="4" y="4.5" width="32" height="31.5" rx="15"/>',8:'<path d="M20 3.5C21 3.5 22 4 22.8 4.9L35.6 17.6C36.6 18.7 36.6 20.3 35.6 21.4L22.8 34.6C21.3 36.2 18.7 36.2 17.2 34.6L4.4 21.4C3.4 20.3 3.4 18.7 4.4 17.6L17.2 4.9C18 4 19 3.5 20 3.5Z"/>',10:'<rect x="5" y="5" width="30" height="30" rx="3.5"/>',9:'<rect x="5" y="5" width="30" height="30" rx="7"/>'};
const SW={1:3.5,2:2,3:3.5,4:9,5:10,6:2,7:2,8:8,9:2,10:2},FY={1:-1,2:0,3:4,4:2,5:0,6:6,7:0,8:2,9:0,10:0},CT={1:[.5,.42],2:[.5,.45],3:[.5,.62],4:[.5,.55],5:[.5,.48],6:[.5,.62],7:[.5,.45],8:[.5,.52],9:[.5,.45],10:[.5,.48]};
let vsGb=0,vsAtk=0;
function face(dy,mood){const o='#2a1712',hl=(x)=>`<ellipse cx="${x+.4}" cy="16.8" rx=".55" ry=".7" fill="#fff" opacity=".8"/>`;
  let eyes=`<ellipse cx="16" cy="17.6" rx="1.7" ry="2.3" fill="${o}"/><ellipse cx="24" cy="17.6" rx="1.7" ry="2.3" fill="${o}"/>${hl(16)}${hl(24)}`;
  let mouth=`<path d="M15.6 21.4Q20 26.6 24.4 21.4Q20 23.4 15.6 21.4Z" fill="${o}" stroke="${o}" stroke-width="1.2" stroke-linejoin="round"/>`;
  if(mood==='b')eyes=`<path d="M14.3 17.6q1.7 1.5 3.4 0M22.3 17.6q1.7 1.5 3.4 0" stroke="${o}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
  if(mood==='o'){eyes=`<ellipse cx="16" cy="17.2" rx="2.1" ry="2.6" fill="${o}"/><ellipse cx="24" cy="17.2" rx="2.1" ry="2.6" fill="${o}"/>${hl(16)}${hl(24)}`;mouth=`<ellipse cx="20" cy="23.2" rx="1.8" ry="2" fill="${o}"/>`}
  if(mood==='x'){eyes=`<path d="M14.2 16l3.6 3.6M17.8 16l-3.6 3.6M22.2 16l3.6 3.6M25.8 16l-3.6 3.6" stroke="${o}" stroke-width="1.6" stroke-linecap="round"/>`;mouth=`<path d="M16.5 22.5q3.5 3.8 7 0" fill="${o}"/>`}
  return `<g transform="translate(0 ${dy})">${eyes}${mouth}</g>`}
function pieceSVG(c,mood){const [b,l,d]=COL[c],sh=SH[c],w=SW[c],[cx,cy]=CT[c];
  const body=f=>`<g fill="${f}" stroke="${f}" stroke-width="${w}" stroke-linejoin="round">${sh}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 44 44" width="88" height="88"><defs><radialGradient id="g" cx="${cx}" cy="${cy}" r=".62"><stop offset="0" stop-color="${l}"/><stop offset=".5" stop-color="${b}"/><stop offset=".86" stop-color="${b}"/><stop offset="1" stop-color="${d}"/></radialGradient><mask id="m" maskUnits="userSpaceOnUse" x="-5" y="-5" width="50" height="50">${body('#fff')}</mask><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".9"/></filter></defs><g fill="#231510" stroke="#231510" stroke-width="${w+3.2}" stroke-linejoin="round">${sh}</g>${body('url(#g)')}<g mask="url(#m)"><g fill="none" stroke="${d}" stroke-width="3" stroke-linejoin="round" transform="translate(0 1.3)" opacity=".55" filter="url(#s)">${sh}</g><ellipse cx="13.5" cy="9.5" rx="5.2" ry="2.6" transform="rotate(-28 13.5 9.5)" fill="#fff" opacity=".85" filter="url(#s)"/><circle cx="9.5" cy="14" r="1.1" fill="#fff" opacity=".7"/></g>${face(FY[c],mood)}</svg>`}
const svgURL=s=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);

window.PangArt={pieceSVG,COL};