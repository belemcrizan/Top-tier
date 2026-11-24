import { registerWorker } from './boot/registerWorker';
import { loadCollectionFonts } from './styles/loadFonts';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Application } from './app/Application';
import './styles/index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing application root');
if (root.hasChildNodes() && !document.documentElement.hasAttribute('data-client-entry')) {
  hydrateRoot(root, <Application />);
} else {
  // A shared URL or stored language can require a different first page than the static collection.
  root.replaceChildren();
  document.documentElement.removeAttribute('data-client-entry');
  createRoot(root).render(<Application />);
}

registerWorker();
loadCollectionFonts();
