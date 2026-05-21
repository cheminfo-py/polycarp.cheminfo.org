/** About page — scientific background, dataset, and citation for PolyCarp. */
export function AboutTab() {
  return (
    <div className="about-content">
      <h2>What is PolyCarp?</h2>
      <p>
        <strong>PolyCarp</strong> (Copolymer Architecture Reactivity Predictor)
        is a condition-aware machine-learning tool that predicts the
        microstructure of radical copolymers. Given two monomers together with
        reaction conditions — solvent, temperature, and polymerization mechanism
        — it classifies the resulting copolymer as <em>random</em>,{' '}
        <em>alternating</em>, or <em>gradient/block-like</em> and retrieves the
        closest experimental analogues from a curated literature database.
      </p>

      <h2>Why does copolymer architecture matter?</h2>
      <p>
        The architecture of a statistical copolymer determines how the material
        behaves: an alternating sequence distributes co-monomers evenly, a
        random sequence gives statistical mixing, and a gradient or block-like
        sequence creates domain separation. Designing a polymer for a target
        property therefore begins with designing for a target architecture.
      </p>
      <p>
        Reactivity ratios — the central quantity behind copolymer architecture —
        have been known since Mayo and Lewis (1944) to depend on solvent,
        temperature, and polymerization mechanism. Yet every prior predictive
        approach, from the Q–e scheme of Alfrey and Price to recent
        machine-learning models, takes monomer structure alone as input and
        ignores conditions entirely. PolyCarp closes this gap by explicitly
        incorporating reaction conditions.
      </p>

      <h2>The database</h2>
      <p>
        Measurements for thousands of monomer pairs exist but are scattered
        across eight decades of heterogeneous literature, including publications
        predating digital archiving. We developed a vision–language-model
        pipeline that parses typeset tables and scanned figures, yielding{' '}
        <strong>3,792 copolymerizations</strong> from{' '}
        <strong>1,206 publications</strong>, each annotated with reactivity
        ratios, solvent, temperature, and polymerization mechanism. This is, to
        our knowledge, the first dataset at this scale to record reaction
        conditions per entry.
      </p>
      <p>
        The full database is openly available alongside the model and this web
        interface. You can browse monomers and solvents in the{' '}
        <strong>Data</strong> tab.
      </p>

      <h2>The model</h2>
      <p>
        The predictor combines molecular descriptors computed with{' '}
        <strong>XTB</strong> (extended tight-binding semi-empirical quantum
        chemistry) with a gradient-boosted classifier trained on the literature
        database. Solvent properties (log<em>P</em>), temperature, and
        polymerization type are incorporated as additional features alongside
        the monomer descriptors. The prediction pipeline runs four steps
        automatically:
      </p>
      <ol>
        <li>
          <strong>Preprocessing</strong> — XTB descriptors are computed (or
          fetched from cache) for the two monomers, and the nearest database
          neighbours are identified via fingerprint similarity.
        </li>
        <li>
          <strong>Architecture prediction</strong> — The classifier returns
          class probabilities and a predicted architecture label.
        </li>
        <li>
          <strong>Condition optimisation</strong> — A systematic sweep over
          solvents and temperatures shows how the predicted architecture changes
          across the condition space.
        </li>
        <li>
          <strong>Architecture-switch search</strong> — Counterfactual analysis
          identifies the minimal change in conditions that would flip the
          predicted architecture, highlighting which conditions are decisive.
        </li>
      </ol>

      <h2>Validation</h2>
      <p>
        The tool was validated against a literature case study in which it
        correctly captures solvent-driven architectural transitions, and against
        three prospective laboratory copolymerizations carried out specifically
        to test the model&apos;s predictions.
      </p>

      <h2>Citation</h2>
      <p>
        If you use PolyCarp or the underlying database in your research, please
        cite the corresponding publication:
      </p>
      <blockquote className="about-citation">
        Predicting copolymer architecture from literature-extracted data.{' '}
        <em>Manuscript in preparation.</em> See the{' '}
        <a
          href="https://github.com/lamalab-org/copolymer-reactivity"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub repository
        </a>{' '}
        for the latest preprint and dataset.
      </blockquote>

      <h2>Open availability</h2>
      <p>
        The database, trained model, and this web interface are all openly
        available under permissive licences. Programmatic access is provided via
        a REST API — see the <strong>API</strong> tab for interactive
        documentation.
      </p>

      <h2>Technical stack</h2>
      <p>
        Frontend built with{' '}
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          React
        </a>
        ,{' '}
        <a
          href="https://blueprintjs.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Blueprint
        </a>
        , and{' '}
        <a
          href="https://github.com/cheminfo/react-ocl"
          target="_blank"
          rel="noopener noreferrer"
        >
          react-ocl
        </a>{' '}
        (OpenChemLib). Backend powered by a Python/FastAPI service running XTB
        calculations and serving the curated database.
      </p>
    </div>
  );
}
