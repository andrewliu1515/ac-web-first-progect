// 滾動帶初始化 + 輕量 Lightbox
(function(){
  const rolling = document.querySelector('.rolling');
  if (!rolling) return;
  const track = rolling.querySelector('.track');
  const speed = parseInt(rolling.dataset.speed || '32', 10); // 秒

  // 複製一輪做無縫循環
  track.innerHTML += track.innerHTML;
  track.style.animation = `roll ${speed}s linear infinite`;

  // 觸控暫停/恢復（滑鼠用 :hover）
  ['touchstart','pointerdown'].forEach(evt=>{
    rolling.addEventListener(evt, ()=> track.style.animationPlayState='paused');
  });
  ['touchend','pointerup','pointercancel','mouseleave'].forEach(evt=>{
    rolling.addEventListener(evt, ()=> track.style.animationPlayState='running');
  });

  // Lightbox
  const lb = document.querySelector('.lightbox');
  const lbImg = lb.querySelector('.lb-img');
  const lbCap = lb.querySelector('.lb-cap');
  const items = Array.from(track.querySelectorAll('.shot img'));
  let idx = 0;

  function open(i){
    idx = i;
    const fig = items[idx].closest('figure');
    lbImg.src = items[idx].src;
    lbImg.alt = items[idx].alt || '';
    lbCap.textContent = fig.querySelector('figcaption')?.textContent || '';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }
  function close(){
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }
  function nav(dir){
    idx = (idx + dir + items.length) % items.length;
    open(idx);
  }

  items.forEach((img,i)=> img.addEventListener('click', ()=> open(i)));
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', ()=> nav(-1));
  lb.querySelector('.lb-next').addEventListener('click', ()=> nav(1));
  document.addEventListener('keydown', e=>{
    if(!lb.classList.contains('open')) return;
    if(e.key==='Escape') close();
    if(e.key==='ArrowLeft') nav(-1);
    if(e.key==='ArrowRight') nav(1);
  });
})();
