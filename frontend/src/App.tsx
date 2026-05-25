import { useState } from 'react';

import { AboutTab } from './components/AboutTab.tsx';
import { ApiDocsTab } from './components/ApiDocsTab.tsx';
import { PredictTab } from './components/PredictTab.tsx';
import { ResultsTab } from './components/ResultsTab.tsx';
import { UserGuideTab } from './components/UserGuideTab.tsx';

type TabId = 'predict' | 'results' | 'api' | 'guide' | 'about';

/** The database is browsed in the NOMAD polymerization OASIS, not in-app. */
const NOMAD_DATA_URL =
  'https://nomad-lab.eu/prod/v1/oasis/gui/search/polymerization';

/** A nav entry is either an in-app tab (`id`) or an external link (`href`). */
interface NavEntry {
  label: string;
  id?: TabId;
  href?: string;
}

const TABS: NavEntry[] = [
  { id: 'predict', label: 'Prediction' },
  { href: NOMAD_DATA_URL, label: 'Data' },
  { id: 'results', label: 'Results' },
  { id: 'api', label: 'API' },
  { id: 'guide', label: 'User Guide' },
  { id: 'about', label: 'About' },
];

/** Root application component with sticky header and tab navigation. */
export function App() {
  const [active, setActive] = useState<TabId>('predict');

  return (
    <div>
      <header className="app-header">
        {/* ── Logo ── */}
        <div className="app-wordmark">
          <img className="app-logo" src="/logo.png" alt="PolyCarp" />
        </div>

        {/* ── Nav ── */}
        <nav className="app-nav">
          {TABS.map((entry) =>
            entry.href ? (
              <a
                key={entry.label}
                className="app-nav-btn"
                href={entry.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {entry.label}
              </a>
            ) : (
              <button
                key={entry.label}
                type="button"
                className={`app-nav-btn${active === entry.id ? ' active' : ''}`}
                onClick={() => entry.id && setActive(entry.id)}
              >
                {entry.label}
              </button>
            ),
          )}
        </nav>
      </header>

      <div className="app-content">
        {active === 'predict' && <PredictTab />}
        {active === 'results' && <ResultsTab />}
        {active === 'api' && <ApiDocsTab />}
        {active === 'guide' && <UserGuideTab />}
        {active === 'about' && <AboutTab />}
      </div>
    </div>
  );
}
