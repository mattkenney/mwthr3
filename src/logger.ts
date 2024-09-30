function log(level: string, ...what: unknown[]) {
  const url = new URL('/collect.gif', location.href);
  if (level) {
    url.searchParams.append('level', level);
  }
  url.searchParams.append('data', JSON.stringify(what, replacer));
  fetch(url.href).catch((err: unknown) => {
    console.error(err, ...what);
  });
}

function replacer(_: string, value: unknown) {
  if (value instanceof Error || value instanceof GeolocationPositionError) {
    const { code, message, name, stack } = value as Error &
      GeolocationPositionError;
    return {
      code,
      message,
      name,
      stack: stack && String(stack).split('\n')[0],
      type: value.constructor.name,
    };
  }

  return value;
}

export const logger = {
  error: (...args: unknown[]) => log('error', ...args),
  info: (...args: unknown[]) => log('info', ...args),
  log: (...args: unknown[]) => log('', ...args),
  warn: (...args: unknown[]) => log('warn', ...args),
};
