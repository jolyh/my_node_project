const SESSION_STORAGE_KEY = 'userSession';

const isTokenExpired = (expireAt) => {
  const now = Math.floor(Date.now() / 1000);
  return expireAt && expireAt < now;
};

export { SESSION_STORAGE_KEY, isTokenExpired }