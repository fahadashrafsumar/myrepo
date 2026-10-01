(function () {
  "use strict";

  // --- Configuration ---------------------------------------------------------
  var REPO = { owner: "fahadashrafsumar", name: "myrepo", branch: "main",
               path: "license-tracker/data/licenses.json" };
  var DATA_URL = "data/licenses.json";
  var DRAFT_KEY = "lt.draft";
  var DAY = 86400000;

  // --- State -----------------------------------------------------------------
  var items = [];
  var sort = { key: "expiry", dir: 1 };
  var editingId = null;

  var $ = function (id) { return document.getElementById(id); };

  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function safeDel(k) { try { localStorage.removeItem(k); } catch (e) {} }

  // --- Helpers ---------------------------------------------------------------
  function daysLeft(expiry) {
    var d = new Date(expiry + "T00:00:00");
    var t = new Date(); t.setHours(0, 0, 0, 0);
    return Math.round((d - t) / DAY);
  }
  function statusOf(item) {
    var d = daysLeft(item.expiry), warn = +$("warnDays").value;
    return d < 0 ? "expired" : d <= warn ? "soon" : "ok";
  }
  function money(n) { return (+n || 0).toLocaleString(undefined, { style: "currency", currency: "USD" }); }
  function uid() { return "lic-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function clean(i) {
    return {
      id: String(i.id || uid()), name: String(i.name || ""), vendor: String(i.vendor || ""),
      seats: +i.seats || 0, owner: String(i.owner || ""), purchased: String(i.purchased || ""),
      expiry: String(i.expiry || ""), cost: +i.cost || 0, notes: String(i.notes || "")
    };
  }
  function cell(tr, text, cls) {
    var td = document.createElement("td");
    td.textContent = text;
    if (cls) td.className = cls;
    tr.appendChild(td);
    return td;
  }

  // --- Persistence -----------------------------------------------------------
  function markDirty() {
    safeSet(DRAFT_KEY, JSON.stringify(items));
    $("dirtyBanner").hidden = false;
  }
  function load() {
    var draft = safeGet(DRAFT_KEY);
    if (draft) {
      try { items = JSON.parse(draft).map(clean); $("dirtyBanner").hidden = false; render(); return; }
      catch (e) { safeDel(DRAFT_KEY); }
    }
    return fetch(DATA_URL, { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) { items = data.map(clean); render(); })
      .catch(function () {
        items = [];
        render();
        $("empty").hidden = false;
        $("empty").textContent = "Could not load data/licenses.json. Serve this folder over http(s) rather than opening the file directly.";
      });
  }

  // --- Rendering -------------------------------------------------------------
  function render() {
    var q = $("search").value.trim().toLowerCase();
    var sf = $("statusFilter").value;
    var rows = items.filter(function (i) {
      var hay = (i.name + " " + i.vendor + " " + i.owner).toLowerCase();
      return (!q || hay.indexOf(q) !== -1) && (!sf || statusOf(i) === sf);
    });
    rows.sort(function (a, b) {
      var va = sort.key === "days" ? daysLeft(a.expiry) : a[sort.key];
      var vb = sort.key === "days" ? daysLeft(b.expiry) : b[sort.key];
      if (typeof va === "string") { va = va.toLowerCase(); vb = String(vb).toLowerCase(); }
      return (va < vb ? -1 : va > vb ? 1 : 0) * sort.dir;
    });

    var tb = $("tbody");
    tb.textContent = "";
    rows.forEach(function (i) {
      var tr = document.createElement("tr");
      var st = statusOf(i), d = daysLeft(i.expiry);
      cell(tr, i.name); cell(tr, i.vendor); cell(tr, i.seats); cell(tr, i.owner);
      cell(tr, i.expiry); cell(tr, d); cell(tr, money(i.cost));
      var tdS = document.createElement("td");
      var b = document.createElement("span");
      b.className = "badge " + st;
      b.textContent = st === "soon" ? "Expiring soon" : st === "expired" ? "Expired" : "OK";
      tdS.appendChild(b); tr.appendChild(tdS);
      var tdA = document.createElement("td");
      [["Edit", function () { openEdit(i.id); }], ["Delete", function () { remove(i.id); }]].forEach(function (a) {
        var btn = document.createElement("button");
        btn.className = "btn small"; btn.textContent = a[0]; btn.addEventListener("click", a[1]);
        tdA.appendChild(btn); tdA.appendChild(document.createTextNode(" "));
      });
      tr.appendChild(tdA);
      tb.appendChild(tr);
    });
    $("empty").hidden = rows.length > 0;
    if (rows.length === 0 && items.length > 0) $("empty").textContent = "No licenses match.";
    renderStats();
  }

  function renderStats() {
    var c = { expired: 0, soon: 0, ok: 0 };
    items.forEach(function (i) { c[statusOf(i)]++; });
    var box = $("stats");
    box.textContent = "";
    [["Total", items.length, ""], ["Expired", c.expired, "bad"],
     ["Expiring soon", c.soon, "soon"], ["OK", c.ok, "ok"]].forEach(function (s) {
      var d = document.createElement("div"); d.className = "stat " + s[2];
      var b = document.createElement("b"); b.textContent = s[1];
      d.appendChild(b); d.appendChild(document.createTextNode(s[0]));
      box.appendChild(d);
    });
  }

  // --- CRUD ------------------------------------------------------------------
  function openEdit(id) {
    editingId = id || null;
    var f = $("editForm"), it = id ? items.filter(function (x) { return x.id === id; })[0] : null;
    $("editTitle").textContent = it ? "Edit license" : "Add license";
    ["name", "vendor", "seats", "owner", "purchased", "expiry", "cost", "notes"].forEach(function (k) {
      f.elements[k].value = it ? it[k] : (k === "seats" ? 1 : k === "cost" ? 0 : "");
    });
    $("editDialog").showModal();
  }
  function remove(id) {
    var it = items.filter(function (x) { return x.id === id; })[0];
    if (!it || !confirm("Delete \"" + it.name + "\"?")) return;
    items = items.filter(function (x) { return x.id !== id; });
    markDirty(); render();
  }
  $("editForm").addEventListener("submit", function () {
    var f = $("editForm"), rec = { id: editingId || uid() };
    ["name", "vendor", "seats", "owner", "purchased", "expiry", "cost", "notes"].forEach(function (k) { rec[k] = f.elements[k].value; });
    rec = clean(rec);
    var idx = items.findIndex(function (x) { return x.id === rec.id; });
    if (idx >= 0) items[idx] = rec; else items.push(rec);
    markDirty(); render();
  });
  $("cancelEdit").addEventListener("click", function () { $("editDialog").close(); });
  $("addBtn").addEventListener("click", function () { openEdit(null); });

  // --- Import / export -------------------------------------------------------
  function download(name, text, type) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: type }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  function csvCell(v) {
    v = String(v);
    if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; // neutralise spreadsheet formulas
    return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  }
  $("exportJsonBtn").addEventListener("click", function () {
    download("licenses.json", JSON.stringify(items, null, 2) + "\n", "application/json");
  });
  $("exportCsvBtn").addEventListener("click", function () {
    var cols = ["name", "vendor", "seats", "owner", "purchased", "expiry", "cost", "notes"];
    var lines = [cols.join(",")].concat(items.map(function (i) {
      return cols.map(function (c) { return csvCell(i[c]); }).join(",");
    }));
    download("licenses.csv", lines.join("\n") + "\n", "text/csv");
  });
  $("importBtn").addEventListener("click", function () { $("importFile").click(); });
  $("importFile").addEventListener("change", function (e) {
    var file = e.target.files[0]; if (!file) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var data = JSON.parse(r.result);
        if (!Array.isArray(data)) throw new Error("not an array");
        items = data.map(clean); markDirty(); render();
      } catch (err) { alert("Invalid JSON file: " + err.message); }
    };
    r.readAsText(file); e.target.value = "";
  });

  // --- Save to GitHub --------------------------------------------------------
  function toBase64(str) {
    var bytes = new TextEncoder().encode(str), bin = "";
    bytes.forEach(function (b) { bin += String.fromCharCode(b); });
    return btoa(bin);
  }
  $("saveGhBtn").addEventListener("click", function () {
    var tok = ""; try { tok = sessionStorage.getItem("lt.token") || ""; } catch (e) {}
    $("ghForm").elements.token.value = tok;
    $("ghMsg").textContent = "";
    $("ghDialog").showModal();
  });
  $("cancelGh").addEventListener("click", function () { $("ghDialog").close(); });
  $("ghForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var token = $("ghForm").elements.token.value.trim(), msg = $("ghMsg");
    try { sessionStorage.setItem("lt.token", token); } catch (err) {}
    var api = "https://api.github.com/repos/" + REPO.owner + "/" + REPO.name + "/contents/" + REPO.path;
    var headers = { "Authorization": "Bearer " + token, "Accept": "application/vnd.github+json" };
    msg.textContent = "Saving…";
    fetch(api + "?ref=" + REPO.branch, { headers: headers })
      .then(function (r) { if (!r.ok) throw new Error("Could not read file (" + r.status + ")"); return r.json(); })
      .then(function (cur) {
        return fetch(api, {
          method: "PUT", headers: headers,
          body: JSON.stringify({
            message: "Update license data via tracker UI",
            content: toBase64(JSON.stringify(items, null, 2) + "\n"),
            sha: cur.sha, branch: REPO.branch
          })
        });
      })
      .then(function (r) { if (!r.ok) throw new Error("Commit failed (" + r.status + ")"); return r.json(); })
      .then(function () {
        safeDel(DRAFT_KEY); $("dirtyBanner").hidden = true;
        msg.textContent = "Saved. The site redeploys in about a minute.";
        setTimeout(function () { $("ghDialog").close(); }, 1500);
      })
      .catch(function (err) { msg.textContent = "Error: " + err.message; });
  });
  $("resetBtn").addEventListener("click", function () {
    if (!confirm("Discard unsaved changes and reload data from the repo?")) return;
    safeDel(DRAFT_KEY); $("dirtyBanner").hidden = true; load();
  });

  // --- Controls --------------------------------------------------------------
  ["search", "statusFilter", "warnDays"].forEach(function (id) {
    $(id).addEventListener("input", render);
  });
  document.querySelectorAll("th[data-key]").forEach(function (th) {
    th.addEventListener("click", function () {
      var k = th.dataset.key;
      sort = { key: k, dir: sort.key === k ? -sort.dir : 1 };
      render();
    });
  });

  load();
})();
