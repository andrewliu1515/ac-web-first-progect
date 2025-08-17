// 可拖曳橫向 Gallery + 慣性 + Lightbox
(function(){
  const root = document.querySelector('.gallery');
  if (!root) return;

  const track = root.querySelector('.track');
  const prevBtn = root.querySelector('.g-nav.prev');
  const nextBtn = root.querySelector('.g-nav.next');

  // 拖曳/滑動 + 慣性
  let isDown = false, startX = 0, startScroll = 0, vx = 0, raf;
  const maxVel = 120;

  const onDown = (e) => {
    isDown = true;
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    startScroll = track.scrollLeft;
    vx = 0;
    cancelAnimationFrame(raf);
  };
  const onMove = (e) => {
    if (!isDown) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    const dx = x - startX;
    track.scrollLeft = startScroll - dx;
    vx = -(dx);
  };
  const onUp = () => {
    if (!isDown) return;
    isDown = false;
    let v = Math.max(Math.min(vx, maxVel), -maxVel);
    const friction = 0.92;
    const step = () => {
      if (Math.abs(v) < 0.5) return;
      track.scrollLeft += -v;
      v *= friction;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };

  track.addEventListener('mousedown', onDown);
  track.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  track.addEventListener('touchstart', onDown, {passive:true});
  track.addEventListener('touchmove', onMove, {passive:true});
  track.addEventListener('touchend', onUp);

  // 滑輪 → 橫向
  const onWheel = (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      track.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };
  track.addEventListener('wheel', onWheel, {passive:false});

  // 鍵盤左右鍵
  track.addEventListener('keydown', (e)=>{
    if (e.key === 'ArrowRight') track.scrollLeft += track.clientWidth * 0.9;
    if (e.key === 'ArrowLeft') track.scrollLeft -= track.clientWidth * 0.9;
  });

  // 上/下一張（對齊 scroll-snap）
  const scrollByOne = (dir) => {
    const cards = Array.from(track.querySelectorAll('.shot'));
    const x = track.scrollLeft + (dir > 0 ? track.clientWidth*0.55 : -track.clientWidth*0.55);
    let best = track.scrollLeft, min = Infinity;
    for (const el of cards){
      const left = el.offsetLeft - 6;
      const diff = Math.abs(left - x);
      if (diff < min){ min = diff; best = left; }
    }
    track.scrollTo({left: best, behavior:'smooth'});
  };
  prevBtn.addEventListener('click', ()=> scrollByOne(-1));
  nextBtn.addEventListener('click', ()=> scrollByOne(1));

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
