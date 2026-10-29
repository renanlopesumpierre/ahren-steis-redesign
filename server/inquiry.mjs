const fallback='https://www.ahrensteis.com/start-here';
const message='Online submission is temporarily unavailable. Please use the contact page below to complete your inquiry.';
export function validateInquiry(value){
 if(!value||typeof value!=='object'||Array.isArray(value))return {error:'Please complete the required fields.'};
 const text=(key,max)=>typeof value[key]==='string'?value[key].trim().slice(0,max+1):'';
 const data={name:text('name',120),email:text('email',254),company:text('company',160),project:text('project',5000),service:text('service',80),website:text('website',200)};
 if(data.website)return {error:'Please try again.',bot:true};
 if(data.name.length<2||data.name.length>120)return {error:'Please enter your name (2–120 characters).',field:'name'};
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)||data.email.length>254||/[\r\n]/.test(data.email))return {error:'Please enter a valid email address.',field:'email'};
 if(data.company.length>160)return {error:'Please shorten the company name.',field:'company'};
 if(data.project.length<20||data.project.length>5000)return {error:'Please describe the project in 20–5,000 characters.',field:'project'};
 if(!['','strategy','production','continuity','not-sure'].includes(data.service))return {error:'Please select one of the available services.',field:'service'};
 return {data};
}
export async function submitInquiry(value,{env=process.env,fetcher=fetch}={}){
 const validated=validateInquiry(value);
 if(validated.error)return {status:400,body:{ok:false,error:validated.error,field:validated.field}};
 if(!env.RESEND_API_KEY||!env.INQUIRY_TO||!env.INQUIRY_FROM)return {status:503,body:{ok:false,error:message,fallback}};
 const {data}=validated;
 try{
  const response=await fetcher('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:env.INQUIRY_FROM,to:[env.INQUIRY_TO],reply_to:data.email,subject:`Website inquiry — ${data.name.replace(/[\r\n]/g,' ')}`,text:`Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company||'Not supplied'}\nService: ${data.service||'Not sure yet'}\n\nProject:\n${data.project}`}),signal:AbortSignal.timeout(10000)});
  if(!response.ok)return {status:502,body:{ok:false,error:message,fallback}};
  const result=await response.json();
  if(!result.id)return {status:502,body:{ok:false,error:message,fallback}};
  return {status:200,body:{ok:true,message:'Your inquiry has been submitted. Ahren will review the project and reply by email.'}};
 }catch{return {status:502,body:{ok:false,error:message,fallback}};}
}
