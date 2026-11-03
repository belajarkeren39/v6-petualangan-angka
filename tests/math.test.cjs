const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const scope={window:{addEventListener(){}}};vm.createContext(scope);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../aset/js/sensor-camera.js'),'utf8'),scope);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../aset/js/bank-angka.js'),'utf8')+';this.bank=MATH_QUESTIONS;',scope);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../aset/js/game.js'),'utf8')+';this.Game=EcosystemQuadrantGame;',scope);
const bank=scope.bank;
// Independently reviewed answer keys, including units, time and decimal commas.
const keys={
 K1:['5','6','9','10','13','3','5','6','10','10','4','7','10','15','19','8','9','15','16','20','4','7','10','14','19','Segitiga','Lingkaran','4','3','Sepuluh'],
 K2:['18','37','55','58','45','13','32','40','42','34','6','12','8','25','27','43','65','81','1000 rupiah','1500 rupiah','2000 rupiah','2500 rupiah','08.00','10.00','12.00','12.00','100','60','7','50 cm'],
 K3:['24','21','40','54','56','6','7','8','9','9','1/2','1/3','1/4','1/8','200','300','400','500','2 jam','3 jam','4 jam','5 jam','12 cm','16 cm','20 cm','24 cm','21','36','30','48'],
 K4:['48','90','69','120','12','12','12','12','2/4','2/6','4/6','6/8','15 cm²','28 cm²','40 cm²','54 cm²','18 cm','24 cm','28 cm','32 cm','3','6','21','36','90°','Lancip','Tumpul','3000','2000','240'],
 K5:['1,5','4','4','1,5','6,5','3/5','5/8','4/7','3/4','8','10','30','30','8 cm³','27 cm³','64 cm³','125 cm³','12 cm²','20 cm²','30 cm²','42 cm²','6','7','8','150','2500','1250','10000 rupiah','9000 rupiah','15000 rupiah'],
 K6:['5','-3','-7','-3','0','3/4','1/4','1/2','2','3 3/4','12','20','15','15','9000 rupiah','15000 rupiah','40000 rupiah','20000 rupiah','154 cm²','616 cm²','44 cm','88 cm','24 cm³','60 cm³','80 cm³','200 cm³','8','8','7','10']
};
for(const grade of Object.keys(keys)){
 test(grade+': 30 unique questions with reviewed answers and explanations',()=>{
  const questions=bank[grade];assert.equal(questions.length,30);assert.equal(new Set(questions.map(q=>q.question)).size,30);
  questions.forEach((q,i)=>{assert.equal(q.id,grade+'-'+(i+1));assert.equal(q.difficulty,grade);assert.equal(q.options[0],keys[grade][i],q.id+': '+q.question);assert.equal(new Set(q.options).size,4);assert(q.explanation.length>15);});
 });
 test(grade+': randomized full session keeps each answer with its question',()=>{
  const game=Object.create(scope.Game.prototype);
  for(let round=0;round<5;round++){
   const session=game.buildSessionQuestions(grade,30);assert.equal(new Set(session.map(q=>q.id)).size,30);
   for(const q of session){const source=bank[grade].find(s=>s.id===q.id);assert.equal(q.options[q.correctIndex],source.options[0]);assert.equal(q.explanation,source.explanation);}
  }
 });
}
test('fraction alternatives do not contain a second equivalent correct answer',()=>{
 const value=s=>{if(/^\d+ \d+\/\d+$/.test(s)){const [a,b]=s.split(' ');return +a+value(b);}if(/^\d+\/\d+$/.test(s)){const [a,b]=s.split('/');return a/b;}if(/^-?\d+(,\d+)?$/.test(s))return Number(s.replace(',','.'));return NaN;};
 for(const q of Object.values(bank).flat()){
  const v=value(q.options[0]);if(Number.isNaN(v))continue;
  for(const option of q.options.slice(1))assert(Math.abs(value(option)-v)>1e-10||Number.isNaN(value(option)),q.id+': '+option);
 }
});
test('visible pages use math branding and the math bank',()=>{
 for(const file of ['index.html','pratinjau-animasi.html']){const html=fs.readFileSync(path.join(__dirname,'..',file),'utf8');assert.match(html,/Petualangan Angka/);assert(!/Petualangan Kata|Bahasa Indonesia|bank-kata/.test(html));}
});
