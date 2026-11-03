const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const scope={window:{},document:{addEventListener(){}}};vm.createContext(scope);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../aset/js/kontrol-pukul.js'),'utf8'),scope);
const Strike=scope.window.HandStrikeTracker;
const rects=[{left:100,right:200,top:100,bottom:200}];
const palm=(x,t,span=50,id=1)=>({trackId:id,cx:x,cy:150,span,radius:25,lastSeen:t,ttl:500});
test('three separate swings count three times',()=>{
 const s=new Strike();let count=0;
 for(let i=0;i<3;i++){const t=1000+i*700;s.update([palm(60,t)],rects,t,500);count+=s.update([palm(150,t+150)],rects,t+150,500).length;}
 assert.equal(count,3);
});
test('stationary first appearance and jitter do not count',()=>{
 const s=new Strike();let count=0;
 for(let t=1000;t<3000;t+=100)count+=s.update([palm(150+Math.sin(t)*2,t)],rects,t,500).length;
 assert.equal(count,0);
});
test('reused frame cannot register another strike',()=>{
 const s=new Strike();s.update([palm(60,1000)],rects,1000,500);assert.equal(s.update([palm(150,1100)],rects,1100,500).length,1);
 for(let t=1130;t<=1600;t+=30)assert.equal(s.update([palm(150,1100)],rects,t,500).length,0);
});
test('long capture gap cannot create a crossing strike',()=>{
 const s=new Strike();s.update([palm(60,1000)],rects,1000,500);assert.equal(s.update([palm(150,1800)],rects,1800,500).length,0);
});
test('speed uses capture time even when inference delay varies',()=>{
 const s=new Strike();s.update([palm(60,1000)],rects,1050,500);assert.equal(s.update([palm(150,1400)],rects,1700,500).length,1);
});
test('missing or expired hands cannot strike on return',()=>{
 const s=new Strike();s.update([palm(60,1000)],rects,1000,500);s.update([],rects,1100,500);assert.equal(s.update([palm(150,1200)],rects,1200,500).length,0);
 s.update([palm(60,1300)],rects,2000,500);assert.equal(s.update([palm(150,2100)],rects,2100,500).length,0);
});
test('forward push requires withdrawal before another push',()=>{
 const s=new Strike();s.update([palm(150,1000,50)],rects,1000,500);
 assert.equal(s.update([palm(150,1100,65)],rects,1100,500).length,1);
 assert.equal(s.update([palm(150,1500,80)],rects,1500,500).length,0);
 s.update([palm(150,1700,50)],rects,1700,500);
 assert.equal(s.update([palm(150,1850,65)],rects,1850,500).length,1);
});
test('fast path can cross a target between two frames',()=>{
 const s=new Strike();s.update([palm(60,1000)],rects,1000,500);assert.equal(s.update([palm(250,1200)],rects,1200,500).length,1);
});
test('two hand tracks have independent release state',()=>{
 const s=new Strike();s.update([palm(60,1000,50,1),palm(60,1000,50,2)],rects,1000,500);
 assert.equal(s.update([palm(150,1100,50,1),palm(60,1100,50,2)],rects,1100,500).length,1);
 assert.equal(s.update([palm(150,1200,50,1),palm(150,1200,50,2)],rects,1200,500).length,1);
});
test('cursor expiry between slow samples keeps history, actual missing sample clears it',()=>{
 const s=new Strike();s.update([palm(60,1000)],rects,1300,500,1000);
 assert.equal(s.update([],rects,1550,500,1000).length,0);
 assert.equal(s.update([palm(150,1350)],rects,1650,500,1350).length,1);
 s.update([],rects,1700,500,1600);
 assert.equal(s.update([palm(150,1800)],rects,1900,500,1800).length,0);
});
