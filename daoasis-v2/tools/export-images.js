// Exports the V2 app screens and generated plates as image files for the website copy.
// Needs a static server on the daoasis-v2 folder:  python3 -m http.server 8899
// Run: NODE_PATH=$(npm root -g) node tools/export-images.js
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const OUT=path.join(__dirname,'../site/images/v2'),BASE='http://localhost:8899';
(async()=>{
  const b=await chromium.launch(),p=await b.newPage({viewport:{width:1200,height:1000},deviceScaleFactor:2});
  for(const s of ['home','journey','today','stage','route','milestones','library']){
    await p.goto(`${BASE}/app/?journey=everest-base-camp&screen=${s}`,{waitUntil:'networkidle'});
    await p.addStyleTag({content:'.phone-wrap{max-width:410px!important}.phone{box-shadow:none!important}'});
    await p.evaluate(()=>window.dispatchEvent(new Event('resize')));await p.waitForTimeout(400);
    const png=path.join(OUT,`app-v2-${s}.png`);await (await p.$('.phone')).screenshot({path:png,omitBackground:true});
    execFileSync('python3',['-c',`from PIL import Image;im=Image.open('${png}');im.thumbnail((800,1700));im.save('${png.replace('.png','.webp')}','WEBP',quality=88,alpha_quality=100,method=6)`]);fs.unlinkSync(png);
  }
  // generated plates
  const J=JSON.parse(fs.readFileSync(path.join(__dirname,'../journeys/journeys.json'))).journeys,A=require('./journey-art.js');
  const plates=[['ridge-everest',J[0],2400,1300,{sunx:.66}],['ridge-everest-tall',J[0],1200,1800,{sunx:.5}],['ridge-lejog',J[2],1600,1000,{peaks:0,sunx:.3}]];
  for(const [n,j,W,H,o] of plates){
    await p.setViewportSize({width:W/2,height:H/2});
    await p.setContent(`<style>body{margin:0}svg{width:${W/2}px;height:${H/2}px;display:block}</style>${A.ridge(j,Object.assign({W,H},o))}`);
    const png=path.join(OUT,n+'.png');await p.screenshot({path:png});
    execFileSync('python3',['-c',`from PIL import Image;Image.open('${png}').convert('RGB').save('${png.replace('.png','.jpg')}',quality=86,optimize=True,progressive=True)`]);fs.unlinkSync(png);
  }
  await b.close();console.log(fs.readdirSync(OUT).map(f=>f+' '+Math.round(fs.statSync(path.join(OUT,f)).size/1024)+'KB').join('\n'));
})();
