import { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import { Box, Stack, Typography, IconButton, Paper, InputBase, Button, ButtonBase, Divider, Chip, ToggleButtonGroup, ToggleButton, Tooltip, Container, TextField, Select, MenuItem, FormControl, InputAdornment, Icon as MuiIcon, Menu, ListItemIcon, ListItemText, Link, Collapse, Fab, Skeleton, Fade, Dialog, DialogTitle, DialogContent, DialogActions, Badge, Checkbox, FormControlLabel, Alert, Snackbar } from '@mui/material';
import { lighten, darken, alpha } from '@mui/material/styles';
import AppShell from '@archera/design-system/AppShell';
import palette from '@archera/design-system/palettes/archera-palette';
import { color, typography, radius } from '@archera/design-system/tokens';

// Animation color constants — must be plain hex strings for the SVG lerp functions
const C_PRIMARY   = palette.brandPrimary[500];
const C_SECONDARY = palette.brandSecondary[500];
const C_TERTIARY  = palette.brandTertiary[500];
const C_ACCENT    = palette.accent1[500];



// ─── SVG animation constants ──────────────────────────────────────────────────
const NS = "http://www.w3.org/2000/svg";
const LG = "M26.7279 10.6158C27.7676 7.24828 32.5473 7.24828 33.587 10.6158L38.7004 27.1779C39.0524 28.3179 39.9507 29.2081 41.0961 29.5518L57.7604 34.552C61.1665 35.574 61.1665 40.384 57.7604 41.406L41.0961 46.4063C39.9507 46.7499 39.0524 47.6401 38.7004 48.7801L33.587 65.3423C32.5473 68.7097 27.7676 68.7097 26.7279 65.3423L21.6145 48.7801C21.2626 47.6401 20.3642 46.7499 19.2189 46.4063L2.55455 41.406C-0.851516 40.384 -0.851516 35.574 2.55455 34.552L19.2189 29.5518C20.3642 29.2081 21.2626 28.3179 21.6145 27.1779L26.7279 10.6158Z";
const CO = "M62.0869 49.4656C62.6414 47.6696 65.1906 47.6696 65.7451 49.4656L68.4722 58.2987C68.66 58.9067 69.1391 59.3815 69.7499 59.5648L78.6376 62.2316C80.4541 62.7766 80.4541 65.3419 78.6376 65.887L69.7499 68.5538C69.1391 68.7371 68.66 69.2119 68.4722 69.8199L65.7451 78.653C65.1906 80.449 62.6414 80.449 62.0869 78.653L59.3598 69.8199C59.1721 69.2119 58.6929 68.7371 58.0821 68.5538L49.1945 65.887C47.3779 65.3419 47.3779 62.7766 49.1945 62.2316L58.0821 59.5648C58.6929 59.3815 59.1721 58.9067 59.3598 58.2987L62.0869 49.4656Z";
const BL = "M62.9641 1.01024C63.38 -0.336747 65.2919 -0.336748 65.7077 1.01024L67.7531 7.6351C67.8939 8.0911 68.2532 8.44718 68.7114 8.58464L75.3771 10.5848C76.7395 10.9936 76.7395 12.9175 75.3771 13.3263L68.7114 15.3264C68.2532 15.4639 67.8939 15.82 67.7531 16.276L65.7077 22.9008C65.2919 24.2478 63.38 24.2478 62.9641 22.9008L60.9188 16.276C60.778 15.82 60.4186 15.4639 59.9605 15.3264L53.2948 13.3263C51.9323 12.9175 51.9323 10.9936 53.2948 10.5848L59.9605 8.58465C60.4186 8.44718 60.778 8.0911 60.9188 7.6351L62.9641 1.01024Z";

function softStar(cx,cy,sc,isc=sc){const f=n=>n.toFixed(4),o=(x,y)=>`${f((x-30)*sc+cx)},${f((y-30)*sc+cy)}`,i=(x,y)=>`${f((x-30)*isc+cx)},${f((y-30)*isc+cy)}`;return[`M${o(26.5884,2.535)}C${o(27.6226,-0.845)} ${o(32.3774,-0.845)} ${o(33.4116,2.535)}`,`L${o(38.4983,16.1476)}C${i(38.8485,17.8918)} ${i(42.1265,21.1965)} ${o(43.8658,21.5414)}`,`L${o(57.4588,26.5603)}C${i(60.8471,27.5861)} ${i(60.8471,32.4139)} ${o(57.4588,33.4397)}`,`L${o(43.8658,38.4586)}C${i(42.1265,38.8035)} ${i(38.8485,42.1082)} ${o(38.4983,43.8524)}`,`L${o(33.4116,57.465)}C${i(32.3774,60.845)} ${i(27.6226,60.845)} ${o(26.5884,57.465)}`,`L${o(21.5017,43.8524)}C${i(21.1516,42.1082)} ${i(17.8736,38.8035)} ${o(16.1342,38.4586)}`,`L${o(2.54121,33.4397)}C${i(-0.84707,32.4139)} ${i(-0.84707,27.5861)} ${o(2.54121,26.5603)}`,`L${o(16.1342,21.5414)}C${i(17.8735,21.1965)} ${i(21.1516,17.8918)} ${o(21.5017,16.1476)}Z`].join(" ");}
const LGS=softStar(30.16,37.98,27.5/30,29/30),COS=softStar(63.92,64.06,13/30,14/30),BLS=softStar(64.34,11.96,10/30,11/30);
function gearPath(cx,cy,outerR,innerR,teeth,tw=0.45,r=0.12){const step=(Math.PI*2)/teeth,f=n=>n.toFixed(3),pts=[];for(let i=0;i<teeth;i++){const a0=i*step-step*0.5,a1=a0+step*(0.5-tw*0.5),a2=a0+step*(0.5+tw*0.5),a3=a0+step;pts.push([cx+innerR*Math.cos(a0),cy+innerR*Math.sin(a0)],[cx+outerR*Math.cos(a1),cy+outerR*Math.sin(a1)],[cx+outerR*Math.cos(a2),cy+outerR*Math.sin(a2)],[cx+innerR*Math.cos(a3),cy+innerR*Math.sin(a3)]);}const n=pts.length;let d="";for(let i=0;i<n;i++){const p=pts[(i-1+n)%n],c=pts[i],nx=pts[(i+1)%n],tx=p[0]-c[0],ty=p[1]-c[1],ux=nx[0]-c[0],uy=nx[1]-c[1],dp=Math.sqrt(tx*tx+ty*ty),dn=Math.sqrt(ux*ux+uy*uy);if(dp<.001||dn<.001){d+=i===0?`M${f(c[0])},${f(c[1])}`:`L${f(c[0])},${f(c[1])}`;continue;}const off=Math.min(dp,dn)*r,ex=c[0]+(tx/dp)*off,ey=c[1]+(ty/dp)*off,xx=c[0]+(ux/dn)*off,xy=c[1]+(uy/dn)*off;d+=i===0?`M${f(ex)},${f(ey)}`:`L${f(ex)},${f(ey)}`;d+=`Q${f(c[0])},${f(c[1])} ${f(xx)},${f(xy)}`;}return d+"Z";}
const GLG=gearPath(32.62,38.48,28*0.8,20*0.8,8),GCO=gearPath(57.94,58.05,13*0.8,9*0.8,6),GBL=gearPath(58.26,18.97,10*0.8,7*0.8,6);
function star5(cx,cy,outerR,innerR){const f=n=>n.toFixed(4),v=[];for(let i=0;i<10;i++){const a=(i*Math.PI/5)-Math.PI/2,rad=i%2===0?outerR:innerR;v.push([cx+rad*Math.cos(a),cy+rad*Math.sin(a)]);}let d="";for(let i=0;i<10;i++){const p=v[(i-1+10)%10],c=v[i],nx=v[(i+1)%10],tx=p[0]-c[0],ty=p[1]-c[1],ux=nx[0]-c[0],uy=nx[1]-c[1],dp=Math.sqrt(tx*tx+ty*ty),dn=Math.sqrt(ux*ux+uy*uy);if(dp<.001||dn<.001){d+=i===0?`M${f(c[0])},${f(c[1])}`:`L${f(c[0])},${f(c[1])}`;continue;}const ro=i%2===0?.3:.1,off=Math.min(dp,dn)*ro,ex=c[0]+(tx/dp)*off,ey=c[1]+(ty/dp)*off,xx=c[0]+(ux/dn)*off,xy=c[1]+(uy/dn)*off;d+=i===0?`M${f(ex)},${f(ey)}`:`L${f(ex)},${f(ey)}`;d+=`Q${f(c[0])},${f(c[1])} ${f(xx)},${f(xy)}`;}return d+"Z";}
const SLG=star5(40,40,36,14),SCO=star5(40,40,9,3.4),SBL=star5(40,40,7,2.6);
const N=120,ptCache={};
function smp(d){const el=document.createElementNS(NS,"path");el.setAttribute("d",d);document.body.appendChild(el);const len=el.getTotalLength(),pts=Array.from({length:N},(_,i)=>{const p=el.getPointAtLength((i/N)*len);return[p.x,p.y];});document.body.removeChild(el);return pts;}
function smpC(k,d){if(!ptCache[k])ptCache[k]=smp(d);return ptCache[k];}
function lrp(a,b,t){return a.map((p,i)=>[p[0]+(b[i][0]-p[0])*t,p[1]+(b[i][1]-p[1])*t]);}
function tD(pts){return"M"+pts.map(p=>p.map(n=>n.toFixed(3)).join(",")).join("L")+"Z";}
function eio(t){return t<.5?2*t*t:-1+(4-2*t)*t;}
function eo3(t){return 1-Math.pow(1-t,3);}
function lh(a,b,t){const h=s=>[parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16)];const[ar,ag,ab]=h(a),[br,bg,bb]=h(b);return"#"+[ar+(br-ar)*t,ag+(bg-ag)*t,ab+(bb-ab)*t].map(v=>Math.round(v).toString(16).padStart(2,"0")).join("");}
function cbz(t){const cx=1.2,bx=-.6,ax=.4,cy=0,by=3,ay=-2;const sx=u=>((ax*u+bx)*u+cx)*u,sy=u=>((ay*u+by)*u+cy)*u,dx=u=>(3*ax*u+2*bx)*u+cx;let u=t;for(let i=0;i<8;i++)u-=(sx(u)-t)/dx(u);return Math.max(0,Math.min(1,sy(u)));}
function mkSVGEl(size=40){const s=document.createElementNS(NS,"svg");s.setAttribute("width",String(size));s.setAttribute("height",String(size));s.setAttribute("viewBox","0 0 80 80");s.setAttribute("fill","none");s.style.overflow="visible";return s;}
function mkP(d,f){const p=document.createElementNS(NS,"path");p.setAttribute("d",d);p.setAttribute("fill",f);return p;}
function mkC(cx,cy,r,f){const c=document.createElementNS(NS,"circle");c.setAttribute("cx",cx);c.setAttribute("cy",cy);c.setAttribute("r",r);c.setAttribute("fill",f);return c;}

// ─── Archera star logo (inline SVG — unique brand asset) ──────────────────────
function ArcheraLogo({ size = 20, tint, breathe=false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none"
      style={{flexShrink:0, ...(breathe && {animation:'logoBreath 3s ease-in-out infinite', transformOrigin:'center'})}}
    >
      <path d="M26.7 10.6C27.8 7.2 32.5 7.2 33.6 10.6L38.7 27.2C39.1 28.3 40 29.2 41.1 29.6L57.8 34.6C61.2 35.6 61.2 40.4 57.8 41.4L41.1 46.4C40 46.7 39.1 47.6 38.7 48.8L33.6 65.3C32.5 68.7 27.8 68.7 26.7 65.3L21.6 48.8C21.3 47.6 20.4 46.7 19.2 46.4L2.6 41.4C-.9 40.4 -.9 35.6 2.6 34.6L19.2 29.6C20.4 29.2 21.3 28.3 21.6 27.2Z" fill={tint || C_PRIMARY}/>
      <path d="M62.1 49.5C62.6 47.7 65.2 47.7 65.7 49.5L68.5 58.3C68.7 58.9 69.1 59.4 69.7 59.6L78.6 62.2C80.5 62.8 80.5 65.3 78.6 65.9L69.7 68.6C69.1 68.7 68.7 69.2 68.5 69.8L65.7 78.7C65.2 80.4 62.6 80.4 62.1 78.7L59.4 69.8C59.2 69.2 58.7 68.7 58.1 68.6L49.2 65.9C47.4 65.3 47.4 62.8 49.2 62.2L58.1 59.6C58.7 59.4 59.2 58.9 59.4 58.3Z" fill={tint || C_TERTIARY}/>
      <path d="M63 1C63.4 -.3 65.3 -.3 65.7 1L67.8 7.6C67.9 8.1 68.3 8.4 68.7 8.6L75.4 10.6C76.7 11 76.7 12.9 75.4 13.3L68.7 15.3C68.3 15.5 67.9 15.8 67.8 16.3L65.7 22.9C65.3 24.2 63.4 24.2 63 22.9L60.9 16.3C60.8 15.8 60.4 15.5 60 15.3L53.3 13.3C51.9 12.9 51.9 11 53.3 10.6L60 8.6C60.4 8.4 60.8 8.1 60.9 7.6Z" fill={tint || C_SECONDARY}/>
    </svg>
  );
}

// ─── Animated Archera icon ────────────────────────────────────────────────────
function Icon({ mode, onDone, size=40 }) {
  const ref=useRef(null),rafs=useRef([]);
  function stopAll(){rafs.current.forEach(r=>cancelAnimationFrame(r));rafs.current=[];}
  useEffect(()=>{
    const wrap=ref.current;if(!wrap)return;stopAll();
    if(mode==="done"){wrap.innerHTML="";return;}
    if(mode==="breathe"){
      const s=mkSVGEl(size),pL=mkP(LG,C_PRIMARY),pC=mkP(CO,C_TERTIARY),pB=mkP(BL,C_SECONDARY);
      s.appendChild(pL);s.appendChild(pC);s.appendChild(pB);wrap.innerHTML="";wrap.appendChild(s);
      const sLG=smpC("LG",LG),tLG=smpC("LGS",LGS),sCO=smpC("CO",CO),tCO=smpC("COS",COS),sBL=smpC("BL",BL),tBL=smpC("BLS",BLS);
      let t0=null;
      function tick(ts){if(!t0)t0=ts;const p=((ts-t0)%3500)/3500,half=p<.5?p*2:(1-p)*2,bz=cbz(half);pL.setAttribute("d",tD(lrp(sLG,tLG,bz)));pL.setAttribute("transform",`translate(${30.16+(40-30.16)*(1-bz)*.35},${37.98+(40-37.98)*(1-bz)*.35}) scale(${(.9+bz*.2).toFixed(4)}) translate(-30.16,-37.98)`);pC.setAttribute("d",tD(lrp(sCO,tCO,bz)));pC.setAttribute("transform",`translate(${63.92+(40-63.92)*(1-bz)*.14},${64.06+(40-64.06)*(1-bz)*.14}) scale(${(.92+bz*.16).toFixed(4)}) translate(-63.92,-64.06)`);pB.setAttribute("d",tD(lrp(sBL,tBL,bz)));pB.setAttribute("transform",`translate(${64.34+(40-64.34)*(1-bz)*.14},${11.96+(40-11.96)*(1-bz)*.14}) scale(${(.92+bz*.16).toFixed(4)}) translate(-64.34,-11.96)`);rafs.current.push(requestAnimationFrame(tick));}
      rafs.current.push(requestAnimationFrame(tick));
    } else if(mode==="thinking"){
      const fL=smpC("LG",LG),fC=smpC("CO",CO),fB=smpC("BL",BL),tL=smpC("GLG",GLG),tC=smpC("GCO",GCO),tB=smpC("GBL",GBL);
      const s=mkSVGEl(size),gL=document.createElementNS(NS,"g"),gC=document.createElementNS(NS,"g"),gB=document.createElementNS(NS,"g");
      const pL=mkP(LG,C_PRIMARY),pC=mkP(CO,C_TERTIARY),pB=mkP(BL,C_SECONDARY);
      const hL=mkC(32.62,38.48,0,"#fff"),hC=mkC(57.94,58.05,0,"#fff"),hB=mkC(58.26,18.97,0,"#fff");
      gL.appendChild(pL);gL.appendChild(hL);gC.appendChild(pC);gC.appendChild(hC);gB.appendChild(pB);gB.appendChild(hB);
      s.appendChild(gL);s.appendChild(gC);s.appendChild(gB);wrap.innerHTML="";wrap.appendChild(s);
      const MORPH=1200,HOLE=200;let t0=null,done=false,ht0=null;
      function tick(ts){if(!t0)t0=ts;const el=ts-t0;if(!done){const raw=Math.min(el/MORPH,1),t=raw*raw;pL.setAttribute("d",tD(lrp(fL,tL,t)));pC.setAttribute("d",tD(lrp(fC,tC,t)));pB.setAttribute("d",tD(lrp(fB,tB,t)));gL.setAttribute("transform",`translate(32.62,38.48) rotate(${(270*t).toFixed(2)}) translate(-32.62,-38.48)`);gC.setAttribute("transform",`translate(57.94,58.05) rotate(${(-360*t).toFixed(2)}) translate(-57.94,-58.05)`);gB.setAttribute("transform",`translate(58.26,18.97) rotate(${(180*t).toFixed(2)}) translate(-58.26,-18.97)`);if(raw>=1){done=true;ht0=ts;pL.setAttribute("d",GLG);pC.setAttribute("d",GCO);pB.setAttribute("d",GBL);gL.removeAttribute("transform");gC.removeAttribute("transform");gB.removeAttribute("transform");gL.style.cssText="transform-origin:32.62px 38.48px;animation:gl 4s linear infinite";gC.style.cssText="transform-origin:57.94px 58.05px;animation:gc 1.86s linear infinite";gB.style.cssText="transform-origin:58.26px 18.97px;animation:gb 1.4s linear infinite";}}else{const hp=eio(Math.min((ts-ht0)/HOLE,1));hL.setAttribute("r",7*0.8*hp);hC.setAttribute("r",3.5*0.8*hp);hB.setAttribute("r",2.8*0.8*hp);if(ts-ht0>=HOLE){hL.setAttribute("r",5.6);hC.setAttribute("r",2.8);hB.setAttribute("r",2.24);return;}}rafs.current.push(requestAnimationFrame(tick));}
      rafs.current.push(requestAnimationFrame(tick));
    } else if(mode==="success"){
      const fL=smpC("GLG",GLG),fC=smpC("GCO",GCO),fB=smpC("GBL",GBL),tL=smpC("SLG",SLG),tC=smpC("SCO",SCO),tB=smpC("SBL",SBL);
      const s=mkSVGEl(size),pL=mkP(GLG,C_PRIMARY),pC=mkP(GCO,C_TERTIARY),pB=mkP(GBL,C_SECONDARY);
      const grp=document.createElementNS(NS,"g");grp.appendChild(pL);grp.appendChild(pC);grp.appendChild(pB);s.appendChild(grp);wrap.innerHTML="";wrap.appendChild(s);
      const MORPH=400,TADA=400;let t0=null,phase="morph";
      function tick(ts){if(!t0)t0=ts;const el=ts-t0;if(phase==="morph"){const t=eio(Math.min(el/MORPH,1));pL.setAttribute("d",tD(lrp(fL,tL,t)));pL.setAttribute("fill",lh(C_PRIMARY,C_ACCENT,t));pC.setAttribute("d",tD(lrp(fC,tC,t)));pC.setAttribute("fill",lh(C_TERTIARY,C_ACCENT,t));pB.setAttribute("d",tD(lrp(fB,tB,t)));pB.setAttribute("fill",lh(C_SECONDARY,C_ACCENT,t));if(el>=MORPH){phase="tada";t0=ts;pL.setAttribute("d",SLG);pL.setAttribute("fill",C_ACCENT);pC.setAttribute("d",SCO);pC.setAttribute("fill",C_ACCENT);pB.setAttribute("d",SBL);pB.setAttribute("fill",C_ACCENT);}rafs.current.push(requestAnimationFrame(tick));}else{const p=Math.min(el/TADA,1);let sc,rot;if(p<0.4){const u=eio(p/0.4);sc=1+u*0.2;rot=-15*u;}else if(p<0.7){const u=eio((p-0.4)/0.3);sc=1.2-u*0.15;rot=-15*(1-u);}else{const u=eio((p-0.7)/0.3);sc=1.05-u*0.05;rot=0;}grp.setAttribute("transform",`translate(40,40) scale(${sc.toFixed(4)}) rotate(${rot.toFixed(2)}) translate(-40,-40)`);if(el>=TADA){grp.setAttribute("transform","");if(onDone)onDone();return;}rafs.current.push(requestAnimationFrame(tick));}}
      rafs.current.push(requestAnimationFrame(tick));
    } else if(mode==="reset"){
      const SC=star5(40,40,36,14),SCC=star5(40,40,9,3.4),SBC=star5(40,40,7,2.6);
      const fL=smp(SC),fC=smp(SCC),fB=smp(SBC),tL=smpC("LG",LG),tC=smpC("CO",CO),tB=smpC("BL",BL);
      const s=mkSVGEl(size),outer=document.createElementNS(NS,"g");
      const gL=document.createElementNS(NS,"g"),gC=document.createElementNS(NS,"g"),gB=document.createElementNS(NS,"g");
      const pL=mkP(SC,C_ACCENT),pC=mkP(SCC,C_ACCENT),pB=mkP(SBC,C_ACCENT);
      gL.appendChild(pL);gC.appendChild(pC);gB.appendChild(pB);outer.appendChild(gL);outer.appendChild(gC);outer.appendChild(gB);s.appendChild(outer);wrap.innerHTML="";wrap.appendChild(s);
      const DUR=400,SHRINK=300,TOTAL=DUR+SHRINK;let t0=null;
      function tick(ts){if(!t0)t0=ts;const el=ts-t0,raw=Math.min(el,DUR),t=eio(raw/DUR),sp=eo3(raw/DUR);const c1=t<0.7?t/0.7:1,c2=t>0.7?(t-0.7)/0.3:0;pL.setAttribute("d",tD(lrp(fL,tL,t)));pL.setAttribute("fill",c2>0?`rgba(152,152,160,${(0.45*c2).toFixed(3)})`:lh(C_ACCENT,C_PRIMARY,c1));pC.setAttribute("d",tD(lrp(fC,tC,t)));pC.setAttribute("fill",c2>0?`rgba(152,152,160,${(0.45*c2).toFixed(3)})`:lh(C_ACCENT,C_TERTIARY,c1));pB.setAttribute("d",tD(lrp(fB,tB,t)));pB.setAttribute("fill",c2>0?`rgba(152,152,160,${(0.45*c2).toFixed(3)})`:lh(C_ACCENT,C_SECONDARY,c1));const lgX=40+(30.16-40)*t,lgY=40+(37.98-40)*t,cX=40+(63.92-40)*t,cY=40+(64.06-40)*t,bX=40+(64.34-40)*t,bY=40+(11.96-40)*t;gL.setAttribute("transform",`translate(${lgX.toFixed(3)},${lgY.toFixed(3)}) rotate(${((1-sp)*180).toFixed(2)}) translate(${(-lgX).toFixed(3)},${(-lgY).toFixed(3)})`);gC.setAttribute("transform",`translate(${cX.toFixed(3)},${cY.toFixed(3)}) rotate(${(-(1-sp)*270).toFixed(2)}) translate(${(-cX).toFixed(3)},${(-cY).toFixed(3)})`);gB.setAttribute("transform",`translate(${bX.toFixed(3)},${bY.toFixed(3)}) rotate(${((1-sp)*360).toFixed(2)}) translate(${(-bX).toFixed(3)},${(-bY).toFixed(3)})`);if(el>=DUR){const st=eio(Math.min((el-DUR)/SHRINK,1));outer.setAttribute("transform",`translate(40,40) scale(${(1-st).toFixed(4)}) translate(-40,-40)`);}if(el<TOTAL)rafs.current.push(requestAnimationFrame(tick));else{wrap.innerHTML="";if(onDone)onDone();}}
      rafs.current.push(requestAnimationFrame(tick));
    }
    return ()=>stopAll();
  },[mode,size]);
  return <div ref={ref} style={{width:size,height:size,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}} />;
}

