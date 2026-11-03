
/* Tiga pukulan terpisah: masuk target atau dorongan maju, bukan diam/menahan. */
class HandStrikeTracker {
  constructor() { this.hands = new Map(); }
  reset() { this.hands.clear(); this.lastSample = -1; }
  segmentHit(x0,y0,x1,y1,r) {
    let near=0,far=1;
    for(const [p,d,min,max] of [[x0,x1-x0,r.left,r.right],[y0,y1-y0,r.top,r.bottom]]){
      if(Math.abs(d)<0.0001){if(p<min||p>max)return false;continue;}
      let a=(min-p)/d,b=(max-p)/d;if(a>b)[a,b]=[b,a];
      near=Math.max(near,a);far=Math.min(far,b);if(near>far)return false;
    }
    return true;
  }
  update(palms, rects, now, height, sampleTime) {
    // Only new sensor evidence can change strike history. A temporarily expired
    // cursor between two slow results must not erase the preceding captured pose.
    if(sampleTime!==undefined){if(sampleTime<0||sampleTime===this.lastSample)return [];this.lastSample=sampleTime;}
    const events=[];
    const present=new Set(palms.map(p=>p.trackId));
    for(const id of this.hands.keys())if(!present.has(id))this.hands.delete(id);
    for(const palm of palms){
      if(now-palm.lastSeen>(palm.ttl||500)){this.hands.delete(palm.trackId);continue;}
      const id=palm.trackId, x=palm.cx, y=palm.cy;
      const span=palm.span || palm.radius*2;
      const zone=rects.findIndex(r=>x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom);
      let old=this.hands.get(id);
      if(old && (palm.lastSeen-old.frame>500 || palm.lastSeen<old.frame)){this.hands.delete(id);old=null;}
      if(old && palm.lastSeen===old.frame)continue;
      if(!old){this.hands.set(id,{x,y,zone,span,minSpan:span,peak:span,armed:true,time:now,frame:palm.lastSeen,lastHit:-Infinity});continue;}
      const dt=Math.max(.016,(palm.lastSeen-old.frame)/1000), distance=Math.hypot(x-old.x,y-old.y);
      const speed=distance/Math.max(1,height)/dt;
      let target=zone;
      if(target<0 && speed>.25)target=rects.findIndex(r=>this.segmentHit(old.x,old.y,x,y,r));
      // Bergerak minimal 1% tinggi arena menghindari jitter landmark.
      const enter=target>=0 && old.zone!==target && old.armed && distance>=height*.01 && speed>.22;
      const expansion=span/Math.max(1,old.minSpan);
      const forward=zone>=0 && old.zone===zone && old.armed && expansion>=1.2 && (span-old.span)/Math.max(1,old.span)/dt>.45;
      const hit=(enter||forward) && now-old.lastHit>=350;
      let armed=old.armed,minSpan=old.minSpan,peak=Math.max(old.peak,span),lastHit=old.lastHit;
      if(hit){events.push({target,palm,x,y});armed=false;lastHit=now;peak=span;palm.flashUntil=now+230;}
      else if(zone<0 || (!armed&&span<peak*.83)){armed=true;minSpan=span;peak=span;}
      else if(armed)minSpan=Math.min(minSpan,span);
      this.hands.set(id,{x,y,zone,span,minSpan,peak,armed,time:now,frame:palm.lastSeen,lastHit});
    }
    return events;
  }
}
window.HandStrikeTracker=HandStrikeTracker;

window.GameFullscreen={
  wanted:false,
  async enter(){
    this.wanted=true;
    if(!document.fullscreenElement){
      try{await document.documentElement.requestFullscreen({navigationUI:"hide"});}catch(e){}
    }
    this.update();
  },
  update(){
    const el=document.getElementById("fullscreen-restore");
    if(el)el.hidden=!!document.fullscreenElement||!this.wanted;
  }
};
document.addEventListener("fullscreenchange",()=>GameFullscreen.update());
document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("fullscreen-restore").addEventListener("click",()=>GameFullscreen.enter());
});

