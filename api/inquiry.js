import { submitInquiry } from '../server/inquiry.mjs';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({ok:false,error:'Method not allowed.'});}
 const allowed=process.env.SITE_ORIGIN||'https://www.ahrensteis.com';
 if(req.headers.origin!==allowed)return res.status(403).json({ok:false,error:'Please use the website form.'});
 if(!String(req.headers['content-type']).includes('application/json'))return res.status(415).json({ok:false,error:'Unsupported request format.'});
 let body;
 try{body=typeof req.body==='string'?JSON.parse(req.body):req.body;if(JSON.stringify(body).length>16000)throw new Error();}catch{return res.status(400).json({ok:false,error:'Please check the form and try again.'});}
 const result=await submitInquiry(body);return res.status(result.status).json(result.body);
}
