import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { submitInquiry } from '../server/inquiry.mjs';
const root=path.resolve('dist'),port=Number(process.env.PORT||4842);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'};
const server=http.createServer(async(req,res)=>{
 const json=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
 if(req.url==='/api/inquiry'){
  if(req.method!=='POST')return json(405,{ok:false,error:'Method not allowed.'});
  if(req.headers.origin!==`http://127.0.0.1:${port}`&&req.headers.origin!==`http://localhost:${port}`)return json(403,{ok:false,error:'Please use the website form.'});
  let body='';try{for await(const chunk of req){body+=chunk;if(body.length>16000)return json(413,{ok:false,error:'Please shorten the message.'});}const result=await submitInquiry(JSON.parse(body),{env:{}});return json(result.status,result.body);}catch{return json(400,{ok:false,error:'Please check the form.'});}
 }
 try{
  const url=new URL(req.url,'http://127.0.0.1');const decoded=decodeURIComponent(url.pathname);
  let target=path.resolve(root,'.'+decoded);
  if(!target.startsWith(root+path.sep)&&target!==root){res.writeHead(403);res.end();return;}
  try{if((await stat(target)).isDirectory())target=path.join(target,'index.html');}catch{target=path.join(root,'404.html');res.statusCode=404;}
  const data=await readFile(target);
  res.setHeader('Content-Type',mime[path.extname(target)]||'application/octet-stream');
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  if(path.extname(target)==='.html')res.setHeader('Cache-Control','no-store');
  res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Local preview: http://127.0.0.1:${port}`));
