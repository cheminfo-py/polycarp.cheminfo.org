// --- Prediction + reaction optimization (stable render order) ---
// Key idea: set rxnopt first, then set result LAST so the view renders once with both.

const Molecule = OCL.Molecule;
// const url = 'https://polygalaceous-guadalupe-gonangial.ngrok-free.dev';
// const url = 'https://copolymer.cheminfo.org';
const url = "https://polycarp.cheminfo.org/api";

const prefs = API.getData("preferences").resurrect();
const molfile1 = API.getData("molfile1").resurrect();
const molfile2 = API.getData("molfile2").resurrect();
const molfileSolvent = API.getData("molfileSolvent").resurrect();

const smiles1 = Molecule.fromMolfile(molfile1).toSmiles();
const smiles2 = Molecule.fromMolfile(molfile2).toSmiles();
const smilesSolvent = Molecule.fromMolfile(molfileSolvent).toSmiles();

function safeNum(x, fallback) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

const payloadBase = {
  monomer1_smiles: smiles1,
  monomer2_smiles: smiles2,
  solvent_smiles: smilesSolvent,
  method: prefs.polymerisationMethod || "solvent",
  polytype: prefs.polymerisationType || "free radical",
  temperature: safeNum(prefs.temperature, 60.0),
};

fetch(url + "/preprocess_all", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payloadBase),
})
  .then((r) => r.json())
  .then((preprocessed) => {
    if (!preprocessed || !preprocessed.success) {
      throw new Error(preprocessed?.error || "Preprocessing failed");
    }

    // Values from preprocess_all
    const nearestNeighbors = preprocessed.nearest_neighbors || null;
    const solubilityIssuePre = preprocessed.solubility_issue ?? null;

    // /predict rejects null feature values (XTB may return null when a
    // descriptor cannot be computed); drop them so the API validates cleanly.
    const features = Object.fromEntries(
      Object.entries(preprocessed.features).filter(([, v]) => v !== null),
    );

    // predict (needs features + smiles)
    return fetch(url + "/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        features,
        monomer1_smiles: smiles1,
        monomer2_smiles: smiles2,
        solvent_smiles: smilesSolvent,
      }),
    })
      .then((r) => r.json())
      .then((result) => {
        // Build final result object
        const finalResult = {
          ...result,
          nearest_neighbors: nearestNeighbors,
          solubility_issue:
            result?.solubility_issue !== null &&
            result?.solubility_issue !== undefined
              ? result.solubility_issue
              : solubilityIssuePre,
        };

        // Run reaction optimization BEFORE setting 'result'
        return fetch(url + "/optimize_reaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payloadBase,
            temperature_step: 20.0,
            n_solvents: 3,
          }),
        })
          .then((r) => r.json())
          .then((rxnOptResponse) => {
            // Always store rxnopt as a LIST
            const predictions = Array.isArray(rxnOptResponse?.predictions)
              ? rxnOptResponse.predictions
              : [];

            API.createData("rxnopt", predictions);
            API.createData("rxnopt_error", null);

            // Now set result last to trigger a single render with both
            API.createData("nearestneighbor", finalResult.nearest_neighbors);
            API.createData("result", finalResult);

            return finalResult;
          })
          .catch((optErr) => {
            console.warn("Reaction optimization failed:", optErr);

            // Always store rxnopt as a LIST even on failure
            API.createData("rxnopt", []);
            API.createData(
              "rxnopt_error",
              optErr?.message || "Reaction optimization failed",
            );

            // Still set result last
            API.createData("nearestneighbor", finalResult.nearest_neighbors);
            API.createData("result", finalResult);

            return finalResult;
          });
      });
  })
  .catch((err) => {
    console.warn("Pipeline failed:", err);

    // Keep rxnopt consistent
    API.createData("rxnopt", []);
    API.createData(
      "rxnopt_error",
      "Preprocessing failed, optimization skipped",
    );

    // Result error object
    API.createData("result", {
      error: err?.message || "Unknown error",
      success: false,
    });
  });
