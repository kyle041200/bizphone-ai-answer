/* No secrets are included in this script or localized configuration. */
(() => {
  const start = document.getElementById('kghq-start');
  if (!start) return;
  const status = document.getElementById('kghq-status');
  const list = document.getElementById('kghq-results');
  const progress = document.getElementById('kghq-progress');
  const request = async operation => {
    const body = new URLSearchParams({ action: 'kghq_published', operation, nonce: KGHQPublished.nonce });
    const response = await fetch(KGHQPublished.url, { method: 'POST', credentials: 'same-origin', body });
    let result;
    try { result = await response.json(); }
    catch { throw new Error('The hosting server returned an unreadable response. Check the PHP error log and request limits, then retry. Saved drafts remain.'); }
    if (!result.success) throw new Error(result.data?.message || 'Import request failed. Please check your login and hosting logs.');
    return result.data;
  };
  start.addEventListener('click', async () => {
    const form = document.getElementById('kghq-source-settings');
    if (!form.reportValidity()) return;
    start.disabled = true;
    list.replaceChildren();
    progress.value = 0;
    status.textContent = 'Starting import…';
    try {
      // Settings API's hidden input named "action" shadows form.action in the DOM.
      const settingsURL = new URL(form.getAttribute('action'), location.href);
      if (settingsURL.origin !== location.origin) throw new Error('Settings must be saved on this WordPress site.');
      const saved = await fetch(settingsURL.href, { method: 'POST', credentials: 'same-origin', body: new FormData(form) });
      if (!saved.ok) throw new Error('Settings could not be saved. Refresh the page, check your login and try again.');
      const token = document.getElementById('kghq-token');
      if (token.value) token.placeholder = 'Saved — leave blank to keep';
      token.value = '';
      let result = await request('start');
      while (!result.done) {
        status.textContent = result.message || 'Reading the next page…';
        result = await request('step');
        progress.value = result.count;
        if (result.url) {
          const item = document.createElement('li');
          item.textContent = `${result.url}: ${result.message} `;
          for (const [key, label] of [['edit', 'Edit'], ['view', 'View draft']]) {
            if (result[key]) {
              const link = document.createElement('a');
              const url = new URL(result[key], location.href);
              if (url.origin !== location.origin) continue;
              link.href = url.href;
              link.textContent = `${label} `;
              item.append(link);
            }
          }
          for (const warning of result.warnings || []) {
            const note = document.createElement('p');
            note.textContent = warning;
            item.append(note);
          }
          list.append(item);
        }
      }
      status.textContent = result.message;
      progress.max = Math.max(1, result.count || 0);
      progress.value = result.count || 0;
    } catch (error) {
      status.textContent = error.message || 'Connection interrupted. Imported drafts remain saved.';
    } finally {
      start.disabled = false;
    }
  });
  start.disabled = false;
})();
