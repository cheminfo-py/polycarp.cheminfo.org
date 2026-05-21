import { useState } from 'react';

import { BRAND_AMBER, BRAND_NAVY } from './colors.ts';
import { AboutTab } from './components/AboutTab.tsx';
import { DataTab } from './components/DataTab.tsx';
import { CarpIcon } from './components/Logo.tsx';
import { PredictTab } from './components/PredictTab.tsx';
import { UserGuideTab } from './components/UserGuideTab.tsx';

type TabId = 'predict' | 'data' | 'guide' | 'about';

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'predict', label: 'Prediction' },
  { id: 'data', label: 'Data' },
  { id: 'guide', label: 'User Guide' },
  { id: 'about', label: 'About' },
];

/** Root application component with sticky header and tab navigation. */
export function App() {
  const [active, setActive] = useState<TabId>('predict');

  return (
    <div>
      <header className="app-header">
        {/* ── Wordmark ── */}
        <div className="app-wordmark">
          <CarpIcon size={30} variant="light" />
          <span>
            <span className="wordmark-poly" style={{ color: BRAND_NAVY }}>
              Poly
            </span>
            <span className="wordmark-carp" style={{ color: BRAND_AMBER }}>
              Carp
            </span>
          </span>
        </div>

        {/* ── Nav ── */}
        <nav className="app-nav">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`app-nav-btn${active === id ? ' active' : ''}`}
              onClick={() => setActive(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <div className="app-content">
        {active === 'predict' && <PredictTab />}
        {active === 'data' && <DataTab />}
        {active === 'guide' && <UserGuideTab />}
        {active === 'about' && <AboutTab />}
      </div>
    </div>
  );
}
