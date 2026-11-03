// Dwell time is earned only between distinct, fresh camera observations.
class CameraDwellSelector {
  constructor(duration=360){this.duration=duration;this.reset();}
  reset(){this.target=-1;this.elapsed=0;this.lastSample=-1;}
  step(target,sampleTime,now,enabled=true){
    if(!enabled){this.reset();return -1;}
    if(sampleTime===this.lastSample){
      // Do not confuse cursor expiry between slow results with a new observation
      // of a missing hand. Reused frames can never add time or choose an answer.
      if(now-sampleTime>1000){this.target=-1;this.elapsed=0;}
      return -1;
    }
    if(sampleTime<0||now-sampleTime>500){this.target=-1;this.elapsed=0;this.lastSample=sampleTime;return -1;}
    const delta=this.lastSample<0?0:sampleTime-this.lastSample;
    this.lastSample=sampleTime;
    if(target<0){this.target=-1;this.elapsed=0;return -1;}
    if(target!==this.target||delta<0||delta>500){this.target=target;this.elapsed=0;}
    else this.elapsed+=delta;
    return this.elapsed>=this.duration?this.target:-1;
  }
  get progress(){return Math.min(1,this.elapsed/this.duration);}
}
