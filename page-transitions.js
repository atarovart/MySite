(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  let isNavigating = false;
  let navigationTimer;

  const finishEntering = (event) => {
    if (event.target !== document.body || event.animationName !== 'page-transition-in') return;
    document.body.classList.remove('page-entering');
    document.body.removeEventListener('animationend', finishEntering);
  };

  document.body.classList.add('page-entering');
  document.body.addEventListener('animationend', finishEntering);

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    window.clearTimeout(navigationTimer);
    isNavigating = false;
    document.documentElement.classList.remove('is-page-leaving');
    document.body.classList.remove('page-entering');
  });

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || isNavigating) return;

    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin || destination.protocol !== window.location.protocol) return;
    if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;

    event.preventDefault();
    isNavigating = true;
    document.documentElement.classList.add('is-page-leaving');
    navigationTimer = window.setTimeout(() => window.location.assign(destination.href), 160);
  });
})();
