import type { NearestNeighbor } from '../types.ts';

import { DoiButton } from './DoiButton.tsx';
import { MoleculeDisplay } from './MoleculeDisplay.tsx';

const CLASS_COLORS: Record<string, string> = {
  random: '#1c3d6e',
  block: '#7b2929',
  'block like': '#7b2929',
  alternating: '#b5621e',
};

function archColor(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, color] of Object.entries(CLASS_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return '#555';
}

interface Props {
  neighbors: NearestNeighbor[];
}

/**
 * Table of nearest database neighbors for the current monomer pair.
 * @param root0
 * @param root0.neighbors
 */
export function NearestResults({ neighbors }: Props) {
  if (neighbors.length === 0) return null;

  return (
    <div className="nearest-card">
      <h2>Nearest database results</h2>
      <div className="nearest-table-wrap">
        <table className="nearest-table">
          <thead>
            <tr>
              <th>Monomer 1</th>
              <th>Monomer 2</th>
              <th>Solvent</th>
              <th>Temp (°C)</th>
              <th>Method</th>
              <th>Type</th>
              <th>Architecture</th>
              <th>Similarity</th>
            </tr>
          </thead>
          <tbody>
            {neighbors.map((n) => (
              <tr
                key={`${n.monomer1_smiles}|${n.monomer2_smiles}|${n.solvent_name}`}
              >
                <td>
                  <MoleculeDisplay
                    smiles={n.monomer1_smiles}
                    width={100}
                    height={75}
                  />
                </td>
                <td>
                  <MoleculeDisplay
                    smiles={n.monomer2_smiles}
                    width={100}
                    height={75}
                  />
                </td>
                <td>{n.solvent_name}</td>
                <td>{n.temperature}</td>
                <td>{n.method}</td>
                <td>{n.polytype}</td>
                <td>
                  <span
                    className="arch-badge"
                    style={{ background: archColor(n.predicted_class_name) }}
                  >
                    {n.predicted_class_name}
                  </span>
                </td>
                <td>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <span className="similarity-badge">
                      {n.similarity.toFixed(2)}
                    </span>
                    {n.doi_url && (
                      <DoiButton doi={n.doi ?? n.doi_url} url={n.doi_url} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
