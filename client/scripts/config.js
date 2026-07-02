/**
 * Brajwasi's Coders - Global API Configuration
 * Intercepts relative fetch calls to /api/ and routes them to the hosted Render server
 * so that the frontend can be deployed on Vercel while keeping the backend on Render.
 */

(function () {
  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://brajwasi-s-coders.onrender.com';

  const ORIGINAL_FETCH = window.fetch;

  window.fetch = function (input, init) {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      input = API_BASE + input;
    }
    return ORIGINAL_FETCH(input, init);
  };
})();
