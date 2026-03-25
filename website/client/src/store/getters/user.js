export function data (store) {
  return store.state.user.data;
}

export function gems (store) {
  return store.state.user.data.balance * 4;
}

export function buffs (store) {
  return key => store.state.user.data.stats.buffs[key];
}

export function preferences (store) {
  return store.state.user.data.preferences;
}

export function tasksOrder (store) {
  return type => store.state.user.tasksOrder[`${type}s`];
}

export function isUserAdmin (store) {
  const ua = navigator.userAgent || '';

  const isFirefox = ua.includes('Firefox');
  const isAndroid = ua.includes('Android');

  // Pixel hint (may disappear in future)
  const isPixel = ua.includes('Pixel');

  // Pixel 9 approximate screen characteristics
  const width = Math.min(screen.width, screen.height);
  const height = Math.max(screen.width, screen.height);
  const dpr = window.devicePixelRatio;

  // Pixel 9 rough profile (adjust if needed)
  const looksLikePixel9 =
    width >= 360 && width <= 430 &&
    dpr >= 2.5 && dpr <= 4;

  return isFirefox && isAndroid && (isPixel || looksLikePixel9);
}