// ─── Shared activity data ─────────────────────────────────────────────────────
const ACTIVITY = [
  { type:"api",   status:"done",    label:"GET /v1/commitments",          detail:"Retrieved 47 active reservations" },
  { type:"api",   status:"done",    label:"GET /v1/usage/ec2",             detail:"30-day utilization across 3 regions" },
  { type:"api",   status:"active",  label:"GET /v1/pricing/reserved",      detail:"Fetching current RI pricing tiers…" },
  { type:"doc",   status:"done",    label:"AWS Reserved Instance Guide",   detail:"docs.aws.amazon.com" },
  { type:"doc",   status:"pending", label:"Convertible RI Exchange Rules", detail:"Archera knowledge base" },
  { type:"agent", status:"active",  label:"Cost Optimization Agent",       detail:"Modeling break-even scenarios…" },
  { type:"web",   status:"pending", label:"EC2 On-Demand Pricing",         detail:"aws.amazon.com/ec2/pricing" },
];

const ACTIVITY_DONE = ACTIVITY.map(a=>({...a, status:"done", detail:a.detail.replace("…","")}));

// ─── Generic follow-up pool ───────────────────────────────────────────────────
const FOLLOWUP_POOL = [
  "Model a different commitment term",
  "Show me how this compares to last month",
  "Check for similar opportunities in my other regions",
  "Set up an alert if coverage drops",
  "Show projected savings over the next 12 months",
  "Look at my RDS fleet next",
];
function pickFollowUp(){ return FOLLOWUP_POOL[Math.floor(Math.random()*FOLLOWUP_POOL.length)]; }

// ─── Generic reasoning pool (WHY — justification for the response) ───────────
const REASONING_POOL = [
  "Coverage below 70% — significant on-demand spend left unprotected",
  "30-day terms balance savings with flexibility for a scaling fleet",
  "Current utilization pattern supports a conservative commitment strategy",
  "Break-even under 30 days makes short-term commitment the lower-risk choice",
  "Usage growth trend suggests avoiding long lock-in periods right now",
  "Reservable spend concentration in EC2 makes RIs the highest-leverage option",
  "Partial upfront pricing offers better savings without full capital outlay",
  "Coverage gap is concentrated in predictable, steady-state workloads",
  "Historical utilization variance is low enough to justify commitment",
];
function pickReasoningSteps(n=3){ return [...REASONING_POOL].sort(()=>0.5-Math.random()).slice(0,n); }

// ─── Generic thinking step pool ───────────────────────────────────────────────
const THINKING_POOL = [
  "Looking at your active commitments",
  "Checking how much of your spend is covered",
  "Analyzing your usage patterns",
  "Seeing what's expiring soon",
  "Looking for savings opportunities",
  "Comparing pricing options",
  "Running the numbers",
  "Checking what you're paying on-demand",
  "Looking for underutilized commitments",
  "Comparing plan options",
  "Putting it together",
];
function pickThinkingSteps(n=4){
  return [...THINKING_POOL].sort(()=>0.5-Math.random()).slice(0,n);
}

function ActivityTypeIcon({ type, isActive }) {
  const iconColor = isActive ? palette.uiPrimary[500] : palette.text.secondary;
  const sx = {fontSize:12, color:iconColor};
  const name = type==="api" ? "desktop_windows" : type==="web" ? "language" : type==="agent" ? "ios_share" : "description";
  return <MuiIcon baseClassName="material-icons-outlined" sx={sx}>{name}</MuiIcon>;
}

