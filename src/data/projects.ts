import fragments from '../assets/home-01.jpg';
import fragmentsClose from '../assets/home-02.png';
import ralph from '../assets/work-02.png';
import ralphClose from '../assets/work-03.png';
import studio from '../assets/work-01.jpg';
import williams from '../assets/work-05.png';
import williamsPhone from '../assets/work-06.png';
import interview from '../assets/work-10.png';
import workshop from '../assets/work-26.png';
import portrait from '../assets/black-crowe-productions-02.jpg';
import direction from '../assets/about-04.jpg';
import set from '../assets/black-crowe-productions-04.jpeg';
import kb1 from '../assets/work-75.jpeg';
import kb2 from '../assets/work-76.jpeg';
import kb3 from '../assets/work-77.jpeg';
import xzibit from '../assets/home-04.png';
import story from '../assets/home-07.png';
import type { ImageMetadata } from 'astro';

export const media = { fragments, fragmentsClose, ralph, ralphClose, studio, portrait, direction, set, interview, workshop, story, xzibit, williams };
export type Frame = { image: ImageMetadata; alt: string; caption: string };
export type Project = {
 slug: string; title: string; shortTitle: string; type: string; category: string; description: string; cover: ImageMetadata; alt: string; position?: string;
 purpose: string; headline?: string; role: string; context: string; intro: string; sections: {title:string; text:string}[]; credits: {label:string;value:string}[]; frames: Frame[];
};
export const projects: Project[] = [
 {
  slug: 'we-the-free', title: 'We The Free', shortTitle: 'We The Free', type: 'Original programming', category:'Creative development',
  purpose:'Build a Content System / Launch and Promote',
  headline:'Original programming built as a connected brand system.',
  description:'Original programming built as a connected brand system.',cover:williams,alt:'Armstrong Williams in a production frame for We The Free',position:'55% 45%',
  role:'Creative development · Cinematography · Post-production',context:'We The Free engaged Coyote Ranch Films, the production company Ahren co-owned, during the foundational development of its original programming.',
  intro:'A production model for original programming, advertising, promotion, streaming and live production—giving each show its own character within the larger We The Free brand.',
  sections:[
   {title:'The problem',text:'We The Free wanted to develop original shows but did not yet have the creative, production or marketing framework required to turn those ideas into distinctive, repeatable programming.'},
   {title:'The approach',text:'Concepts, visual identities, production systems and promotional strategies were designed together. Each program needed its own character while strengthening the larger We The Free brand.'},
   {title:'The contribution',text:'Through Coyote Ranch Films, Ahren worked across creative development, cinematography, camera operation, directing selected episodes, editing, visual effects, audio and live production.'},
   {title:'The work included',text:'Original shows, advertising and promotional content, streaming series, social assets, live-event recording and broadcast, editorial, visual effects and audio. The scope varied by production.'}
  ],
  credits:[{label:'Platform',value:'We The Free'},{label:'Production partner',value:'Coyote Ranch Films'},{label:'Ahren’s role',value:'Creative development, cinematography, selected directing, post-production and live production'},{label:'Featured film',value:'Fragments — produced by We The Free; directed by Brendan Nieto; cinematography by Ahren Steis'}],
  frames:[
   {image:fragments,alt:'Therapist seated in a warm, directional pool of light in Fragments',caption:'Fragments · Cinematography by Ahren Steis'},
   {image:fragmentsClose,alt:'Close-up from Fragments with restrained warm lighting',caption:'Fragments · Directed by Brendan Nieto'},
   {image:studio,alt:'Behind the scenes with multiple monitors and cameras in a studio',caption:'We The Free · Production and live execution'},
   {image:williams,alt:'Documentary frame of Armstrong Williams looking out of an aircraft window',caption:'We The Free · Selected production frame'},
   {image:interview,alt:'Interview subject lit against a dark studio background',caption:'We The Free · Interview production'},
   {image:workshop,alt:'A workshop scene with controlled red and blue lighting',caption:'We The Free · Selected production frame'}
  ]
 },
 {
  slug:'ralph-lauren',title:'A Portrait of the American Dream: Oak Bluffs',shortTitle:'Ralph Lauren',type:'Documentary',category:'Cinematography',
  purpose:'Document a Story / Build Trust',
  description:'An intimate interview segment for a documentary about Oak Bluffs.',cover:ralphClose,alt:'Interview frame from A Portrait of the American Dream: Oak Bluffs',position:'55% 42%',
  role:'Director of photography · Camera operator',context:'Interview segment produced by Coyote Ranch Films · 2025',
  intro:'Cinematography for an interview segment in Ralph Lauren’s documentary, directed by Cole Brown.',
  sections:[
   {title:'The assignment',text:'Film an interview segment while preserving the natural character of the subject and the location.'},
   {title:'The decision',text:'Use restrained, motivated lighting and the existing environment. The interview needed to feel intimate and visually consistent with the documentary.'},
   {title:'The contribution',text:'Coyote Ranch Films was hired to produce this interview segment. Ahren served as director of photography and camera operator for that segment.'}
  ],
  credits:[{label:'Film',value:'A Portrait of the American Dream: Oak Bluffs'},{label:'Brand',value:'Ralph Lauren'},{label:'Director',value:'Cole Brown'},{label:'Interview segment production',value:'Coyote Ranch Films'},{label:'Segment cinematography / camera',value:'Ahren Steis'},{label:'Year',value:'2025'}],
  frames:[{image:ralph,alt:'Wide interview composition in a naturally lit living room',caption:'Oak Bluffs · Interview segment'},{image:ralphClose,alt:'Close-up interview composition with natural lighting',caption:'Oak Bluffs · Detail of the interview coverage'}]
 },
 {
  slug:'kentucky-ballistics',title:'Kentucky Ballistics × Ballistic Dummy Lab',shortTitle:'Kentucky Ballistics',type:'Episode & promotion',category:'Production & editorial',
  purpose:'Document the Test / Promote the Episode',
  description:'Episode coverage and a promotional edit from the same production.',cover:kb2,alt:'Kentucky Ballistics episode and promotional material',position:'50% 50%',
  role:'Camera · Editorial',context:'In collaboration with the existing production team',
  intro:'Capturing an episode and extending the value of its footage into promotion for the release.',
  sections:[
   {title:'The assignment',text:'Co-shoot an episode produced in conjunction with Ballistic Dummy Lab, capturing material that could support both the episode and its promotion.'},
   {title:'The contribution',text:'Ahren contributed camera coverage alongside the existing production team, as well as editorial work.'},
   {title:'The use',text:'Kentucky Ballistics later used Ahren’s footage and edit to advertise the episode. The promotional material served a different purpose from the episode: giving the audience a reason to watch.'}
  ],
  credits:[{label:'Production',value:'Kentucky Ballistics × Ballistic Dummy Lab'},{label:'Ahren’s role',value:'Camera and editorial'},{label:'Format',value:'Episode coverage and promotional edit'}],
  frames:[{image:kb1,alt:'Vertical promotional frame from the Kentucky Ballistics collaboration',caption:'Episode coverage · Promotional material'},{image:kb2,alt:'Kentucky Ballistics episode promotional frame',caption:'Episode coverage · Promotional material'},{image:kb3,alt:'Vertical frame documenting the Kentucky Ballistics production',caption:'Episode coverage · Promotional material'}]
 }
];
export const selectedFrames: Frame[] = [projects[0].frames[0],projects[1].frames[1],{image:story,alt:'Two people in a church in Come Walk With Me',caption:'Come Walk With Me · Selected production frame'}, {image:williamsPhone,alt:'Armstrong Williams seated inside an aircraft',caption:'We The Free · Selected production frame'}];
export const services = [
 {title:'Diagnosis & strategy',description:'Define what the audience needs to understand, believe or do before committing to a production.',items:['Communication and positioning review','Audience questions and evidence','Creative direction and production brief'],example:'When the expertise is clear internally, but its value is difficult to explain outside the business.'},
 {title:'Campaign production',description:'Build the production around the message, the evidence and the places the work needs to appear.',items:['Branded documentary and interviews','Campaigns, demonstrations and original series','Editorial, sound, visual effects and delivery'],example:'When the direction is defined and you need the right team to turn it into finished work.'},
 {title:'Strategic continuity',description:'Keep the communication useful as the business, its audience and its priorities change.',items:['Ongoing creative advisory','Recurring production and focused edits','Planning across sales, web and social'],example:'When the work needs a consistent creative partner beyond a single release.'}
];
