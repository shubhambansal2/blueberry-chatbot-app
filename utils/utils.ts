export const getWindowInstance = () => {
    const isBrowser = typeof window === 'object';
    if (isBrowser) {
      return window;
    }
    return {};
  };

  