function ActivityRow({ item, i, total }) {
  return (
    <Box sx={{
      display:"flex",gap:1,alignItems:"flex-start",
      py:0.875, px:1.25,
      borderBottom:i<total-1?`1px solid ${color.divider}`:"none",
      background:item.status==="active"?`${C_PRIMARY}08`:item.status==="pending"?"rgba(0,0,0,0.01)":palette.surface,
      opacity:item.status==="pending"?0.5:1,
    }}>
      <Box sx={{mt:0.125,flexShrink:0}}><ActivityTypeIcon type={item.type} isActive={item.status==="active"}/></Box>
      <Box sx={{flex:1,minWidth:0}}>
        <Stack direction="row" alignItems="center" gap={0.75}>
          <Typography sx={{...typography.body2,fontWeight:500,color:item.status==="active"?C_PRIMARY:palette.text.primary,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.label}</Typography>
          {item.status==="active"&&<Typography component="span" sx={{...typography.micro,color:C_PRIMARY,background:`${C_PRIMARY}14`,borderRadius:"3px",padding:"1px 4px",flexShrink:0}}>ACTIVE</Typography>}
          {item.status==="done"&&<Typography component="span" sx={{...typography.micro,color:palette.success[500],background:`${palette.success[500]}14`,borderRadius:"3px",padding:"1px 4px",flexShrink:0}}>DONE</Typography>}
          {item.status==="pending"&&<Typography component="span" sx={{...typography.micro,color:palette.text.secondary,background:"rgba(0,0,0,0.05)",borderRadius:"3px",padding:"1px 4px",flexShrink:0}}>PENDING</Typography>}
        </Stack>
        <Typography sx={{...typography.caption,color:palette.text.secondary,mt:0.125,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.detail}</Typography>
      </Box>
    </Box>
  );
}

// ─── ThinkingTrace component ──────────────────────────────────────────────────
function ThinkingTrace({ steps, instant=false }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [allDone, setAllDone] = useState(false);
  const stopped = useRef(false);

  useEffect(() => {
    stopped.current = false;
    if(instant){ setCurrentStep(steps.length-1); setDisplayedText(steps[steps.length-1]); setAllDone(true); return; }
    setCurrentStep(0);
    setDisplayedText("");
    setAllDone(false);
    return () => { stopped.current = true; };
  }, [steps, instant]);

  useEffect(() => {
    if (!steps || steps.length === 0) return;
    if (allDone) return;

    const text = steps[currentStep];
    let ci = 0;
    setDisplayedText("");

    function typeChar() {
      if (stopped.current) return;
      if (ci < text.length) {
        ci = Math.min(ci + 2, text.length);
        setDisplayedText(text.slice(0, ci));
        setTimeout(typeChar, 15);
      } else {
        // step complete — pause then move on
        setTimeout(() => {
          if (stopped.current) return;
          if (currentStep < steps.length - 1) {
            setCurrentStep(s => s + 1);
          } else {
            setAllDone(true);
          }
        }, 300);
      }
    }
    typeChar();
  }, [currentStep, steps, allDone]);

  if (!steps || steps.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {steps.slice(0, allDone ? steps.length : currentStep + 1).map((step, i) => {
        const isTyping = !allDone && i === currentStep;
        const text = isTyping ? displayedText : step;
        return (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, padding: "2px 0" }}>
            <Typography component="span" sx={{ color: palette.uiPrimary[300], flexShrink: 0, fontWeight: 500, ...typography.body2, lineHeight: "18px" }}>→</Typography>
            <span style={{ ...typography.body2, color: palette.text.secondary, lineHeight: "18px" }}>
              {text}
              {isTyping && <span style={{ opacity: 0.5 }}>|</span>}
              {allDone && i === steps.length - 1 && (
                <span style={{ display: "inline-block", animation: "thinkingDots 1.4s ease infinite", opacity: 0.5, marginLeft: 2 }}>...</span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared expand/collapse toggle header ────────────────────────────────────
function ExpandToggle({ label, expanded, onToggle, children, withBox=true }) {
  return (
    <div>
      <div style={{display:"flex",gap:4,alignItems:"center",cursor:"pointer"}} onClick={()=>onToggle(o=>!o)}>
        <div style={{transition:"transform 0.18s",transform:expanded?"rotate(90deg)":"rotate(0deg)",display:"flex",alignItems:"center",color:palette.text.disabled}}>
          <MuiIcon fontSize="inherit">chevron_right</MuiIcon>
        </div>
        <span style={{...typography.micro,color:palette.text.secondary}}>{label}</span>
      </div>
      {expanded&&(withBox
        ? <Box sx={{mt:0.75,py:1, px:1.25,border:`1px solid ${color.divider}`,borderRadius:`${radius.lg}px`,display:"flex",flexDirection:"column",gap:0.25}}>{children}</Box>
        : children
      )}
    </div>
  );
}

// ─── ThinkingToggle — collapsible wrapper for ThinkingTrace ──────────────────
function ThinkingToggle({ steps, expanded, setExpanded, instant=false }) {
  return (
    <ExpandToggle label="THINKING" expanded={expanded} onToggle={setExpanded}>
      <ThinkingTrace steps={steps} instant={instant}/>
    </ExpandToggle>
  );
}

// ─── FollowUp component ───────────────────────────────────────────────────────
function FollowUp({ text, onPrompt }) {
  return (
    <Link
      component="button"
      onClick={()=>onPrompt(text)}
      underline="hover"
      sx={{...typography.body1, mt:1, color:palette.uiPrimary[500], display:"block", textAlign:"left"}}
    >
      {text}
    </Link>
  );
}

// ─── ReasoningTrace component ─────────────────────────────────────────────────
function ReasoningTrace({ reasoning, expanded, setExpanded }) {
  const [visible, setVisible] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(()=>{
    if(!expanded) return;
    if(hasAnimated.current){ setVisible(reasoning.length); return; }
    hasAnimated.current=true;
    setVisible(0);
    reasoning.forEach((_,i)=>setTimeout(()=>setVisible(i+1), i*70));
  },[expanded, reasoning]);

  return (
    <ExpandToggle label="WHY" expanded={expanded} onToggle={setExpanded}>
      {reasoning.map((step,i)=>(
        <div key={i} style={{
          display:"flex",alignItems:"flex-start",gap:6,padding:"3px 0",
          opacity:i<visible?1:0, transform:i<visible?"translateY(0)":"translateY(4px)",
          transition:"opacity 0.2s ease, transform 0.2s ease",
        }}>
          <div style={{width:4,height:4,borderRadius:"50%",background:palette.text.secondary,flexShrink:0,marginTop:6}}/>
          <span style={{...typography.body2,color:palette.text.secondary,lineHeight:"18px"}}>{step}</span>
        </div>
      ))}
    </ExpandToggle>
  );
}

// ─── SourcesPanel — source activities ────────────────────────────────────────
function SourcesPanel({ data=ACTIVITY_DONE, expanded, setExpanded }) {
  return (
    <ExpandToggle label={`SOURCES USED (${data.length})`} expanded={expanded} onToggle={setExpanded} withBox={false}>
      <div style={{marginTop:6,border:`1px solid ${color.divider}`,borderRadius:6,overflow:"hidden"}}>
        {data.map((item,i)=><ActivityRow key={`s${i}`} item={item} i={i} total={data.length}/>)}
      </div>
    </ExpandToggle>
  );
}

// ─── Thinking phrases ─────────────────────────────────────────────────────────
function Phrases({ active, expanded, setExpanded }) {
  const ref=useRef(null),stopped=useRef(false),started=useRef(false);

  useEffect(()=>{
    if(!active||!ref.current||started.current)return;
    started.current=true;
    stopped.current=false;
    const el=ref.current;
    const all=["Thinking","Analyzing","Processing","Reasoning","Working on it","One moment"];
    const chosen=all.sort(()=>Math.random()-.5).slice(0,3+Math.floor(Math.random()*2));
    let pi=0;
    function typePhrase(){if(stopped.current)return;const text=chosen[pi%chosen.length]+"…";let ci=0;el.textContent="";el.classList.remove("shimmer","run");function typeChar(){if(stopped.current)return;if(ci<text.length){el.textContent=text.slice(0,++ci);if(ci>=Math.floor(text.length*0.8)&&!el.classList.contains("shimmer")){el.classList.add("shimmer");requestAnimationFrame(()=>el.classList.add("run"));}setTimeout(typeChar,28+Math.random()*10);}else{setTimeout(()=>{if(stopped.current)return;el.classList.remove("shimmer","run");el.style.transition="opacity .25s";el.style.opacity="0";setTimeout(()=>{if(stopped.current)return;el.style.opacity="1";el.style.transition="";pi=(pi+1)%chosen.length;typePhrase();},280);},1100);}}typeChar();}
    setTimeout(()=>typePhrase(),900);return()=>{stopped.current=true;};
  },[active]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      <div style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}} onClick={()=>setExpanded(o=>!o)}>
        <div style={{transition:"transform 0.18s",transform:expanded?"rotate(90deg)":"rotate(0deg)",display:"flex",alignItems:"center",flexShrink:0,color:palette.text.disabled}}>
          <MuiIcon fontSize="inherit">chevron_right</MuiIcon>
        </div>
        <Typography ref={ref} component="div" sx={{...typography.body1,color:palette.text.secondary,fontStyle:"italic",flex:1}} />
      </div>
      {expanded&&(
        <div style={{paddingLeft:20,marginTop:6,border:`1px solid ${color.divider}`,borderRadius:6,overflow:"hidden"}}>
          {ACTIVITY.map((item,i)=><ActivityRow key={i} item={item} i={i} total={ACTIVITY.length}/>)}
        </div>
      )}
    </div>
  );
}

const PAGE_NAME = "Commitment Inventory";
const SUGGESTED_PROMPTS = [
  "Which commitments are expiring in the next 30 days?",
  "Where am I losing the most money on underutilized reservations?",
  "What's my total monthly savings from active commitments?",
];

function promptToTitle(prompt) {
  let t = prompt.trim().split(/[.!?]/)[0].trim();
  const strips = [
    /^where am i\s+/i,
    /^what(?:'s| is| are| am| would| will| can| should)?\s+(?:my\s+)?/i,
    /^i(?:'d| would) like to (?:understand|know|see|learn about)\s+/i,
    /^help me (?:understand|with)\s+/i,
    /^walk me through\s+(?:my\s+)?/i,
    /^tell me (?:about\s+)?(?:my\s+)?/i,
    /^show me\s+(?:my\s+)?/i,
    /^can you (?:explain|show|tell me about)\s+(?:my\s+)?/i,
    /^explain\s+(?:my\s+)?/i,
    /^(?:which|who|where|when|why|how(?:\s+(?:much|many))?)\s+(?:(?:is|are|am|do|does|did|was|were)\s+)?(?:my\s+)?/i,
    /^(?:is|are|am|do|does|did|was|were)\s+(?:my\s+|i\s+)?/i,
    /^my\s+/i,
  ];
  for (const re of strips) t = t.replace(re, '');
  const minor = new Set(['a','an','the','and','but','or','for','nor','on','at','to','from','by','in','of','up','as','is','are']);
  t = t.split(/\s+/).filter(Boolean).map((w,i)=>{
    const lo = w.toLowerCase();
    return (i===0 || !minor.has(lo)) ? lo.charAt(0).toUpperCase()+lo.slice(1) : lo;
  }).join(' ');
  if (t.length > 45) t = t.slice(0,45).replace(/\s+\S*$/,'').trim();
  return t || prompt.slice(0,40);
}

// ─── Suggested prompt chip (shared) ──────────────────────────────────────────
const STAR_ICON = <svg width="12" height="12" viewBox="0 0 19 18" fill="none" style={{flexShrink:0,marginLeft:8}}><path d="M8.01838 0.757682C8.33029 -0.25256 9.7642 -0.252561 10.0761 0.757681L11.6101 5.72633C11.7157 6.06833 11.9852 6.33538 12.3288 6.43848L17.3281 7.93856C18.3499 8.24517 18.3499 9.68815 17.3281 9.99475L12.3288 11.4948C11.9852 11.5979 11.7157 11.865 11.6101 12.207L10.0761 17.1756C9.7642 18.1859 8.33029 18.1859 8.01838 17.1756L6.48436 12.207C6.37877 11.865 6.10927 11.5979 5.76567 11.4948L0.766365 9.99475C-0.255455 9.68815 -0.255455 8.24517 0.766365 7.93856L5.76566 6.43848C6.10927 6.33538 6.37877 6.06833 6.48436 5.72633L8.01838 0.757682Z" fill={palette.uiPrimary[200]}/></svg>;

// Suggested-prompt chips — full-width medium chips with extra vertical padding.
// (Pattern-level styling only; the generic MUI Chip is untouched.)
function PromptChips({ prompts, onPrompt, stacked=false }) {
  return (
    <Box sx={{display:'flex', flexDirection:'column', gap:1, animation:'fadeIn 0.4s ease'}}>
      {prompts.map((p,i)=>(
        <Chip key={i} onClick={()=>onPrompt(p)} label={p} size="medium" variant="outlined" icon={STAR_ICON}
          sx={{borderColor:palette.uiPrimary[200], color:palette.uiPrimary[500], cursor:'pointer',
            width:'100%', justifyContent:'flex-start',
            '&:hover':{bgcolor:`${palette.uiPrimary[500]}08`, borderColor:palette.uiPrimary[400]}}}
        />
      ))}
    </Box>
  );
}

const NEW_CHAT_GREETINGS = [
  "How can I help?",
  "What can I help you with?",
  "What are you working on?",
  "Ready when you are.",
  "What would you like to explore?",
];

// Pool of rotating new-chat options — 3 picked randomly on each new chat
const NEW_CHAT_POOL = [
  "What's my current commitment coverage rate?",
  "Show me upcoming reservation expirations",
  "How much am I spending on-demand vs. committed?",
  "Are there any underutilized reservations I should address?",
  "Which services have the most untapped savings potential?",
  "Compare my savings this month to last month",
  "What's the break-even timeline for a 1-year commitment?",
  "Help me optimize my RDS reservations",
  "What would a 10% coverage increase save me monthly?",
];

// ─── New Chat view ────────────────────────────────────────────────────────────
function NewChatView({ onPrompt, options, greeting='How can I help?', stacked=false }) {
  return (
    <Box sx={{width:'100%', minWidth:0}}>
      <Typography sx={{...typography.h4,color:palette.text.primary}}>{greeting}</Typography>
      <Box sx={{mt:2}}>
        <PromptChips prompts={options} onPrompt={onPrompt} stacked={stacked}/>
      </Box>
    </Box>
  );
}

// ─── Welcome typewriter ───────────────────────────────────────────────────────
const WELCOME_INTRO = "Your Commitment Inventory tracks all your active reservations, coverage rates, upcoming expirations, monthly and amortized costs, and total savings — all in one place.";

function Welcome({ onPrompt, stacked=false, pageName=PAGE_NAME, title, intro=WELCOME_INTRO, body, prompts=SUGGESTED_PROMPTS }) {
  const [l1,setL1]=useState(""), [l2,setL2]=useState(""), [phase,setPhase]=useState(1);
  // Larger type is reserved for the typed title + brief teaser; `body` paragraphs
  // (consumer-provided, e.g. a CUR analysis) render in standard body1 after them.
  const f1=title||pageName, f2=intro;

  // Retype from the top whenever the content changes (e.g. the planner switching
  // toolbar tabs while the welcome screen is showing) — not just on mount, or the
  // title/intro would stay frozen on the tab the chat was first opened on.
  useEffect(()=>{let i=0,c=false;setL1("");setL2("");setPhase(1);function t(){if(c)return;if(i<f1.length){i++;setL1(f1.slice(0,i));setTimeout(t,8+Math.random()*6);}else setPhase(2);}setTimeout(t,100);return()=>{c=true;};},[f1,f2]);
  useEffect(()=>{if(phase!==2)return;let i=0,c=false;setL2("");function t(){if(c)return;if(i<f2.length){i++;setL2(f2.slice(0,i));if(i===f2.length)setPhase(3);else setTimeout(t,6+Math.random()*4);}}setTimeout(t,80);return()=>{c=true;};},[phase,f2]);

  const bodyParas = body ? (Array.isArray(body) ? body : [body]) : [];
  return (
    <Box sx={{width:'100%', minWidth:0}}>
      <Typography sx={{...typography.h4,color:palette.text.primary}}>{l1}</Typography>
      {l2&&<Typography sx={{...typography.body3,color:palette.text.secondary,mt:0.75}}>{l2}</Typography>}
      {phase>=3&&bodyParas.map((p,i)=>(
        <Typography key={i} sx={{...typography.body1,color:palette.text.primary,mt:2.5,animation:'fadeIn 0.4s ease'}}>{p}</Typography>
      ))}
      {phase>=3&&prompts?.length>0&&<Box sx={{mt:2}}><PromptChips prompts={prompts} onPrompt={onPrompt} stacked={stacked}/></Box>}
    </Box>
  );
}

function UserBubble({ content, isLatest }) {
  const [bounce, setBounce] = useState(false);
  useEffect(()=>{
    if(!isLatest) return;
    const t = setTimeout(()=>setBounce(true), 450);
    return()=>clearTimeout(t);
  },[isLatest]);
  return (
    <Paper sx={{
      bgcolor:palette.accent2[50],flex:1,py:1.375, px:1.875,
      borderRadius:3,borderBottomRightRadius:0,
      color:palette.text.primary,boxShadow:"none",
      animation: bounce ? "bounceIn 0.8s cubic-bezier(0.0,0.0,0.2,1) both" : "none",
    }}>
      {content}
    </Paper>
  );
}



function ResponseToolbar({ page=1, total=1, compact=false, html='', onRegenerate, onPrev, onNext, onShare }) {
  const btnSize = compact ? 24 : 32;
  const iconSize = compact ? 16 : 20;
  const dividerH = compact ? 12 : 16;
  const [feedback, setFeedback] = useState(null);   // form open: null | 'positive' | 'negative'
  const [submitted, setSubmitted] = useState(null); // feedback sent: null | 'positive' | 'negative'
  const [issueType, setIssueType] = useState('');
  const [details, setDetails] = useState('');
  const [copied, setCopied] = useState(false);
  const detailsRef = useRef(null);
  const selectRef = useRef(null);

  function openFeedback(type) {
    setIssueType(''); setDetails(''); setFeedback(type);
  }

  useEffect(() => {
    if (feedback) {
      const ref = feedback === 'negative' ? selectRef : detailsRef;
      const id = setTimeout(() => ref.current?.focus(), 150);
      return () => clearTimeout(id);
    }
  }, [feedback]);
  function submitFeedback() {
    setSubmitted(feedback); setFeedback(null);
  }
  function cancelFeedback() {
    setFeedback(null);
  }

  const btnSx = (isActive) => ({
    width:btnSize, height:btnSize, p:`${radius.sm}px`, borderRadius:`${radius.lg}px`, flexShrink:0,
    ...(isActive && { bgcolor:`${palette.brandPrimary[500]}14`, '&:hover':{bgcolor:`${palette.brandPrimary[500]}22`} }),
    '&.Mui-disabled':{ opacity:0.35 },
  });

  const TBtn = ({title, onClick, children, isActive=false, isDisabled=false}) => (
    <Tooltip title={isDisabled ? '' : title} placement="top" arrow>
      <span>
        <IconButton sx={btnSx(isActive)} onClick={onClick} disabled={isDisabled}>{children}</IconButton>
      </span>
    </Tooltip>
  );

  const likeActive    = submitted === 'positive' || feedback === 'positive';
  const dislikeActive = submitted === 'negative' || feedback === 'negative';
  const likeDisabled    = submitted !== null && !likeActive;
  const dislikeDisabled = submitted !== null && !dislikeActive;

  return (
    <>
    <Box sx={{borderTop:`1px solid ${color.divider}`,display:"flex",alignItems:"center",gap:2,pt:0.5,width:"100%",mt:1}}>
      <Stack direction="row" flex={1} alignItems="center" gap="8px">
        <Box sx={{display:"flex",alignItems:"center"}}>
          <TBtn
            title={likeActive ? "Update positive feedback" : "Give positive feedback"}
            onClick={()=>openFeedback('positive')}
            isActive={likeActive} isDisabled={likeDisabled}
          >
            <MuiIcon {...(submitted !== 'positive' && {baseClassName:"material-icons-outlined"})} sx={{fontSize:iconSize, color:likeActive ? palette.brandPrimary[500] : likeDisabled ? palette.text.disabled : palette.text.secondary}}>thumb_up</MuiIcon>
          </TBtn>
          <TBtn
            title={dislikeActive ? "Update negative feedback" : "Give negative feedback"}
            onClick={()=>openFeedback('negative')}
            isActive={dislikeActive} isDisabled={dislikeDisabled}
          >
            <MuiIcon {...(submitted !== 'negative' && {baseClassName:"material-icons-outlined"})} sx={{fontSize:iconSize, color:dislikeActive ? palette.brandPrimary[500] : dislikeDisabled ? palette.text.disabled : palette.text.secondary}}>thumb_down</MuiIcon>
          </TBtn>
        </Box>
        <Box sx={{width:"1px",height:dividerH,bgcolor:color.divider,flexShrink:0}}/>
        <Box sx={{display:"flex",alignItems:"center"}}>
          <TBtn title={copied ? "Copied!" : "Copy"} onClick={()=>{ const tmp=document.createElement('div');tmp.innerHTML=html;navigator.clipboard.writeText(tmp.innerText||''); setCopied(true); setTimeout(()=>setCopied(false),2000); }}>
            <MuiIcon {...(!copied && {baseClassName:"material-icons-outlined"})} sx={{fontSize:iconSize, color:copied ? palette.success[500] : palette.text.secondary}}>content_copy</MuiIcon>
          </TBtn>
          {onShare && <TBtn title="Share" onClick={onShare}><MuiIcon baseClassName="material-symbols-outlined" sx={{fontSize:iconSize, color:palette.text.secondary}}>share</MuiIcon></TBtn>}
        </Box>
      </Stack>
      <Stack direction="row" alignItems="center" gap={compact?"2px":"4px"} flexShrink={0}>
        <TBtn title="Regenerate response" onClick={onRegenerate}><MuiIcon baseClassName="material-icons-outlined" sx={{fontSize:iconSize, color:palette.text.secondary}}>replay</MuiIcon></TBtn>
        {total > 1 && (
          <>
            <Box sx={{width:"1px",height:dividerH,bgcolor:color.divider,flexShrink:0,mx:0.5}}/>
            <IconButton sx={{width:20,height:20,p:0}} onClick={onPrev} disabled={page<=1}>
              <MuiIcon sx={{fontSize:16,color:palette.text.secondary}}>chevron_left</MuiIcon>
            </IconButton>
            <Typography sx={{...typography.body2,color:palette.text.secondary,whiteSpace:"nowrap"}}>
              <strong style={{color:palette.text.primary,fontWeight:600}}>{page}</strong>{` of ${total}`}
            </Typography>
            <IconButton sx={{width:20,height:20,p:0}} onClick={onNext} disabled={page>=total}>
              <MuiIcon sx={{fontSize:16,color:palette.text.secondary}}>chevron_right</MuiIcon>
            </IconButton>
          </>
        )}
      </Stack>
    </Box>

    <Collapse in={!!feedback} unmountOnExit>
      <Stack gap={2} sx={{mt:1, p:2, bgcolor:`${palette.accent1[700]}08`, border:`1px solid ${palette.accent1[700]}4d`, borderRadius:`${radius.lg}px`}}>
        <Typography sx={{...typography.h6, color:palette.neutral.black}}>
          {feedback==='positive' ? 'What worked well?' : "What didn't work?"}
        </Typography>
        {feedback === 'negative' && (
          <FormControl fullWidth>
            <Typography variant="body2" gutterBottom>How would you describe the quality of this response? (optional)</Typography>
            <Select size="small" inputRef={selectRef} value={issueType} onChange={e=>setIssueType(e.target.value)} displayEmpty renderValue={v=>v||'Select...'}>
              <MenuItem value=""><em>Select…</em></MenuItem>
              <MenuItem value="inaccurate">Not accurate</MenuItem>
              <MenuItem value="irrelevant">Not relevant to my question</MenuItem>
              <MenuItem value="incomplete">Incomplete or missing details</MenuItem>
              <MenuItem value="unclear">Unclear or hard to follow</MenuItem>
              <MenuItem value="overconfident">Too confident without enough context</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        )}
        <Box>
          <Typography variant="body2" gutterBottom>
            {feedback === 'positive' ? 'What was helpful about this response?' : 'What was wrong or unhelpful?'} (optional)
          </Typography>
          <TextField
            multiline minRows={2} fullWidth size="small" inputProps={{style:{fontSize:typography.body2.fontSize}}} inputRef={detailsRef}
            placeholder={feedback === 'positive'
              ? 'e.g. the coverage analysis gave me a clear picture of my savings opportunity'
              : 'e.g. the recommended plan didn\'t account for my actual usage patterns'}
            value={details} onChange={e=>setDetails(e.target.value)}
          />
        </Box>
        <Typography variant="caption">
          Submitting this feedback shares the conversation context with Archera to help improve the Archera AI experience.{' '}
          <Link href="#" onClick={e=>e.preventDefault()}>Learn More</Link>
        </Typography>
        <Stack direction="row" justifyContent="flex-end" gap={1}>
          <Button onClick={cancelFeedback}>Cancel</Button>
          <Button variant="contained" onClick={submitFeedback}>Submit</Button>
        </Stack>
      </Stack>
    </Collapse>
    </>
  );
}

// ─── Step cards (inline agent progress) ──────────────────────────────────────
const STEP_TONES = {
  blue:   { fg:palette.uiPrimary[500],  iconBg:palette.uiPrimary[50]  },
  amber:  { fg:palette.accent1[700],    iconBg:palette.accent1[50]    },
  violet: { fg:palette.accent2[800],    iconBg:palette.accent2[50]    },
};

const STEP_ICON = { chart: 'bar_chart', bolt: 'bolt', folder: 'folder_open' };

function StepPill({ tone="blue", label, meta }) {
  const t = STEP_TONES[tone] || STEP_TONES.blue;
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingLeft:2,paddingRight:4}}>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:t.fg,flexShrink:0}}/>
        <span style={{...typography.micro,color:t.fg}}>{label}</span>
      </div>
      {meta && <Typography component="span" sx={{...typography.body2,color:palette.text.secondary}}>{meta}</Typography>}
    </div>
  );
}

function StepCards({ steps }) {
  const [visible, setVisible] = useState(0);
  const [open, setOpen] = useState({});
  useEffect(()=>{
    if(visible >= steps.length) return;
    const t = setTimeout(()=>setVisible(v=>v+1), 600);
    return()=>clearTimeout(t);
  },[visible, steps.length]);

  return (
    <Stack direction="column" gap="14px" sx={{mb:1.75}}>
      {steps.slice(0,visible).map((step,i)=>{
        const tone = STEP_TONES[step.tone] || STEP_TONES.blue;
        const stepIconName = STEP_ICON[step.icon] || 'bar_chart';
        const isOpen = !!open[i];
        return (
          <Stack key={i} direction="column" gap={0.75} sx={{animation:"fadeIn 0.3s ease both"}}>
            <StepPill tone={step.tone} label={step.pill} meta={step.meta}/>
            <Paper variant="outlined" sx={{borderRadius:2,overflow:"hidden",bgcolor:palette.surface,borderColor:color.divider}}>
              <Box
                onClick={step.expandable ? ()=>setOpen(o=>({...o,[i]:!o[i]})) : undefined}
                sx={{
                  display:"flex",alignItems:"center",gap:1.25,
                  py:1, px:1.5,
                  cursor:step.expandable?"pointer":"default",
                }}>
                <Box sx={{
                  width:26,height:26,borderRadius:"6px",
                  bgcolor:tone.iconBg,color:tone.fg,
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                }}>
                  <MuiIcon baseClassName="material-icons-outlined" sx={{fontSize:14}}>{stepIconName}</MuiIcon>
                </Box>
                <Typography sx={{...typography.body1,fontWeight:500,color:palette.neutral.black,flex:1}}>{step.label}</Typography>
                {step.expandable && (
                  <MuiIcon sx={{fontSize:16,color:palette.text.secondary,flexShrink:0,transition:"transform 0.18s",transform:isOpen?"rotate(180deg)":"rotate(0deg)"}}>keyboard_arrow_down</MuiIcon>
                )}
              </Box>
              {step.expandable && isOpen && step.plans && (
                <Box sx={{borderTop:`1px solid ${color.divider}`}}>
                  {step.plans.map((plan,j)=>(
                    <Box key={j} sx={{
                      display:"flex",alignItems:"center",justifyContent:"space-between",
                      py:1.25, px:1.75,
                      borderTop:j===0?"none":`1px solid ${color.divider}`,
                      animation:"fadeIn 0.25s ease both",
                    }}>
                      <Box sx={{minWidth:0}}>
                        <Typography sx={{...typography.h6,color:palette.neutral.black}}>
                          {plan.name}
                        </Typography>
                        <Typography sx={{...typography.body2,color:palette.text.secondary,mt:0.25}}>
                          {plan.term} term
                        </Typography>
                      </Box>
                      <Box sx={{textAlign:"right",flexShrink:0,ml:1.5}}>
                        <Typography sx={{...typography.h6,color:palette.success[500]}}>
                          {plan.savings}
                        </Typography>
                        <Typography sx={{...typography.caption,color:palette.text.secondary,mt:0.25}}>
                          monthly savings
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
              {step.expandable && isOpen && step.detail && !step.plans && (
                <Box sx={{borderTop:`1px solid ${color.divider}`,p:"8px 12px 10px 48px",animation:"fadeIn 0.25s ease both"}}>
                  <Typography sx={{...typography.body2,color:palette.text.secondary,lineHeight:"18px"}}>{step.detail}</Typography>
                </Box>
              )}
            </Paper>
          </Stack>
        );
      })}
    </Stack>
  );
}

// ─── Response row ─────────────────────────────────────────────────────────────
// Strip <a class="resp-btn"> links from html before streaming so they never
// partially render mid-type; returned as {streamHtml, btns:[{href,label}]}.
function extractRespBtns(html) {
  const btns=[];
  const streamHtml=html.replace(/<a\s+class="resp-btn"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g,(_,href,label)=>{
    btns.push({href,label:label.replace(/<[^>]+>/g,'').trim()});
    return '';
  });
  return {streamHtml,btns};
}

function ResponseRow({ html, instant=false, onStreamDone, pageNum, totalPages, onResetDone, expanded, setExpanded, steps, confirm, onConfirmStatus, choice, onChoiceSelect, onChoiceConfirm, onChoiceDeny, onRegenerate, onPrev, onNext, compact=false, reasoning, reasoningExpanded, setReasoningExpanded, thinkingTrace, thinkingExpanded, setThinkingExpanded, followUp, onFollowUp, onShare, canShare=true, canWriteActions=true }) {
  const {streamHtml,btns}=useMemo(()=>extractRespBtns(html),[html]);
  const [disp,setDisp]=useState(()=>instant?streamHtml:"");
  const [iconMode,setIconMode]=useState(()=>instant?"done":"success");
  const [streamDone,setStreamDone]=useState(()=>instant);
  const [successDone,setSuccessDone]=useState(()=>instant);
  const idx=useRef(0);
  useEffect(()=>{
    idx.current=0;setStreamDone(false);setSuccessDone(false);
    if(instant){setDisp(streamHtml);setStreamDone(true);setSuccessDone(true);setIconMode("done");return;}
    setDisp("");setIconMode("success");
    function stream(){if(idx.current<streamHtml.length){idx.current=Math.min(idx.current+2,streamHtml.length);setDisp(streamHtml.slice(0,idx.current));setTimeout(stream,18);}else setStreamDone(true);}
    stream();
  },[html,instant]);
  useEffect(()=>{if(streamDone&&!instant)onStreamDone?.(html);},[streamDone]);
  useEffect(()=>{if(streamDone&&successDone&&!instant)setIconMode("reset");},[streamDone,successDone]);
  const done=streamDone&&disp===streamHtml&&disp.length>0;
  function handleIconDone(){if(iconMode==="success")setSuccessDone(true);else if(iconMode==="reset"){if(onResetDone)onResetDone();setIconMode("done");}}
  const content = (
    <div style={{display:"flex",flexDirection:"column",gap:8,flex:1,minWidth:0}}>
      {thinkingTrace?.length>0&&<Box sx={{mb:2}}><ThinkingToggle steps={thinkingTrace} expanded={thinkingExpanded} setExpanded={setThinkingExpanded} instant/></Box>}
      {steps&&<StepCards steps={steps}/>}
      <div className="resp-html" dangerouslySetInnerHTML={{__html:disp+(done?"":"<span style='opacity:.4'>|</span>")}} />
      {done&&btns.length>0&&<div style={{marginTop:8,display:'flex',flexDirection:'column',gap:6,animation:'fadeIn 0.3s ease'}}>
        {btns.map((b,i)=><a key={i} href={b.href} target="_blank" rel="noopener" className="resp-btn" style={{textAlign:'center'}}>{b.label}</a>)}
      </div>}
      {done&&canWriteActions&&confirm&&(
        <div style={{marginTop:12}}>
          {confirm.type==="automation"
            ? <WriteActionAutomation {...confirm} onConfirm={()=>onConfirmStatus("confirmed")} onDeny={()=>onConfirmStatus("denied")}/>
            : <WriteAction {...confirm} onConfirm={()=>onConfirmStatus("confirmed")} onDeny={()=>onConfirmStatus("denied")}/>
          }
        </div>
      )}
      {done&&canWriteActions&&choice&&(
        <div style={{marginTop:12}}>
          <WriteActionChoice {...choice} onSelect={onChoiceSelect} onConfirm={onChoiceConfirm} onDeny={onChoiceDeny}/>
        </div>
      )}
      {done&&followUp&&onFollowUp&&<FollowUp text={followUp} onPrompt={onFollowUp}/>}
      {done&&reasoning&&<div style={{marginTop:8}}><ReasoningTrace reasoning={reasoning} expanded={reasoningExpanded} setExpanded={setReasoningExpanded}/></div>}
      {done&&<div style={{marginTop:0}}><SourcesPanel expanded={expanded} setExpanded={setExpanded}/></div>}
      {done&&<ResponseToolbar page={pageNum} total={totalPages} compact={compact} html={html} onRegenerate={onRegenerate} onPrev={onPrev} onNext={onNext} onShare={canShare ? onShare : undefined}/>}
    </div>
  );
  if(compact) return (
    <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%",marginBottom:32}}>
      <div style={{width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Icon mode={iconMode} onDone={handleIconDone} size={32}/>
      </div>
      {content}
    </div>
  );
  return (
    <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%",marginBottom:32}}>
      <div style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Icon mode={iconMode} onDone={handleIconDone} />
      </div>
      {content}
    </div>
  );
}

// ─── Shared write-action tone helper ─────────────────────────────────────────
// flow-based cards (plan/automation) use brandPrimary for pending; others use accent1
function writeActionTone(status, flow) {
  const pendingKey = flow ? 'brandPrimary' : 'accent1';
  const shade = status==="confirmed" ? palette.success[300] : status==="denied" ? palette.error[300] : palette[pendingKey][300];
  return { statusColor: darken(shade, 0.6), borderColor: lighten(shade, 0.5), bgColor: lighten(shade, 0.9) };
}

// ─── Write action confirmation ────────────────────────────────────────────────
function WriteAction({ action, detail, items, onConfirm, onDeny, status, flow }) {
  const isDone = status==="confirmed" || status==="denied";
  const { statusColor, borderColor, bgColor } = writeActionTone(status, flow);
  return (
    <Box>
      {/* Label */}
      <Stack direction="row" alignItems="center" gap={0.75} sx={{mb:1}}>
        <Box sx={{width:6,height:6,borderRadius:"50%",bgcolor:statusColor,flexShrink:0}}/>
        <Typography sx={{...typography.overline, color:statusColor}}>
          {status==="confirmed"?"WRITE ACTION APPROVED":status==="denied"?"WRITE ACTION DENIED":"WRITE ACTION REQUESTED"}
        </Typography>
      </Stack>
      {/* Card */}
      <Paper variant="outlined" sx={{borderRadius:2,overflow:"hidden",borderColor,bgcolor:bgColor}}>
        <Box sx={{py:1.25, px:1.5,borderBottom:`1px solid ${color.divider}`}}>
          <Typography sx={{...typography.body1, fontWeight:600, color:palette.neutral.black}}>{action}</Typography>
          <Typography sx={{...typography.body2, color:palette.text.secondary, mt:0.25}}>{detail}</Typography>
        </Box>
        {items&&items.length>0&&(
          <Stack direction="column" gap="4px" sx={{py:1, px:1.5}}>
            {items.map((item,i)=>(
              <Stack key={i} direction="row" alignItems="center" gap={0.75}>
                <Box sx={{width:3,height:3,borderRadius:"1.5px",bgcolor:palette.text.secondary,flexShrink:0}}/>
                <Typography sx={{...typography.body2, color:palette.text.secondary}}>{item}</Typography>
              </Stack>
            ))}
          </Stack>
        )}
        <Stack direction="column" gap="8px" sx={{pt:1.125,pb:1.5,px:1.5,borderTop:`1px solid ${color.divider}`}}>
          {!isDone?(
            <>
              <Stack direction="row" gap="4px" justifyContent="flex-end">
                <Button color={flow?'secondary':'inherit'} onClick={onDeny}>Deny</Button>
                <Button variant="contained" color={flow?'secondary':'primary'} onClick={onConfirm}>Confirm</Button>
              </Stack>
              <Stack direction="row" gap="4px" alignItems="center">
                <MuiIcon baseClassName="material-icons-outlined" sx={{fontSize:16,color:palette.warning[500],flexShrink:0}}>warning_amber</MuiIcon>
                <Typography sx={{...typography.body2, fontStyle:"italic", color:palette.warning[500]}}>This action will modify your commitments</Typography>
              </Stack>
            </>
          ):(
            <Typography sx={{...typography.body2, fontWeight:500, color:statusColor}}>
              {status==="confirmed"?"✓ Action confirmed and applied":"✕ Action denied — no changes made"}
            </Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}

// ─── Write action: choice (pick one of N options) ─────────────────────────────
function WriteActionChoice({ action, detail, choices, selected, status, onSelect, onConfirm, onDeny, flow }) {
  const isDone = status==="confirmed" || status==="denied";
  const canAct = !!selected && !isDone;
  const { statusColor, borderColor, bgColor } = writeActionTone(status, flow);
  return (
    <Box>
      {/* Label */}
      <Stack direction="row" alignItems="center" gap={0.75} sx={{mb:1}}>
        <Box sx={{width:6,height:6,borderRadius:"50%",bgcolor:statusColor,flexShrink:0}}/>
        <Typography sx={{...typography.overline, color:statusColor}}>
          {status==="confirmed"?"WRITE ACTION APPROVED":status==="denied"?"WRITE ACTION DENIED":"WRITE ACTION REQUESTED"}
        </Typography>
      </Stack>
      {/* Card */}
      <Paper variant="outlined" sx={{borderRadius:2,overflow:"hidden",borderColor,bgcolor:bgColor}}>
        <Box sx={{py:1.25, px:1.5,borderBottom:`1px solid ${color.divider}`}}>
          <Typography sx={{...typography.body1, fontWeight:600, color:palette.neutral.black}}>{action}</Typography>
          <Typography sx={{...typography.body2, color:palette.text.secondary, mt:0.25}}>{detail}</Typography>
        </Box>
        {/* Choice rows */}
        <Stack direction="column" gap={0.75} sx={{p:1}}>
          {choices.map((c)=>{
            const picked = selected===c.id;
            const dimmed = isDone && !picked;
            const accentColor = picked ? (isDone?palette.success[500]:C_PRIMARY) : color.outlineBorder;
            const accentBg    = picked ? (isDone?`${palette.success[500]}0f`:`${C_PRIMARY}0a`) : palette.surface;
            return (
              <Paper
                key={c.id}
                variant="outlined"
                onClick={()=>!isDone&&onSelect(c.id)}
                component="button"
                disabled={isDone}
                sx={{
                  display:"flex",alignItems:"center",justifyContent:"space-between",
                  py:1.25, px:1.5,
                  borderColor:accentColor,
                  bgcolor:accentBg,
                  borderRadius:`${radius.sm}px`,
                  cursor:isDone?"default":"pointer",
                  opacity:dimmed?0.4:1,
                  fontFamily:typography.fontFamily,
                  textAlign:"left",
                  transition:"border-color 0.15s, background 0.15s, opacity 0.15s",
                  width:"100%",
                }}>
                <Box sx={{minWidth:0}}>
                  <Stack direction="row" alignItems="center" gap={0.75}>
                    <Typography sx={{...typography.body1, fontWeight:600, color:palette.neutral.black}}>{c.name}</Typography>
                    {c.recommended&&!picked&&!isDone&&<Typography component="span" sx={{...typography.overline, fontSize:"9px", color:C_PRIMARY, background:`${C_PRIMARY}14`, padding:"1px 5px", borderRadius:`${radius.sm}px`}}>RECOMMENDED</Typography>}
                    {picked&&!isDone&&<Box sx={{width:6,height:6,borderRadius:"50%",bgcolor:C_PRIMARY,flexShrink:0}}/>}
                    {picked&&isDone&&status==="confirmed"&&<MuiIcon sx={{fontSize:14, color:palette.success[500]}}>check</MuiIcon>}
                  </Stack>
                  <Typography sx={{...typography.body2, color:palette.text.secondary, mt:0.125}}>{c.term} term</Typography>
                </Box>
                <Box sx={{textAlign:"right",flexShrink:0,ml:1.5}}>
                  <Typography sx={{...typography.body1, fontWeight:600, color:picked&&isDone&&status==="confirmed"?palette.success[500]:palette.neutral.black}}>{c.savings}</Typography>
                  <Typography sx={{...typography.caption, color:palette.text.secondary, mt:0.125}}>monthly savings</Typography>
                </Box>
              </Paper>
            );
          })}
        </Stack>
        {/* Footer */}
        <Stack direction="row" gap={1} alignItems="center" sx={{py:1, px:1.5,borderTop:`1px solid ${color.divider}`}}>
          {!isDone?(
            <>
              <Button
                variant="contained"
                color={flow?'secondary':'success'}
                size="small"
                onClick={canAct?onConfirm:undefined}
                disabled={!canAct}
                startIcon={<MuiIcon sx={{fontSize:"12px !important"}}>check</MuiIcon>}
                sx={{textTransform:"none",borderRadius:`${radius.sm}px`,py:0.75,px:1.75,opacity:canAct?1:0.35,transition:"opacity 0.15s"}}>
                Confirm
              </Button>
              <Button
                variant="outlined"
                color={flow?'secondary':'inherit'}
                size="small"
                onClick={canAct?onDeny:undefined}
                disabled={!canAct}
                startIcon={<MuiIcon sx={{fontSize:"12px !important"}}>close</MuiIcon>}
                sx={{textTransform:"none",borderRadius:`${radius.sm}px`,py:0.75,px:1.75,opacity:canAct?1:0.35,transition:"opacity 0.15s"}}>
                Deny
              </Button>
              <Typography sx={{...typography.caption, color:palette.text.disabled, ml:0.5}}>
                {selected ? "Apply this plan or deny" : "Select a plan above to continue"}
              </Typography>
            </>
          ):(
            <Typography sx={{...typography.body2, fontWeight:500, color:statusColor}}>
              {status==="confirmed"?`✓ ${choices.find(c=>c.id===selected)?.name} submitted`:"✕ No plan applied — no changes made"}
            </Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}

// ─── Write action: automation setup form ─────────────────────────────────────
function WriteActionAutomation({ action, detail, onConfirm, onDeny, status, flow }) {
  const [cadence, setCadence] = useState('weekly');
  const [threshold, setThreshold] = useState(50);
  const [showMax, setShowMax] = useState(false);
  const [maxSpend, setMaxSpend] = useState(500);
  const [applyNow, setApplyNow] = useState(true);
  const isDone = status === 'confirmed' || status === 'denied';
  const { statusColor, borderColor, bgColor } = writeActionTone(status, flow);
  return (
    <Box>
      {/* Label */}
      <Stack direction="row" alignItems="center" gap={0.75} sx={{mb:1}}>
        <Box sx={{width:6,height:6,borderRadius:"50%",bgcolor:statusColor,flexShrink:0}}/>
        <Typography sx={{...typography.overline, color:statusColor}}>
          {isDone ? (status==="confirmed" ? "WRITE ACTION APPROVED" : "WRITE ACTION DENIED") : "WRITE ACTION REQUESTED"}
        </Typography>
      </Stack>
      {/* Card */}
      <Paper variant="outlined" sx={{borderRadius:2,overflow:"hidden",borderColor,bgcolor:bgColor}}>
        <Box sx={{py:1.25, px:1.5,borderBottom:`1px solid ${color.divider}`}}>
          <Typography sx={{...typography.body1, fontWeight:600, color:palette.neutral.black}}>{action}</Typography>
          <Typography sx={{...typography.body2, color:palette.text.secondary, mt:0.25}}>{detail}</Typography>
        </Box>
        {!isDone && (
          <Box sx={{pt:3, pb:1.5, px:1.5, display:"flex", flexDirection:"column", gap:2.5}}>
            {/* Two-col: Execution Cadence + Savings Threshold */}
            <Box sx={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:1.5}}>
              <TextField
                select
                label="Execution Cadence"
                value={cadence}
                onChange={e=>setCadence(e.target.value)}
                helperText="Rate at which Archera checks and executes"
                fullWidth
              >
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
              </TextField>
              <TextField
                label="Savings Threshold"
                type="number"
                value={threshold}
                onChange={e=>setThreshold(Number(e.target.value))}
                InputProps={{startAdornment:<InputAdornment position="start">$</InputAdornment>}}
                helperText="Min savings required to execute"
                fullWidth
              />
            </Box>
            {/* Max spend threshold toggle */}
            <Box>
              <Link
                component="button"
                variant="body2"
                onClick={()=>setShowMax(v=>!v)}
                sx={{display:"flex", alignItems:"center", gap:0.25}}
              >
                <MuiIcon sx={{fontSize:18}}>{showMax ? 'expand_less' : 'expand_more'}</MuiIcon>
                Add max spend threshold
              </Link>
              <Collapse in={showMax}>
                <Box sx={{mt:1, display:"flex", flexDirection:"column", gap:2.5}}>
                  <Typography sx={{...typography.body2, fontWeight:500}}>
                    Purchases above this amount will require your approval before executing.
                  </Typography>
                  <TextField
                    label="Max Spend Threshold"
                    type="number"
                    value={maxSpend}
                    onChange={e=>setMaxSpend(Number(e.target.value))}
                    InputProps={{startAdornment:<InputAdornment position="start">$</InputAdornment>}}
                    helperText="Dollar amount that triggers a manual approval step."
                    fullWidth
                  />
                </Box>
              </Collapse>
            </Box>
          </Box>
        )}
        <Stack direction="column" gap="8px" sx={{pt:1.125,pb:1.5,px:1.5,borderTop:`1px solid ${color.divider}`}}>
          {!isDone ? (
            <>
              <Stack direction="row" gap="4px" justifyContent="flex-end">
                <Button color="secondary" onClick={onDeny}>Deny</Button>
                <Button variant="contained" color="secondary" onClick={onConfirm}>Confirm</Button>
              </Stack>
              <Stack direction="row" gap="4px" alignItems="center">
                <MuiIcon baseClassName="material-icons-outlined" sx={{fontSize:16,color:palette.warning[500],flexShrink:0}}>warning_amber</MuiIcon>
                <Typography sx={{...typography.body2, fontStyle:"italic", color:palette.warning[500]}}>This action will modify your purchase automation settings</Typography>
              </Stack>
            </>
          ) : (
            <Typography sx={{...typography.body2, fontWeight:500, color:statusColor}}>
              {status==="confirmed" ? "✓ Purchase automation enabled" : "✕ Action denied — no changes made"}
            </Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}

const RESP=[
  {html:`<p>Analyzing your cloud commitment configuration. Based on current usage patterns across <strong>47 EC2 instances</strong> in 3 regions, I recommend converting your on-demand <code>m5.xlarge</code> fleet to a <strong>1-year Convertible Reserved Instance</strong> plan.</p><p>This reduces your compute costs by approximately <strong>34%</strong>, saving an estimated <strong>$2,840/month</strong>. Break-even is around 7 months at current utilization.</p>`},
  {html:`<p>I've reviewed your S3 storage tiers. You have <strong>14.2 TB in Standard storage</strong> that hasn't been accessed in over 90 days — moving to S3 Intelligent-Tiering would save roughly <strong>$180/month</strong> automatically.</p><p>Additionally, 3 buckets have versioning enabled without a lifecycle policy. Adding a 30-day expiry on non-current versions will prevent cost accumulation.</p>`},
  {
    html:`<p>Your 4 RDS Multi-AZ <code>db.r5.2xlarge</code> read replicas in <code>us-east-1</code> are running 24/7 with 0% reserved coverage — you're paying full on-demand rates on predictable production load.</p><p style="font-size:15px;font-weight:600;margin:10px 0 4px;color:rgba(9,10,29,0.75)">Recommended Action</p><p>Cover them with <strong>30-day Guaranteed Reserved Instances (GRIs)</strong>. GRIs give you the reserved discount without long-term lock-in — Archera absorbs the underutilization risk so if usage drops, you're protected. Estimated savings: <strong>$1,120/month</strong>.</p>`,
    confirm:{
      action:"Purchase 4 × db.r5.2xlarge GRIs",
      detail:"30-day Guaranteed RI · us-east-1 · estimated savings $1,120/mo",
      items:[
        "replica-prod-01 (us-east-1a)",
        "replica-prod-02 (us-east-1b)",
        "replica-analytics-01 (us-east-1a)",
        "replica-analytics-02 (us-east-1c)",
      ],
      flow:"plan",
    },
  },
  {html:`<p>Your Lambda concurrency profile shows several functions with <strong>cold start latency above 800ms</strong>, three of which are in the customer-facing checkout path.</p><p>Enabling Provisioned Concurrency on those three costs an additional <strong>$62/month</strong> but eliminates cold starts entirely.</p>`},
];

// ─── Conversation flow definitions ────────────────────────────────────────────
const AUTOMATION_CONFIRM = {
  type: "automation",
  action: "Enable Purchase Automation",
  detail: "Configure the cadence and savings threshold — Archera handles the rest.",
  flow: "automation",
};

const FLOW_SETUP_AUTOMATION_OFFER = {
  thinkingTrace: [
    "Reviewing your current commitment coverage",
    "Checking automation eligibility across your fleet",
    "Calculating optimal threshold and cadence",
  ],
  html: `<p>Your fleet qualifies for purchase automation. Based on your current usage patterns, I'd suggest a <strong>weekly cadence</strong> with a <strong>$50/mo savings threshold</strong> — any opportunity worth at least $50/mo gets purchased automatically during the weekly review.</p><p>Review the settings below and confirm to enable.</p>`,
  confirm: AUTOMATION_CONFIRM,
};

function flowPlanConfirmed(plan) {
  return {
    thinkingTrace: [
      `Submitting the ${plan.name}`,
      "Making sure there are no conflicting reservations",
      "Queuing 8 EC2 Reserved Instances",
      "Queuing 2 Compute Savings Plans",
      "Queuing 2 EC2 Instance Savings Plans",
      "All 12 commitments are in — they'll be active within the hour",
    ],
    reasoning: [
      `Confirmed submission of ${plan.name} to Archera commitment engine`,
      "Verified 12 target instances still match original utilization profile",
      "No conflicting reservations found — safe to proceed",
      `Savings rate locked at current on-demand pricing: ${plan.savings}`,
    ],
    html: `<p>Your <strong>${plan.name}</strong> has been submitted. You'll start seeing savings immediately as the new commitments take effect across your account — at the modeled <strong>${plan.savings}</strong> rate.</p><p style="font-size:15px;font-weight:600;margin:10px 0 4px;color:rgba(9,10,29,0.75)">Keep saving automatically?</p><p>I can monitor your usage continuously and auto-purchase new commitments the moment savings opportunities cross a threshold — so you'll never miss a window when your usage shifts. Over a year, this typically captures an additional <strong>10–15%</strong> on top of your current plan. Configure and confirm below to enable.</p>`,
    confirm: AUTOMATION_CONFIRM,
  };
}

const FLOW_PLAN_DENIED = {
  followUp: "Set up purchase automation",
  thinkingTrace: [
    "Not applying the plan — leaving your commitments as they are",
    "Checking if automation could help catch future opportunities",
    "Working out what the delay is costing per day",
  ],
  reasoning: [
    "User declined plan — no changes made to commitment inventory",
    "Reviewed automation eligibility — current fleet qualifies for weekly auto-purchase",
    "Calculated opportunity cost of delay: ~$308/day in uncaptured savings",
  ],
  html: `<p>No problem — I'll keep your current commitments in place. The modeled plans stay available in your Commitment Inventory anytime you want to revisit them.</p><p style="font-size:15px;font-weight:600;margin:10px 0 4px;color:rgba(9,10,29,0.75)">One thing worth considering</p><p>Even without applying a new plan today, enabling <strong>purchase automation</strong> is the highest-leverage move available here. It watches your usage continuously and auto-purchases new commitments as soon as they cross a savings threshold — so the next time your fleet shifts, you don't lose weeks of full on-demand spend before someone notices.</p><p>I'd suggest a <strong>$50 savings threshold</strong> with a <strong>weekly cadence</strong> — any opportunity worth at least $50/mo in savings gets purchased automatically during the weekly review. You can dial it up later if you want a more conservative bar.</p>`,
};

const FLOW_AUTOMATION_CONFIRMED = {
  followUp: "Show me what the first weekly run will cover",
  html: `<p><strong>Purchase automation is now enabled.</strong> I'll review your usage every week and automatically purchase any commitment opportunity worth <strong>≥$50/mo</strong> in savings — you'll get a notification each time one fires.</p><p>You can change the threshold, cadence, or scope at any time from <em>Settings → Automation</em>, or just ask me here. I'll send you a digest after the first weekly run.</p>`,
};

const FLOW_AUTOMATION_DENIED = {
  html: `<p>Got it — automation is off for now. Your active commitments are still saving in the background.</p><p style="font-size:15px;font-weight:600;margin:10px 0 4px;color:rgba(9,10,29,0.75)">Worth keeping in mind</p><p>The biggest source of savings drift is <strong>not noticing</strong>. Without automation, opportunities surface only when someone manually models them — which often means weeks of full on-demand spend before a new commitment is in place.</p><p>If that ever changes, just say "enable automation" and I'll set it up. You can also start with a more conservative threshold — say, <strong>$200/mo</strong> — if $50 feels too aggressive.</p>`,
};

// ─── App ──────────────────────────────────────────────────────────────────────
const INIT_UID = 1;
const INIT_MSGS = [
  {id:INIT_UID, type:"user", content:"I'd like to understand my savings opportunities. Can you walk me through what I could be saving on my current cloud spend?"},
  {id:INIT_UID+1, type:"response",
    html:`<p>I've analyzed your cloud environment. Here is your current savings posture:</p><hr style="border:none;border-top:1px solid rgba(9,10,29,0.1);margin:12px 0"/><p style="font-size:15px;font-weight:600;margin:10px 0 4px;color:rgba(9,10,29,0.75)">Current State</p><p><strong>Coverage is very low at 22.5%</strong> — only about a quarter of your reservable spend is covered by commitments. Most of your workloads are running on-demand at full price.</p><p style="font-size:15px;font-weight:600;margin:10px 0 4px;color:rgba(9,10,29,0.75)">My Recommendation</p><p>I'd go with the <strong>Recommended Plan (30 days)</strong> over the longer 1-year option. It captures <strong>$9,240/mo</strong> in savings — roughly 91% of what the 1-year plan offers — while keeping you nimble. Three reasons short-term wins here:</p><ul><li><strong>Lower commitment risk.</strong> Your fleet is still scaling — locking in a year now means paying for capacity you may not need by Q3.</li><li><strong>Faster break-even.</strong> 30-day plans pay back in under a month vs. 4–6 months for longer terms.</li><li><strong>Easier to layer.</strong> You can stack additional 30-day commitments as your usage stabilizes, without overcommitting up front.</li></ul>`,
    thinkingTrace:[
      "Looking at your usage data over the last 90 days",
      "Checking what reservations you have active right now",
      "Pulling current pricing for reserved capacity",
      "Modeling savings scenarios based on your usage patterns",
    ],
    followUp: "Show me what's in the Recommended Plan",
    pageNum:1, totalPages:1, expanded:false, onResetDone:null,
    reasoning: [
      "Fetched 90-day usage data for 47 EC2 instances across 3 regions",
      "Calculated on-demand spend: $32,400/mo with 22.5% commitment coverage",
      "Modeled 30-day vs 1-year commitment scenarios against actual utilization",
      "Weighted for fleet scaling risk — usage grew 18% last quarter",
      "Selected 30-day plan: 91% of max savings with significantly lower commitment risk",
    ],
    steps:[
      {tone:"blue",   pill:"ANALYSIS DONE",     icon:"chart",  label:"Overview ready — $36/mo saved, 22% coverage", expandable:true, detail:"Analyzed 47 instances: 12× m5.xlarge, 8× c5.2xlarge, 7× t3.medium — 22.5% covered by active commitments"},
      {tone:"amber",  pill:"OPTIMIZER FOUND",   icon:"bolt",   label:"Recommended plan found — $9,240/mo savings",  expandable:true, detail:"Modeled 3 plan variants. 30-day: $9,240/mo (94% utilization match). 1-year: $10,180/mo (requires 89% sustained utilization). Hybrid: $8,600/mo."},
      {tone:"violet", pill:"MODELING COMPLETE", icon:"folder", label:"Available Commitment Plans", meta:"2 Plans", expandable:true,
        plans:[
          {name:"Recommended Plan", term:"30 days", savings:"$9,240/mo"},
          {name:"Balanced Plan",    term:"1 year",  savings:"$10,180/mo"},
        ],
        detail:"Cross-referenced 90-day CUR data, active RI inventory, current on-demand rates, and Archera commitment catalog pricing",
      },
    ],
    confirm:{
      action:"Apply recommended commitment plan",
      detail:"Purchase 12 new commitments to lift coverage 22% → 60% · estimated $9,240/mo additional savings",
      items:[
        "8 × Convertible RI · m5.xlarge · 1yr no upfront",
        "2 × Compute Savings Plan · $1,200/mo commitment · 1yr",
        "2 × EC2 Instance Savings Plan · c5 family · 3yr partial upfront",
      ],
      flow:"plan",
    },
  },
];

// ─── Chat item ────────────────────────────────────────────────────────────────
function ChatItem({ title: initialTitle, isPinned=false, onPinToggle, onDelete, onSelect, onShare, onRename, dense=false, isShared=false, sharedBy, sharedDate, isRead=true, isOwned=false, isActive=false }) {
  const [title, setTitle] = useState(initialTitle);
  const [hovered, setHovered] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState('');
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);
  const renameRef = useRef(null);
  const menuOpen = Boolean(menuAnchor);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [title]);

  useEffect(() => {
    if (!renaming) setTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    if (renaming && renameRef.current) {
      renameRef.current.focus();
      renameRef.current.select();
    }
  }, [renaming]);

  function startRename() { setRenameVal(title); setRenaming(true); }
  function commitRename() { const t=renameVal.trim(); if(t){setTitle(t);onRename?.(t);} setRenaming(false); }
  function cancelRename() { setRenaming(false); }

  return (
    <Box
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      onClick={!renaming && !confirmingDelete && !menuOpen ? onSelect : undefined}
      sx={{
        display:"flex", alignItems:"center",
        px:1, py: dense ? 0 : "2px", borderRadius:`${radius.sm}px`, cursor: renaming ? "default" : "pointer",
        bgcolor: isActive ? `${palette.uiPrimary[500]}14` : hovered ? "rgba(79,78,85,0.04)" : "transparent",
        transition:"background 0.1s",
      }}
    >
      {renaming ? (
        <InputBase
          inputRef={renameRef}
          value={renameVal}
          onChange={e=>setRenameVal(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter') commitRename(); if(e.key==='Escape') cancelRename(); }}
          sx={{flex:1, minWidth:0, ...typography.body1, color:palette.text.primary}}
        />
      ) : confirmingDelete ? (
        <Typography sx={{...typography.body2, color:palette.error[500], flex:1, minWidth:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
          Delete "{title}"?
        </Typography>
      ) : (
        <Stack direction="row" alignItems="flex-start" gap={0.75} sx={{flex:1,minWidth:0}}>
          {isShared && !isRead && <Box sx={{width:6,height:6,borderRadius:'50%',bgcolor:palette.brandTertiary[500],flexShrink:0,mt:0.75}}/>}
          <Box sx={{flex:1,minWidth:0}}>
            {!title ? <Skeleton variant="text" width="72%" sx={{fontSize:'0.875rem'}}/> : (
            <Tooltip title={isTruncated ? title : ""} placement="right" enterDelay={600} disableHoverListener={!isTruncated}>
              <Typography ref={textRef} sx={{...typography.body1,color:isActive?palette.uiPrimary[700]:palette.text.primary,fontWeight:isActive?500:undefined,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {title}
              </Typography>
            </Tooltip>
            )}
            {isShared && sharedBy && !isOwned && (
              <Typography sx={{...typography.caption,color:palette.text.secondary}}>
                Shared by {sharedBy} · {sharedDate}
              </Typography>
            )}
          </Box>
        </Stack>
      )}

      {(renaming || confirmingDelete) ? (
        <Stack direction="row" gap="2px" sx={{flexShrink:0, ml:"auto", pl:1}}>
          <IconButton size="small" onClick={renaming ? commitRename : ()=>{ setConfirmingDelete(false); onDelete?.(); }} color={renaming ? "success" : "error"}>
            <MuiIcon sx={{fontSize:16}}>{renaming ? "check" : "delete_outline"}</MuiIcon>
          </IconButton>
          <IconButton size="small" onClick={renaming ? cancelRename : ()=>setConfirmingDelete(false)} color={renaming ? "error" : "default"}>
            <MuiIcon sx={{fontSize:16}}>close</MuiIcon>
          </IconButton>
        </Stack>
      ) : null}

      {!renaming && !confirmingDelete && (
        <IconButton
          size="small"
          onClick={e=>{e.stopPropagation(); setMenuAnchor(e.currentTarget);}}
          sx={{flexShrink:0, ml:0.5, visibility: hovered||menuOpen ? "visible" : "hidden"}}
        >
          <MuiIcon sx={{fontSize:16}}>more_vert</MuiIcon>
        </IconButton>
      )}

      <Menu
        anchorEl={menuAnchor}
        open={menuOpen}
        onClose={()=>setMenuAnchor(null)}
        anchorOrigin={{vertical:'bottom', horizontal:'right'}}
        transformOrigin={{vertical:'top', horizontal:'right'}}
        slotProps={{paper:{sx:{borderRadius:`${radius.sm}px`, minWidth:140}}}}
      >
        <MenuItem dense onClick={()=>{ setMenuAnchor(null); onPinToggle?.(); }}>
          <ListItemIcon><MuiIcon baseClassName={isPinned ? 'material-symbols-outlined' : 'material-icons-outlined'} sx={{fontSize:20}}>{isPinned ? 'keep_off' : 'push_pin'}</MuiIcon></ListItemIcon>
          <ListItemText><Typography sx={{...typography.body2}}>{isPinned ? 'Unpin' : 'Pin'}</Typography></ListItemText>
        </MenuItem>
        <MenuItem dense onClick={()=>{ setMenuAnchor(null); startRename(); }}>
          <ListItemIcon><MuiIcon baseClassName="material-icons-outlined" sx={{fontSize:20}}>drive_file_rename_outline</MuiIcon></ListItemIcon>
          <ListItemText><Typography sx={{...typography.body2}}>Rename</Typography></ListItemText>
        </MenuItem>
        {onShare && <MenuItem dense onClick={()=>{ setMenuAnchor(null); onShare(); }}>
          <ListItemIcon><MuiIcon baseClassName="material-symbols-outlined" sx={{fontSize:20}}>share</MuiIcon></ListItemIcon>
          <ListItemText><Typography sx={{...typography.body2}}>Share</Typography></ListItemText>
        </MenuItem>}
        <Divider />
        <MenuItem dense onClick={()=>{ setMenuAnchor(null); setConfirmingDelete(true); }}>
          <ListItemIcon><MuiIcon baseClassName="material-icons-outlined" sx={{fontSize:20, color:palette.error[500]}}>delete_outline</MuiIcon></ListItemIcon>
          <ListItemText><Typography sx={{...typography.body2, color:palette.error[500]}}>Delete</Typography></ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}

// ─── Demo conversations (loaded instantly from chat history) ──────────────────
function hist(id, pairs) {
  return pairs.flatMap(([q, a], i) => {
    const steps = pickThinkingSteps(4);
    return [
      { id: `${id}_${i}_u`, type:"user",     content: q },
      { id: `${id}_${i}_r`, type:"response", html: a, instant:true, thinkingTrace:steps, reasoning:pickReasoningSteps(), followUp:pickFollowUp(), pageNum:1, totalPages:1, expanded:false, onResetDone:null },
    ];
  });
}

const CHAT_CONVOS = {
  1: hist(1,[
    ["What does my EC2 commitment coverage look like?",
     `<p>Your EC2 commitment coverage is currently <strong>34%</strong> — well below the recommended 70%+ threshold for mature cloud environments.</p><p>You have <strong>47 on-demand instances</strong> running in us-east-1 and us-west-2 with no reservations attached. The largest uncovered workloads are your <code>m5.xlarge</code> fleet (18 instances) and <code>c5.2xlarge</code> batch workers (12 instances).</p>`],
    ["Which instances should I prioritize for reservations?",
     `<p>Based on 90-day utilization patterns, I'd prioritize in this order:</p><ol><li><strong>m5.xlarge fleet (18 instances)</strong> — 94% average utilization, steady traffic. A 1-year no-upfront RI saves <strong>$1,840/mo</strong>.</li><li><strong>c5.2xlarge batch workers (12 instances)</strong> — 78% utilization. Compute Savings Plan covers variable scheduling better than RIs here. Estimated savings: <strong>$1,120/mo</strong>.</li><li><strong>t3.medium web servers (9 instances)</strong> — 65% utilization, borderline. Worth a 1-year convertible RI for flexibility.</li></ol><p>Total opportunity: <strong>~$3,200/mo</strong> with minimal commitment risk.</p>`],
    ["Can you apply the m5.xlarge reservations?",
     `<p>I've submitted <strong>18 × m5.xlarge 1-year no-upfront Reserved Instances</strong> across us-east-1 (12) and us-west-2 (6). They'll be active within the hour and automatically applied to matching instances.</p><p>Projected monthly savings: <strong>$1,840</strong>. Your EC2 coverage will move from 34% → 52% once these take effect.</p>`],
    ["What about the c5.2xlarge workers — should I do a Savings Plan or RIs?",
     `<p>For your <code>c5.2xlarge</code> batch workers, a <strong>Compute Savings Plan</strong> is the better fit over instance-level RIs. Here's why:</p><ul><li><strong>Usage pattern.</strong> Batch workloads typically have variable concurrency — some hours you're running 12 instances, others you might be at 6 or fewer. A CSP discounts any EC2 compute usage (regardless of instance type or region), so it absorbs that variability without waste.</li><li><strong>Flexibility.</strong> If you right-size these workers to <code>c5.xlarge</code> or move to Graviton <code>c6g</code> down the road, the CSP still applies. Instance RIs would strand.</li><li><strong>Discount.</strong> A $2,400/mo Compute Savings Plan commitment covers the c5.2xlarge fleet at ~76% utilization and saves approximately <strong>$1,120/mo</strong> — effectively 32% off on-demand.</li></ul><p>I'd recommend a 1-year no-upfront CSP at <strong>$2,400/mo</strong>. Want me to submit it?</p>`],
    ["Yes, go ahead",
     `<p>Submitted. A <strong>1-year no-upfront Compute Savings Plan at $2,400/mo</strong> is now queued — it typically activates within 15 minutes and begins discounting eligible EC2 usage immediately.</p><p>With the m5.xlarge RIs and this CSP combined, your EC2 coverage moves from <strong>34% → 67%</strong> and total monthly savings increase by <strong>$2,960</strong>. You're close to the 70% threshold — the remaining gap is mostly your t3.medium web tier.</p>`],
    ["What's the risk if I also do the t3.medium RIs and usage drops?",
     `<p>The t3.medium fleet is where I'd be more cautious. A few things to consider:</p><p><strong>Utilization risk.</strong> At 65% average utilization, you have meaningful idle time already. If a deployment or traffic shift drops that further — say, to 50% — you're paying for reservations on instances that are partially sitting idle. The break-even math still works, but the margin of safety is thinner than with your m5 or c5 workloads.</p><p><strong>Mitigation options:</strong></p><ul><li>Use <strong>Convertible RIs</strong> instead of Standard — you can exchange them for a different instance type if your fleet evolves. The discount is slightly lower (~31% vs ~37%) but you preserve flexibility.</li><li>Start with <strong>50% coverage</strong> (5 of 9 instances) rather than going all-in. This hedges the utilization risk while still capturing meaningful savings.</li><li>Wait 30 days for the Archera utilization model to refine its forecast now that your m5 and c5 coverage has changed — the freed-up spend sometimes shifts instance patterns.</li></ul><p>My recommendation: hold on the t3.medium RIs for 30 days and revisit. The opportunity isn't going anywhere.</p>`],
    ["That makes sense. Can you set a reminder to revisit in 30 days?",
     `<p>Noted — I'll flag the t3.medium opportunity in your next monthly review. In the meantime, I'll track utilization on those 9 instances and surface any trend changes before then.</p><p>Here's where things stand after today's changes:</p><ul><li><strong>EC2 coverage:</strong> 34% → 67%</li><li><strong>New monthly savings:</strong> +$2,960</li><li><strong>Commitments submitted:</strong> 18 × m5.xlarge RIs + 1 × Compute Savings Plan</li><li><strong>Pending review (30 days):</strong> t3.medium web tier — 9 instances, ~$360/mo opportunity</li></ul><p>Is there anything else you'd like to tackle in this session?</p>`],
  ]),
  2: hist(2,[
    ["Can you summarize my savings this month?",
     `<p>Here's your May 2026 savings summary:</p><ul><li><strong>Total cloud spend:</strong> $142,400</li><li><strong>On-demand equivalent:</strong> $198,600</li><li><strong>Total savings:</strong> $56,200 (28.3%)</li></ul><p>Breakdown by commitment type: Reserved Instances contributed <strong>$38,400</strong>, Savings Plans added <strong>$14,200</strong>, and Spot usage saved <strong>$3,600</strong>.</p>`],
    ["How does that compare to last month?",
     `<p>April savings were <strong>$49,800 (24.8%)</strong>, so May improved by <strong>$6,400</strong> — driven mainly by the 12 new EC2 RIs that activated on May 3rd.</p><p>Coverage rate improved from <strong>61% → 68%</strong>. The remaining gap is concentrated in your RDS fleet, which added 4 new db.r5.2xlarge instances in mid-April that aren't yet covered.</p>`],
  ]),
  3: hist(3,[
    ["What RDS optimization opportunities do you see?",
     `<p>Your RDS fleet has <strong>$4,200/mo</strong> in untapped savings potential:</p><ul><li><strong>db.r5.2xlarge × 4</strong> (Aurora MySQL, us-east-1) — 0% reserved, running 24/7 at 82% CPU. 1-year RI saves <strong>$2,100/mo</strong>.</li><li><strong>db.t3.large × 6</strong> (PostgreSQL, dev/staging) — only 18% utilization on weekends. Scheduled stop/start would save <strong>$840/mo</strong> without reservations.</li><li><strong>db.r5.xlarge × 2</strong> (reporting) — used primarily 9am–6pm weekdays. Reserved + scheduled would save <strong>$520/mo</strong>.</li></ul>`],
    ["Apply the Aurora reservations",
     `<p>Submitted <strong>4 × db.r5.2xlarge 1-year Reserved Instances</strong> for Aurora MySQL in us-east-1. Activation typically takes 10–15 minutes.</p><p>Estimated monthly savings: <strong>$2,100</strong>. Your RDS coverage moves from <strong>12% → 41%</strong> — significantly closing the gap we identified last month.</p><p>I've flagged the dev/staging schedule opportunity separately — want me to set up auto-stop policies for those too?</p>`],
  ]),
  4: hist(4,[
    ["I'd like to understand my savings opportunities. Can you walk me through what I could be saving on my current cloud spend?",
     `<p>I've analyzed your cloud environment. Your current commitment coverage is <strong>22.5%</strong> — only about a quarter of your reservable spend is covered. Most workloads are running on-demand at full price.</p><p>The biggest opportunity is your EC2 fleet. I'd recommend the <strong>Recommended Plan (30 days)</strong> — it captures <strong>$9,240/mo</strong> in savings while keeping you flexible as your fleet scales.</p>`],
    ["Go ahead and apply the recommended plan",
     `<p>Your <strong>Recommended Plan</strong> has been submitted. You'll start seeing savings immediately as the new commitments take effect — at the modeled <strong>$9,240/mo</strong> rate.</p><p>Coverage will rise from 22.5% → 60% once all commitments activate. Want me to set up automation to catch new opportunities as your usage grows?</p>`],
  ]),
  5: hist(5,[
    ["What Azure VM reservations should I be buying?",
     `<p>Your Azure environment has <strong>$6,800/mo</strong> in reservation opportunities across two main areas:</p><ul><li><strong>Standard_D4s_v3 × 8</strong> (East US) — 91% utilization, ideal for 1-year reservation. Saves <strong>$3,200/mo</strong> vs. pay-as-you-go.</li><li><strong>Standard_E8s_v3 × 4</strong> (West Europe) — 74% utilization. 1-year flexible scope reservation saves <strong>$2,400/mo</strong> and covers instance size flexibility.</li><li><strong>Standard_B2s × 12</strong> (dev workloads) — lower priority, but 3-year reservation saves <strong>$1,200/mo</strong> if these are stable long-term.</li></ul>`],
    ["What's the difference between a shared scope and single scope reservation?",
     `<p><strong>Shared scope</strong> applies the reservation discount to any matching VM across all subscriptions in your billing account. It maximizes utilization — if one subscription's VMs go offline, another's can absorb the reservation.</p><p><strong>Single scope</strong> limits the discount to a specific subscription or resource group. Useful when you need cost attribution per team or business unit, but risks underutilization if that subscription's usage drops.</p><p>For your D4s_v3 fleet spread across 3 subscriptions, <strong>shared scope is the right choice</strong>.</p>`],
  ]),
  6: hist(6,[
    ["Can you project my Q2 savings?",
     `<p>Based on your current commitments and the pipeline of recommendations, here's the Q2 2026 savings forecast:</p><ul><li><strong>April:</strong> $49,800 (24.8%) — baseline from current commitments</li><li><strong>May:</strong> $56,200 (28.3%) — new EC2 RIs take effect</li><li><strong>June:</strong> $61,400 (30.1%) — RDS reservations + projected Savings Plan top-up</li></ul><p>Full Q2 projected savings: <strong>$167,400</strong>. To hit the 35% coverage target by Q3, you'd need to add approximately <strong>$8,200/mo</strong> in new commitments — primarily in RDS and Lambda.</p>`],
    ["What's driving the June improvement?",
     `<p>The June jump is driven by three things:</p><ol><li><strong>RDS Aurora reservations</strong> (~$2,100/mo) — submitted last week, activating June 1st</li><li><strong>Compute Savings Plan top-up</strong> (~$1,400/mo) — a $3,200/mo CSP addition you approved in April hits its 60-day mark and begins providing full benefit</li><li><strong>Lambda provisioned concurrency</strong> (~$380/mo) — three checkout-path functions switching from on-demand to provisioned reduces cold starts and cost simultaneously</li></ol><p>The remaining gap to 35% is mostly Fargate, which is on the roadmap for Q3 planning.</p>`],
  ]),
};

// ─── Chat history menu ────────────────────────────────────────────────────────
const INIT_PINNED = [
  { id: 1, title: "EC2 coverage analysis" },
  { id: 2, title: "Monthly savings report" },
];
const INIT_ALL = [
  { id: 3, title: "RDS optimization review" },
  { id: 4, title: "Fargate commitment plan" },
  { id: 5, title: "Azure VM reservations" },
  { id: 6, title: "Q2 savings forecast" },
];

// ─── Org accounts (mock) ─────────────────────────────────────────────────────
const ORG_ACCOUNTS = [
  { id:'a1', name:'Sarah Chen',    email:'s.chen@company.com',    initials:'SC', color:palette.uiPrimary[700]    },
  { id:'a2', name:'Marcus Johnson',email:'m.johnson@company.com', initials:'MJ', color:palette.brandPrimary[600] },
  { id:'a3', name:'Priya Patel',   email:'p.patel@company.com',   initials:'PP', color:palette.success[700]      },
  { id:'a4', name:'Alex Rivera',   email:'a.rivera@company.com',  initials:'AR', color:palette.accent2[700]      },
  { id:'a5', name:'Jordan Kim',    email:'j.kim@company.com',     initials:'JK', color:palette.info[700]         },
  { id:'a6', name:'Taylor Brooks', email:'t.brooks@company.com',  initials:'TB', color:palette.warning[700]      },
  { id:'a7', name:'Devon Walsh',   email:'d.walsh@company.com',   initials:'DW', color:palette.brandTertiary[700]},
];

function avatarColor(name) {
  const account = ORG_ACCOUNTS.find(a=>a.name===name);
  return account?.color ?? palette.uiPrimary[700];
}

// ─── Received shares (mock) ───────────────────────────────────────────────────
const INIT_RECEIVED_SHARES = [
  { id:'r1', title:'EC2 reservation priorities', sharedBy:'Sarah Chen',    date:'2h ago',    type:'conversation', read:false,
    msgs: hist('r1',[
      ["What does my EC2 commitment coverage look like?",
       `<p>Your EC2 commitment coverage is currently <strong>34%</strong> — well below the recommended 70%+ threshold.</p><p>You have <strong>47 on-demand instances</strong> running in us-east-1 and us-west-2 with no reservations. The largest uncovered workloads are your <code>m5.xlarge</code> fleet (18 instances) and <code>c5.2xlarge</code> batch workers (12 instances).</p>`],
      ["Which should I prioritize?",
       `<p>I'd prioritize in this order:</p><ol><li><strong>m5.xlarge fleet (18 instances)</strong> — 94% utilization, steady traffic. A 1-year no-upfront RI saves <strong>$1,840/mo</strong>.</li><li><strong>c5.2xlarge batch workers (12)</strong> — 78% utilization. Compute Savings Plan covers variable scheduling better. Savings: <strong>$1,120/mo</strong>.</li></ol><p>Total opportunity: <strong>~$3,200/mo</strong> with minimal risk.</p>`],
    ])
  },
  { id:'r2', title:'Q2 savings projection',    sharedBy:'Marcus Johnson', date:'Yesterday', type:'response',      read:false,
    msgs: hist('r2',[
      ["Can you project our Q2 savings?",
       `<p>Based on current commitments, here's your Q2 2026 forecast:</p><ul><li><strong>April:</strong> $49,800 (24.8%)</li><li><strong>May:</strong> $56,200 (28.3%) — new EC2 RIs activate</li><li><strong>June:</strong> $61,400 (30.1%) — RDS reservations take effect</li></ul><p>Full Q2 projected savings: <strong>$167,400</strong>. To hit 35% by Q3 you'll need <strong>$8,200/mo</strong> in new commitments.</p>`],
    ])
  },
];

// ─── Received demo pre-seeded messages (includes share divider) ──────────────
const RECEIVED_DEMO_MSGS = [
  ...INIT_RECEIVED_SHARES[0].msgs,
  { id:'r1_div', type:'shared-divider', title:INIT_RECEIVED_SHARES[0].title, sharedBy:INIT_RECEIVED_SHARES[0].sharedBy, date:INIT_RECEIVED_SHARES[0].date },
];

// ─── UserAvatar ───────────────────────────────────────────────────────────────
function UserAvatar({ name, initials, size=28, color }) {
  const fontSize = size <= 20 ? 10 : 12;
  const bg = color ?? avatarColor(name);
  return (
    <Box sx={{width:size,height:size,borderRadius:'50%',bgcolor:bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <Typography sx={{fontSize,fontWeight:500,lineHeight:`${fontSize}px`,color:palette.neutral.white}}>{initials}</Typography>
    </Box>
  );
}

// ─── UserRow — matches Figma "Full" pattern (28px avatar, name + email) ───────
function UserRow({ account, size='full' }) {
  const isCompact = size === 'standard';
  const avatarSize = isCompact ? 20 : 28;
  const gap = isCompact ? '4px' : '8px';
  return (
    <Stack direction="row" alignItems="center" gap={gap}>
      <UserAvatar name={account.name} initials={account.initials} size={avatarSize} color={account.color}/>
      {isCompact ? (
        <Typography sx={{...typography.body1,fontWeight:500,color:palette.text.primary,whiteSpace:'nowrap'}}>{account.name}</Typography>
      ) : (
        <Box>
          <Typography sx={{...typography.body1,fontWeight:500,color:palette.text.primary,lineHeight:'20px'}}>{account.name}</Typography>
          <Typography sx={{fontSize:'0.625rem',fontWeight:400,lineHeight:'12px',color:palette.text.secondary}}>{account.email}</Typography>
        </Box>
      )}
    </Stack>
  );
}

// ─── ShareDialog ──────────────────────────────────────────────────────────────
function generateShareTitle(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';
  const text = (tmp.textContent || '').replace(/\s+/g, ' ').trim();
  const words = text.split(' ');
  return words.slice(0, 7).join(' ') + (words.length > 7 ? '…' : '');
}

function ShareDialog({ open, config, onClose, onShare }) {
  const [includeConversation, setIncludeConversation] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [shareAll, setShareAll] = useState(false);
  const [shareTitle, setShareTitle] = useState('');

  useEffect(() => {
    if(open){ setShareTitle(config?.title || ''); }
    else { setIncludeConversation(false); setSelectedAccounts([]); setShareAll(false); setShareTitle(''); }
  }, [open]);

  function toggleAccount(id) {
    setSelectedAccounts(prev => {
      const next = prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id];
      setShareAll(next.length === ORG_ACCOUNTS.length);
      return next;
    });
  }

  const isConversation = config?.isConversation;
  const canShare = shareAll || selectedAccounts.length > 0;
  const sharingConversation = isConversation || includeConversation;

  const shareLabel = shareAll ? 'Share with everyone' : selectedAccounts.length > 1 ? `Share with ${selectedAccounts.length} people` : selectedAccounts.length === 1 ? 'Share with 1 person' : 'Share';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" gap={1}>
          <MuiIcon baseClassName="material-symbols-outlined" sx={{fontSize:20,color:palette.text.secondary}}>share</MuiIcon>
          {isConversation ? 'Share Conversation' : 'Share Response'}
        </Stack>
      </DialogTitle>

      <DialogContent sx={{px:3,pt:1,pb:2.5}}>
        {/* Subtitle + warning inline */}
        <Typography sx={{...typography.body1,color:palette.text.secondary,pb:2}}>
          Share this analysis with teammates. Each person gets their own private copy to continue the conversation, ask follow-up questions, and apply the insights to their workloads.{' '}
          <span style={{color:palette.warning[500]}}>This can't be undone.</span>
        </Typography>

        {/* Title input */}
        <Box sx={{mb:2.5}}>
          <Typography sx={{...typography.body1, fontWeight:500, mb:0.75}}>
            {isConversation ? 'Conversation title' : 'Response title'}
          </Typography>
          <TextField
            placeholder="Enter a title…"
            value={shareTitle}
            onChange={e=>setShareTitle(e.target.value)}
            fullWidth
          />
        </Box>

        {/* Recipients section */}
        <Typography sx={{...typography.subtitle2, color:palette.text.secondary, mb:1}}>Share with</Typography>
        <Box sx={{border:`1px solid ${color.divider}`, borderRadius:1, overflow:'hidden', mb:2}}>
          {/* Select all */}
          <Box onClick={()=>{ const next=!shareAll; setShareAll(next); setSelectedAccounts(next?ORG_ACCOUNTS.map(a=>a.id):[]); }}
            sx={{display:'flex',alignItems:'center',gap:1.5,px:2,py:1.25,cursor:'pointer',
              bgcolor:shareAll?`${palette.uiPrimary[500]}08`:'transparent',
              borderLeft:`3px solid ${shareAll?palette.uiPrimary[500]:'transparent'}`,
              '&:hover':{bgcolor:`${palette.uiPrimary[500]}06`},
              transition:'background 0.1s, border-color 0.1s',
            }}>
            <Checkbox size="small" checked={shareAll}
              indeterminate={!shareAll && selectedAccounts.length>0 && selectedAccounts.length<ORG_ACCOUNTS.length}
              onClick={e=>e.stopPropagation()}
              onChange={e=>{setShareAll(e.target.checked); setSelectedAccounts(e.target.checked?ORG_ACCOUNTS.map(a=>a.id):[]);}}
              sx={{p:0,flexShrink:0}}/>
            <Box>
              <Typography sx={{...typography.body1,fontWeight:500}}>Share with entire organization</Typography>
              <Typography sx={{...typography.caption,color:palette.text.secondary}}>All {ORG_ACCOUNTS.length} members</Typography>
            </Box>
          </Box>
          <Divider/>
          {/* Account grid */}
          <Box sx={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',maxHeight:220,overflowY:'auto'}}>
            {ORG_ACCOUNTS.map(account => {
              const selected = selectedAccounts.includes(account.id);
              return (
                <Box key={account.id} onClick={()=>toggleAccount(account.id)}
                  sx={{display:'flex',alignItems:'center',gap:1.5,px:2,py:1.25,cursor:'pointer',
                    bgcolor:selected?`${palette.uiPrimary[500]}08`:'transparent',
                    borderLeft:`3px solid ${selected?palette.uiPrimary[500]:'transparent'}`,
                    '&:hover':{bgcolor:`${palette.uiPrimary[500]}06`},
                    transition:'background 0.1s, border-color 0.1s',
                  }}
                >
                  <Checkbox size="small" checked={selected}
                    onClick={e=>e.stopPropagation()} onChange={()=>toggleAccount(account.id)} sx={{p:0,flexShrink:0}}/>
                  <UserRow account={account}/>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Include full conversation — only for single response */}
        {!isConversation && (
          <FormControlLabel
            control={<Checkbox size="small" checked={includeConversation} onChange={e=>setIncludeConversation(e.target.checked)}/>}
            label={
              <Box>
                <Typography sx={{...typography.body1}}>Include full conversation</Typography>
                <Typography sx={{...typography.caption,color:palette.text.secondary}}>Gives recipients the context behind this response so they can follow the full analysis.</Typography>
              </Box>
            }
          />
        )}
      </DialogContent>

      <DialogActions sx={{px:3,pb:2.5,pt:1}}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="secondary" disabled={!canShare}
          onClick={()=>{ onShare({ accounts: shareAll ? 'all' : selectedAccounts, includeConversation: sharingConversation }); onClose(); }}>
          {shareLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Shared conversation attribution ────────────────────────────────────────
function SharedByMeta({ title, sharedBy, date }) {
  return (
    <Box sx={{borderBottom:'1px dashed rgba(0,0,0,0.15)', pb:0.5, pl:0.5, mb:2}}>
      <Typography sx={{...typography.h6, color:palette.text.primary}}>{title}</Typography>
      <Typography sx={{...typography.body2, color:palette.text.secondary}}>Shared by {sharedBy} · {date}</Typography>
    </Box>
  );
}

function ChatMenu({ onNewChat, sidebar=false, onSelectChat, showNewChat=true, dense=false, receivedShares=[], onMarkRead, onSelectShared, onShare, onClose, activeChatId=null, activeShareId=null, pinned=[], all=[], onPin, onUnpin, onDelete, onRename }) {
  function pin(item) { onPin?.(item); }
  function unpin(item) { onUnpin?.(item); }
  function deleteItem(item) { onDelete?.(item); }
  return (
    <Box sx={sidebar ? {
      width: { xs: 260, lg: 320 }, flexShrink:0,
      bgcolor:palette.neutral[50],
      display:"flex",flexDirection:"column",gap: dense ? "8px" : "24px",
      pt:2, pb:1, px:2,
      overflow:"hidden",
      borderRight:`1px solid ${color.divider}`,
    } : {
      position:"absolute",top:8,left:8,right:8,bottom:8,
      bgcolor:palette.surface,
      zIndex:5,
      display:"flex",flexDirection:"column",gap:3,
      pt:2,pb:1,px:2,
      overflow:"hidden",
      animation:"fadeIn 0.15s ease",
      borderRadius:1,
      border:`1px solid ${color.divider}`,
      boxShadow:"0px 2px 1px -1px rgba(0,0,0,0.20), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    }} onClick={e=>e.stopPropagation()}>
      {/* Overlay header with close button */}
      {!sidebar&&onClose&&<Box sx={{display:"flex",justifyContent:"flex-end",mb:-1}}>
        <IconButton size="small" onClick={onClose} sx={{mr:"-6px"}}><MuiIcon sx={{fontSize:18}}>close</MuiIcon></IconButton>
      </Box>}
      {/* New Chat */}
      {sidebar&&showNewChat&&<ButtonBase onClick={onNewChat} sx={{display:"flex",alignItems:"center",justifyContent:"flex-start",gap:1,borderRadius:1,"&:hover":{opacity:0.75}}}>
        <svg width="25" height="25" viewBox="0 0 28 28" fill="none" style={{flexShrink:0}}>
          <path d="M25.6549 4.66665C25.6549 3.38331 24.6166 2.33331 23.3333 2.33331H4.66659C3.38325 2.33331 2.33325 3.38331 2.33325 4.66665V18.6666C2.33325 19.95 3.38325 21 4.66659 21H20.9999L25.6666 25.6666L25.6549 4.66665ZM19.8333 12.8333H15.1666V17.5H12.8333V12.8333H8.16659V10.5H12.8333V5.83331H15.1666V10.5H19.8333V12.8333Z" fill={C_TERTIARY}/>
        </svg>
        <Typography sx={{...typography.h5,color:palette.text.primary}}>New Chat</Typography>
      </ButtonBase>}

      {/* Chat list */}
      <Box sx={{flex:1,display:"flex",flexDirection:"column",overflowY:"auto",minHeight:0,gap:0,'&::-webkit-scrollbar':{display:'none'},scrollbarWidth:'none'}}>
        {/* Pinned */}
        {pinned.length > 0 && <>
          <Box sx={{mb:1.5}}>
            <Box sx={{display:"flex",alignItems:"center",gap:1,mb:0.75,px:1,color:palette.text.secondary}}>
              <MuiIcon baseClassName="material-icons-outlined" sx={{fontSize:"inherit",color:"inherit",flexShrink:0}}>push_pin</MuiIcon>
              <Typography sx={{...typography.overline,color:palette.text.secondary,whiteSpace:"nowrap"}}>Pinned Conversations</Typography>
            </Box>
            {pinned.map(item => (
              <ChatItem key={item.id} title={item.title} isPinned onPinToggle={()=>unpin(item)} onDelete={()=>deleteItem(item)} onSelect={()=>onSelectChat?.(item)} onShare={()=>onShare?.({isConversation:true, title:item.title})} onRename={t=>onRename?.(item.id,t)} dense={dense} isActive={activeChatId===item.id} />
            ))}
          </Box>
          <Divider sx={{mt:2,mb:2}}/>
        </>}
        {/* All conversations — received shares float to top */}
        <Box>
          <Box sx={{display:"flex",alignItems:"center",gap:1,mb:0.75,px:1,color:palette.text.secondary}}>
            <MuiIcon baseClassName="material-icons-outlined" sx={{fontSize:"inherit",color:"inherit",flexShrink:0}}>chat</MuiIcon>
            <Typography sx={{...typography.overline,color:palette.text.secondary,whiteSpace:"nowrap"}}>All Conversations</Typography>
          </Box>
          {/* Unread received shares first, then read — owned ones move to regular list */}
          {[...receivedShares.filter(s=>!s.read&&!s.owned), ...receivedShares.filter(s=>s.read&&!s.owned)].map(item => (
            <ChatItem key={item.id} title={item.title} isShared sharedBy={item.sharedBy} sharedDate={item.date} isRead={item.read} isOwned={false}
              onDelete={()=>{}} onSelect={()=>{ onMarkRead?.(item.id); onSelectShared?.(item); }} dense={dense} isActive={activeShareId===item.id}/>
          ))}
          {receivedShares.filter(s=>!s.owned).length>0 && all.length>0 && <Divider sx={{my:1}}/>}
          {/* Owned received shares merged into regular list */}
          {[...receivedShares.filter(s=>s.owned), ...all].map(item => (
            <ChatItem key={item.id} title={item.title} onPinToggle={()=>pin(item)} onDelete={()=>deleteItem(item)} onSelect={()=>onSelectChat?.(item)} onShare={()=>onShare?.({isConversation:true, title:item.title})} onRename={t=>onRename?.(item.id,t)} dense={dense} isActive={activeChatId===item.id||activeShareId===item.id} />
          ))}
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{borderTop:`1px solid ${color.divider}`,pt:1,display:"flex",alignItems:"center",gap:1,flexShrink:0}}>
        <Box sx={{width:28,height:28,borderRadius:"50%",flexShrink:0,border:`2px solid ${palette.uiPrimary[500]}`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
          <MuiIcon sx={{fontSize:20,color:palette.uiPrimary[500]}}>support_agent</MuiIcon>
        </Box>
        <Box>
          <Typography sx={{...typography.overline,fontWeight:600,color:palette.uiPrimary[500]}}>Talk to a human</Typography>
          <Typography sx={{...typography.body2,color:palette.text.secondary}}>powered by pylon</Typography>
        </Box>
      </Box>
    </Box>
  );
}

function PagePlaceholder({ panelOpen }) {
  return (
    <Box sx={{p:4, pr: panelOpen ? 1 : 4}}>
      <Stack direction="row" gap={2} alignItems="center" sx={{mb:3}}>
        {[90,110,70].map((w,i)=>(
          <Skeleton key={i} variant="rounded" width={w} height={32} sx={{flexShrink:0}}/>
        ))}
        <Box sx={{flex:1}}/>
        <Skeleton variant="rounded" width={120} height={32} sx={{flexShrink:0}}/>
      </Stack>
      <Paper variant="outlined" sx={{borderRadius:2, overflow:'hidden'}}>
        <Box sx={{display:'flex', py:1.5, px:2, borderBottom:1, borderColor:'divider', gap:3}}>
          {[160,100,90,90,80,80].map((w,i)=>(
            <Skeleton key={i} variant="rounded" width={w} height={10} sx={{flexShrink:0}}/>
          ))}
        </Box>
        {Array.from({length:8}).map((_,i)=>(
          <Box key={i} sx={{
            display:'flex', py:2, px:2,
            borderBottom: i<7 ? 1 : 0, borderColor:'divider',
            gap:3, alignItems:'center',
          }}>
            <Skeleton variant="rounded" width={160} height={10} sx={{flexShrink:0}}/>
            <Skeleton variant="rounded" width={100} height={10} sx={{flexShrink:0}}/>
            <Skeleton variant="rounded" width={90} height={22} sx={{flexShrink:0}}/>
            <Skeleton variant="rounded" width={90} height={10} sx={{flexShrink:0}}/>
            <Skeleton variant="rounded" width={80} height={10} sx={{flexShrink:0}}/>
            <Skeleton variant="rounded" width={80} height={10} sx={{flexShrink:0}}/>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}

const DEV_MSGS = [
  {id:INIT_UID, type:"user", content:"What does my coverage look like?"},
  {id:INIT_UID+1, type:"response",
    html:`<p>Your current commitment coverage is <strong>73%</strong>, with estimated monthly savings of <strong>$4,200</strong>. You have 12 reservations expiring in the next 30 days.</p>`,
    pageNum:1, totalPages:1, expanded:false, onResetDone:null,
  },
];

// Responsive breakpoints
const BP_WIDE = 1440; // auto-open sidebar alongside content
const BP_MED  = 1280; // FAB opens sidebar above this, overlay below

function getInitialPanelState(autoOpen = true) {
  const w = window.innerWidth;
  if (autoOpen && w >= BP_WIDE) return { open: true,  mode: 'sidebar' };
  return             { open: false, mode: w >= BP_MED ? 'sidebar' : 'overlay' };
}

// ─── Panel mode toggle group (shared by header and bottom rail) ───────────────
function PanelModeToggleGroup({ panelMode, onChange, tooltipPlacement='bottom', orientation='horizontal' }) {
  const p = tooltipPlacement;
  const vertical = orientation === 'vertical';
  return (
    <ToggleButtonGroup orientation={orientation} size={panelMode==='fullscreen'&&!vertical?'medium':'small'} value={panelMode} exclusive onChange={(_,val)=>onChange(val)} sx={{flexShrink:0,...(vertical&&{width:'100%'})}}>
      <Tooltip title="Dock right"    placement={p} arrow><ToggleButton value="sidebar">   <MuiIcon baseClassName="material-symbols-outlined">dock_to_right</MuiIcon></ToggleButton></Tooltip>
      <Tooltip title="Dock bottom"   placement={p} arrow><ToggleButton value="bottom">    <MuiIcon baseClassName="material-symbols-outlined">dock_to_bottom</MuiIcon></ToggleButton></Tooltip>
      <Tooltip title="Overlay"       placement={p} arrow><ToggleButton value="overlay">   <MuiIcon baseClassName="material-symbols-outlined">ad_group</MuiIcon></ToggleButton></Tooltip>
      <Tooltip title="Fullscreen"    placement={p} arrow><ToggleButton value="fullscreen"><MuiIcon>crop_free</MuiIcon></ToggleButton></Tooltip>
      <Tooltip title="Close panel"   placement={p} arrow><ToggleButton value="close">     <MuiIcon>close</MuiIcon></ToggleButton></Tooltip>
    </ToggleButtonGroup>
  );
}

export default function App({ embedded = false, content, features, appShell, children, chat = true, autoOpen = false } = {}) {
  const demo = new URLSearchParams(window.location.search).get('demo');
  const dev = demo === 'dev';
  // Merged content — consumers override any field via the `content` prop; module consts are the defaults.
  const C = { pageName: PAGE_NAME, suggestedPrompts: SUGGESTED_PROMPTS, initMsgs: INIT_MSGS, welcomeIntro: WELCOME_INTRO, ...content };
  // FAB bubble teaser prompt — the page's first suggested prompt (consumer content,
  // not the package default). Null when the consumer hides prompts with [].
  const fabPrompt = C.suggestedPrompts?.[0] ?? null;
  // Feature flags — consumers strip in-chat workflows from the embeddable chat. All default true so the standalone demo is unchanged.
  const F = { writeActions: true, share: true, chatHistory: true, ...features };
  // Chat on/off + auto-dock behavior: set per-consumer (props) or overridden per-URL.
  const params = new URLSearchParams(window.location.search);
  const chatParam = (params.get('chat') || '').toLowerCase();
  const chatOff = chat === false || chatParam === 'off' || chatParam === '0' || chatParam === 'false';
  // autoOpen = auto-dock-open on large viewports. Prop default, overridable via ?dock=on|off.
  const dockParam = (params.get('dock') || '').toLowerCase();
  const autoDock = ['off','0','false'].includes(dockParam) ? false : ['on','1','true'].includes(dockParam) ? true : autoOpen;
  // FAB launch-prompt bubble — off by default, shown only with ?fab-tooltip=on.
  const fabTooltip = ['on','1','true'].includes((params.get('fab-tooltip') || '').toLowerCase());
  const INIT_TRACE = C.initMsgs[1]?.thinkingTrace||[];
  const INIT_TRACE_MS = INIT_TRACE.reduce((t,s)=>t+(s.length/2)*15+300, 0)+2500;
  const INIT_START = C.initMsgs[0] ? [C.initMsgs[0], {id:INIT_UID+1, type:"thinking", expanded:false, thinkingTrace:INIT_TRACE}] : [];
  // Consumers that pass content.initMsgs (including embedded/host use) seed from it
  // (e.g. [] → start on the welcome screen); otherwise fall back to the demo's own seeding.
  const [msgs,setMsgs]=useState((embedded || content?.initMsgs!==undefined) ? C.initMsgs : (demo==='welcome'||demo==='received' ? [] : demo==='savings_analysis' ? INIT_START : DEV_MSGS));
  useEffect(()=>{
    // received demo: sidebar auto-opens on wide screens; on small screens the FAB badge is enough
    if(demo==='received' && window.innerWidth >= BP_MED){ setPanelOpen(true); }
  },[]);
  useEffect(()=>{
    if(demo==='savings_analysis'){
      const t=setTimeout(()=>setMsgs(prev=>{
        // Only fire if still in the initial thinking state
        if(prev.length===2&&prev[1]?.type==='thinking') return [prev[0], {...C.initMsgs[1], onResetDone:prev[1].onResetDone}];
        return prev;
      }), INIT_TRACE_MS);
      return()=>clearTimeout(t);
    }
  },[]);
  const [isNewChat,setIsNewChat]=useState(false);
  const [newChatOptions,setNewChatOptions]=useState([]);
  const [newChatGreeting,setNewChatGreeting]=useState('');
  const [input,setInput]=useState(""), [busy,setBusy]=useState(false), [ri,setRi]=useState(1);
  const [showWaiting,setShowWaiting]=useState(false);
  const [showMenu,setShowMenu]=useState(false);
  const [pinned,setPinned]=useState(INIT_PINNED);
  const [all,setAll]=useState(INIT_ALL);
  function pinConvo(item){ setAll(prev=>prev.filter(c=>c.id!==item.id)); setPinned(prev=>[item,...prev]); }
  function unpinConvo(item){ setPinned(prev=>prev.filter(c=>c.id!==item.id)); setAll(prev=>[item,...prev]); }
  function deleteConvo(item){ setPinned(prev=>prev.filter(c=>c.id!==item.id)); setAll(prev=>prev.filter(c=>c.id!==item.id)); }
  function renameConvo(id,title){ setPinned(prev=>prev.map(c=>c.id===id?{...c,title}:c)); setAll(prev=>prev.map(c=>c.id===id?{...c,title}:c)); }
  const [receivedShares,setReceivedShares]=useState(demo==='received' ? INIT_RECEIVED_SHARES : []);
  const [shareDialog,setShareDialog]=useState(null); // null | { isConversation, msgId, title }
  const [activeShareId,setActiveShareId]=useState(null);
  const [activeChatId,setActiveChatId]=useState(null);
  const [snackbar,setSnackbar]=useState(null); // null | string message
  const [notificationDismissed,setNotificationDismissed]=useState(false);
  // ── Panel-state persistence ────────────────────────────────────────────────
  // open/dock/size persist to localStorage so the panel follows the user across
  // pages AND prototypes on the same origin (e.g. the anomaly-detection chat's
  // "View in Exchanges" cross-link). Explicit ?dock= flags beat the saved state;
  // `embedded` panels are excluded (they're forced open in their container).
  const savedPanel = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('archera-chat-panel')) || null; } catch { return null; }
  }, []);
  // Explicit ?dock= flags beat the saved state. ?dock=on means "arrive with the
  // panel open" (cross-prototype links append it so continuity survives an origin
  // change, where localStorage can't follow — e.g. localhost → the deployed site);
  // it prefers the saved mode/size when present. ?dock=off forces FAB-only.
  const dockForcedOn = ['on','1','true'].includes(dockParam);
  const dockForcedOff = ['off','0','false'].includes(dockParam);
  const PANEL_MODES = ['sidebar','bottom','overlay','fullscreen'];
  const savedMode = PANEL_MODES.includes(savedPanel?.mode) ? savedPanel.mode : null;
  // Saved/forced sidebar dock doesn't fit a narrow viewport — fall back to overlay.
  const fitMode = (m) => (m === 'sidebar' && window.innerWidth < BP_MED ? 'overlay' : m);
  const [panelOpen,setPanelOpen]=useState(()=>{
    if (embedded) return true;
    if (dockForcedOff) return false;
    if (dockForcedOn) return true;
    if (savedPanel?.open != null) return savedPanel.open;
    return getInitialPanelState(autoDock).open;
  });
  const scrollRef=useRef(null), taRef=useRef(null);
  const [activeId, setActiveId]=useState(null);
  const promptRef=useRef(null);
  const [panelMode, setPanelMode]=useState(()=>{
    if (embedded) return 'sidebar';
    if (dockForcedOn) return fitMode(savedMode || 'sidebar');
    if (!dockForcedOff && savedMode) return fitMode(savedMode);
    return getInitialPanelState(autoDock).mode;
  });
  const [showFabBubble, setShowFabBubble]=useState(false);
  const fabBubbleFired=useRef(false);
  const [panelWidth, setPanelWidth]=useState(savedPanel?.width ?? 380);
  const [panelHeight, setPanelHeight]=useState(savedPanel?.height ?? 300); // for bottom dock
  useEffect(()=>{
    if (embedded) return;
    try { localStorage.setItem('archera-chat-panel', JSON.stringify({ open: panelOpen, mode: panelMode, width: panelWidth, height: panelHeight })); } catch { /* storage unavailable */ }
  },[embedded, panelOpen, panelMode, panelWidth, panelHeight]);
  const [lastMode, setLastMode]=useState('sidebar'); // tracks last non-rail mode for rail placement
  const [bottomVisible, setBottomVisible]=useState(false);
  const bottomSlideTimer=useRef(null);
  const [overlayRect, setOverlayRect]=useState(null); // {left,top,w,h} — overlay position/size
  const panelRef=useRef(null);
  const bottomRef=useRef(null);
  const scrollToBottomOnCommit=useRef(false);
  const userScrolled=useRef(false);
  const lastScrollTop=useRef(0);
  const scrollRaf=useRef(null);
  const isProgrammaticScroll=useRef(false);
  const INPUT_BAR_H=100;

  function handleScroll(){
    const container=scrollRef.current;
    if(!container) return;
    const currentTop=container.scrollTop;
    // If user scrolled UP, immediately lock auto-scroll regardless of programmatic state
    if(currentTop < lastScrollTop.current - 5) userScrolled.current=true;
    lastScrollTop.current=currentTop;
    if(isProgrammaticScroll.current) return;
    const anchor=bottomRef.current;
    if(!anchor) return;
    const visibleBottom=container.getBoundingClientRect().bottom-INPUT_BAR_H;
    // Re-enable auto-scroll if user has scrolled back near the bottom
    if(anchor.getBoundingClientRect().bottom <= visibleBottom+80) userScrolled.current=false;
  }

  function scrollToBottom(){
    if(userScrolled.current||isProgrammaticScroll.current) return;
    const anchor=bottomRef.current, container=scrollRef.current;
    if(!anchor||!container) return;
    const visibleBottom=container.getBoundingClientRect().bottom-INPUT_BAR_H;
    const delta=anchor.getBoundingClientRect().bottom-visibleBottom;
    if(delta>1) container.scrollBy({top:delta,behavior:'instant'});
  }

  useEffect(()=>{
    if(!activeId||!promptRef.current||!scrollRef.current) return;
    isProgrammaticScroll.current=true;
    userScrolled.current=false;
    const timer=setTimeout(()=>{
      if(!promptRef.current||!scrollRef.current) return;
      const container=scrollRef.current;
      const el=promptRef.current;
      const elTop=el.getBoundingClientRect().top;
      const containerTop=container.getBoundingClientRect().top;
      const scrollTarget=container.scrollTop+(elTop-containerTop)-16;
      container.scrollTo({top:scrollTarget,behavior:'smooth'});
      setTimeout(()=>{isProgrammaticScroll.current=false;},500);
    },100);
    return()=>clearTimeout(timer);
  },[activeId]);

  useLayoutEffect(()=>{
    const mode=scrollToBottomOnCommit.current;
    if(!mode) return;
    scrollToBottomOnCommit.current=false;
    // 'reset': set scrollTop=0 after commit (conversation load) so user sees top before animating down.
    // 'smooth': scroll from current position (branch nav — content may shrink or grow).
    if(mode==='reset'&&scrollRef.current) scrollRef.current.scrollTop=0;
    requestAnimationFrame(()=>{
      if(scrollRaf.current){ cancelAnimationFrame(scrollRaf.current); scrollRaf.current=null; }
      isProgrammaticScroll.current=false;
      const c=scrollRef.current, a=bottomRef.current; if(!c||!a) return;
      const delta=a.getBoundingClientRect().bottom-(c.getBoundingClientRect().bottom-INPUT_BAR_H);
      if(Math.abs(delta)>1) c.scrollBy({top:delta,behavior:'smooth'});
    });
  },[msgs]);

  useEffect(()=>{
    const el=scrollRef.current;
    if(!el) return;
    const mo=new MutationObserver(()=>{
      if(scrollRaf.current) return;
      scrollRaf.current=requestAnimationFrame(()=>{scrollRaf.current=null;scrollToBottom();});
    });
    mo.observe(el,{childList:true,subtree:true,characterData:true});
    return()=>{mo.disconnect();cancelAnimationFrame(scrollRaf.current);};
  },[]);

  // Show FAB bubble once on page load (opt-in via ?fab-tooltip=on); never again after panel is opened
  useEffect(()=>{
    if(!fabTooltip || panelOpen) return;
    const t=setTimeout(()=>{ if(!fabBubbleFired.current) setShowFabBubble(true); },1800);
    return()=>clearTimeout(t);
  },[]);
  useEffect(()=>{
    if(panelOpen&&!fabBubbleFired.current){ fabBubbleFired.current=true; setShowFabBubble(false); }
  },[panelOpen]);

  useEffect(()=>{
    if(panelMode==='fullscreen'||panelMode==='rail'||panelMode==='bottom') setShowMenu(false);
    if(panelMode==='fullscreen'||panelMode==='bottom') setNotificationDismissed(true);
    if(panelMode!=='rail') setLastMode(panelMode);
    if(panelMode!=='bottom') setBottomVisible(false);
  },[panelMode]);

  // Responsive resize — auto-open on wide screens only; never auto-change an open panel
  useEffect(()=>{
    function onResize(){
      const w = window.innerWidth;
      if(w >= BP_WIDE && !panelOpen && autoDock){
        setPanelOpen(true); setPanelMode('sidebar');
      }
    }
    window.addEventListener('resize', onResize);
    return()=>window.removeEventListener('resize', onResize);
  },[panelOpen, autoDock]);

  function newChat(){
    setMsgs([]);setBusy(false);setInput("");setActiveId(null);setShowWaiting(false);setActiveShareId(null);setActiveChatId(null);
    setIsNewChat(true);
    const shuffled=[...NEW_CHAT_POOL].sort(()=>0.5-Math.random());
    setNewChatOptions(shuffled.slice(0,3));
    setNewChatGreeting(NEW_CHAT_GREETINGS[Math.floor(Math.random()*NEW_CHAT_GREETINGS.length)]);
    isProgrammaticScroll.current=false;userScrolled.current=false;
    if(scrollRef.current) scrollRef.current.scrollTop=0;
  }
  function selectChat(item){
    if(activeChatId===item.id) return;
    const chatMsgs = CHAT_CONVOS[item.id] || DEV_MSGS;
    setMsgs(chatMsgs); setBusy(false); setInput(""); setActiveId(null); setShowWaiting(true);
    setIsNewChat(false); setActiveChatId(item.id); setActiveShareId(null);
    userScrolled.current=false; isProgrammaticScroll.current=true;
    scrollToBottomOnCommit.current='reset';
    if(panelMode!=='fullscreen') setShowMenu(false);
  }
  function markShareRead(id){ setReceivedShares(prev=>prev.map(s=>s.id===id?{...s,read:true}:s)); }
  function selectReceivedShare(item){
    if(activeShareId===item.id) return;
    const divider = { id:item.id+'_div', type:'shared-divider', title:item.title, sharedBy:item.sharedBy, date:item.date };
    setMsgs([...item.msgs, divider]); setBusy(false); setInput(""); setActiveId(null); setShowWaiting(true);
    setIsNewChat(false); setActiveShareId(item.id); setActiveChatId(null);
    if(!panelOpen){ openPanel(); }
    if(panelMode!=='fullscreen') setShowMenu(false);
    userScrolled.current=false; isProgrammaticScroll.current=true;
    scrollToBottomOnCommit.current='reset';
  }
  function openNotificationMenu(){
    setNotificationDismissed(true);
    if(!panelOpen) openPanel();
    if(F.chatHistory) setTimeout(()=>setShowMenu(true), panelOpen?0:300);
  }
  function addWaiting(){setTimeout(()=>setShowWaiting(true),400);}
  // Wire onResetDone for pre-seeded initial message
  useEffect(()=>{
    setMsgs(prev=>prev.map(m=>m.id===INIT_UID+1?{...m,onResetDone:addWaiting}:m));
  },[]);
  function setConfirmStatus(id, status){
    setMsgs(prev=>prev.map(m=>m.id===id?{...m,status}:m));
  }
  const thinkingPref=useRef(false), reasoningPref=useRef(false), sourcesPref=useRef(false);
  function setExpanded(id,val){setMsgs(prev=>prev.map(m=>{if(m.id!==id)return m;const v=typeof val==="function"?val(m.expanded):val;sourcesPref.current=v;return {...m,expanded:v};}));}
  function setReasoningExpanded(id,val){setMsgs(prev=>prev.map(m=>{if(m.id!==id)return m;const v=typeof val==="function"?val(m.reasoningExpanded):val;reasoningPref.current=v;return {...m,reasoningExpanded:v};}));}
  function setThinkingExpanded(id,val){setMsgs(prev=>prev.map(m=>{if(m.id!==id)return m;const v=typeof val==="function"?val(m.thinkingExpanded):val;thinkingPref.current=v;return {...m,thinkingExpanded:v};}));}

  // versions entries are {html, tail} objects. tail = messages after this response in that branch.
  function saveVersion(mid, html){
    setMsgs(prev=>prev.map(m=>{
      if(m.id!==mid) return m;
      const versions=[...(m.versions||[])];
      const idx=m.versionIdx||0;
      versions[idx]=versions[idx]?{...versions[idx],html}:{html,tail:[]};
      return {...m,versions};
    }));
  }
  function regenerateMsg(mid){
    if(busy) return;
    const resp=RESP[ri%RESP.length];
    setRi(i=>(i+1)%RESP.length);
    setBusy(true);setShowWaiting(false);
    setMsgs(prev=>{
      const msgIdx=prev.findIndex(m=>m.id===mid);
      if(msgIdx===-1) return prev;
      const existing=prev[msgIdx];
      // Save current tail (messages after this response) into current version slot.
      const currentTail=prev.slice(msgIdx+1).filter(m=>m.type!=='waiting');
      const versions=[...(existing.versions||[])];
      const cvi=existing.versionIdx||0;
      versions[cvi]=versions[cvi]?{...versions[cvi],tail:currentTail}:{html:existing.html,tail:currentTail};
      const newVersionIdx=versions.length;
      // Drop tail, switch to thinking.
      return [
        ...prev.slice(0,msgIdx),
        {...existing,type:"thinking",expanded:false,versions,versionIdx:newVersionIdx},
      ];
    });
    setActiveId(Date.now());
    const delay=dev?400:2500; // regenerate: brief pause (was 9–12s)
    setTimeout(()=>{
      userScrolled.current=false;
      isProgrammaticScroll.current=false;
      setMsgs(prev=>prev.map(m=>m.id===mid?{...m,type:"response",html:resp.html,instant:false,onResetDone:addWaiting}:m));
      setBusy(false);
    },delay);
  }
  function navigateVersion(mid, targetIdx){
    const existing=msgs.find(m=>m.id===mid);
    if(!existing) return;
    const versions=existing.versions||[];
    if(targetIdx<0||targetIdx>=versions.length) return;
    const newTail=versions[targetIdx]?.tail||[];
    setMsgs(prev=>{
      const msgIdx=prev.findIndex(m=>m.id===mid);
      if(msgIdx===-1) return prev;
      const m=prev[msgIdx];
      const vs=[...(m.versions||[])];
      // Save current tail into current version before switching.
      const currentTail=prev.slice(msgIdx+1).filter(t=>t.type!=='waiting');
      const cvi=m.versionIdx||0;
      vs[cvi]=vs[cvi]?{...vs[cvi],tail:currentTail}:{html:m.html,tail:currentTail};
      const sel=vs[targetIdx];
      const updatedMsg={...m,html:sel?.html||m.html,versionIdx:targetIdx,instant:true,versions:vs,onResetDone:null};
      return [...prev.slice(0,msgIdx),updatedMsg,...newTail];
    });
    setShowWaiting(true);
    userScrolled.current=false;
    isProgrammaticScroll.current=true;
    scrollToBottomOnCommit.current='smooth';
  }

  function sendPrompt(msg){
    if(!msg||busy) return;
    setBusy(true);setInput("");setShowWaiting(false);setIsNewChat(false);
    if(taRef.current)taRef.current.style.height="auto";
    const uid=Date.now();
    setActiveId(uid);
    // New conversation — add placeholder entry immediately; title resolves when response arrives.
    const isNewConvo = !activeChatId && !activeShareId;
    if(isNewConvo){
      setActiveChatId(uid);
      setAll(prev=>[{id:uid,title:null},...prev]);
    }
    // Deleted conversation — re-add at top with title derived from first user message.
    if(activeChatId && !pinned.some(c=>c.id===activeChatId) && !all.some(c=>c.id===activeChatId)){
      const firstUser=msgs.find(m=>m.type==='user');
      setAll(prev=>[{id:activeChatId,title:promptToTitle(firstUser?.content||msg)},...prev]);
    }
    if(activeShareId) setReceivedShares(prev=>{
      const target=prev.find(s=>s.id===activeShareId);
      if(!target) return prev;
      return [{...target,owned:true},...prev.filter(s=>s.id!==activeShareId)];
    });
    const steps = pickThinkingSteps(4);
    const traceMs = steps.reduce((t,s)=>t+(s.length/2)*15+300, 0);
    setMsgs(prev=>[...prev.filter(m=>m.type!=="waiting"),{id:uid,type:"user",content:msg,isFresh:true},{id:uid+1,type:"thinking",expanded:false,thinkingTrace:steps,thinkingExpanded:thinkingPref.current}]);
    // Consumer-provided canned responses (content.promptResponses: { [prompt]: {html, followUp?} })
    // take priority; then built-in flows; then the round-robin demo responses.
    const canned = C.promptResponses?.[msg];
    const isAutoSetup = msg === "Set up purchase automation";
    const resp = canned || (isAutoSetup ? FLOW_SETUP_AUTOMATION_OFFER : RESP[ri%RESP.length]);
    if(!canned && !isAutoSetup) setRi(i=>(i+1)%RESP.length);
    const respHtml=resp.html;
    const respConfirm=resp.confirm;
    // Brief, responsive "thinking" pause. `?demo=dev` keeps the fuller trace
    // pacing for demos; everywhere else it's a short pause (~1–1.5s) so the reply
    // doesn't feel sluggish. (Was 9–12s, which felt like a hang.)
    const delay=dev ? Math.max(traceMs+1200, 2500) : Math.min(Math.max(traceMs*0.85, 2700), 3700);
    setTimeout(()=>{
      setMsgs(prev=>{
        return prev.map(m=>m.id===uid+1?{id:uid+2,type:"response",html:respHtml,confirm:respConfirm,thinkingTrace:steps,reasoning:pickReasoningSteps(),followUp:resp.followUp!==undefined?resp.followUp:pickFollowUp(),pageNum:1,totalPages:1,expanded:sourcesPref.current,reasoningExpanded:reasoningPref.current,thinkingExpanded:thinkingPref.current,onResetDone:addWaiting}:m);
      });
      if(isNewConvo) renameConvo(uid, promptToTitle(msg));
      setBusy(false);
    },delay);
  }

  function send(){
    const msg=input.trim();
    if(!msg||busy) return;
    sendPrompt(msg);
  }

  // Send a canned response (not random) as the next conversation turn
  function sendFlowResponse(userMsg, responseObj){
    if(busy) return;
    setBusy(true);setShowWaiting(false);
    const uid=Date.now();
    setActiveId(uid);
    const flowSteps = responseObj.thinkingTrace?.length
      ? responseObj.thinkingTrace
      : pickThinkingSteps(4);
    const traceMs = flowSteps.reduce((t,s)=>t+(s.length/2)*15+300, 0);
    setMsgs(prev=>[...prev.filter(m=>m.type!=="waiting"),{id:uid,type:"user",content:userMsg,isFresh:true},{id:uid+1,type:"thinking",expanded:false,thinkingTrace:flowSteps,thinkingExpanded:thinkingPref.current}]);
    // Brief, responsive "thinking" pause. `?demo=dev` keeps the fuller trace
    // pacing for demos; everywhere else it's a short pause (~1–1.5s) so the reply
    // doesn't feel sluggish. (Was 9–12s, which felt like a hang.)
    const delay=dev ? Math.max(traceMs+1200, 2500) : Math.min(Math.max(traceMs*0.85, 2700), 3700);
    setTimeout(()=>{
      setMsgs(prev=>prev.map(m=>m.id===uid+1?{id:uid+2,type:"response",pageNum:1,totalPages:1,expanded:sourcesPref.current,reasoningExpanded:reasoningPref.current,thinkingExpanded:thinkingPref.current,onResetDone:addWaiting,...responseObj,thinkingTrace:flowSteps,reasoning:responseObj.reasoning||pickReasoningSteps(),followUp:responseObj.followUp||pickFollowUp()}:m));
      setBusy(false);
    },delay);
  }

  // ── Choice flow handlers ─────────────────────────────────────────
  function chooseSelect(mid, cid){
    setMsgs(prev=>prev.map(r=>r.id===mid?{...r,choice:{...r.choice,selected:cid}}:r));
  }
  function chooseConfirm(mid, choiceData){
    const sel = choiceData.choices.find(c=>c.id===choiceData.selected);
    if(!sel) return;
    setMsgs(prev=>prev.map(r=>r.id===mid?{...r,choice:{...r.choice,status:"confirmed"}}:r));
    setTimeout(()=>sendFlowResponse(`Let's go with the ${sel.name}.`, flowPlanConfirmed(sel)), 700);
  }
  function chooseDeny(mid){
    setMsgs(prev=>prev.map(r=>r.id===mid?{...r,choice:{...r.choice,status:"denied"}}:r));
    setTimeout(()=>sendFlowResponse("I'll skip applying a plan for now.", FLOW_PLAN_DENIED), 700);
  }

  // ── Confirm flow handler — fires next turn when confirm.flow is set ──
  function setConfirmStatusAndFlow(mid, status, confirmData){
    setMsgs(prev=>prev.map(r=>r.id===mid?{...r,confirm:{...r.confirm,status}}:r));
    if(confirmData?.flow === "plan"){
      setTimeout(()=>{
        if(status==="confirmed"){
          sendFlowResponse("Let's go with the Recommended Plan.", flowPlanConfirmed({name:"Recommended Plan", savings:"$9,240/mo"}));
        } else {
          sendFlowResponse("I'll hold off on applying a plan for now.", FLOW_PLAN_DENIED);
        }
      }, 700);
    } else if(confirmData?.flow === "automation"){
      setTimeout(()=>{
        if(status==="confirmed"){
          sendFlowResponse("Yes, enable purchase automation with those settings.", FLOW_AUTOMATION_CONFIRMED);
        } else {
          sendFlowResponse("I'll skip automation for now.", FLOW_AUTOMATION_DENIED);
        }
      }, 700);
    }
  }

  const latestUserId=msgs.filter(m=>m.type==="user").at(-1)?.id;
  function onKey(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}
  function resize(e){const el=e.target;el.style.height="auto";el.style.height=Math.min(el.scrollHeight,110)+"px";}

  function openBottom(){
    clearTimeout(bottomSlideTimer.current);
    setPanelMode('bottom');
    requestAnimationFrame(()=>requestAnimationFrame(()=>setBottomVisible(true)));
  }
  function closeToRail(){
    setBottomVisible(false);
    clearTimeout(bottomSlideTimer.current);
    bottomSlideTimer.current=setTimeout(()=>setPanelMode('rail'), 280);
  }
  function openSidebar(){
    setPanelOpen(true); setPanelMode('sidebar');
  }
  function closeSidebar(){
    setPanelOpen(false); setShowMenu(false);
  }

  // Bottom dock: click to collapse to rail, drag to resize height
  function startBottomDockResize(e){
    e.preventDefault();
    const startY=e.clientY, startH=panelHeight;
    let dragged=false;
    function onMove(ev){
      if(Math.abs(ev.clientY-startY)>4){ dragged=true; }
      if(dragged) setPanelHeight(Math.max(150, Math.min(Math.round(window.innerHeight*0.8), startH+(startY-ev.clientY))));
    }
    function onUp(){
      window.removeEventListener('mousemove',onMove);
      window.removeEventListener('mouseup',onUp);
      if(!dragged) closeToRail();
    }
    window.addEventListener('mousemove',onMove); window.addEventListener('mouseup',onUp);
  }

  // Sidebar: click to collapse to rail, drag to resize width
  function startPanelResize(e){
    if(panelMode!=='sidebar') return;
    e.preventDefault();
    const startX=e.clientX, startW=panelWidth;
    let dragged=false;
    function onMove(ev){
      if(Math.abs(ev.clientX-startX)>4){ dragged=true; }
      if(dragged) setPanelWidth(Math.max(280, Math.min(640, startW+(startX-ev.clientX))));
    }
    function onUp(){
      window.removeEventListener('mousemove',onMove);
      window.removeEventListener('mouseup',onUp);
      if(!dragged) setPanelMode('rail');
    }
    window.addEventListener('mousemove',onMove); window.addEventListener('mouseup',onUp);
  }

  // Overlay: drag to move
  function startOverlayDrag(e){
    if(e.target.closest('[data-no-drag]')) return;
    e.preventDefault();
    const rect=panelRef.current.getBoundingClientRect();
    const offX=e.clientX-rect.left, offY=e.clientY-rect.top;
    const init={left:rect.left, top:rect.top, w:rect.width, h:rect.height};
    setOverlayRect(init);
    function onMove(ev){
      setOverlayRect(r=>({...(r||init), left:ev.clientX-offX, top:Math.max(0,ev.clientY-offY)}));
    }
    function onUp(){ window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseup',onUp); }
    window.addEventListener('mousemove',onMove); window.addEventListener('mouseup',onUp);
  }

  // Overlay: left-edge width resize
  function startOverlayWidthResize(e){
    e.preventDefault();
    const rect=panelRef.current.getBoundingClientRect();
    const init={left:rect.left, top:rect.top, w:rect.width, h:rect.height};
    const startX=e.clientX;
    function onMove(ev){
      const delta=startX-ev.clientX;
      const newW=Math.max(280, Math.min(640, init.w+delta));
      const newLeft=init.left-(newW-init.w);
      setOverlayRect(r=>({...(r||init), left:newLeft, w:newW}));
    }
    function onUp(){ window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseup',onUp); }
    window.addEventListener('mousemove',onMove); window.addEventListener('mouseup',onUp);
  }

  // Overlay: bottom-left corner resize (both axes)
  function startOverlayCornerResize(e){
    e.preventDefault();
    const rect=panelRef.current.getBoundingClientRect();
    const init={left:rect.left, top:rect.top, w:rect.width, h:rect.height};
    const startX=e.clientX, startY=e.clientY;
    function onMove(ev){
      const dX=startX-ev.clientX, dY=ev.clientY-startY;
      const newW=Math.max(280,Math.min(640, init.w+dX));
      const newLeft=init.left-(newW-init.w);
      const newH=Math.max(300, init.h+dY);
      setOverlayRect(r=>({...(r||init), left:newLeft, w:newW, h:newH}));
    }
    function onUp(){ window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseup',onUp); }
    window.addEventListener('mousemove',onMove); window.addEventListener('mouseup',onUp);
  }

  // Overlay: bottom-edge height resize
  function startOverlayHeightResize(e){
    e.preventDefault();
    const rect=panelRef.current.getBoundingClientRect();
    const init={left:rect.left, top:rect.top, w:rect.width, h:rect.height};
    const startY=e.clientY;
    function onMove(ev){
      const newH=Math.max(300, init.h+(ev.clientY-startY));
      setOverlayRect(r=>({...(r||init), h:newH}));
    }
    function onUp(){ window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseup',onUp); }
    window.addEventListener('mousemove',onMove); window.addEventListener('mouseup',onUp);
  }

  const compact = panelMode !== 'fullscreen';
  const responseCompact = panelMode === 'sidebar' || panelMode === 'overlay';
  const panelVisible = panelOpen && panelMode !== 'rail';
  const unreadShareCount = receivedShares.filter(s=>!s.read).length;
  const notificationVisible = F.share && unreadShareCount > 0 && !notificationDismissed;
  const isSidebarOpen = panelOpen && panelMode === 'sidebar';
  function openPanel(){ window.innerWidth>=BP_MED ? openSidebar() : (setPanelMode('overlay'), setPanelOpen(true)); }
  const styleBlock = (<style>{`
        *{box-sizing:border-box;}
        @keyframes gl{to{transform:rotate(360deg);}}
        @keyframes gc{to{transform:rotate(-360deg);}}
        @keyframes gb{to{transform:rotate(360deg);}}
        @keyframes gradientShift{0%{background-position:0% 0%}100%{background-position:300% 0%}}
        @keyframes gradientSlide{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .shimmer{position:relative;overflow:hidden;display:inline-block;}
        .shimmer::after{content:"";position:absolute;top:-10%;left:120%;width:50%;height:120%;background:linear-gradient(100deg,transparent 20%,rgba(255,255,255,.9) 50%,transparent 80%);mix-blend-mode:screen;pointer-events:none;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes backdropIn{from{opacity:0}to{opacity:1}}
        @keyframes panelReveal{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}
        @keyframes bounceIn{0%{transform:scale(0.93)}60%{transform:scale(1.02)}100%{transform:scale(1)}}
        @keyframes thinkingDots{0%,80%,100%{opacity:0.2}40%{opacity:0.8}}
        @keyframes rotateFabGradient{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes logoBreath{0%,100%{transform:scale(1.08)}50%{transform:scale(1.25)}}
        .shimmer.run::after{animation:shimmer-slide 1.1s linear 1 forwards;}
        @keyframes shimmer-slide{0%{left:-60%}100%{left:120%}}
        .resp-html p{margin-bottom:8px;font-size:14px;line-height:20px;color:rgba(9,10,29,.65);font-family:Roboto,sans-serif;}
        .resp-html p:last-child{margin-bottom:0;}
        .resp-html strong{font-weight:600;}
        .resp-html code{font-family:Menlo,monospace;font-size:12px;background:${palette.neutral[50]};border:1px solid ${color.divider};padding:1px 4px;border-radius:3px;}
        .resp-html ul{margin:4px 0 8px 0;padding-left:18px;}
        .resp-html li{font-size:14px;line-height:20px;color:rgba(9,10,29,.65);font-family:Roboto,sans-serif;margin-bottom:4px;}
        .resp-html li:last-child{margin-bottom:0;}
        a.resp-btn{display:inline-block;padding:8px 12px;border-radius:4px;background:${C_PRIMARY};color:${palette.neutral.white};font-family:Roboto,sans-serif;font-size:12px;line-height:12px;font-weight:500;letter-spacing:0.4px;text-transform:uppercase;text-decoration:none;}
        a.resp-btn:hover{background:${palette.brandPrimary[700]};}
        .icon-btn{background:transparent;border:none;cursor:pointer;padding:4px;border-radius:6px;display:flex;align-items:center;justify-content:center;color:${palette.text.secondary};}
        .icon-btn:hover{background:rgba(0,0,0,0.05);}
        ::-webkit-scrollbar{width:3px;}
        .chat-host-scroll{scrollbar-width:none;-ms-overflow-style:none;}
        .chat-host-scroll::-webkit-scrollbar{display:none;}
        ::-webkit-scrollbar-thumb{background:${color.divider};border-radius:3px;}
        textarea::placeholder{color:${palette.text.secondary};}
        .resize-handle:hover{background:${palette.brandPrimary[100]}!important;}
      `}</style>);
  const chatPanel = (<>
    {/* Chat header — default: 48px (sidebar/overlay), fullwidth: 64px (fullscreen) */}
    <Box
      onMouseDown={panelMode==='overlay' ? startOverlayDrag : undefined}
      sx={{flexShrink:0,p:1,pl:2,display:"flex",alignItems:"center",position:"relative",
        order:panelMode==='bottom'?2:0,
        ...(panelMode==='bottom'&&{borderTop:`1px solid ${color.divider}`}),
        cursor:panelMode==='overlay'?"grab":"default",
        '&:active':{cursor:panelMode==='overlay'?"grabbing":"default"}}}
    >

      {/* Overlay drag handle — top-left dots grid */}
      {panelMode==='overlay' && (
        <Box data-no-drag={false} sx={{position:'absolute',top:'50%',left:6,transform:'translateY(-50%)',display:'grid',gridTemplateColumns:'repeat(2,4px)',gap:0.375,pointerEvents:'none'}}>
          {[...Array(6)].map((_,i)=><Box key={i} sx={{width:4,height:4,borderRadius:'50%',bgcolor:palette.neutral[200]}}/>)}
        </Box>
      )}
      {/* Left */}
      <Stack direction="row" alignItems="center" gap="16px" sx={{flex:"1 0 0",minWidth:0}}>
        {panelMode==='fullscreen' ? (
          <Stack direction="row" alignItems="center" gap="8px" sx={{flexShrink:0}}>
            <ArcheraLogo size={20} tint={palette.text.secondary}/>
            <Typography sx={{...typography.h4,color:palette.text.secondary,whiteSpace:"nowrap"}}>Archera AI</Typography>
          </Stack>
        ) : (
          <>
            {F.share ? (
              <Badge badgeContent={unreadShareCount} invisible={!notificationVisible} onClick={()=>{ if(F.chatHistory){ setShowMenu(true); setNotificationDismissed(true); } }} sx={{cursor:notificationVisible?'pointer':'default','& .MuiBadge-badge':{bgcolor:palette.brandTertiary[500],color:palette.neutral.white,transition:'opacity 0.3s ease',top:4,right:-12}}}>
                <ArcheraLogo size={28} tint={palette.neutral[400]} sx={{flexShrink:0}}/>
              </Badge>
            ) : (
              <ArcheraLogo size={28} tint={palette.neutral[400]} sx={{flexShrink:0}}/>
            )}
          </>
        )}
      </Stack>
      {/* Right: action icons + ToggleButtonGroup */}
      <Stack data-no-drag direction="row" alignItems="center" gap={1.5} sx={{flexShrink:0}}>
        {compact && <>
          <IconButton sx={{width:28,height:28,p:0,flexShrink:0}} title="New chat" onClick={newChat}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21.99 4C21.99 2.9 21.1 2 20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H18L22 22L21.99 4ZM17 11H13V15H11V11H7V9H11V5H13V9H17V11Z" fill={C_TERTIARY}/>
            </svg>
          </IconButton>
          {F.chatHistory && panelMode!=='bottom' && <>
            <IconButton sx={{width:28,height:28,p:0,flexShrink:0}} title="Chat history" onClick={()=>{ setShowMenu(o=>!o); setNotificationDismissed(true); }}>
              <MuiIcon sx={{fontSize:24,color:showMenu?palette.text.primary:palette.text.secondary}}>view_list</MuiIcon>
            </IconButton>
            <Box sx={{width:"1px",bgcolor:color.divider,alignSelf:"stretch",flexShrink:0}}/>
          </>}
        </>}
        {!embedded && <PanelModeToggleGroup panelMode={panelMode} onChange={val=>{
          if(val==='close'){
            if(panelMode==='bottom') closeToRail();
            else if(window.innerWidth>=BP_WIDE) setPanelMode('rail');
            else closeSidebar();
          } else if(val==='bottom') openBottom();
          else if(val) setPanelMode(val);
        }}/>}
      </Stack>
      {/* Animated gradient bottom border — bottom-dock toolbar uses a plain top divider instead (gradient lives on the top bar) */}
      {panelMode!=='bottom' && <div style={{
        position:"absolute",bottom:0,left:0,right:0,height:2,opacity:0.50,
        background:`linear-gradient(90deg,${C_PRIMARY},${C_TERTIARY},${C_PRIMARY},${C_SECONDARY},${C_PRIMARY})`,
        backgroundSize:"300% 100%",animation:"gradientShift 8s linear infinite",
      }}/>}
    </Box>
    {/* Body */}
    <Box sx={{flex:1,order:panelMode==='bottom'?1:0,display:"flex",flexDirection:(panelMode==='fullscreen'||panelMode==='bottom')?"row":"column",overflow:"hidden",position:"relative"}}>
      {F.chatHistory&&panelMode==='fullscreen'&&<ChatMenu sidebar onNewChat={()=>newChat()} onSelectChat={selectChat} receivedShares={receivedShares} onMarkRead={markShareRead} onSelectShared={selectReceivedShare} onShare={cfg=>setShareDialog({...cfg,isConversation:true})} activeChatId={activeChatId} activeShareId={activeShareId} pinned={pinned} all={all} onPin={pinConvo} onUnpin={unpinConvo} onDelete={deleteConvo} onRename={renameConvo}/>}
      {F.chatHistory&&panelMode==='bottom'&&<ChatMenu sidebar dense showNewChat={false} onNewChat={()=>newChat()} onSelectChat={selectChat} receivedShares={receivedShares} onMarkRead={markShareRead} onSelectShared={selectReceivedShare} onShare={cfg=>setShareDialog({...cfg,isConversation:true})} activeChatId={activeChatId} activeShareId={activeShareId} pinned={pinned} all={all} onPin={pinConvo} onUnpin={unpinConvo} onDelete={deleteConvo} onRename={renameConvo}/>}
      <Box sx={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>
      {F.chatHistory&&showMenu&&panelMode!=='fullscreen'&&<div onClick={()=>setShowMenu(false)} style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.2)',zIndex:4,animation:'backdropIn 0.2s ease'}}/>}
      {F.chatHistory&&showMenu&&panelMode!=='fullscreen'&&<ChatMenu onNewChat={()=>{newChat();setShowMenu(false);}} onSelectChat={selectChat} receivedShares={receivedShares} onMarkRead={markShareRead} onSelectShared={selectReceivedShare} onShare={cfg=>setShareDialog({...cfg,isConversation:true})} onClose={()=>setShowMenu(false)} activeChatId={activeChatId} activeShareId={activeShareId} pinned={pinned} all={all} onPin={pinConvo} onUnpin={unpinConvo} onDelete={deleteConvo} onRename={renameConvo}/>}
      <Box ref={scrollRef} onScroll={handleScroll} sx={{flex:1,overflowY:"auto",p:"24px 24px 0"}}>
        <Container disableGutters maxWidth={panelMode==='fullscreen'||panelMode==='bottom'?'md':false}>
        {msgs.length===0&&(
          <Box sx={{display:"flex",flexDirection:"column",alignItems:"flex-start",pt:panelMode==='bottom'?2:8,mb:4}}>
            <Box sx={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",mb:2}}>
              <Icon mode="breathe"/>
            </Box>
            {isNewChat
              ? <NewChatView onPrompt={sendPrompt} options={newChatOptions} greeting={newChatGreeting} stacked={panelMode==='fullscreen'||panelMode==='bottom'}/>
              : <Welcome onPrompt={sendPrompt} stacked={panelMode==='fullscreen'||panelMode==='bottom'} pageName={C.pageName} title={C.welcomeTitle} intro={C.welcomeIntro} body={C.welcomeBody} prompts={C.suggestedPrompts}/>}
          </Box>
        )}
        <Stack direction="column">
          {msgs.map(m=>{
            if(m.type==="shared-divider") return (
              <Box key={m.id} sx={{animation:'fadeIn 0.4s ease'}}>
                <SharedByMeta title={m.title} sharedBy={m.sharedBy} date={m.date}/>
              </Box>
            );
            if(m.type==="user") return (
              <Box key={m.id} ref={m.id===latestUserId?promptRef:null} sx={{display:"flex",justifyContent:"flex-end",pl:"6em",mb:2}}>
                <UserBubble content={m.content} isLatest={!!m.isFresh}/>
              </Box>
            );
            if(m.type==="thinking") return (
              <Box key={m.id} sx={{mb:2}}>
                <Box sx={{display:"flex",gap:2,alignItems:"flex-start",pl:6,position:"relative",minHeight:40}}>
                  <Box sx={{position:"absolute",left:0,top:0,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Icon mode="thinking"/>
                  </Box>
                  <Box sx={{flex:1,mt:"0.5rem"}}>
                    <Phrases active={true} expanded={m.expanded} setExpanded={v=>setExpanded(m.id,v)}/>
                  </Box>
                </Box>
                {m.thinkingTrace&&m.thinkingTrace.length>0&&(
                  <Box sx={{mt:2}}>
                    <ThinkingToggle steps={m.thinkingTrace} expanded={m.thinkingExpanded||false} setExpanded={v=>setThinkingExpanded(m.id,v)}/>
                  </Box>
                )}
              </Box>
            );
            if(m.type==="response") { const vIdx=m.versionIdx||0; const vLen=(m.versions||[]).length; const pageNum=vIdx+1; const totalPages=Math.max(vLen, vIdx+1); return <ResponseRow key={m.id} html={m.html} instant={m.instant||false} onStreamDone={html=>{saveVersion(m.id,html); window.dispatchEvent(new CustomEvent('archera-chat:response-done',{detail:{id:m.id}}));}} pageNum={pageNum} totalPages={totalPages} onResetDone={m.onResetDone} expanded={m.expanded} setExpanded={v=>setExpanded(m.id,v)} steps={m.steps} confirm={m.confirm} onConfirmStatus={s=>setConfirmStatusAndFlow(m.id,s,m.confirm)} choice={m.choice} onChoiceSelect={id=>chooseSelect(m.id,id)} onChoiceConfirm={()=>chooseConfirm(m.id,m.choice)} onChoiceDeny={()=>chooseDeny(m.id)} onRegenerate={()=>regenerateMsg(m.id)} onPrev={()=>navigateVersion(m.id,vIdx-1)} onNext={()=>navigateVersion(m.id,vIdx+1)} compact={responseCompact} reasoning={m.reasoning} reasoningExpanded={m.reasoningExpanded||false} setReasoningExpanded={v=>setReasoningExpanded(m.id,v)} thinkingTrace={m.thinkingTrace} thinkingExpanded={m.thinkingExpanded||false} setThinkingExpanded={v=>setThinkingExpanded(m.id,v)} followUp={m.followUp} onFollowUp={sendPrompt} canShare={F.share} onShare={F.share ? ()=>setShareDialog({isConversation:false, msgId:m.id, title:generateShareTitle(m.html)}) : undefined} canWriteActions={F.writeActions}/>; }
            return null;
          })}
        </Stack>
        {showWaiting&&(
          <Box sx={{mb:2,animation:"fadeIn 0.8s ease both"}}>
            <Box sx={{width:responseCompact?32:40,height:responseCompact?32:40,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon mode="breathe" size={responseCompact?32:40}/>
            </Box>
          </Box>
        )}
        <div ref={bottomRef}/>
        </Container>
        <Box sx={{height:panelMode==='bottom'?`${panelHeight}px`:"90vh"}}/>
      </Box>
      <div style={{
        position:"absolute",bottom:0,left:0,right:0,
        background:`linear-gradient(to bottom,${palette.surface}00 0%,${palette.surface} 35%)`,
        padding:"24px 16px 16px",
      }}>
        <Container disableGutters maxWidth={panelMode==='fullscreen'||panelMode==='bottom'?'md':false}>
        <Paper variant="outlined" sx={{borderRadius:6,py:1.5, px:1.75,display:"flex",gap:1.25,alignItems:"center"}}>
          <IconButton size="small" sx={{flexShrink:0,p:0}}>
            <MuiIcon baseClassName="material-icons-outlined" sx={{fontSize:18,color:palette.text.secondary}}>attach_file</MuiIcon>
          </IconButton>
          <InputBase
            multiline
            maxRows={5}
            inputRef={taRef}
            value={input}
            placeholder="Send a message"
            autoFocus={!embedded && !children}
            onKeyDown={onKey}
            onChange={e=>{setInput(e.target.value);}}
            sx={{flex:1,fontSize:14,lineHeight:"20px",color:palette.text.primary,p:0}}
          />
          <IconButton size="small" onClick={send} disabled={busy||!input.trim()} sx={{flexShrink:0,p:0,opacity:busy||!input.trim()?0.3:1}}>
            <MuiIcon sx={{fontSize:18,color:palette.uiPrimary[300]}}>send</MuiIcon>
          </IconButton>
        </Paper>
        </Container>
      </div>
      </Box>
    </Box>
  </>);

  // Chat off: render the host page in a plain AppShell (or nothing when embedded).
  if (chatOff) return children ? <AppShell {...appShell}>{children}</AppShell> : (embedded ? null : <AppShell {...appShell}><PagePlaceholder panelOpen={false}/></AppShell>);

  if (embedded) return (<>
    <Snackbar open={!!snackbar} autoHideDuration={4000} onClose={()=>setSnackbar(null)} anchorOrigin={{vertical:'bottom',horizontal:'center'}}>
      <Alert onClose={()=>setSnackbar(null)} severity="success" variant="filled" sx={{width:'100%'}}>
        {snackbar}
      </Alert>
    </Snackbar>
    {F.share && <ShareDialog open={!!shareDialog} config={shareDialog} onClose={()=>setShareDialog(null)} onShare={({accounts,includeConversation})=>{
      const what = (shareDialog?.isConversation||includeConversation) ? 'Conversation' : 'Response';
      const who = accounts==='all' ? 'everyone in your organization' : accounts.length===1 ? '1 person' : `${accounts.length} people`;
      setSnackbar(`${what} shared with ${who}.`);
    }}/>}
    {styleBlock}
    <Box sx={{height:'100%',width:'100%',display:'flex',flexDirection:'column',bgcolor:'background.paper',overflow:'hidden'}}>{chatPanel}</Box>
  </>);

  return (<>
    <Snackbar open={!!snackbar} autoHideDuration={4000} onClose={()=>setSnackbar(null)} anchorOrigin={{vertical:'bottom',horizontal:'center'}}>
      <Alert onClose={()=>setSnackbar(null)} severity="success" variant="filled" sx={{width:'100%'}}>
        {snackbar}
      </Alert>
    </Snackbar>
    {F.share && <ShareDialog open={!!shareDialog} config={shareDialog} onClose={()=>setShareDialog(null)} onShare={({accounts,includeConversation})=>{
      const what = (shareDialog?.isConversation||includeConversation) ? 'Conversation' : 'Response';
      const who = accounts==='all' ? 'everyone in your organization' : accounts.length===1 ? '1 person' : `${accounts.length} people`;
      setSnackbar(`${what} shared with ${who}.`);
    }}/>}
    <AppShell
      pageName="Commitment Inventory"
      provider="AWS"
      navIcons={[{icon:'list_alt'},{icon:'equalizer',active:true},{icon:'workspaces'}]}
      maxWidth={false}
      {...appShell}
      contentStyle={{p:0, position:'relative', overflow:'hidden', ...(appShell?.contentStyle)}}
    >
      {styleBlock}

      {/* ── Unified layout — always mounted, CSS-driven per mode ── */}
      <div style={{display:'flex', height:'100%', position:'relative'}}>

        {/* Page content — never unmounts */}
        <div className="chat-host-scroll" style={{flex:1, overflowY:'auto', minWidth:0,
          paddingBottom: panelVisible && panelMode==='bottom' ? panelHeight + 16 : 0}}>
          {children || <PagePlaceholder panelOpen={isSidebarOpen}/>}
        </div>

        {/* Launch FAB — shown when panel is closed */}
        {/* LaunchPrompt — independent of FAB layout so it doesn't cause a shift */}
        {!panelOpen&&(
          <Fade in={showFabBubble} unmountOnExit timeout={{enter:700,exit:250}}>
            <Box sx={{position:'absolute',bottom:120,right:32,zIndex:10,maxWidth:240}}>
              <Paper elevation={6} sx={{borderRadius:3,borderBottomRightRadius:0,bgcolor:palette.header,position:'relative'}}>
                <IconButton size="small" onClick={()=>setShowFabBubble(false)} sx={{position:'absolute',top:6,right:6,p:0.25,'&:hover':{bgcolor:alpha(palette.neutral.white,0.1)}}}>
                  <MuiIcon sx={{fontSize:14,color:alpha(palette.neutral.white,0.5)}}>close</MuiIcon>
                </IconButton>
                <Box sx={{p:'14px 16px 12px'}}>
                  <Stack direction="row" alignItems="center" gap={1} sx={{mb:1.25}}>
                    <ArcheraLogo size={14} tint={alpha(palette.neutral.white,0.55)}/>
                    <Typography sx={{...typography.micro,color:alpha(palette.neutral.white,0.55)}}>ARCHERA AI</Typography>
                  </Stack>
                  <Typography sx={{...typography.body2,color:palette.neutral.white,mb:1.25,lineHeight:'1.5'}}>
                    Ask me about your <Box component="span" sx={{color:palette.accent1[300],fontWeight:500}}>{C.pageName}</Box>.
                  </Typography>
                  {fabPrompt && (
                    <Box
                      onClick={()=>{
                        setShowFabBubble(false);
                        fabBubbleFired.current=true;
                        openPanel();
                        setMsgs([]); setActiveShareId(null); setActiveChatId(null);
                        sendPrompt(fabPrompt);
                      }}
                      sx={{display:'inline-flex',alignItems:'flex-start',gap:0.75,px:1.25,py:0.75,borderRadius:3,border:`1px solid ${alpha(palette.neutral.white,0.25)}`,bgcolor:alpha(palette.neutral.white,0.1),cursor:'pointer','&:hover':{bgcolor:alpha(palette.neutral.white,0.18)}}}
                    >
                      <Typography sx={{...typography.body2,color:alpha(palette.neutral.white,0.9),lineHeight:1.5}}>{fabPrompt}</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>
          </Fade>
        )}

        {!panelOpen&&(
          <Stack sx={{position:'absolute',bottom:24,right:24,zIndex:10,alignItems:'center',gap:1,animation:'fadeIn 0.2s ease'}}>

            {/* Notification badge wraps the active FAB — badge dot is clickable, FAB itself is not affected */}
            <Badge badgeContent={unreadShareCount} sx={{position:'relative','& .MuiBadge-badge':{bgcolor:palette.brandTertiary[500],color:palette.neutral.white,top:4,right:4,opacity:notificationVisible?1:0,transition:'opacity 0.3s ease',cursor:'pointer',pointerEvents:'all',zIndex:1},'& .MuiBadge-badge:hover':{opacity:notificationVisible?0.85:0}}} componentsProps={{badge:{onClick:e=>{e.stopPropagation();openNotificationMenu();}}}}>

            {/* Active FAB */}
            <Box sx={{position:'relative',width:60,height:60,filter:`drop-shadow(0 4px 10px ${C_PRIMARY}40)`}} onClick={()=>{openPanel();}}>
              <Box sx={{position:'absolute',inset:0,borderRadius:'50%',overflow:'hidden'}}>
                <Box sx={{position:'absolute',inset:-20,background:`conic-gradient(from 0deg,${C_PRIMARY},${C_TERTIARY},${C_PRIMARY},${C_SECONDARY},${C_PRIMARY})`,animation:'rotateFabGradient 3s linear infinite'}}/>
                <Box sx={{position:'absolute',inset:'2px',borderRadius:'50%',bgcolor:'background.paper'}}/>
              </Box>
              <Fab sx={{position:'absolute',inset:0,width:'100%',height:'100%',bgcolor:'transparent',boxShadow:'none','&:hover':{bgcolor:'rgba(0,0,0,0.04)',boxShadow:'none'}}}>
                <ArcheraLogo size={24} breathe/>
              </Fab>
            </Box>

            </Badge>
          </Stack>
        )}

        {panelVisible&&<>
        {/* Left resize handle — sidebar only; click to collapse, drag to resize */}
        {panelMode==='sidebar' && (
          <Tooltip title="Click to collapse · Drag to resize" placement="left" arrow>
            <div
              onMouseDown={startPanelResize}
              style={{width:10, flexShrink:0, cursor:'col-resize', display:'flex', alignItems:'center', justifyContent:'center', background:'transparent'}}
            >
              <div style={{width:4, height:40, borderRadius:2, background:palette.neutral[300]}}/>
            </div>
          </Tooltip>
        )}

        {/* Fullscreen backdrop */}
        {panelMode==='fullscreen' && (
          <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:19, animation:'backdropIn 0.2s ease'}}/>
        )}
        </>}

        {/* Rail — collapsed strip (outside panelVisible guard — rail mode sets panelVisible=false) */}
        {panelOpen && panelMode==='rail' && lastMode!=='bottom' && (
          <Box onClick={()=>lastMode==='sidebar'?openSidebar():setPanelMode(lastMode)}
            sx={{width:40,flexShrink:0,borderLeft:`1px solid ${color.divider}`,bgcolor:palette.surface,
              display:'flex',flexDirection:'column',alignItems:'center',pt:2,pb:1,
              cursor:'pointer','&:hover':{bgcolor:palette.neutral[50]},transition:'background 0.15s'}}>
            <Tooltip title="Open Archera AI" placement="left" arrow>
              <Box sx={{p:0.75,borderRadius:1,display:'flex',alignItems:'center',justifyContent:'center',
                '&:hover':{bgcolor:palette.neutral[100]},transition:'background 0.15s'}}>
                <ArcheraLogo size={20}/>
              </Box>
            </Tooltip>
            <Box sx={{flex:1}}/>
            <PanelModeToggleGroup panelMode={panelMode} orientation="vertical" tooltipPlacement="left" onChange={val=>{
              if(val==='close') setPanelOpen(false);
              else if(val==='bottom') openBottom();
              else if(val) setPanelMode(val);
            }}/>
          </Box>
        )}
        {/* Rail — bottom strip (outside panelVisible guard — rail mode sets panelVisible=false) */}
        {panelOpen && panelMode==='rail' && lastMode==='bottom' && (
          <Box onClick={openBottom} sx={{position:'fixed',bottom:0,left:0,right:0,height:48,
            borderTop:`1px solid ${color.divider}`,bgcolor:palette.surface,
            display:'flex',alignItems:'center',px:2,gap:2,zIndex:20,cursor:'pointer',
            '&:hover':{bgcolor:palette.neutral[50]},transition:'background 0.15s'}}>
            <Tooltip title="Open Archera AI" placement="top" arrow>
              <Box sx={{display:'flex',alignItems:'center',gap:1}}>
                <ArcheraLogo size={20}/>
              </Box>
            </Tooltip>
            <Box sx={{flex:1}}/>
            <PanelModeToggleGroup panelMode={panelMode} tooltipPlacement="top" onChange={val=>{
              if(val==='close') setPanelOpen(false);
              else if(val==='bottom') openBottom();
              else if(val) setPanelMode(val);
            }}/>
          </Box>
        )}

        {/* Chat panel — always mounted to preserve streaming/animation state across open/close/rail */}
        <div ref={panelRef} style={(!panelOpen || panelMode==='rail') ? {display:'none'} : {
          ...(panelMode==='sidebar' ? {
            position:'relative',
            width:panelWidth, flexShrink:0,
            borderLeft:`1px solid ${color.divider}`,
          } :panelMode==='overlay' ? (overlayRect ? {
            position:'fixed',
            left:overlayRect.left, top:overlayRect.top,
            width:overlayRect.w, height:overlayRect.h,
            borderRadius:8,
            boxShadow:'0 4px 24px rgba(0,0,0,0.2)',
            border:`1px solid ${color.divider}`,
            zIndex:10,
          } : {
            position:'absolute',
            top:12, right:12, bottom:12, width:panelWidth,
            borderRadius:8,
            boxShadow:'0 4px 12px rgba(0,0,0,0.25)',
            border:`1px solid ${color.divider}`,
            zIndex:10,
            animation:'panelReveal 0.2s ease',
          }) : panelMode==='bottom' ? {
            position:'fixed',
            bottom:0, left:0, right:0,
            height:panelHeight,
            borderTop:`1px solid ${color.divider}`,
            boxShadow:'0 -2px 12px rgba(0,0,0,0.12)',
            zIndex:20,
            transition:'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
            transform: bottomVisible ? 'translateY(0)' : 'translateY(100%)',
          } : {
            position:'fixed', inset:24,
            borderRadius:8,
            boxShadow:'0 8px 32px rgba(0,0,0,0.3)',
            zIndex:20,
            animation:'panelReveal 0.25s ease',
          }),
          background:palette.surface,
          display:'flex', flexDirection:'column', overflow:'hidden',
        }}
        >
          {chatPanel}
          {/* Bottom dock resize handle — thin bar pinned to the top of the dock */}
          {panelMode==='bottom' && (
            <Tooltip title="Click to collapse · Drag to resize" placement="top" arrow>
              <div onMouseDown={startBottomDockResize}
                style={{order:0,flexShrink:0,height:12,paddingBottom:2,boxSizing:'border-box',cursor:'n-resize',position:'relative',
                  borderTop:`1px solid ${color.divider}`,
                  display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{width:40,height:4,borderRadius:2,background:palette.neutral[300]}}/>
                {/* Animated gradient border at the bottom of the top bar */}
                <div style={{
                  position:'absolute',bottom:0,left:0,right:0,height:2,opacity:0.50,
                  background:`linear-gradient(90deg,${C_PRIMARY},${C_TERTIARY},${C_PRIMARY},${C_SECONDARY},${C_PRIMARY})`,
                  backgroundSize:"300% 100%",animation:"gradientShift 8s linear infinite",
                }}/>
              </div>
            </Tooltip>
          )}
          {/* Overlay resize handles */}
          {panelMode==='overlay' && <>
            {/* Left edge — width */}
            <div onMouseDown={startOverlayWidthResize}
              style={{position:'absolute',top:0,left:0,bottom:0,width:8,cursor:'col-resize',zIndex:5}}/>
            {/* Bottom edge — height */}
            <div onMouseDown={startOverlayHeightResize}
              style={{position:'absolute',bottom:0,left:32,right:0,height:8,cursor:'s-resize',zIndex:5}}/>
            {/* Bottom-left corner — both axes, with diagonal-lines visual */}
            <div onMouseDown={startOverlayCornerResize}
              style={{position:'absolute',bottom:'4px',left:'4px',width:24,height:24,cursor:'nesw-resize',zIndex:6,
                clipPath:'polygon(0 0, 0 100%, 100% 100%)',
                background:`linear-gradient(45deg, transparent 2px, ${palette.neutral[200]} 2px, ${palette.neutral[200]} 5px, transparent 5px, transparent 8px, ${palette.neutral[200]} 8px, ${palette.neutral[200]} 11px, transparent 11px, transparent 14px, ${palette.neutral[200]} 14px, ${palette.neutral[200]} 17px, transparent 17px, transparent 20px, ${palette.neutral[200]} 20px, ${palette.neutral[200]} 23px, transparent 23px)`
              }}/>
          </>}
        </div>

      </div>

    </AppShell>
  </>);
}
