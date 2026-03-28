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

export function isUserManaged (store) {
  return store.state.user.data?.isManaged === true;
}

export function isUserAdmin (store) {
  if (store.state.user.data?.isManaged !== true) return false;
  return localStorage.getItem('admin-override') === 'true';
}

export function isManagedRestricted (store) {
  return store.state.user.data?.isManaged === true
    && localStorage.getItem('admin-override') !== 'true';
}