import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/hanken-grotesk';
/* The public surface's display face. Firewall rule 20 fences it to the
   marketing components; the product ramp never changes face.
   `/wdth.css`, NOT the bare entry point — the default subset ships the
   weight axis only, with no `wdth` in the woff2 at all, so B47's
   `scale="issue"` would declare a width it cannot get and the poster title
   would silently set at normal width. This file declares
   `font-stretch: 62% 125%`, which is the entire reason a variable face was
   registered instead of a static condensed one. */
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/fragment-mono';
import '@/styles/tokens.css';
import '@/styles/base.css';
import './site/site.css';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
