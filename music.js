/* Original looping chiptune for Shooting Pang (v2, 2026-11-01): 시리즈 톤에 맞춰 칩튠 멜로디 + 튕기는 베이스 + 가벼운 드럼. Web Audio only; no external audio. */
window.PangMusic=(()=>{
  let context,bus,noise=null,timer=null,step=0,nextTime=0,enabled=true,volume=.35,unlocked=false,running=false;
  const voices=new Set(),bpm=126,tick=60/bpm/2;
  const A=[72,76,79,76,81,79,76,74,72,76,79,84,83,79,76,0,69,72,76,72,77,76,72,71,69,72,76,81,79,76,72,0,65,69,72,69,74,72,69,67,65,69,72,77,76,72,69,0,67,71,74,79,77,74,71,74,67,71,74,79,83,81,79,0];
  const B=A.map((m,i)=>!m?0:(i%16===8||i%16===12)?m+12:(i%4===3?0:m)); /* 두 번째 바퀴: 몇 음을 한 옥타브 위로, 쉼표를 넣어 통통 튀게 */
  const melody=[...A,...B];
  const chords=[[48,52,55],[45,48,52],[41,45,48],[43,47,50]];
  try{enabled=localStorage.getItem('shooting-bgm')!=='0';volume=Math.min(1,Math.max(0,Number(localStorage.getItem('shooting-bgm-volume')??.35)))}catch{}
  function ensure(){if(context)return true;const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;context=new C();bus=context.createGain();bus.gain.value=volume;bus.connect(context.destination);
    const len=context.sampleRate*.3,buf=context.createBuffer(1,len,context.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;noise=buf;return true}
  function track(n,t,dur){voices.add(n);n.onended=()=>{voices.delete(n);try{n.disconnect()}catch{}};n.start(t);n.stop(t+dur+.03)}
  function note(midi,time,duration,gain,type,cut){if(!midi)return;const o=context.createOscillator(),g=context.createGain();o.type=type;o.frequency.value=440*Math.pow(2,(midi-69)/12);let out=g;
    if(cut){const f=context.createBiquadFilter();f.type='lowpass';f.frequency.value=cut;o.connect(f);f.connect(g)}else o.connect(g);out.connect(bus);
    g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(gain,time+.008);g.gain.exponentialRampToValueAtTime(.0001,time+duration);track(o,time,duration)}
  function kick(t){const o=context.createOscillator(),g=context.createGain();o.type='sine';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(45,t+.11);g.gain.setValueAtTime(.16,t);g.gain.exponentialRampToValueAtTime(.0001,t+.16);o.connect(g);g.connect(bus);track(o,t,.16)}
  function hiss(t,gain,dur,freq){const s=context.createBufferSource(),f=context.createBiquadFilter(),g=context.createGain();s.buffer=noise;f.type='highpass';f.frequency.value=freq;g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(bus);track(s,t,dur)}
  function schedule(){if(!running||!context)return;if(nextTime<context.currentTime-.2)nextTime=context.currentTime+.03;
    while(nextTime<context.currentTime+.15){const t=nextTime,s=step%128,b=s%8,chord=chords[Math.floor(s/16)%4];
      note(melody[s],t,tick*.8,.026,'square',2600);                       /* 칩튠 멜로디 */
      note(chord[0]-12+(b%2?12:0),t,tick*.9,.05,'triangle');             /* 옥타브로 통통 튀는 베이스 */
      note(chord[s%3]+12,t,tick*.35,.006,'square');                      /* 작은 반짝이 아르페지오 */
      if(b===0||b===4)kick(t);                                           /* 쿵 */
      if(b===2||b===6)hiss(t,.05,.09,1800);                              /* 짝 */
      if(b%2===1)hiss(t,.012,.03,7000);                                  /* 츠 */
      step++;nextTime+=tick}}
  function stop(){if(timer!==null)clearInterval(timer);timer=null;running=false;for(const o of voices){try{o.stop()}catch{}}voices.clear()}
  function sync(playing){if(!enabled||!unlocked||!playing||document.hidden){if(running)stop();return}if(running||!ensure())return;if(context.state!=='running'){context.resume().catch(()=>{});return}running=true;nextTime=context.currentTime+.04;schedule();timer=setInterval(schedule,60)}
  function unlock(){unlocked=true;if(ensure())context.resume().catch(()=>{})}
  function setEnabled(value){enabled=!!value;try{localStorage.setItem('shooting-bgm',enabled?'1':'0')}catch{}if(!enabled)stop();else unlock()}
  function setVolume(value){volume=Math.min(1,Math.max(0,+value||0));if(bus)bus.gain.setTargetAtTime(volume,context.currentTime,.03);try{localStorage.setItem('shooting-bgm-volume',volume)}catch{}}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});window.addEventListener('pagehide',stop);
  return {unlock,sync,stop,setEnabled,setVolume,get enabled(){return enabled},get volume(){return volume},get playing(){return running}};
})();
