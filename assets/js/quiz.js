/* Minimal 3-step quiz + gift code + redirect */
const form = document.getElementById('quizForm');
const steps = [...form.querySelectorAll('.step')];
let i = 0;

function show(k){
  steps.forEach((s,idx)=>s.classList.toggle('active', idx===k));
  form.querySelector('[data-prev]').disabled = k===0;
  form.querySelector('[data-next]').classList.toggle('hidden', k===steps.length-1);
  document.getElementById('finishBtn').classList.toggle('hidden', k!==steps.length-1);
}

form.querySelector('[data-prev]').addEventListener('click', ()=>{ if(i>0){i--; show(i);} });
form.querySelector('[data-next]').addEventListener('click', ()=>{
  // require one checked input in current step
  const checked = steps[i].querySelector('input:checked');
  if(!checked){ steps[i].animate([{transform:'scale(1.02)'},{transform:'scale(1)'}],{duration:160}); return; }
  if(i<steps.length-1){ i++; show(i); }
});
show(0);

form.addEventListener('submit', e=>{
  e.preventDefault();
  // simple reservation code
  const data = Object.fromEntries(new FormData(form).entries());
  const seed = JSON.stringify(data) + Date.now().toString(36);
  const code = [...crypto.getRandomValues(new Uint8Array(6))].map(n=>('0'+(n%36).toString(36)).slice(-1).toUpperCase()).join('');
  localStorage.setItem('hp_gift', JSON.stringify({code, ts: Date.now(), data}));
  document.getElementById('claimCode').textContent = code;
  document.getElementById('goSite').href = 'https://happypark.example'; // замените на реальный сайт
  document.getElementById('claim').classList.remove('hidden');
  document.getElementById('quiz').classList.add('hidden');
});
