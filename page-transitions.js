(() => {
  const root = document.documentElement;
  const loader = document.querySelector('.page-loader');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let loadingTimer;

  const setLoading = (visible) => {
    root.classList.toggle('is-loading', visible);
    if (loader) loader.setAttribute('aria-hidden', String(!visible));
  };

  if (!reduceMotion && document.body) {
    const finishPageEntering = (event) => {
      if (event.target !== document.body || event.animationName !== 'page-enter') return;
      document.body.classList.remove('page-entering');
      document.body.removeEventListener('animationend', finishPageEntering);
    };
    document.body.classList.add('page-entering');
    document.body.addEventListener('animationend', finishPageEntering);
  }

  if (document.readyState !== 'complete') {
    loadingTimer = window.setTimeout(() => setLoading(true), 1200);
  }

  const finishLoading = () => {
    window.clearTimeout(loadingTimer);
    setLoading(false);
    root.classList.remove('is-leaving');
  };

  window.addEventListener('load', finishLoading, { once: true });
  window.addEventListener('pageshow', finishLoading);

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest?.('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin || destination.protocol !== window.location.protocol) return;
    if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;

    event.preventDefault();
    root.classList.add('is-leaving');
    window.setTimeout(() => window.location.assign(destination.href), reduceMotion ? 0 : 360);
  });
})();
