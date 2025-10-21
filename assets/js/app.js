/* Particle field + tilt + cursor */
const canvas = document.getElementById('field');
const ctx = canvas.getContext('2d', { alpha: true });
let particles = [];
let w=0,h=0,raf,mouse={x:0,y:0};

function resize(){
  w = canvas.width = innerWidth * devicePixelRatio;
  h = canvas.height = (document.querySelector('.hero').offsetHeight) * devicePixelRatio;
  particles = Array.from({length: Math.min(140, Math.floor(w/20))}, () => ({
    x: Math.random()*w,
    y: Math.random()*h,
    vx: (Math.random()-.5)*0.2,
    vy: (Math.random()-.5)*0.2,
    r: 0.7 + Math.random()*1.3
  }));
}
addEventListener('resize', resize); resize();

function step(){
  ctx.clearRect(0,0,w,h);
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  for(const p of particles){
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>w) p.vx*=-1;
    if(p.y<0||p.y>h) p.vy*=-1;
    const dx=(p.x - mouse.x*devicePixelRatio);
    const dy=(p.y - mouse.y*devicePixelRatio);
    const d = Math.hypot(dx,dy);
    const pull = Math.max(0, 120 - d)/120;
    p.x += dx/d * (-pull*0.6);
    p.y += dy/d * (-pull*0.6);
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
  }
  raf = requestAnimationFrame(step);
}
raf = requestAnimationFrame(step);

// Tilt cards
for(const el of document.querySelectorAll('.tilt')){
  el.addEventListener('pointermove', e=>{
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - .5;
    const y = (e.clientY - r.top)/r.height - .5;
    el.style.transform = `rotateX(${ -y*6 }deg) rotateY(${ x*8 }deg) translateY(-4px)`;
  });
  el.addEventListener('pointerleave', ()=>{ el.style.transform='translateY(0)'; });
}

// Cursor
const cursor = document.getElementById('cursor');
addEventListener('pointermove', e=>{
  mouse.x = e.clientX; mouse.y = e.clientY;
  cursor.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
});

// Open quiz
document.querySelectorAll('[data-start]').forEach(b=>{
  b.addEventListener('click', ()=>document.querySelector('#quiz').classList.remove('hidden'));
});
// Close quiz
document.querySelector('[data-close]').addEventListener('click', ()=>{
  document.querySelector('#quiz').classList.add('hidden');
});

gsap.from('.card',{opacity:0,y:40,duration:0.6,stagger:0.15,scrollTrigger:'.cards'});
gsap.from('.hero-content',{opacity:0,y:-20,duration:0.8});
