export const isPathActive = (pathname: string, path: string) =>
  pathname === path || pathname.startsWith(`${path}/`);
