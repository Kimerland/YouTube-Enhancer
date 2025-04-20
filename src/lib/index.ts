export const observeUrlChange = (callback: () => void) => {
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(callback, 1000);
    }
  }).observe(document, { subtree: true, childList: true });
};
