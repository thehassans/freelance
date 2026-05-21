const GUEST_USES_KEY = 'fk_guest_uses';

export const getAnonymousUses = (): number => {
  const uses = localStorage.getItem(GUEST_USES_KEY);
  return uses ? parseInt(uses, 10) : 0;
};

export const incrementAnonymousUses = (): number => {
  const current = getAnonymousUses();
  const next = current + 1;
  localStorage.setItem(GUEST_USES_KEY, next.toString());
  return next;
};
