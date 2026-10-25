BROWSER-ONLY BUILD
==================

Static files. No server, no Python, no ffmpeg, no CPU cost to you.
Upload this folder anywhere that serves files — Vercel, Netlify,
Cloudflare Pages, GitHub Pages, or your own hosting.

    cd app
    npx vercel --prod

WHAT WORKS HERE
  Video Studio    5 kinds — quiz, question-and-answer, presentation,
                  animated, whiteboard. Records and downloads.
  3D Studio       real geometry, recorded in the browser
  Web Studio      six complete site designs
  Brand Studio    marks and palettes

Every one of those draws on a canvas and records it with the browser's
own recorder. The visitor's machine does the work.

WHAT DOES NOT, AND WHY
  Anything rendered by the studio in Python: decks, Word files, PDFs,
  the motif and flow chart videos, the still posts, the asset search
  over 18,030 icons, narration, music. Those need craftly_server.py on
  a machine. The pages say so rather than failing silently.

THE FORMAT, WHICH MATTERS ON A PHONE
  The browser records WEBM. Chrome, Edge, Firefox and Android play it.
  iPhone and Safari largely do not. The "MP4" button converts by
  posting the file to the studio — so with no server you get WebM only.

  Getting true MP4 with no server is possible: the WebCodecs
  VideoEncoder plus an MP4 muxer, which is hardware-accelerated and
  works in Chrome, Edge, Android Chrome and Safari 16.4+. That is a
  build, not a setting, and it is not done here.

COOP/COEP headers are set in vercel.json because WebCodecs and
SharedArrayBuffer need them. Harmless if you never use either.
