// Copy-to-clipboard for blog tools. Any button with data-copy-target="<id>" copies that element's text.
(function () {
  function fallbackCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(area);
    return ok;
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }
  window.scCopyText = copyText;
  document.addEventListener('click', function (event) {
    var btn = event.target.closest && event.target.closest('[data-copy-target]');
    if (!btn) return;
    var el = document.getElementById(btn.getAttribute('data-copy-target'));
    if (!el) return;
    var label = btn.getAttribute('data-label') || btn.textContent;
    btn.setAttribute('data-label', label);
    var status = btn.closest('.sc-copy, .sc-gen');
    status = status && status.querySelector('[role="status"]');
    copyText(el.innerText || el.textContent).then(function (ok) {
      btn.textContent = ok ? 'Copied' : 'Select and copy';
      if (status) status.textContent = ok ? 'Copied. Open Notes and paste.' : 'Copy did not work here. Press and hold the text to select it, then copy.';
      setTimeout(function () { btn.textContent = label; }, 2000);
    });
  });
})();
