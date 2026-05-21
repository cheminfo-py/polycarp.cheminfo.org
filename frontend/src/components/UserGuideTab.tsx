/** Step-by-step user guide for the PolyCarp prediction interface. */
export function UserGuideTab() {
  return (
    <div className="about-content guide-content">
      <h2>Quick start</h2>
      <p>
        Three steps to get your first prediction: (1) draw or select your two
        monomers, (2) set the reaction conditions, (3) click{' '}
        <strong>Predict</strong>. The results appear below the input panel.
      </p>

      <div className="guide-steps">
        {/* ── Step 1 ── */}
        <div className="guide-step">
          <div className="guide-step-number">1</div>
          <div className="guide-step-body">
            <h3>Define the two monomers</h3>
            <p>
              Each monomer card shows a structure editor. You can either draw a
              molecule directly in the canvas or click{' '}
              <strong>Load template</strong> to pick from a library of common
              vinyl monomers (styrene, MMA, acrylates, acrylamides, and more).
            </p>
            <p>
              The editor accepts standard bond-drawing interactions: click to
              place atoms, drag to draw bonds, right-click to delete. The SMILES
              string underneath the canvas updates live and can also be pasted
              directly.
            </p>
            <ul>
              <li>
                <strong>Monomer 1</strong> and <strong>Monomer 2</strong> are
                treated symmetrically — the order does not affect the
                prediction.
              </li>
              <li>
                Predictions are most reliable for common vinyl monomers.
                Structures with unusual functional groups or ring-opening motifs
                may fall outside the training distribution.
              </li>
            </ul>
          </div>
        </div>

        {/* ── Step 2 ── */}
        <div className="guide-step">
          <div className="guide-step-number">2</div>
          <div className="guide-step-body">
            <h3>Set reaction conditions</h3>
            <p>
              Copolymer architecture depends strongly on conditions — this is
              the core insight behind PolyCarp. Set all four parameters before
              running a prediction:
            </p>
            <dl className="guide-params">
              <dt>Solvent</dt>
              <dd>
                Draw or select the solvent molecule. The model uses the
                solvent&apos;s log<em>P</em> as a feature. If the
                monomer–solvent pair is predicted to have compatibility issues,
                a solubility warning is shown alongside the results.
              </dd>
              <dt>Temperature (°C)</dt>
              <dd>
                Reaction temperature in degrees Celsius. Most literature data
                falls in the 40–100 °C range; extrapolations far outside this
                range carry higher uncertainty.
              </dd>
              <dt>Polymerization method</dt>
              <dd>
                The physical setup: bulk, solution, emulsion, suspension, etc.
                Use <em>n/a</em> if the method is not known or not applicable.
              </dd>
              <dt>Polymerization type</dt>
              <dd>
                The initiation mechanism: free radical, controlled/living
                radical (ATRP, RAFT), cationic, anionic, coordination, etc. Free
                radical is the most data-rich category. Use <em>n/a</em> if
                unknown.
              </dd>
            </dl>
          </div>
        </div>

        {/* ── Step 3 ── */}
        <div className="guide-step">
          <div className="guide-step-number">3</div>
          <div className="guide-step-body">
            <h3>Run the prediction</h3>
            <p>
              Click <strong>Predict</strong>. The first request for a monomer
              pair may take up to a minute while XTB descriptors are computed;
              subsequent predictions using the same structures are served from
              cache and return in seconds.
            </p>
          </div>
        </div>
      </div>

      <h2>Interpreting the results</h2>

      <h3>Architecture prediction</h3>
      <p>
        The top card shows the predicted architecture class — <em>random</em>,{' '}
        <em>alternating</em>, or <em>gradient/block-like</em> — together with
        the classifier&apos;s confidence (the probability assigned to the
        winning class) and a full probability table across all three classes. A
        confidence below roughly 50 % indicates the system is near a class
        boundary; in such cases the condition optimisation grid is especially
        informative.
      </p>

      <h3>Condition optimisation grid</h3>
      <p>
        This heat-map sweeps over the solvent set and temperature range you
        selected in the settings and shows the predicted architecture for each
        combination. Use it to:
      </p>
      <ul>
        <li>
          See whether the prediction is robust (same class across most
          conditions) or sensitive (architecture flips with small changes).
        </li>
        <li>
          Identify which solvent–temperature combinations favour a target
          architecture.
        </li>
        <li>
          The <strong>Solvent set</strong> selector lets you focus on top
          predicted solvents, common lab solvents, chlorinated, or aromatic
          solvents. The <strong>Temperature range</strong> selector controls the
          sweep extent and step size.
        </li>
      </ul>

      <h3>Architecture switch (counterfactual)</h3>
      <p>
        This card reports the minimal change in conditions that would flip the
        predicted architecture — for example, switching from toluene at 60 °C to
        DMF at 80 °C to move from random to alternating. It is useful for
        designing experiments that probe the architecture boundary and for
        understanding which condition levers have the largest effect.
      </p>

      <h3>Nearest database entries</h3>
      <p>
        The table at the bottom lists the closest experimental records in the
        literature database, ranked by fingerprint similarity of the monomer
        pair. Each row shows the monomer structures, reported reactivity ratios,
        conditions, and the source publication. These neighbours serve as
        experimental grounding: if the nearest analogues were measured under
        similar conditions and share the predicted class, confidence is higher.
      </p>

      <h2>Browsing the database</h2>
      <p>
        The <strong>Data</strong> tab provides a searchable grid of all monomers
        and solvents in the curated database. Click a monomer card to copy its
        SMILES or load it directly into the prediction form. Use the search box
        to filter by name or SMILES fragment.
      </p>

      <h2>Tips and limitations</h2>
      <ul>
        <li>
          <strong>Condition sensitivity first.</strong> Before trusting a single
          prediction, inspect the condition optimisation grid. If the predicted
          class is stable across a wide range of solvents and temperatures, the
          prediction is robust.
        </li>
        <li>
          <strong>Check the nearest neighbours.</strong> If no close analogues
          exist in the database (low similarity scores), the prediction is an
          extrapolation and should be treated cautiously.
        </li>
        <li>
          <strong>Training distribution.</strong> The model was trained
          predominantly on free-radical polymerizations of vinyl monomers. For
          ring-opening, step-growth, or coordination mechanisms the training
          data is sparser and predictions carry higher uncertainty.
        </li>
        <li>
          <strong>Reactivity ratios vs. architecture.</strong> PolyCarp predicts
          the architecture class directly, not individual reactivity ratios (r₁,
          r₂). The architecture class is derived from the product r₁ × r₂ and
          the ratio r₁/r₂, so some information is deliberately abstracted.
        </li>
        <li>
          <strong>Solubility warnings.</strong> When the model detects a
          potential incompatibility between the monomer and solvent log
          <em>P</em> values it shows a warning. This does not prevent prediction
          but suggests the experiment may not be feasible as described.
        </li>
        <li>
          <strong>API access.</strong> All predictions are also available
          programmatically via the REST API documented in the{' '}
          <strong>API</strong> tab, enabling integration into computational
          workflows or high-throughput screening scripts.
        </li>
      </ul>
    </div>
  );
}
