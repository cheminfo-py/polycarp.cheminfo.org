/** Static about page describing PolyCarp's approach and citation. */
export function AboutTab() {
  return (
    <div className="about-content">
      <h2>About PolyCarp</h2>
      <p>
        <strong>PolyCarp</strong> (Copolymer Reactivity Prediction) is a
        machine-learning tool for predicting the microstructure of radical
        copolymers. Given two monomers, a solvent, and reaction conditions, it
        predicts whether the resulting copolymer will have a <em>random</em>,{' '}
        <em>block-like</em>, or <em>alternating</em> architecture.
      </p>

      <h2>How it works</h2>
      <p>
        The model combines molecular descriptors computed with{' '}
        <strong>XTB</strong> (extended tight-binding) with a gradient-boosted
        classifier trained on a curated literature database of copolymer
        synthesis experiments. Reaction conditions (temperature, polymerization
        method and type) and solvent properties (logP) are incorporated as
        additional features.
      </p>
      <p>The prediction pipeline runs four steps automatically:</p>
      <ol>
        <li>
          <strong>Preprocessing</strong> — XTB molecular descriptors are
          computed (or fetched from cache) and the nearest database neighbours
          are identified via fingerprint similarity.
        </li>
        <li>
          <strong>Class prediction</strong> — The classifier returns class
          probabilities and a predicted architecture.
        </li>
        <li>
          <strong>Condition optimisation</strong> — A sweep over solvents and
          temperatures shows how the prediction changes across conditions.
        </li>
        <li>
          <strong>Architecture-switch search</strong> — The tool searches for
          the minimal change in conditions that would flip the predicted
          architecture (counterfactual analysis).
        </li>
      </ol>

      <h2>Usage notes</h2>
      <ul>
        <li>
          Draw monomers and solvent in the editors on the left, or pick a
          structure from the template library.
        </li>
        <li>
          The first prediction may take up to a minute if XTB descriptors are
          not yet cached.
        </li>
        <li>
          Predictions are most reliable for common vinyl monomers. Unusual
          functional groups may fall outside the training distribution.
        </li>
        <li>
          A solubility-issue warning is shown when the model detects potential
          compatibility problems between monomer and solvent.
        </li>
      </ul>

      <h2>Citation</h2>
      <p>
        If you use PolyCarp in your research, please cite the corresponding
        publication. See the{' '}
        <a
          href="https://github.com/lamalab-org/copolymer-reactivity"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub repository
        </a>{' '}
        for details.
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
        calculations.
      </p>
    </div>
  );
}
