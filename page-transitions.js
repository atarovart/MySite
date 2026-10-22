(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  let isNavigating = false;
  let navigationTimer;
  let enteringTimer;

  const startEntering = () => {
    window.clearTimeout(enteringTimer);
    document.body.classList.remove('page-entered');
    document.body.classList.add('page-entering');
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => document.body.classList.add('page-entered'));
    });
    enteringTimer = window.setTimeout(() => {
      document.body.classList.remove('page-entering', 'page-entered');
    }, 500);
  };

  startEntering();

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    window.clearTimeout(navigationTimer);
    isNavigating = false;
    document.documentElement.classList.remove('is-page-leaving');
    startEntering();
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

    const navigate = () => {
      window.clearTimeout(navigationTimer);
      document.body.removeEventListener('transitionend', finishLeaving);
      window.location.assign(destination.href);
    };

    const finishLeaving = (transitionEvent) => {
      if (transitionEvent.target === document.body && transitionEvent.propertyName === 'opacity') navigate();
    };

    document.body.addEventListener('transitionend', finishLeaving);
    navigationTimer = window.setTimeout(navigate, 600);
  });
})();
