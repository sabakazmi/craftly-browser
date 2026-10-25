/* ══════════════════════════════════════════════════════════════════════
   THE NAVIGATION BAR

   One bar, injected into every page by the server rather than pasted
   into twelve HTML files — so a module added next week gets it for free
   and none of them can drift out of step with the others.

   Why it exists: every studio worked, and you could not get out of one
   without the browser's back button. Ten good pages that do not know
   about each other are ten pages, not an app.

   What it does and nothing more: says where you are, lets you go
   anywhere in one click, carries the workspace token with you, and
   stays out of the way. It is 48px tall, it does not animate on scroll,
   and it has no dropdown that hides a destination behind a hover.

   Keyboard: Ctrl/Cmd-K opens the jump box. Nobody has to know that, but
   the people who use this every day will.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  if (window.__craftlyNav) return;
  window.__craftlyNav = true;

  var TOKEN = new URLSearchParams(location.search).get("t") || "";
  var q = TOKEN ? "?t=" + encodeURIComponent(TOKEN) : "";

  var GROUPS = [
    ["Make", [
      ["Create",    "create.html",    "Start here — describe it or paste your source"],
      ["Document",  "document.html",  "Plain text to a set Word file, deck and PDF"],
      ["Content",   "content.html",   "Posts and carousels in your brand"],
      ["Video",     "video.html",     "Quiz, whiteboard, animated and spatial"],
      ["Short form","reels.html",     "Kinetic, countdown, sting, stat, testimonial"],
      ["3D",        "studio3d.html",  "Geometry, data scenes and turntables"],
      ["Web",       "webstudio.html", "Five questions, six complete websites"]
    ]],
    ["Set up", [
      ["Brand",     "brand.html",     "Palette, type and marks"],
      ["Workspace", "workspace.html", "Team, connections, schedule and plan"]
    ]],
    ["Look back", [
      ["Gallery",   "index.html",   "Everything this studio has made"],
      ["Control",   "admin.html",     "What ran, and what it cost"]
    ]]
  ];

  var FLAT = GROUPS.reduce(function (a, g) { return a.concat(g[1]); }, []);
  var here = location.pathname.replace(/\/$/, "") || "/";
  var ALIAS = { "/": "/", "/home": "/", "/studio": "content.html", "/docs": "document.html",
                "/videostudio": "video.html", "/web": "webstudio.html", "/new": "create.html" };
  here = ALIAS[here] || here;

  var css = document.createElement("style");
  css.textContent = [
    ":root{--nv-h:48px}",
    "body{padding-top:var(--nv-h)!important}",
    "#cnav{position:fixed;top:0;left:0;right:0;height:var(--nv-h);z-index:99998;",
    "  display:flex;align-items:center;gap:2px;padding:0 10px;",
    "  background:rgba(8,11,16,.86);backdrop-filter:blur(14px);",
    "  -webkit-backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.07);",
    "  font:500 13px/1 Inter,ui-sans-serif,-apple-system,'Segoe UI',Roboto,sans-serif}",
    "#cnav .home{display:flex;align-items:center;gap:8px;padding:0 12px 0 6px;",
    "  color:#eef2f7;text-decoration:none;font-weight:700;letter-spacing:-.01em;",
    "  white-space:nowrap}",
    "#cnav .home b{color:#3ddc97}",
    "#cnav .sep{width:1px;height:20px;background:rgba(255,255,255,.09);margin:0 8px}",
    "#cnav a.n{color:#93a2b5;text-decoration:none;padding:8px 11px;border-radius:9px;",
    "  white-space:nowrap;transition:background .12s,color .12s}",
    "#cnav a.n:hover{color:#eef2f7;background:rgba(255,255,255,.06)}",
    "#cnav a.n[aria-current]{color:#04140b;background:#3ddc97;font-weight:600}",
    "#cnav .grow{flex:1}",
    "#cnav .k{color:#6b7a8d;border:1px solid rgba(255,255,255,.10);border-radius:8px;",
    "  padding:6px 10px;cursor:pointer;background:none;font:inherit;white-space:nowrap}",
    "#cnav .k:hover{color:#eef2f7;border-color:rgba(255,255,255,.22)}",
    "#cnav .ws{color:#6b7a8d;padding:0 10px;white-space:nowrap;font-size:12px}",
    "#cjump{position:fixed;inset:0;z-index:99999;display:none;",
    "  background:rgba(4,7,11,.72);backdrop-filter:blur(6px);padding-top:14vh}",
    "#cjump.on{display:block}",
    "#cjump .box{max-width:560px;margin:0 auto;background:#0d1219;",
    "  border:1px solid #1c2430;border-radius:16px;overflow:hidden;",
    "  box-shadow:0 30px 80px rgba(0,0,0,.6)}",
    "#cjump input{width:100%;border:0;background:none;color:#eef2f7;",
    "  padding:18px 20px;font:16px Inter,sans-serif;outline:none}",
    "#cjump .res{max-height:52vh;overflow:auto;border-top:1px solid #1c2430}",
    "#cjump .r{display:flex;gap:12px;align-items:baseline;padding:12px 20px;",
    "  color:#c7d2de;cursor:pointer;text-decoration:none}",
    "#cjump .r.sel,#cjump .r:hover{background:#121a24}",
    "#cjump .r b{min-width:96px;color:#eef2f7;font-weight:600}",
    "#cjump .r span{color:#7c8a9c;font-size:13px}",
    "@media(max-width:900px){#cnav .wide{display:none}}",
    "@media(print){#cnav,#cjump{display:none}body{padding-top:0!important}}"
  ].join("");
  document.head.appendChild(css);

  var nav = document.createElement("nav");
  nav.id = "cnav";
  nav.innerHTML =
    '<a class="home" href="/' + q + '"><b>◆</b> iCore</a><span class="sep"></span>' +
    FLAT.map(function (m) {
      return '<a class="n wide" href="' + m[1] + q + '" title="' + m[2] + '"' +
        (m[1] === here ? ' aria-current="page"' : "") + '>' + m[0] + "</a>";
    }).join("") +
    '<span class="grow"></span>' +
    '<button class="k" id="cjb">Jump <span style="opacity:.6">⌘K</span></button>' +
    '<span class="ws" id="cws"></span>';
  document.body.appendChild(nav);

  /* ---- the jump box ---- */
  var jump = document.createElement("div");
  jump.id = "cjump";
  jump.innerHTML = '<div class="box"><input id="cji" placeholder="Go to…" ' +
    'autocomplete="off" spellcheck="false"><div class="res" id="cjr"></div></div>';
  document.body.appendChild(jump);

  var sel = 0, shown = FLAT.slice();
  function paint() {
    document.getElementById("cjr").innerHTML = shown.map(function (m, i) {
      return '<a class="r' + (i === sel ? " sel" : "") + '" href="' + m[1] + q +
        '"><b>' + m[0] + "</b><span>" + m[2] + "</span></a>";
    }).join("") || '<div class="r"><span>Nothing matches that.</span></div>';
  }
  function open() {
    jump.classList.add("on"); sel = 0; shown = FLAT.slice(); paint();
    var i = document.getElementById("cji"); i.value = ""; i.focus();
  }
  function close() { jump.classList.remove("on"); }

  document.getElementById("cjb").onclick = open;
  jump.onclick = function (e) { if (e.target === jump) close(); };
  document.getElementById("cji").oninput = function (e) {
    var v = e.target.value.toLowerCase().trim();
    shown = FLAT.filter(function (m) {
      return !v || (m[0] + " " + m[2]).toLowerCase().indexOf(v) >= 0;
    });
    sel = 0; paint();
  };
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault(); jump.classList.contains("on") ? close() : open(); return;
    }
    if (!jump.classList.contains("on")) return;
    if (e.key === "Escape") { close(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, shown.length - 1); paint(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); paint(); }
    else if (e.key === "Enter" && shown[sel]) { location.href = shown[sel][1] + q; }
  });

  /* ---- which workspace am I in ---- */
  fetch("/api/me" + q).then(function (r) { return r.json(); }).then(function (j) {
    // /api/me returns `workspace` as an ID and the names in `workspaces`.
    // Reading it as an object gave a blank label on every page.
    var el = document.getElementById("cws");
    var name = "";
    if (j && j.workspaces && j.workspace) {
      for (var i = 0; i < j.workspaces.length; i++) {
        if (j.workspaces[i].id === j.workspace) { name = j.workspaces[i].name; break; }
      }
    }
    if (name) {
      var role = (j.role || "").replace(/^./, function (c) { return c.toUpperCase(); });
      el.innerHTML = '<a class="n" href="/workspace' + q + '" title="' +
        (role ? role : "") + '">' + name + "</a>";
    } else if (!j || !j.signed_in) {
      el.innerHTML = '<a class="n" href="/workspace' + q + '">Sign in</a>';
    }
  }).catch(function () {});
})();
