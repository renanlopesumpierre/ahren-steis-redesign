import { readdir, readFile, access, writeFile, stat, mkdir } from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
async function walk(dir){let out=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);out.push(...(e.isDirectory()?await walk(p):[p]));}return out;}
const files=await walk(root),pages=files.filter(f=>f.endsWith('.html')),errors=[],summary=[];
for(const file of pages){
 const html=await readFile(file,'utf8'),route='/'+path.relative(root,file).replace(/index\.html$/,'');
 const redirect=/http-equiv="refresh"/i.test(html);
 const h1=[...html.matchAll(/<h1(?:\s|>)/g)].length;
 if(!redirect&&h1!==1)errors.push(`${route}: ${h1} h1s`);
 if(!redirect&&!html.includes('noindex'))errors.push(`${route}: missing preview noindex`);
 for(const tag of html.matchAll(/<img\b[^>]*>/g)){if(!/\balt(?:[=\s>])/.test(tag[0]))errors.push(`${route}: missing image alt`);if(!/\bsrc="[^"]+"/.test(tag[0]))errors.push(`${route}: missing image src`);}
 for(const attr of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)){
  let target=path.join(root,decodeURIComponent(attr[1]));try{const s=await stat(target);if(s.isDirectory())target=path.join(target,'index.html');await access(target);}catch{errors.push(`${route}: missing ${attr[1]}`);}
 }
 summary.push({route,redirect,h1,htmlBytes:Buffer.byteLength(html),inlineScriptBytes:[...html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)].reduce((n,m)=>n+Buffer.byteLength(m[1]),0)});
}
const code=files.filter(f=>/\.(js|css)$/.test(f));const sizes=await Promise.all(code.map(async f=>({file:path.relative(root,f),bytes:(await stat(f)).size})));
const report={pages:summary,code:sizes,errors:[...new Set(errors)]};await mkdir('qa',{recursive:true});await writeFile('qa/static-verification.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({pages:pages.length,contentPages:summary.filter(p=>!p.redirect).length,redirects:summary.filter(p=>p.redirect).length,errors:report.errors,code:sizes},null,2));
if(errors.length)process.exitCode=1;
