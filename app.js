if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').catch(()=>{});
}

function toNumber(v){ v = parseFloat(v); return isFinite(v) ? v : 0; }
const density = document.getElementById('density');
const lengthInput = document.getElementById('length');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const qty = document.getElementById('qty');
const foil = document.getElementById('foil');
const kgPerUnit = document.getElementById('kgPerUnit');
const totalKg = document.getElementById('totalKg');
const color = document.getElementById('color');
const calcBtn = document.getElementById('calcBtn');
const exportBtn = document.getElementById('exportBtn');

function calc() {
  const d = toNumber(density.value);
  const l = toNumber(lengthInput.value) / 1000;
  const w = toNumber(widthInput.value) / 1000;
  const h = toNumber(heightInput.value) / 1000;
  const q = toNumber(qty.value) || 0;
  let kg = d * l * w * h;
  if (foil.value === 'with') { kg += 1; }
  kgPerUnit.value = formatNumber(kg);
  totalKg.value = formatNumber(kg * q);
}

function formatNumber(n){
  const parts = Number(n.toFixed(3)).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join('.').replace(/\.0+$/, '');
}

function applyColor() {
  color.style.background = '';
  if (color.value === 'yellow') {
    color.style.background = 'var(--soft-yellow)';
  } else if (color.value === 'black') {
    color.style.background = 'var(--soft-olive)';
  } else {
    color.style.background = 'white';
  }
}

[density, lengthInput, widthInput, heightInput, qty, foil].forEach(el=>el.addEventListener('input', calc));
color.addEventListener('change', ()=>{ applyColor(); });

calcBtn.addEventListener('click', calc);

exportBtn.addEventListener('click', ()=>{
  const payload = {
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    brand: document.getElementById('brand').value,
    density: density.value,
    length_mm: lengthInput.value,
    width_mm: widthInput.value,
    height_mm: heightInput.value,
    color: color.value, foil: foil.value, qty: qty.value,
    kgPerUnit: kgPerUnit.value, totalKg: totalKg.value
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'order.json'; document.body.appendChild(a); a.click();
  a.remove(); URL.revokeObjectURL(url);
});

window.addEventListener('load', ()=>{ applyColor(); calc(); });

if (window.matchMedia('(display-mode: standalone)').matches) {
  document.documentElement.classList.add('standalone');
}
