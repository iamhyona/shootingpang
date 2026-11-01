/* Original looping chiptune for Shooting Pang. Web Audio only; no external audio. */
window.PangMusic=(()=>{
  let context,bus,timer=null,step=0,nextTime=0,enabled=true,volume=.35,unlocked=false,running=false;
  const voices=new Set(),bpm=112,tick=60/bpm/2;
  const melody=[72,76,79,76,81,79,76,74,72,76,79,84,83,79,76,0,69,72,76,72,77,76,72,71,69,72,76,81,79,76,72,0,65,69,72,69,74,72,69,67,65,69,72,77,76,72,69,0,67,71,74,79,77,74,71,74,67,71,74,79,83,81,79,0];
  const chords=[[48,52,55],[45,48,52],[41,45,48],[43,47,50]];
  try{enabled=localStorage.getItem('shooting-bgm')!=='0';volume=Math.min(1,Math.max(0,Number(localStorage.getItem('shooting-bgm-volume')??.35)))}catch{}
  function ensure(){if(context)return true;const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;context=new C();bus=context.createGain();bus.gain.value=volume;bus.connect(context.destination);return true}
  function note(midi,time,duration,gain,type){if(!midi)return;const o=context.createOscillator(),g=context.createGain();o.type=type;o.frequency.value=440*Math.pow(2,(midi-69)/12);o.connect(g);g.connect(bus);g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(gain,time+.012);g.gain.exponentialRampToValueAtTime(.0001,time+duration);o.start(time);o.stop(time+duration+.03);voices.add(o);o.onended=()=>{voices.delete(o);o.disconnect();g.disconnect()}}
  function schedule(){if(!running||!context)return;if(nextTime<context.currentTime-.2)nextTime=context.currentTime+.03;while(nextTime<context.currentTime+.15){const chord=chords[Math.floor(step/16)%4];note(melody[step%64],nextTime,tick*.85,.032,'triangle');if(step%2===0)note(chord[0]-12,nextTime,tick*1.6,.045,'triangle');note(chord[step%3]+12,nextTime,tick*.4,.009,'square');step++;nextTime+=tick}}
  function stop(){if(timer!==null)clearInterval(timer);timer=null;running=false;for(const o of voices){try{o.stop()}catch{}}voices.clear()}
  function sync(playing){if(!enabled||!unlocked||!playing||document.hidden){if(running)stop();return}if(running||!ensure())return;if(context.state!=='running'){context.resume().catch(()=>{});return}running=true;nextTime=context.currentTime+.04;schedule();timer=setInterval(schedule,60)}
  function unlock(){unlocked=true;if(ensure())context.resume().catch(()=>{})}
  function setEnabled(value){enabled=!!value;try{localStorage.setItem('shooting-bgm',enabled?'1':'0')}catch{}if(!enabled)stop();else unlock()}
  function setVolume(value){volume=Math.min(1,Math.max(0,+value||0));if(bus)bus.gain.setTargetAtTime(volume,context.currentTime,.03);try{localStorage.setItem('shooting-bgm-volume',volume)}catch{}}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});window.addEventListener('pagehide',stop);
  return {unlock,sync,stop,setEnabled,setVolume,get enabled(){return enabled},get volume(){return volume},get playing(){return running}};
})();
