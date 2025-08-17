// 進場 reveal + Sticky CTA 顯示條件
(function(){
  const targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, {threshold: 0.18});
    targets.forEach(t=>io.observe(t));
  } else {
    targets.forEach(t=>t.classList.add('is-in'));
  }

  // Sticky CTA：滾過首屏 60% 出現
  const sticky = document.querySelector('.sticky-cta');
  const hero = document.querySelector('.hero-photo-img');
  if (sticky && hero) {
    const onScroll = () => {
      const threshold = hero.offsetHeight * 0.6;
      sticky.style.transform = (window.scrollY > threshold) ? 'translateY(0)' : 'translateY(120%)';
    };
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }
})();
