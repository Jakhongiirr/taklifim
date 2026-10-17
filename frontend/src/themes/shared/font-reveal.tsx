/**
 * Keeps the cover's words (marked `data-font-reveal`) hidden until the
 * theme's fonts have loaded, then fades them in (globals.css), so guests
 * never see the names jump from a stand-in font. Runs inline, before the
 * cover paints; without JavaScript, or after 3 s, the words just show.
 */
const SCRIPT = `(function () {
  var html = document.documentElement;
  var fonts = document.fonts;
  if (!fonts) return;
  html.setAttribute("data-fonts", "wait");
  function show() { html.removeAttribute("data-fonts"); }
  setTimeout(show, 3000);
  // Two frames in, the cover has been laid out and its fonts requested.
  function wait() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { fonts.ready.then(show, show); });
    });
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", wait);
  else wait();
})();`;

export default function FontReveal() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
