import { InputGroup } from '@blueprintjs/core';
import { useState } from 'react';

import type { Template } from '../data/monomers.ts';
import { MONOMERS } from '../data/monomers.ts';
import { SOLVENTS } from '../data/solvents.ts';

import { MoleculeDisplay } from './MoleculeDisplay.tsx';

function MoleculeGrid({ items }: { items: Template[] }) {
  return (
    <div className="molecule-browse-grid">
      {items.map((item) => (
        <div key={item.name} className="molecule-browse-card">
          <MoleculeDisplay smiles={item.smiles} width={160} height={120} />
          <div className="molecule-browse-name">{item.name}</div>
          <div className="molecule-browse-smiles">{item.smiles}</div>
        </div>
      ))}
    </div>
  );
}

/** Browsable grid of monomers and solvents available for prediction. */
export function DataTab() {
  const [query, setQuery] = useState('');

  const filter = (items: Template[]) =>
    query
      ? items.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase()),
        )
      : items;

  const filteredMonomers = filter(MONOMERS);
  const filteredSolvents = filter(SOLVENTS);

  return (
    <div className="data-tab">
      <InputGroup
        leftIcon="search"
        placeholder="Filter by name…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="data-tab-search"
      />

      <h2 className="data-section-title">
        Monomers{' '}
        <span className="data-section-count">({filteredMonomers.length})</span>
      </h2>
      {filteredMonomers.length > 0 ? (
        <MoleculeGrid items={filteredMonomers} />
      ) : (
        <p className="data-empty">No monomers match your filter.</p>
      )}

      <h2 className="data-section-title" style={{ marginTop: 32 }}>
        Solvents{' '}
        <span className="data-section-count">({filteredSolvents.length})</span>
      </h2>
      {filteredSolvents.length > 0 ? (
        <MoleculeGrid items={filteredSolvents} />
      ) : (
        <p className="data-empty">No solvents match your filter.</p>
      )}
    </div>
  );
}
