/* eslint-disable boundaries/no-unknown-files */
import { StandalonePageManager } from './standalonePageManager';
import { ExtensionStatusManager } from './extension-status-manager';

new StandalonePageManager(document).init();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
document
  .querySelector('[id="globalToggle"]')
  .addEventListener('change', async (event) => {
    const target = event.target as HTMLInputElement;
    chrome.storage.local.set({ enabled: target.checked }).catch(console.error);
    chrome.storage.local
      .set({ cacheInvalidate: Date.now() })
      .catch(console.error);
    // eslint-disable-next-line unicorn/no-null
    const allStorage = await chrome.storage.local.get(null);
    for (const x of Object.keys(allStorage).filter((x) => {
      return x.startsWith('cache[');
    })) {
      await chrome.storage.local.remove(x);
      continue;
    }

    if (target.checked) {
      ExtensionStatusManager.enable();
    } else {
      ExtensionStatusManager.disable();
    }
  });

chrome.storage.local.get(['enabled'], (r) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  document.querySelector('[id="globalToggle"]').checked = r?.enabled ?? true;
  setTimeout(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete document
      .querySelector('[id="globalToggle"]')
      .classList.remove('noTransition');
  }, 50);
});
