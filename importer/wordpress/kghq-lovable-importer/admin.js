/* global KGHQ_IMPORT */
/* No credentials or source execution in the browser. */
(() => {
  const $ = (id) => document.getElementById("kghq-" + id);
  let job = null;
  let pages = [];
  let busy = false;
  const log = (message, error = false) => {
    const p = document.createElement("p");
    p.textContent = message;
    p.className = error ? "kghq-error" : "";
    $("log").append(p);
  };
  async function api(endpoint, data) {
    const options = { method: "POST", headers: { "X-WP-Nonce": KGHQ_IMPORT.nonce } };
    if (data instanceof FormData) options.body = data;
    else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(data);
    }
    const response = await fetch(KGHQ_IMPORT.api + endpoint, options);
    const result = await response.json();
    if (!response.ok) throw Error(result.message || "Request failed");
    return result;
  }
  function render() {
    const host = $("pages");
    host.replaceChildren();
    for (const page of pages) {
      const row = document.createElement("label");
      row.className = "kghq-page-row";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = page.path;
      checkbox.checked = true;
      const text = document.createElement("span");
      text.textContent =
        page.title +
        " — " +
        page.path +
        (page.existing ? " · existing page #" + page.existing : "");
      row.append(checkbox, text);
      host.append(row);
      for (const warning of page.warnings || []) {
        const p = document.createElement("p");
        p.className = "kghq-warning";
        p.textContent = warning;
        host.append(p);
      }
    }
    $("import").disabled = !job || busy;
  }
  $("scan").onclick = async () => {
    if (busy) return;
    busy = true;
    $("scan").disabled = true;
    try {
      const result = await api("scan", { repository: $("repository").value, ref: $("ref").value });
      job = null;
      pages = result.pages;
      render();
      for (const w of result.warnings) log(w);
      log("Scan complete. Convert these routes with the CLI and load the bundle.");
    } catch (e) {
      log(e.message, true);
    } finally {
      busy = false;
      $("scan").disabled = false;
    }
  };
  $("bundle").onchange = async () => {
    if (busy) return;
    const file = $("bundle").files[0];
    if (!file) return;
    const form = new FormData();
    form.append("bundle", file);
    busy = true;
    try {
      const result = await api("stage", form);
      job = result.job;
      pages = result.pages;
      $("repository").value = result.repository;
      $("job-info").textContent =
        pages.length + " converted pages ready. Bundle expires in one hour.";
      log("Bundle validated. Choose which pages to import.");
    } catch (e) {
      job = null;
      pages = [];
      log(e.message, true);
    } finally {
      busy = false;
      render();
    }
  };
  $("all").onclick = () => {
    if (!busy)
      $("pages")
        .querySelectorAll("input")
        .forEach((el) => (el.checked = true));
  };
  $("none").onclick = () => {
    if (!busy)
      $("pages")
        .querySelectorAll("input")
        .forEach((el) => (el.checked = false));
  };
  $("import").onclick = async () => {
    if (busy || !job) return;
    const selected = [...$("pages").querySelectorAll("input:checked")].map((el) => el.value);
    if (!selected.length) {
      log("Select at least one page.", true);
      return;
    }
    const replace = $("replace").checked;
    const settings = {
      width: Number($("width").value),
      canvas: $("canvas").checked,
      full: $("full").checked,
      header: $("header").checked,
      footer: $("footer").checked,
    };
    busy = true;
    $("import").disabled = true;
    $("bundle").disabled = true;
    let done = 0;
    for (const route of selected) {
      try {
        const result = await api("import", { job, route, replace, settings });
        log(route + ": " + result.status + " — " + result.message);
        const p = document.createElement("p");
        for (const [label, url] of [
          ["Preview", result.preview],
          ["Edit blocks", result.edit],
        ]) {
          if (!url) continue;
          const link = document.createElement("a");
          link.textContent = label + " ";
          link.href = url;
          link.target = "_blank";
          link.rel = "noopener";
          p.append(link);
        }
        $("log").append(p);
      } catch (e) {
        log(route + ": " + e.message, true);
      }
      done++;
      $("progress").value = (done / selected.length) * 100;
    }
    busy = false;
    $("bundle").disabled = false;
    $("import").disabled = false;
    log("Import batch finished. Review every draft and conversion warning.");
  };
})();
