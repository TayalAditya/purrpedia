"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import MobileNav from "@/components/MobileNav";

// ── Template definitions — each has a draw function ──────────────────────
const TEMPLATES = [
  {
    id: "midnight",
    label: "Midnight Cat",
    preview: "🌙",
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Deep night sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#0a0015");
      sky.addColorStop(1, "#1a0530");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);
      // Stars
      ctx.fillStyle = "#ffffff";
      [[60,40],[120,70],[200,30],[300,55],[380,25],[440,80],[500,45],[530,20],[80,120],[250,100]].forEach(([x,y]) => {
        ctx.beginPath(); ctx.arc(x, y, Math.random()*1.5+0.5, 0, Math.PI*2); ctx.fill();
      });
      // Moon
      ctx.fillStyle = "#fffacd";
      ctx.shadowColor = "#fffacd"; ctx.shadowBlur = 20;
      ctx.beginPath(); ctx.arc(480, 70, 40, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "#1a0530";
      ctx.beginPath(); ctx.arc(495, 60, 34, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
      // Silhouette cat
      ctx.fillStyle = "#0a0015";
      // Body
      ctx.beginPath(); ctx.ellipse(280, 290, 70, 55, 0, 0, Math.PI*2); ctx.fill();
      // Head
      ctx.beginPath(); ctx.arc(280, 220, 45, 0, Math.PI*2); ctx.fill();
      // Ears
      ctx.beginPath(); ctx.moveTo(248,185); ctx.lineTo(235,150); ctx.lineTo(268,178); ctx.fill();
      ctx.beginPath(); ctx.moveTo(312,185); ctx.lineTo(325,150); ctx.lineTo(292,178); ctx.fill();
      // Tail
      ctx.beginPath(); ctx.moveTo(345,300); ctx.quadraticCurveTo(420,250,400,200); ctx.lineWidth=12; ctx.strokeStyle="#0a0015"; ctx.stroke();
      // Glowing eyes
      ctx.shadowColor = "#a78bfa"; ctx.shadowBlur = 15;
      ctx.fillStyle = "#a78bfa";
      ctx.beginPath(); ctx.ellipse(265,218,7,9,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(295,218,7,9,0,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
      // Ground
      const ground = ctx.createLinearGradient(0, 320, 0, h);
      ground.addColorStop(0, "#120025"); ground.addColorStop(1, "#0a0015");
      ctx.fillStyle = ground;
      ctx.fillRect(0, 340, w, h-340);
    }
  },
  {
    id: "sunshine",
    label: "Sunny Day",
    preview: "☀️",
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, h*0.6);
      sky.addColorStop(0, "#87CEEB"); sky.addColorStop(1, "#E0F4FF");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h*0.6);
      // Ground
      const grass = ctx.createLinearGradient(0, h*0.6, 0, h);
      grass.addColorStop(0, "#7CBA5E"); grass.addColorStop(1, "#5A9B3C");
      ctx.fillStyle = grass; ctx.fillRect(0, h*0.6, w, h*0.4);
      // Sun
      ctx.shadowColor="#FFD700"; ctx.shadowBlur=30;
      ctx.fillStyle="#FFD700";
      ctx.beginPath(); ctx.arc(80, 70, 45, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;
      // Clouds
      const drawCloud = (x: number, y: number, s: number) => {
        ctx.fillStyle="rgba(255,255,255,0.9)";
        [[-30,10,30],[0,0,40],[30,10,30],[60,10,25]].forEach(([dx,dy,r]) => {
          ctx.beginPath(); ctx.arc(x+dx*s/40,y+dy*s/40,r*s/40,0,Math.PI*2); ctx.fill();
        });
      };
      drawCloud(250,60,40); drawCloud(400,40,35);
      // Tabby cat body - orange
      ctx.fillStyle="#E8831A";
      ctx.beginPath(); ctx.ellipse(280, 295, 75, 58, 0, 0, Math.PI*2); ctx.fill();
      // Stripes
      ctx.strokeStyle="#C06810"; ctx.lineWidth=4;
      [[255,270,295,268],[265,285,305,283],[258,300,302,298]].forEach(([x1,y1,x2,y2]) => {
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      });
      // Head
      ctx.fillStyle="#E8831A";
      ctx.beginPath(); ctx.arc(280, 222, 48, 0, Math.PI*2); ctx.fill();
      // Ears
      ctx.fillStyle="#E8831A";
      ctx.beginPath(); ctx.moveTo(245,190); ctx.lineTo(232,152); ctx.lineTo(268,178); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(315,190); ctx.lineTo(328,152); ctx.lineTo(292,178); ctx.closePath(); ctx.fill();
      ctx.fillStyle="#FFB3C1";
      ctx.beginPath(); ctx.moveTo(247,188); ctx.lineTo(237,158); ctx.lineTo(264,178); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(313,188); ctx.lineTo(323,158); ctx.lineTo(296,178); ctx.closePath(); ctx.fill();
      // Eyes
      ctx.fillStyle="#228B22";
      ctx.beginPath(); ctx.ellipse(264,220,8,10,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(296,220,8,10,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#000"; ctx.beginPath(); ctx.arc(264,220,4,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(296,220,4,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(267,217,2,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(299,217,2,0,Math.PI*2); ctx.fill();
      // Nose & mouth
      ctx.fillStyle="#FF8FAB";
      ctx.beginPath(); ctx.moveTo(280,232); ctx.lineTo(275,238); ctx.lineTo(285,238); ctx.closePath(); ctx.fill();
      ctx.strokeStyle="#8B4513"; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(275,238); ctx.quadraticCurveTo(280,243,285,238); ctx.stroke();
      // Whiskers
      ctx.strokeStyle="#8B4513"; ctx.lineWidth=1;
      [[240,234,265,237],[235,240,265,240],[255,268,290,290]].forEach(([x1,y1,x2,y2])=>{
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w-x1+80,y1); ctx.lineTo(w-x2+80,y2); ctx.stroke();
      });
      // Flowers
      ["#FF6B9D","#FFD700","#FF8C42"].forEach((c,i) => {
        const fx = 80+i*200, fy = h-60;
        ctx.fillStyle="#228B22"; ctx.fillRect(fx,fy-40,3,40);
        ctx.fillStyle=c;
        for(let p=0;p<5;p++){
          ctx.beginPath();
          const a=p*Math.PI*2/5;
          ctx.ellipse(fx+1+Math.cos(a)*12,fy-40+Math.sin(a)*12,7,4,a,0,Math.PI*2); ctx.fill();
        }
        ctx.fillStyle="#FFD700"; ctx.beginPath(); ctx.arc(fx+1,fy-40,5,0,Math.PI*2); ctx.fill();
      });
    }
  },
  {
    id: "galaxy",
    label: "Galaxy Cat",
    preview: "🌌",
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Deep space
      ctx.fillStyle="#03001e"; ctx.fillRect(0,0,w,h);
      // Nebula
      const neb = ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);
      neb.addColorStop(0,"rgba(167,139,250,0.15)");
      neb.addColorStop(0.5,"rgba(249,115,22,0.08)");
      neb.addColorStop(1,"transparent");
      ctx.fillStyle=neb; ctx.fillRect(0,0,w,h);
      // Stars
      for(let i=0;i<120;i++){
        const x=Math.random()*w, y=Math.random()*h, r=Math.random()*2;
        ctx.fillStyle=`rgba(255,255,255,${Math.random()*0.8+0.2})`;
        ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      }
      // Planet
      ctx.shadowColor="#a78bfa"; ctx.shadowBlur=20;
      const planet = ctx.createRadialGradient(420,100,0,420,100,50);
      planet.addColorStop(0,"#c4b5fd"); planet.addColorStop(1,"#7c3aed");
      ctx.fillStyle=planet; ctx.beginPath(); ctx.arc(420,100,50,0,Math.PI*2); ctx.fill();
      // Planet ring
      ctx.strokeStyle="rgba(167,139,250,0.4)"; ctx.lineWidth=6;
      ctx.beginPath(); ctx.ellipse(420,100,70,20,-0.3,0,Math.PI*2); ctx.stroke();
      ctx.shadowBlur=0;
      // Cat silhouette — cosmic purple
      ctx.fillStyle="#1a0a3e";
      ctx.beginPath(); ctx.ellipse(260,295,72,56,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(260,222,46,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(226,188); ctx.lineTo(213,148); ctx.lineTo(248,176); ctx.fill();
      ctx.beginPath(); ctx.moveTo(294,188); ctx.lineTo(307,148); ctx.lineTo(272,176); ctx.fill();
      // Galactic eyes
      ctx.shadowColor="#f97316"; ctx.shadowBlur=20;
      const eyeL = ctx.createRadialGradient(247,220,0,247,220,10);
      eyeL.addColorStop(0,"#fbbf24"); eyeL.addColorStop(1,"#f97316");
      ctx.fillStyle=eyeL; ctx.beginPath(); ctx.ellipse(247,220,8,10,0,0,Math.PI*2); ctx.fill();
      const eyeR = ctx.createRadialGradient(273,220,0,273,220,10);
      eyeR.addColorStop(0,"#fbbf24"); eyeR.addColorStop(1,"#f97316");
      ctx.fillStyle=eyeR; ctx.beginPath(); ctx.ellipse(273,220,8,10,0,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;
      ctx.fillStyle="#000"; ctx.beginPath(); ctx.arc(247,220,4,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(273,220,4,0,Math.PI*2); ctx.fill();
      // Stardust tail
      ctx.strokeStyle="rgba(167,139,250,0.6)"; ctx.lineWidth=8;
      ctx.beginPath(); ctx.moveTo(328,300); ctx.quadraticCurveTo(410,260,390,190); ctx.stroke();
      for(let i=0;i<20;i++){
        ctx.fillStyle=`rgba(167,139,250,${Math.random()*0.8})`;
        ctx.beginPath(); ctx.arc(350+Math.random()*80,200+Math.random()*120,Math.random()*3,0,Math.PI*2); ctx.fill();
      }
      // Bottom gradient
      const bot = ctx.createLinearGradient(0,320,0,h);
      bot.addColorStop(0,"rgba(3,0,30,0)"); bot.addColorStop(1,"#03001e");
      ctx.fillStyle=bot; ctx.fillRect(0,320,w,h-320);
    }
  },
  {
    id: "lofi",
    label: "Lo-Fi Vibes",
    preview: "🎵",
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Warm cream bg
      ctx.fillStyle="#fdf6e3"; ctx.fillRect(0,0,w,h);
      // Window frame
      ctx.fillStyle="#d4a96a";
      ctx.fillRect(60,30,w-120,h-100);
      ctx.fillStyle="#fdf6e3"; ctx.fillRect(70,40,w-140,h-120);
      // Window cross
      ctx.fillStyle="#d4a96a"; ctx.fillRect(w/2-5,40,10,h-120); ctx.fillRect(70,(h-80)/2,w-140,10);
      // Night sky through window
      ctx.fillStyle="#1a1a3e"; ctx.fillRect(75,45,(w-150)/2,(h-130)/2);
      ctx.fillStyle="#1a1a3e"; ctx.fillRect(w/2+5,45,(w-150)/2,(h-130)/2);
      // Stars
      ctx.fillStyle="#fff";
      [[100,70],[130,90],[160,60],[180,85],[350,65],[380,90],[400,70],[430,80]].forEach(([x,y])=>{
        ctx.beginPath(); ctx.arc(x,y,1.5,0,Math.PI*2); ctx.fill();
      });
      // Moon in window
      ctx.fillStyle="#fffacd"; ctx.beginPath(); ctx.arc(170,(h-130)/4+45,22,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#1a1a3e"; ctx.beginPath(); ctx.arc(180,(h-130)/4+40,18,0,Math.PI*2); ctx.fill();
      // Bottom half — cozy room
      ctx.fillStyle="#8B6914"; ctx.fillRect(75,(h-80)/2+10,(w-150)/2,(h-130)/2);
      ctx.fillStyle="#7a5c10"; ctx.fillRect(w/2+5,(h-80)/2+10,(w-150)/2,(h-130)/2);
      // Desk
      ctx.fillStyle="#5c3a1e"; ctx.fillRect(60,h-130,w-120,15);
      // Cat on desk — chubby lofi cat
      ctx.fillStyle="#888";
      ctx.beginPath(); ctx.ellipse(200,h-150,50,35,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(200,h-190,32,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(173,h-215); ctx.lineTo(163,h-240); ctx.lineTo(188,h-218); ctx.fill();
      ctx.beginPath(); ctx.moveTo(227,h-215); ctx.lineTo(237,h-240); ctx.lineTo(212,h-218); ctx.fill();
      // Sleepy eyes (lines)
      ctx.strokeStyle="#333"; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.moveTo(187,h-192); ctx.quadraticCurveTo(192,h-196,197,h-192); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(203,h-192); ctx.quadraticCurveTo(208,h-196,213,h-192); ctx.stroke();
      // Coffee mug
      ctx.fillStyle="#c0392b"; ctx.fillRect(310,h-150,35,28); ctx.fillStyle="#922b21"; ctx.fillRect(310,h-150,35,5);
      ctx.strokeStyle="#922b21"; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(350,h-137,12,Math.PI*0.25,Math.PI*1.75); ctx.stroke();
      // Steam
      ctx.strokeStyle="rgba(180,180,180,0.5)"; ctx.lineWidth=2;
      [318,325,332].forEach((x)=>{
        ctx.beginPath(); ctx.moveTo(x,h-155); ctx.quadraticCurveTo(x-5,h-165,x,h-175); ctx.stroke();
      });
      // Music notes floating
      ctx.fillStyle="rgba(212,169,106,0.7)"; ctx.font="bold 18px serif";
      ctx.fillText("♪",370,h-190); ctx.fillText("♫",400,h-210); ctx.fillText("♩",430,h-185);
      // Warm overlay
      const warm = ctx.createLinearGradient(0,0,w,h);
      warm.addColorStop(0,"rgba(255,200,100,0.03)"); warm.addColorStop(1,"rgba(255,150,50,0.06)");
      ctx.fillStyle=warm; ctx.fillRect(0,0,w,h);
    }
  },
  {
    id: "sakura",
    label: "Sakura Dream",
    preview: "🌸",
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Soft pink sky
      const sky = ctx.createLinearGradient(0,0,0,h);
      sky.addColorStop(0,"#fce4ec"); sky.addColorStop(0.6,"#f8bbd0"); sky.addColorStop(1,"#f48fb1");
      ctx.fillStyle=sky; ctx.fillRect(0,0,w,h);
      // Sakura tree trunk
      ctx.fillStyle="#5D4037"; ctx.fillRect(w-100,h*0.3,20,h*0.7);
      // Tree branches
      ctx.strokeStyle="#5D4037"; ctx.lineWidth=8;
      [[w-90,h*0.3,w-160,h*0.15],[w-90,h*0.35,w-30,h*0.2],[w-90,h*0.4,w-180,h*0.3]].forEach(([x1,y1,x2,y2])=>{
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      });
      // Blossom clusters
      const blossom = (x: number, y: number) => {
        for(let i=0;i<8;i++){
          ctx.fillStyle=["#FF80AB","#F48FB1","#FFCDD2","#FF4081"][Math.floor(Math.random()*4)];
          ctx.beginPath(); ctx.arc(x+Math.random()*30-15,y+Math.random()*30-15,8+Math.random()*8,0,Math.PI*2); ctx.fill();
        }
      };
      [[w-160,h*0.15],[w-30,h*0.2],[w-180,h*0.3],[w-140,h*0.25],[w-60,h*0.28]].forEach(([x,y])=>blossom(x,y));
      // Falling petals
      for(let i=0;i<25;i++){
        ctx.fillStyle=`rgba(255,182,193,${Math.random()*0.7+0.3})`;
        ctx.beginPath();
        const px=Math.random()*w, py=Math.random()*h;
        ctx.ellipse(px,py,4,6,Math.random()*Math.PI,0,Math.PI*2); ctx.fill();
      }
      // White cat
      ctx.fillStyle="#fff";
      ctx.beginPath(); ctx.ellipse(200,295,68,52,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(200,228,44,0,Math.PI*2); ctx.fill();
      // Ears
      ctx.beginPath(); ctx.moveTo(168,198); ctx.lineTo(155,162); ctx.lineTo(188,184); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(232,198); ctx.lineTo(245,162); ctx.lineTo(212,184); ctx.closePath(); ctx.fill();
      ctx.fillStyle="#FFB3C1";
      ctx.beginPath(); ctx.moveTo(170,196); ctx.lineTo(160,167); ctx.lineTo(186,183); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(230,196); ctx.lineTo(240,167); ctx.lineTo(214,183); ctx.closePath(); ctx.fill();
      // Eyes — pink
      ctx.fillStyle="#E91E63"; ctx.beginPath(); ctx.ellipse(186,226,7,9,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(214,226,7,9,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#000"; ctx.beginPath(); ctx.arc(186,226,3.5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(214,226,3.5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(188,224,1.5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(216,224,1.5,0,Math.PI*2); ctx.fill();
      // Nose
      ctx.fillStyle="#FF80AB"; ctx.beginPath(); ctx.moveTo(200,234); ctx.lineTo(196,239); ctx.lineTo(204,239); ctx.closePath(); ctx.fill();
      // Whiskers
      ctx.strokeStyle="rgba(180,180,180,0.8)"; ctx.lineWidth=1;
      [[155,232,190,236],[150,238,190,238],[165,244,190,240]].forEach(([x1,y1,x2,y2])=>{
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w-x1+50,y1); ctx.lineTo(w-x2+50,y2); ctx.stroke();
      });
      // Bow on head
      ctx.fillStyle="#FF4081";
      ctx.beginPath(); ctx.moveTo(185,196); ctx.quadraticCurveTo(200,204,215,196); ctx.quadraticCurveTo(200,190,185,196); ctx.fill();
      ctx.beginPath(); ctx.arc(200,196,4,0,Math.PI*2); ctx.fill();
      // Petals on ground
      ctx.fillStyle="rgba(255,182,193,0.4)"; ctx.fillRect(0,340,w,h-340);
      for(let i=0;i<15;i++){
        ctx.fillStyle="rgba(255,20,147,0.2)";
        ctx.beginPath(); ctx.ellipse(Math.random()*w,360+Math.random()*(h-360),5,3,Math.random()*Math.PI,0,Math.PI*2); ctx.fill();
      }
    }
  },
  {
    id: "retro",
    label: "Retro Neon",
    preview: "🕹️",
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.fillStyle="#0d0d0d"; ctx.fillRect(0,0,w,h);
      // Grid floor
      ctx.strokeStyle="rgba(0,255,200,0.2)"; ctx.lineWidth=1;
      for(let i=0;i<20;i++){ ctx.beginPath(); ctx.moveTo(0,h*0.55+i*15); ctx.lineTo(w,h*0.55+i*10); ctx.stroke(); }
      for(let i=0;i<15;i++){ const x=i*(w/14); ctx.beginPath(); ctx.moveTo(x,h*0.55); ctx.lineTo(w/2+(x-w/2)*0.3,h); ctx.stroke(); }
      // Sun/horizon
      ctx.shadowColor="#f97316"; ctx.shadowBlur=30;
      const sun=ctx.createLinearGradient(0,h*0.3,0,h*0.55);
      sun.addColorStop(0,"#f97316"); sun.addColorStop(1,"#fbbf24");
      ctx.fillStyle=sun; ctx.beginPath(); ctx.arc(w/2,h*0.55,100,Math.PI,0); ctx.fill();
      // Sun stripes (dark lines)
      ctx.fillStyle="#0d0d0d";
      [0.38,0.42,0.45,0.47,0.49,0.51,0.53].forEach(y=>{ ctx.fillRect(w/2-100,h*y,200,5); });
      ctx.shadowBlur=0;
      // Neon title
      ctx.shadowColor="#a78bfa"; ctx.shadowBlur=15;
      ctx.fillStyle="#a78bfa"; ctx.font="bold 22px monospace";
      ctx.textAlign="center"; ctx.fillText("PURR.EXE", w/2, 50);
      ctx.shadowBlur=0; ctx.textAlign="left";
      // Mountains silhouette
      ctx.fillStyle="#1a0040";
      ctx.beginPath(); ctx.moveTo(0,h*0.55); ctx.lineTo(80,h*0.25); ctx.lineTo(160,h*0.45); ctx.lineTo(240,h*0.15); ctx.lineTo(320,h*0.4); ctx.lineTo(400,h*0.2); ctx.lineTo(w,h*0.35); ctx.lineTo(w,h*0.55); ctx.closePath(); ctx.fill();
      // Cat body neon outline
      ctx.strokeStyle="#00ffe0"; ctx.lineWidth=3; ctx.shadowColor="#00ffe0"; ctx.shadowBlur=12;
      ctx.fillStyle="#0d0d0d";
      ctx.beginPath(); ctx.ellipse(w/2,295,70,54,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(w/2,225,44,0,Math.PI*2); ctx.fill(); ctx.stroke();
      // Ears neon
      [[w/2-32,192,w/2-45,155,w/2-12,180],[w/2+32,192,w/2+45,155,w/2+12,180]].forEach(([x1,y1,x2,y2,x3,y3])=>{
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.lineTo(x3,y3); ctx.closePath(); ctx.fill(); ctx.stroke();
      });
      // Eyes neon pink
      ctx.strokeStyle="#ff00ff"; ctx.shadowColor="#ff00ff"; ctx.shadowBlur=15;
      ctx.fillStyle="#ff00ff";
      ctx.beginPath(); ctx.ellipse(w/2-16,223,7,9,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(w/2+16,223,7,9,0,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;
      // Scanline overlay
      ctx.fillStyle="rgba(0,0,0,0.15)";
      for(let y=0;y<h;y+=4){ ctx.fillRect(0,y,w,2); }
    }
  },
  {
    id: "ocean",
    label: "Ocean Cat",
    preview: "🌊",
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Sky
      const sky = ctx.createLinearGradient(0,0,0,h*0.5);
      sky.addColorStop(0,"#0ea5e9"); sky.addColorStop(1,"#7dd3fc");
      ctx.fillStyle=sky; ctx.fillRect(0,0,w,h*0.5);
      // Ocean
      const sea = ctx.createLinearGradient(0,h*0.5,0,h);
      sea.addColorStop(0,"#0284c7"); sea.addColorStop(1,"#075985");
      ctx.fillStyle=sea; ctx.fillRect(0,h*0.5,w,h*0.5);
      // Waves
      ctx.strokeStyle="rgba(255,255,255,0.4)"; ctx.lineWidth=3;
      for(let i=0;i<4;i++){
        ctx.beginPath();
        for(let x=0;x<w;x+=10){
          const y=h*0.5+i*20+Math.sin((x/w)*Math.PI*4+i)*8;
          i===0&&x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        ctx.stroke();
      }
      // Sun reflection
      ctx.fillStyle="rgba(255,255,255,0.15)";
      ctx.beginPath(); ctx.ellipse(w/2,h*0.5,60,8,0,0,Math.PI*2); ctx.fill();
      // White cat on boat
      const bx=w/2, by=h*0.55;
      ctx.fillStyle="#8B4513"; // boat
      ctx.beginPath(); ctx.moveTo(bx-70,by); ctx.lineTo(bx+70,by); ctx.lineTo(bx+55,by+35); ctx.lineTo(bx-55,by+35); ctx.closePath(); ctx.fill();
      ctx.fillStyle="#A0522D"; ctx.fillRect(bx-70,by-5,140,8);
      // Cat body
      ctx.fillStyle="#f0f0f0";
      ctx.beginPath(); ctx.ellipse(bx,by-25,38,28,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(bx,by-58,24,0,Math.PI*2); ctx.fill();
      // Ears
      ctx.beginPath(); ctx.moveTo(bx-18,by-76); ctx.lineTo(bx-28,by-96); ctx.lineTo(bx-5,by-74); ctx.fill();
      ctx.beginPath(); ctx.moveTo(bx+18,by-76); ctx.lineTo(bx+28,by-96); ctx.lineTo(bx+5,by-74); ctx.fill();
      ctx.fillStyle="#FFB3C1";
      ctx.beginPath(); ctx.moveTo(bx-16,by-75); ctx.lineTo(bx-24,by-91); ctx.lineTo(bx-6,by-73); ctx.fill();
      ctx.beginPath(); ctx.moveTo(bx+16,by-75); ctx.lineTo(bx+24,by-91); ctx.lineTo(bx+6,by-73); ctx.fill();
      // Eyes (blue like ocean)
      ctx.fillStyle="#0ea5e9"; ctx.beginPath(); ctx.ellipse(bx-9,by-60,5,6,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(bx+9,by-60,5,6,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#000"; ctx.beginPath(); ctx.arc(bx-9,by-60,2.5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(bx+9,by-60,2.5,0,Math.PI*2); ctx.fill();
      // Fish
      ctx.fillStyle="#FFD700";
      ctx.beginPath(); ctx.ellipse(bx+80,by-30,12,7,0.3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(bx+93,by-35); ctx.lineTo(bx+102,by-40); ctx.lineTo(bx+102,by-25); ctx.closePath(); ctx.fill();
      // Clouds
      ctx.fillStyle="rgba(255,255,255,0.9)";
      [[80,50],[200,30],[400,60]].forEach(([cx,cy])=>{
        [[-20,5,25],[0,0,30],[20,5,22]].forEach(([dx,dy,r])=>{
          ctx.beginPath(); ctx.arc(cx+dx,cy+dy,r,0,Math.PI*2); ctx.fill();
        });
      });
    }
  },
  {
    id: "autumn",
    label: "Autumn Cozy",
    preview: "🍂",
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Warm brown bg
      const bg = ctx.createLinearGradient(0,0,0,h);
      bg.addColorStop(0,"#78350f"); bg.addColorStop(1,"#451a03");
      ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
      // Falling leaves
      const leafColors=["#f97316","#dc2626","#d97706","#b45309","#fbbf24"];
      for(let i=0;i<30;i++){
        ctx.fillStyle=leafColors[i%5];
        ctx.beginPath();
        const lx=Math.random()*w, ly=Math.random()*h;
        ctx.ellipse(lx,ly,6+Math.random()*6,4+Math.random()*4,Math.random()*Math.PI,0,Math.PI*2);
        ctx.fill();
      }
      // Tree
      ctx.strokeStyle="#92400e"; ctx.lineWidth=12;
      ctx.beginPath(); ctx.moveTo(100,h); ctx.lineTo(100,h*0.4); ctx.stroke();
      ctx.lineWidth=6;
      [[100,h*0.4,40,h*0.2],[100,h*0.5,160,h*0.25],[100,h*0.6,60,h*0.45]].forEach(([x1,y1,x2,y2])=>{
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      });
      // Leaf canopy
      ["#dc2626","#f97316","#d97706"].forEach((c,i)=>{
        ctx.fillStyle=c;
        ctx.beginPath(); ctx.arc(80+i*20,h*0.18+i*15,50-i*5,0,Math.PI*2); ctx.fill();
      });
      // Cozy cat with scarf
      const cx=300, cy=260;
      ctx.fillStyle="#c2956c"; // ginger cat
      ctx.beginPath(); ctx.ellipse(cx,cy+30,60,46,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx,cy-10,38,0,Math.PI*2); ctx.fill();
      // Stripes
      ctx.strokeStyle="#a0714f"; ctx.lineWidth=3;
      [[cx-20,cy+15,cx+20,cy+13],[cx-22,cy+28,cx+22,cy+26],[cx-18,cy+41,cx+18,cy+39]].forEach(([x1,y1,x2,y2])=>{
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      });
      // Ears
      ctx.fillStyle="#c2956c";
      ctx.beginPath(); ctx.moveTo(cx-22,cy-44); ctx.lineTo(cx-34,cy-68); ctx.lineTo(cx-8,cy-42); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx+22,cy-44); ctx.lineTo(cx+34,cy-68); ctx.lineTo(cx+8,cy-42); ctx.fill();
      ctx.fillStyle="#f9a8d4";
      ctx.beginPath(); ctx.moveTo(cx-20,cy-43); ctx.lineTo(cx-29,cy-62); ctx.lineTo(cx-10,cy-41); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx+20,cy-43); ctx.lineTo(cx+29,cy-62); ctx.lineTo(cx+10,cy-41); ctx.fill();
      // Scarf
      ctx.fillStyle="#dc2626"; ctx.fillRect(cx-38,cy+8,76,18); ctx.fillRect(cx+30,cy+8,16,40);
      ctx.fillStyle="#f97316"; ctx.fillRect(cx-38,cy+11,76,6); ctx.fillRect(cx+30,cy+11,16,6);
      // Eyes
      ctx.fillStyle="#f59e0b"; ctx.beginPath(); ctx.ellipse(cx-12,cy-12,6,7,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+12,cy-12,6,7,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#000"; ctx.beginPath(); ctx.arc(cx-12,cy-12,3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+12,cy-12,3,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(cx-10,cy-14,1.5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+14,cy-14,1.5,0,Math.PI*2); ctx.fill();
      // Mug
      ctx.fillStyle="#7c3aed"; ctx.fillRect(cx+80,cy+10,30,24); ctx.fillStyle="#6d28d9"; ctx.fillRect(cx+80,cy+10,30,5);
      ctx.strokeStyle="#6d28d9"; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(cx+113,cy+22,10,Math.PI*0.3,Math.PI*1.7); ctx.stroke();
      // Steam
      ctx.strokeStyle="rgba(255,255,255,0.4)"; ctx.lineWidth=2;
      [cx+87,cx+94,cx+101].forEach(sx=>{ ctx.beginPath(); ctx.moveTo(sx,cy+8); ctx.quadraticCurveTo(sx-4,cy,sx,cy-10); ctx.stroke(); });
      // Ground leaves
      ctx.fillStyle="rgba(0,0,0,0.3)"; ctx.fillRect(0,h-60,w,60);
      leafColors.forEach((c,i)=>{
        ctx.fillStyle=c;
        ctx.beginPath(); ctx.ellipse(i*120+40,h-25,10,6,Math.random()*Math.PI,0,Math.PI*2); ctx.fill();
      });
    }
  },
  {
    id: "birthday",
    label: "Birthday Purr",
    preview: "🎂",
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Festive gradient
      const bg = ctx.createLinearGradient(0,0,w,h);
      bg.addColorStop(0,"#fdf4ff"); bg.addColorStop(0.5,"#fce7f3"); bg.addColorStop(1,"#ede9fe");
      ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
      // Confetti
      const confettiColors=["#f97316","#a78bfa","#34d399","#f472b6","#fbbf24","#60a5fa"];
      for(let i=0;i<60;i++){
        ctx.fillStyle=confettiColors[i%6];
        ctx.save(); ctx.translate(Math.random()*w,Math.random()*h); ctx.rotate(Math.random()*Math.PI);
        ctx.fillRect(-4,-2,8,4); ctx.restore();
      }
      // Streamers
      ["#f97316","#a78bfa","#f472b6"].forEach((c,i)=>{
        ctx.strokeStyle=c; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(i*200+100,0);
        for(let y=0;y<h;y+=20){ ctx.lineTo(i*200+100+Math.sin(y/20)*20,y); }
        ctx.stroke();
      });
      // Cake
      const cakex=w-140, cakey=h-80;
      ctx.fillStyle="#fde68a"; ctx.fillRect(cakex-45,cakey-50,90,50);
      ctx.fillStyle="#fca5a5"; ctx.fillRect(cakex-50,cakey-65,100,20);
      ctx.fillStyle="#c084fc"; ctx.fillRect(cakex-45,cakey-80,90,18);
      // Frosting drips
      ctx.fillStyle="#fff";
      [cakex-30,cakex-10,cakex+10,cakex+30].forEach(x=>{
        ctx.beginPath(); ctx.arc(x,cakey-60,6,0,Math.PI*2); ctx.fill();
        ctx.fillRect(x-4,cakey-60,8,12);
      });
      // Candles
      ["#f97316","#a78bfa","#34d399"].forEach((c,i)=>{
        const cx=cakex-25+i*25;
        ctx.fillStyle=c; ctx.fillRect(cx-3,cakey-96,6,16);
        // Flame
        ctx.fillStyle="#fbbf24"; ctx.shadowColor="#fbbf24"; ctx.shadowBlur=8;
        ctx.beginPath(); ctx.ellipse(cx,cakey-100,3,6,0,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0;
      });
      // Birthday cat
      const bx=180, by=270;
      ctx.fillStyle="#fde68a"; // golden cat
      ctx.beginPath(); ctx.ellipse(bx,by+30,55,42,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(bx,by-8,36,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#fca5a5"; // rosy cheeks
      ctx.beginPath(); ctx.arc(bx-18,by,8,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(bx+18,by,8,0,Math.PI*2); ctx.fill();
      // Party hat
      ctx.fillStyle="#a78bfa";
      ctx.beginPath(); ctx.moveTo(bx,by-56); ctx.lineTo(bx-22,by-10); ctx.lineTo(bx+22,by-10); ctx.closePath(); ctx.fill();
      ctx.fillStyle="#f97316"; ctx.fillRect(bx-22,by-12,44,5);
      ctx.fillStyle="#fbbf24"; ctx.beginPath(); ctx.arc(bx,by-58,5,0,Math.PI*2); ctx.fill();
      // Ears
      ctx.fillStyle="#fde68a";
      ctx.beginPath(); ctx.moveTo(bx-20,by-38); ctx.lineTo(bx-32,by-60); ctx.lineTo(bx-8,by-36); ctx.fill();
      ctx.beginPath(); ctx.moveTo(bx+20,by-38); ctx.lineTo(bx+32,by-60); ctx.lineTo(bx+8,by-36); ctx.fill();
      ctx.fillStyle="#fca5a5";
      ctx.beginPath(); ctx.moveTo(bx-18,by-37); ctx.lineTo(bx-27,by-54); ctx.lineTo(bx-10,by-35); ctx.fill();
      ctx.beginPath(); ctx.moveTo(bx+18,by-37); ctx.lineTo(bx+27,by-54); ctx.lineTo(bx+10,by-35); ctx.fill();
      // Happy eyes (curved)
      ctx.strokeStyle="#92400e"; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.arc(bx-11,by-12,6,Math.PI,0); ctx.stroke();
      ctx.beginPath(); ctx.arc(bx+11,by-12,6,Math.PI,0); ctx.stroke();
      // Big smile
      ctx.beginPath(); ctx.arc(bx,by,12,0.1,Math.PI-0.1); ctx.stroke();
      // Text
      ctx.font="bold 24px Georgia";
      ctx.fillStyle="#7c3aed"; ctx.shadowColor="#a78bfa"; ctx.shadowBlur=10;
      ctx.textAlign="center"; ctx.fillText("Happy Birthday!", w/2, 45); ctx.shadowBlur=0; ctx.textAlign="left";
    }
  },
  {
    id: "winter",
    label: "Winter Cat",
    preview: "❄️",
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Night winter sky
      const sky = ctx.createLinearGradient(0,0,0,h*0.6);
      sky.addColorStop(0,"#0c1445"); sky.addColorStop(1,"#1e3a5f");
      ctx.fillStyle=sky; ctx.fillRect(0,0,w,h*0.6);
      // Snowy ground
      const snow=ctx.createLinearGradient(0,h*0.6,0,h);
      snow.addColorStop(0,"#e0f2fe"); snow.addColorStop(1,"#bae6fd");
      ctx.fillStyle=snow; ctx.fillRect(0,h*0.6,w,h*0.4);
      // Stars
      ctx.fillStyle="#fff";
      for(let i=0;i<40;i++){ ctx.beginPath(); ctx.arc(Math.random()*w,Math.random()*h*0.5,Math.random()*1.5+0.5,0,Math.PI*2); ctx.fill(); }
      // Northern lights
      const aurora=ctx.createLinearGradient(0,50,0,h*0.5);
      aurora.addColorStop(0,"rgba(34,197,94,0.3)"); aurora.addColorStop(0.5,"rgba(96,165,250,0.2)"); aurora.addColorStop(1,"transparent");
      ctx.fillStyle=aurora; ctx.fillRect(0,0,w,h*0.5);
      // Snowflakes
      ctx.fillStyle="rgba(255,255,255,0.8)";
      for(let i=0;i<25;i++){ ctx.beginPath(); ctx.arc(Math.random()*w,Math.random()*h,Math.random()*3+1,0,Math.PI*2); ctx.fill(); }
      // Snow hills
      ctx.fillStyle="#e0f2fe";
      ctx.beginPath(); ctx.moveTo(0,h*0.6); ctx.quadraticCurveTo(150,h*0.48,300,h*0.6); ctx.quadraticCurveTo(450,h*0.52,w,h*0.6); ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath(); ctx.fill();
      // Cat bundled in snow gear
      const cx=w/2, cy=280;
      ctx.fillStyle="#9ca3af"; // gray winter cat
      ctx.beginPath(); ctx.ellipse(cx,cy+30,58,44,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx,cy-8,36,0,Math.PI*2); ctx.fill();
      // Winter hat
      ctx.fillStyle="#1e40af"; ctx.beginPath(); ctx.ellipse(cx,cy-38,30,8,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#1e40af"; ctx.fillRect(cx-22,cy-82,44,46);
      ctx.fillStyle="#dbeafe"; ctx.fillRect(cx-24,cy-60,48,6); // stripe
      ctx.fillStyle="#f1f5f9"; ctx.beginPath(); ctx.arc(cx,cy-84,10,0,Math.PI*2); ctx.fill(); // pom
      // Ears (peeking from hat)
      ctx.fillStyle="#9ca3af";
      ctx.beginPath(); ctx.moveTo(cx-18,cy-40); ctx.lineTo(cx-28,cy-60); ctx.lineTo(cx-8,cy-38); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx+18,cy-40); ctx.lineTo(cx+28,cy-60); ctx.lineTo(cx+8,cy-38); ctx.fill();
      // Scarf
      ctx.fillStyle="#dc2626"; ctx.fillRect(cx-42,cy+5,84,16); ctx.fillRect(cx+30,cy+5,18,36);
      ctx.fillStyle="#fca5a5"; ctx.fillRect(cx-42,cy+8,84,5); ctx.fillRect(cx+30,cy+8,18,5);
      // Eyes
      ctx.fillStyle="#60a5fa"; ctx.beginPath(); ctx.ellipse(cx-11,cy-12,5.5,7,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+11,cy-12,5.5,7,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#000"; ctx.beginPath(); ctx.arc(cx-11,cy-12,2.5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+11,cy-12,2.5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(cx-9,cy-14,1.5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+13,cy-14,1.5,0,Math.PI*2); ctx.fill();
      // Snow on ground
      ctx.fillStyle="#f0f9ff"; ctx.fillRect(0,h-30,w,30);
    }
  },
  {
    id: "space",
    label: "Astro Cat",
    preview: "🚀",
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.fillStyle="#000010"; ctx.fillRect(0,0,w,h);
      // Stars
      for(let i=0;i<150;i++){
        const x=Math.random()*w, y=Math.random()*h;
        const r=Math.random()*1.8;
        ctx.fillStyle=`rgba(255,255,255,${Math.random()*0.9+0.1})`;
        ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      }
      // Colorful nebula clouds
      [[80,80,"rgba(139,92,246,0.12)"],[400,200,"rgba(236,72,153,0.1)"],[200,300,"rgba(16,185,129,0.08)"]].forEach(([nx,ny,nc])=>{
        const g=ctx.createRadialGradient(nx as number,ny as number,0,nx as number,ny as number,120);
        g.addColorStop(0,nc as string); g.addColorStop(1,"transparent");
        ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
      });
      // Planet
      const pg=ctx.createRadialGradient(420,80,0,420,80,60);
      pg.addColorStop(0,"#f97316"); pg.addColorStop(0.7,"#c2410c"); pg.addColorStop(1,"#7c2d12");
      ctx.fillStyle=pg; ctx.shadowColor="#f97316"; ctx.shadowBlur=20;
      ctx.beginPath(); ctx.arc(420,80,60,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;
      // Planet ring
      ctx.strokeStyle="rgba(251,191,36,0.5)"; ctx.lineWidth=8;
      ctx.beginPath(); ctx.ellipse(420,80,85,22,-0.2,0,Math.PI*2); ctx.stroke();
      // Cat astronaut
      const cx=220, cy=220;
      // Space suit body (white)
      ctx.fillStyle="#e5e7eb";
      ctx.beginPath(); ctx.ellipse(cx,cy+35,65,50,0,0,Math.PI*2); ctx.fill();
      // Helmet (glass dome)
      ctx.fillStyle="rgba(147,197,253,0.3)";
      ctx.strokeStyle="#93c5fd"; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(cx,cy-10,52,0,Math.PI*2); ctx.fill(); ctx.stroke();
      // Cat inside helmet
      ctx.fillStyle="#f3f4f6";
      ctx.beginPath(); ctx.arc(cx,cy-10,36,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx-20,cy-40); ctx.lineTo(cx-30,cy-62); ctx.lineTo(cx-8,cy-38); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx+20,cy-40); ctx.lineTo(cx+30,cy-62); ctx.lineTo(cx+8,cy-38); ctx.fill();
      // Eyes
      ctx.fillStyle="#a78bfa"; ctx.beginPath(); ctx.ellipse(cx-11,cy-14,6,8,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+11,cy-14,6,8,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#000"; ctx.beginPath(); ctx.arc(cx-11,cy-14,3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+11,cy-14,3,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(cx-9,cy-16,1.5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+13,cy-16,1.5,0,Math.PI*2); ctx.fill();
      // Suit details
      ctx.fillStyle="#3b82f6"; ctx.fillRect(cx-20,cy+20,40,12); // chest panel
      ctx.fillStyle="#f97316"; ctx.beginPath(); ctx.arc(cx-10,cy+26,3,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#34d399"; ctx.beginPath(); ctx.arc(cx,cy+26,3,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#f472b6"; ctx.beginPath(); ctx.arc(cx+10,cy+26,3,0,Math.PI*2); ctx.fill();
      // Jetpack
      ctx.fillStyle="#6b7280"; ctx.fillRect(cx+55,cy,20,40); ctx.fillRect(cx+55,cy+30,25,10);
      ctx.fillStyle="#f97316"; ctx.shadowColor="#f97316"; ctx.shadowBlur=15;
      ctx.beginPath(); ctx.ellipse(cx+67,cy+45,5,10,0,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
      // Flag
      ctx.strokeStyle="#9ca3af"; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(cx-70,cy+30); ctx.lineTo(cx-70,cy-10); ctx.stroke();
      ctx.fillStyle="#f97316"; ctx.fillRect(cx-70,cy-10,30,15);
      ctx.font="bold 8px monospace"; ctx.fillStyle="#fff"; ctx.fillText("MEOW",cx-68,cy);
    }
  },
  {
    id: "vintage",
    label: "Vintage Post",
    preview: "📮",
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Aged paper
      const paper=ctx.createLinearGradient(0,0,w,h);
      paper.addColorStop(0,"#fef9f0"); paper.addColorStop(0.3,"#fdf3e0"); paper.addColorStop(0.7,"#fbeed4"); paper.addColorStop(1,"#f5e0b5");
      ctx.fillStyle=paper; ctx.fillRect(0,0,w,h);
      // Noise/grain texture
      ctx.fillStyle="rgba(139,90,43,0.04)";
      for(let i=0;i<800;i++){
        ctx.fillRect(Math.random()*w,Math.random()*h,Math.random()*2,Math.random()*2);
      }
      // Postcard border
      ctx.strokeStyle="#8B5E3C"; ctx.lineWidth=3;
      ctx.strokeRect(15,15,w-30,h-30);
      ctx.strokeStyle="#D4A96A"; ctx.lineWidth=1;
      ctx.strokeRect(22,22,w-44,h-44);
      // Corner flourishes
      [16,16,w-16,16,w-16,h-16,16,h-16].forEach((_,i,arr)=>{
        if(i%2===0){
          ctx.strokeStyle="#8B5E3C"; ctx.lineWidth=1.5;
          ctx.beginPath(); ctx.arc(arr[i],arr[i+1],8,0,Math.PI*2); ctx.stroke();
        }
      });
      // Stamp area (top right)
      ctx.strokeStyle="#8B5E3C"; ctx.lineWidth=1.5; ctx.setLineDash([3,2]);
      ctx.strokeRect(w-85,25,65,55); ctx.setLineDash([]);
      ctx.fillStyle="#c2410c"; ctx.fillRect(w-82,28,59,49);
      ctx.fillStyle="#fff"; ctx.font="bold 8px monospace"; ctx.textAlign="center";
      ctx.fillText("PURR",w-52,50); ctx.fillText("PEDIA",w-52,60);
      ctx.fillText("🐱",w-52,45); ctx.textAlign="left";
      // Address lines
      ctx.strokeStyle="#8B5E3C"; ctx.lineWidth=1;
      [200,220,240].forEach(y=>{ ctx.beginPath(); ctx.moveTo(w-170,y); ctx.lineTo(w-28,y); ctx.stroke(); });
      // Postmark circle
      ctx.strokeStyle="#8B5E3C"; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.arc(w-120,170,25,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(w-120,170,20,0,Math.PI*2); ctx.stroke();
      ctx.font="6px monospace"; ctx.fillStyle="#8B5E3C"; ctx.textAlign="center";
      ctx.fillText("JUNE 2026",w-120,172); ctx.textAlign="left";
      // Victorian cat illustration
      ctx.fillStyle="#5c3317"; // sepia cat
      ctx.beginPath(); ctx.ellipse(160,270,70,55,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(160,210,46,0,Math.PI*2); ctx.fill();
      // Bow tie
      ctx.fillStyle="#8B0000";
      ctx.beginPath(); ctx.moveTo(140,238); ctx.lineTo(152,245); ctx.lineTo(140,252); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(180,238); ctx.lineTo(168,245); ctx.lineTo(180,252); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(160,245,5,0,Math.PI*2); ctx.fill();
      // Monocle
      ctx.strokeStyle="#DAA520"; ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(148,207,14,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(162,207); ctx.lineTo(172,218); ctx.stroke();
      // Ears
      ctx.fillStyle="#5c3317";
      ctx.beginPath(); ctx.moveTo(128,182); ctx.lineTo(116,154); ctx.lineTo(144,174); ctx.fill();
      ctx.beginPath(); ctx.moveTo(192,182); ctx.lineTo(204,154); ctx.lineTo(176,174); ctx.fill();
      ctx.fillStyle="#8B4513";
      ctx.beginPath(); ctx.moveTo(130,181); ctx.lineTo(120,158); ctx.lineTo(142,173); ctx.fill();
      ctx.beginPath(); ctx.moveTo(190,181); ctx.lineTo(200,158); ctx.lineTo(178,173); ctx.fill();
      // Eyes — distinguished
      ctx.fillStyle="#4a7c59"; ctx.beginPath(); ctx.ellipse(148,208,6,7,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#2f5540"; ctx.beginPath(); ctx.ellipse(174,208,7,8,0.1,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#000"; ctx.beginPath(); ctx.arc(148,208,3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(174,208,3.5,0,Math.PI*2); ctx.fill();
      // Moustache
      ctx.strokeStyle="#3d1f0a"; ctx.lineWidth=1.5;
      [[130,222,148,220],[164,220,178,223]].forEach(([x1,y1,x2,y2])=>{ ctx.beginPath(); ctx.moveTo(x1,y1); ctx.quadraticCurveTo((x1+x2)/2,y1-5,x2,y2); ctx.stroke(); });
      // Title
      ctx.font="italic bold 16px Georgia"; ctx.fillStyle="#5c3317"; ctx.textAlign="center";
      ctx.fillText("Greetings & Purrs", w/2, 50); ctx.textAlign="left";
      ctx.font="10px Georgia"; ctx.fillStyle="#8B5E3C"; ctx.textAlign="center";
      ctx.fillText("— A Feline Correspondence —", w/2, 68); ctx.textAlign="left";
    }
  },
  {
    id: "minecraft",
    label: "Pixel Cat",
    preview: "🟦",
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const P=20; // pixel size
      // Sky
      for(let x=0;x<w;x+=P) for(let y=0;y<h*0.6;y+=P){
        ctx.fillStyle=`rgb(${100+Math.random()*10},${160+Math.random()*10},${220+Math.random()*10})`;
        ctx.fillRect(x,y,P,P);
      }
      // Ground
      for(let x=0;x<w;x+=P) for(let y=h*0.6;y<h;y+=P){
        const g=y<h*0.65?`rgb(${80+Math.random()*20},${150+Math.random()*20},${60+Math.random()*10})`:
                y<h*0.7?`rgb(${100+Math.random()*20},${70+Math.random()*20},${40+Math.random()*10})`:
                `rgb(${120+Math.random()*20},${100+Math.random()*20},${80+Math.random()*10})`;
        ctx.fillStyle=g; ctx.fillRect(x,y,P,P);
      }
      // Clouds (pixel)
      const drawCloud=(cx: number,cy: number)=>{
        [[0,0],[1,0],[2,0],[3,0],[-1,1],[0,1],[1,1],[2,1],[3,1],[4,1],[0,2],[1,2],[2,2],[3,2]].forEach(([dx,dy])=>{
          ctx.fillStyle="#f0f0f0"; ctx.fillRect(cx+dx*P,cy+dy*P,P,P);
        });
      };
      drawCloud(60,40); drawCloud(320,20);
      // Pixel cat body (ocelot style)
      const catColors:{[k:string]:string}={
        B:"#e8a030", // orange body
        S:"#5c3a00", // spots/stripes
        W:"#fff8ee", // white belly
        E:"#1a8c1a", // green eyes
        N:"#ff8080", // nose
        ".": "transparent"
      };
      const grid=[
        "..SSS.SS..",
        ".BBBBBBBBB",
        "SBBBWWBBBS",
        "SBBBWWBBBS",
        ".BNEENBBB.",
        "..BBBBBBB.",
        "..BSSSBBB.",
        "...BBBBB..",
        "....BBB...",
      ];
      const gx=140, gy=100;
      grid.forEach((row,ry)=>{
        row.split("").forEach((cell,rx)=>{
          if(cell===".") return;
          ctx.fillStyle=catColors[cell]||"#e8a030";
          ctx.fillRect(gx+rx*P,gy+ry*P,P,P);
          ctx.fillStyle="rgba(0,0,0,0.15)";
          ctx.fillRect(gx+rx*P+P-2,gy+ry*P+P-2,2,2);
        });
      });
      // Grass pixels
      for(let x=0;x<w;x+=P){
        ctx.fillStyle="#4a7c30"; ctx.fillRect(x,Math.floor(h*0.6/P)*P,P,P);
      }
    }
  },
];

const STICKERS = ["🐱","🐾","😸","😻","🙀","😹","🐈","🐈‍⬛","❤️","⭐","🌙","🌸","✨","🎀","🍀","🎵","🌈","💜","🔮","🌟"];

const FONTS = [
  { label: "Sans", value: "system-ui, sans-serif" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Mono", value: "monospace" },
  { label: "Display", value: "Impact, sans-serif" },
  { label: "Cursive", value: "cursive" },
];

interface Layer {
  id: number;
  type: "text" | "sticker";
  content: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily?: string;
  bold?: boolean;
  italic?: boolean;
  dragging?: boolean;
}

export default function PostcardEditor() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [newText, setNewText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textFont, setTextFont] = useState(FONTS[0].value);
  const [textBold, setTextBold] = useState(false);
  const [textItalic, setTextItalic] = useState(false);
  const dragRef = useRef<{id: number; offsetX: number; offsetY: number} | null>(null);

  const W = 560, H = 360;

  // Draw everything
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    template.draw(ctx, W, H);
    layers.forEach(layer => {
      ctx.save();
      if (layer.id === selectedId) {
        ctx.shadowColor = "rgba(249,115,22,0.8)";
        ctx.shadowBlur = 8;
      }
      const weight = layer.bold ? "bold " : "";
      const style = layer.italic ? "italic " : "";
      const family = layer.fontFamily ?? "system-ui, sans-serif";
      ctx.font = `${style}${weight}${layer.fontSize}px ${family}`;
      ctx.fillStyle = layer.color;
      ctx.fillText(layer.content, layer.x, layer.y);
      if (layer.id === selectedId) {
        const m = ctx.measureText(layer.content);
        ctx.strokeStyle = "#F97316";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(layer.x - 4, layer.y - layer.fontSize, m.width + 8, layer.fontSize + 8);
        ctx.setLineDash([]);
      }
      ctx.restore();
    });
  }, [template, layers, selectedId]);

  useEffect(() => { redraw(); }, [redraw]);

  const addSticker = (emoji: string) => {
    setLayers(l => [...l, { id: Date.now(), type: "sticker", content: emoji, x: 120 + Math.random()*200, y: 160 + Math.random()*80, fontSize: 36, color: "#000" }]);
  };

  const addText = () => {
    if (!newText.trim()) return;
    setLayers(l => [...l, { id: Date.now(), type: "text", content: newText, x: 40, y: 310, fontSize: 20, color: textColor, fontFamily: textFont, bold: textBold, italic: textItalic }]);
    setNewText(""); setShowTextInput(false);
  };

  const deleteSelected = () => {
    if (selectedId == null) return;
    setLayers(l => l.filter(x => x.id !== selectedId));
    setSelectedId(null);
  };

  // Mouse drag
  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current!.getBoundingClientRect();
    const scaleX = W / r.width, scaleY = H / r.height;
    return { x: (e.clientX - r.left) * scaleX, y: (e.clientY - r.top) * scaleY };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getPos(e);
    const ctx = canvasRef.current!.getContext("2d")!;
    const hit = [...layers].reverse().find(l => {
      const w2 = l.bold ? "bold " : ""; const s2 = l.italic ? "italic " : "";
      ctx.font = `${s2}${w2}${l.fontSize}px ${l.fontFamily ?? "system-ui"}`;
      const m = ctx.measureText(l.content);
      return x >= l.x-4 && x <= l.x+m.width+8 && y >= l.y-l.fontSize && y <= l.y+8;
    });
    if (hit) {
      setSelectedId(hit.id);
      dragRef.current = { id: hit.id, offsetX: x - hit.x, offsetY: y - hit.y };
    } else { setSelectedId(null); }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragRef.current) return;
    const { x, y } = getPos(e);
    setLayers(l => l.map(layer => layer.id === dragRef.current!.id
      ? { ...layer, x: x - dragRef.current!.offsetX, y: y - dragRef.current!.offsetY }
      : layer
    ));
  };

  const onMouseUp = () => { dragRef.current = null; };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasData = { templateId: template.id, layers };
    const res = await fetch("/api/postcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientEmail, recipientName: recipientName || undefined,
        message, templateId: template.id, canvasData,
        scheduledFor: new Date(scheduledFor).toISOString(),
      }),
    });
    if (res.ok) { router.push("/dashboard"); }
    else {
      const d = await res.json();
      setError(d.error ?? "Something went wrong.");
      setLoading(false);
    }
  }

  const selected = layers.find(l => l.id === selectedId);
  const minDateTime = new Date(Date.now() + 5*60_000).toISOString().slice(0,16);

  return (
    <main className="min-h-screen bg-[#08070A]">
      <MobileNav backHref="/dashboard" backLabel="Dashboard" />

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <p className="text-xs font-mono tracking-widest uppercase text-[#F97316] mb-1">Purr Postcards</p>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight">Design your Purr</h1>
          <p className="text-[#6B7280] text-sm mt-1">Pick a template, personalise it, schedule the delivery.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-4 sm:gap-6">
          {/* Canvas column */}
          <div className="space-y-3 sm:space-y-4">
            {/* Template row — horizontal scroll on mobile */}
            <div>
              <p className="text-xs font-mono tracking-widest uppercase text-[#6B7280] mb-2">Template</p>
              <div className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-x-visible">
                {TEMPLATES.map(t => (
                  <button key={t.id} onClick={() => { setTemplate(t); setSelectedId(null); }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-all shrink-0 ${
                      template.id === t.id ? "border-[#F97316] bg-[#F97316]/10 text-[#F97316]" : "border-[#1F1B2E] bg-[#13111A] text-[#6B7280] hover:border-[#6B7280]"
                    }`}>
                    {t.preview} <span className="hidden sm:inline">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas — scales to full width */}
            <div className="rounded-2xl overflow-hidden border border-[#1F1B2E] shadow-2xl w-full">
              <canvas
                ref={canvasRef} width={W} height={H}
                className="w-full cursor-crosshair block"
                style={{ touchAction: "none" }}
                onMouseDown={onMouseDown} onMouseMove={onMouseMove}
                onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
              />
            </div>

            {/* Layer tools */}
            <div className="bg-[#13111A] border border-[#1F1B2E] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-mono tracking-widest uppercase text-[#6B7280]">Add to card</p>
                {selectedId != null && (
                  <button onClick={deleteSelected} className="text-xs text-red-400 hover:text-red-300 font-mono transition-colors">
                    Delete selected ✕
                  </button>
                )}
              </div>

              {/* Text tool */}
              {showTextInput ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input value={newText} onChange={e=>setNewText(e.target.value)}
                      placeholder="Type your text..."
                      className="flex-1 bg-[#08070A] border border-[#1F1B2E] rounded-lg px-3 py-2 text-sm text-[#FAF9F7] placeholder-[#6B7280] outline-none focus:border-[#F97316]"
                      onKeyDown={e=>e.key==="Enter"&&addText()} autoFocus />
                    <button onClick={addText} className="bg-[#F97316] text-[#08070A] font-bold px-3 py-2 rounded-lg text-sm hover:bg-[#ea6a0f] shrink-0">Add</button>
                    <button onClick={()=>{setShowTextInput(false);setNewText("")}} className="text-[#6B7280] px-2 hover:text-white shrink-0">✕</button>
                  </div>
                  {/* Style controls */}
                  <div className="flex flex-wrap gap-2 items-center">
                    {/* Color */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-[#6B7280] font-mono">Color</span>
                      <input type="color" value={textColor} onChange={e=>setTextColor(e.target.value)}
                        className="w-8 h-7 rounded cursor-pointer border border-[#1F1B2E] bg-transparent" />
                    </div>
                    {/* Font */}
                    <select value={textFont} onChange={e=>setTextFont(e.target.value)}
                      className="bg-[#08070A] border border-[#1F1B2E] text-[#FAF9F7] text-xs rounded px-2 py-1.5 outline-none focus:border-[#F97316]">
                      {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                    {/* Bold */}
                    <button onClick={()=>setTextBold(b=>!b)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded border transition-all ${textBold ? "border-[#F97316] bg-[#F97316]/10 text-[#F97316]" : "border-[#1F1B2E] text-[#6B7280] hover:border-[#6B7280]"}`}>
                      B
                    </button>
                    {/* Italic */}
                    <button onClick={()=>setTextItalic(b=>!b)}
                      className={`text-xs italic px-2.5 py-1.5 rounded border transition-all ${textItalic ? "border-[#F97316] bg-[#F97316]/10 text-[#F97316]" : "border-[#1F1B2E] text-[#6B7280] hover:border-[#6B7280]"}`}>
                      I
                    </button>
                  </div>
                  {/* Preview */}
                  {newText && (
                    <p className="text-xs px-2 py-1 bg-[#08070A] rounded border border-[#1F1B2E] truncate"
                      style={{ color: textColor, fontFamily: textFont, fontWeight: textBold ? "bold" : "normal", fontStyle: textItalic ? "italic" : "normal" }}>
                      {newText}
                    </p>
                  )}
                </div>
              ) : (
                <button onClick={()=>setShowTextInput(true)}
                  className="flex items-center gap-2 text-sm text-[#FAF9F7] bg-[#1C1928] border border-[#1F1B2E] px-4 py-2 rounded-lg hover:border-[#F97316] transition-colors">
                  <span>✏️</span> Add Text
                </button>
              )}

              {/* Stickers */}
              <div>
                <p className="text-xs text-[#6B7280] font-mono mb-2">STICKERS</p>
                <div className="flex flex-wrap gap-1.5">
                  {STICKERS.map(s => (
                    <button key={s} onClick={()=>addSticker(s)}
                      className="w-9 h-9 text-lg bg-[#08070A] rounded-lg border border-[#1F1B2E] hover:border-[#F97316] transition-all flex items-center justify-center hover:scale-110">
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resize selected */}
              {selected && (
                <div className="space-y-2 pt-2 border-t border-[#1F1B2E]">
                  <p className="text-xs text-[#6B7280] font-mono uppercase tracking-wider">Edit Selected</p>
                  {/* Size */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#6B7280] font-mono w-8">Size</span>
                    <input type="range" min="12" max="80" value={selected.fontSize}
                      onChange={e => setLayers(l => l.map(x => x.id===selectedId ? {...x,fontSize:+e.target.value} : x))}
                      className="flex-1 accent-[#F97316]" />
                    <span className="text-xs text-[#6B7280] font-mono w-8 text-right">{selected.fontSize}px</span>
                  </div>
                  {selected.type === "text" && (
                    <>
                      {/* Color */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-[#6B7280] font-mono">Color</span>
                        <input type="color" value={selected.color}
                          onChange={e => setLayers(l => l.map(x => x.id===selectedId ? {...x,color:e.target.value} : x))}
                          className="w-8 h-6 rounded cursor-pointer border border-[#1F1B2E] bg-transparent" />
                        {/* Quick colors */}
                        {["#ffffff","#FFD700","#FF6B6B","#4ECDC4","#F97316","#A78BFA","#000000"].map(c => (
                          <button key={c} onClick={() => setLayers(l => l.map(x => x.id===selectedId ? {...x,color:c} : x))}
                            className="w-5 h-5 rounded-full border-2 transition-all shrink-0"
                            style={{ background: c, borderColor: selected.color===c ? "#F97316" : "transparent" }} />
                        ))}
                      </div>
                      {/* Font + Bold + Italic */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <select value={selected.fontFamily ?? FONTS[0].value}
                          onChange={e => setLayers(l => l.map(x => x.id===selectedId ? {...x,fontFamily:e.target.value} : x))}
                          className="bg-[#08070A] border border-[#1F1B2E] text-[#FAF9F7] text-xs rounded px-2 py-1 outline-none focus:border-[#F97316]">
                          {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </select>
                        <button onClick={() => setLayers(l => l.map(x => x.id===selectedId ? {...x,bold:!x.bold} : x))}
                          className={`text-xs font-bold px-2 py-1 rounded border transition-all ${selected.bold ? "border-[#F97316] text-[#F97316] bg-[#F97316]/10" : "border-[#1F1B2E] text-[#6B7280]"}`}>B</button>
                        <button onClick={() => setLayers(l => l.map(x => x.id===selectedId ? {...x,italic:!x.italic} : x))}
                          className={`text-xs italic px-2 py-1 rounded border transition-all ${selected.italic ? "border-[#F97316] text-[#F97316] bg-[#F97316]/10" : "border-[#1F1B2E] text-[#6B7280]"}`}>I</button>
                      </div>
                    </>
                  )}
                </div>
              )}

              <p className="text-xs text-[#6B7280] font-mono">Click layer to select · Drag to move · Delete to remove</p>
            </div>
          </div>

          {/* Form column */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#13111A] border border-[#1F1B2E] rounded-2xl p-5 space-y-4">
              <h2 className="font-display text-lg font-bold text-[#FAF9F7]">Delivery details</h2>

              <div>
                <label className="block text-xs font-mono tracking-widest uppercase text-[#6B7280] mb-1.5">Recipient email *</label>
                <input type="email" required value={recipientEmail} onChange={e=>setRecipientEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="w-full bg-[#08070A] border border-[#1F1B2E] rounded-lg px-3 py-2.5 text-sm text-[#FAF9F7] placeholder-[#6B7280] outline-none focus:border-[#F97316] transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-mono tracking-widest uppercase text-[#6B7280] mb-1.5">Their name</label>
                <input type="text" value={recipientName} onChange={e=>setRecipientName(e.target.value)}
                  placeholder="Alex"
                  className="w-full bg-[#08070A] border border-[#1F1B2E] rounded-lg px-3 py-2.5 text-sm text-[#FAF9F7] placeholder-[#6B7280] outline-none focus:border-[#F97316] transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-mono tracking-widest uppercase text-[#6B7280] mb-1.5">Your message *</label>
                <textarea required value={message} onChange={e=>setMessage(e.target.value)}
                  placeholder="Hey! Sending you some cat love 🐾"
                  rows={3} maxLength={500}
                  className="w-full bg-[#08070A] border border-[#1F1B2E] rounded-lg px-3 py-2.5 text-sm text-[#FAF9F7] placeholder-[#6B7280] outline-none focus:border-[#F97316] transition-colors resize-none" />
                <p className="text-xs text-[#6B7280] font-mono text-right mt-0.5">{message.length}/500</p>
              </div>

              <div>
                <label className="block text-xs font-mono tracking-widest uppercase text-[#6B7280] mb-1.5">Schedule delivery *</label>
                <input type="datetime-local" required value={scheduledFor} min={minDateTime}
                  onChange={e=>setScheduledFor(e.target.value)}
                  className="w-full bg-[#08070A] border border-[#1F1B2E] rounded-lg px-3 py-2.5 text-sm text-[#FAF9F7] outline-none focus:border-[#F97316] transition-colors" />
                <p className="text-xs text-[#6B7280] font-mono mt-1">Powered by Temporal — arrives even if server restarts</p>
              </div>

              {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full bg-[#F97316] text-[#08070A] font-black py-3 rounded-xl hover:bg-[#ea6a0f] transition-colors disabled:opacity-50 text-sm">
                {loading ? "Scheduling..." : "Schedule Purr 🐾"}
              </button>
            </div>

            {/* Preview hint */}
            <div className="bg-[#13111A] border border-[#1F1B2E] rounded-xl p-4">
              <p className="text-xs font-mono tracking-widest uppercase text-[#6B7280] mb-1">Limit</p>
              <p className="text-sm text-[#FAF9F7]">5 Purrs per day per user</p>
              <p className="text-xs text-[#6B7280] mt-1">To protect our email sender reputation.</p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
