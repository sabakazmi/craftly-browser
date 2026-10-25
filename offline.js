
/* ══════════════════════════════════════════════════════════════════
   OFFLINE SHIM

   These pages are the real application. Some of what they do happens on
   the studio — a Word file is written by python-docx, a deck is
   rendered by LibreOffice, a reel is encoded by ffmpeg, the asset
   search reads a 7.5 MB pack. None of that can happen in a file:// tab.

   Rather than let those calls hang, this answers them with the reason
   and the one command that turns them on. A control that cannot work
   should say so in a sentence, not spin.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  /* WHEN THIS TURNS ON
     The first version checked `location.protocol !== "file:"` and did
     nothing otherwise. That is wrong for the case this build is most
     likely to be used in: a STATIC HOST. Uploaded to Vercel or
     Netlify with no studio behind it, every /api/ call hit the host,
     got a 404 HTML page, and the UI failed trying to parse HTML as
     JSON — a confusing error instead of a clear message.

     So it now asks once whether a backend is actually there, and
     answers /api/ calls itself only when there is not. That covers
     all three cases with one rule: opened as a file, hosted
     statically, or served by the studio. */
  var REAL = window.fetch;
  var WHY = "This part is rendered by the studio, which is not running here. " +
            "Everything drawn in your browser — the video kinds, the 3D " +
            "scenes, Web Studio, the brand marks — works without it.";
  var backend = (location.protocol === "file:") ? Promise.resolve(false)
    /* GET, not POST. /api/config is a GET route — probing it with POST
       returned 404 text/plain, so the probe would have reported "no
       studio" on a machine where the studio was running. It does not
       bite today because the served pages do not carry this shim, but
       it would the moment they did. */
    : REAL("/api/config", { method: "GET" })
      .then(function (r) {
        var ct = (r.headers.get("content-type") || "");
        return ct.indexOf("json") >= 0;        /* a 401 is still a studio */
      })
      .catch(function () { return false; });
  var known = null;
  backend.then(function (v) { known = v; });

  function isApi(u) {
    return u.indexOf("/api/") === 0 || u.indexOf("/files/") === 0;
  }
  function offline() {
    return new Response(JSON.stringify({ error: WHY, offline: true }),
      { status: 503, headers: { "Content-Type": "application/json" } });
  }

  window.fetch = function (url, opts) {
    var u = String((url && url.url) || url || "");
    if (!isApi(u)) return REAL.apply(this, arguments);
    if (known === false) return Promise.resolve(offline());
    if (known === true) return REAL.apply(this, arguments);
    var self = this, args = arguments;
    return backend.then(function (v) {
      return v ? REAL.apply(self, args) : offline();
    });
  };

  backend.then(function (v) {
    if (v) return;                              /* the studio is there */
    var bar = document.createElement("div");
    bar.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:99997;" +
      "background:#1f180c;color:#e0a94b;border-top:1px solid #4d3c1d;" +
      "font:13px/1.5 Inter,sans-serif;padding:10px 16px;text-align:center";
    bar.innerHTML = (location.protocol === "file:"
      ? "Opened as a file. The 3D scenes cannot load their library here \u2014 a " +
        "browser refuses a local file inside a sandboxed frame. "
      : "Browser-only build. ") +
      "Everything drawn in your browser works and downloads; anything the " +
      "studio renders is off. " +
      "<b style='color:#f3d79a'>python craftly_server.py --port 8137</b> turns it on.";
    function put() { if (document.body) document.body.appendChild(bar); }
    if (document.readyState === "loading")
      addEventListener("DOMContentLoaded", put); else put();
  });
})();
