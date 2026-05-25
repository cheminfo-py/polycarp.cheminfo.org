import type { TabId } from '@blueprintjs/core';
import {
  Button,
  FormGroup,
  HTMLSelect,
  NumericInput,
  Spinner,
  Tab,
  Tabs,
} from '@blueprintjs/core';
import { useCallback, useState } from 'react';

import type { PredictParams } from '../api.ts';
import { runPrediction } from '../api.ts';
import { MONOMERS } from '../data/monomers.ts';
import { SOLVENTS } from '../data/solvents.ts';
import type { PredictionResults } from '../types.ts';

import { ArchitectureSwitch } from './ArchitectureSwitch.tsx';
import { MoleculeEditor } from './MoleculeEditor.tsx';
import { NearestResults } from './NearestResults.tsx';
import { OptimizationGrid } from './OptimizationGrid.tsx';
import { PredictionCard } from './PredictionCard.tsx';

const METHODS = [
  { label: 'n/a', value: 'n/a' },
  { label: 'Bulk', value: 'bulk' },
  { label: 'Solvent / Solution', value: 'solvent' },
  { label: 'Emulsion', value: 'emulsion' },
  { label: 'Suspension', value: 'suspension' },
  { label: 'Precipitation', value: 'precipitation' },
  { label: 'Slurry', value: 'slurry' },
  { label: 'Gas phase', value: 'gas phase' },
  { label: 'Aqueous dispersion', value: 'aqueous dispersion' },
  { label: 'Microemulsion', value: 'microemulsion' },
  { label: 'Miniemulsion', value: 'miniemulsion' },
  { label: 'Inverse emulsion', value: 'inverse emulsion' },
  { label: 'Semicontinuous', value: 'semicontinuous' },
  { label: 'Sealed tube', value: 'sealed tube' },
  { label: 'Confined', value: 'confined' },
  { label: 'Surface-initiated', value: 'surface-initiated' },
];

const POLYTYPES = [
  { label: 'n/a', value: 'n/a' },
  { label: 'Free radical', value: 'free radical' },
  {
    label: 'Controlled/Living radical (ATRP, RAFT…)',
    value: 'controlled/living radical',
  },
  { label: 'Cationic', value: 'cationic' },
  { label: 'Anionic', value: 'anionic' },
  { label: 'Coordination (Ziegler–Natta, metallocene)', value: 'coordination' },
  { label: 'Ring-opening (ROP)', value: 'ring-opening' },
  { label: 'Ring-opening metathesis (ROMP)', value: 'romp' },
  { label: 'Step-growth', value: 'step-growth' },
];

const SOLVENT_SETS = [
  { label: 'Top 3 predicted solvents', value: 'top3' },
  { label: 'Common solvents', value: 'common' },
  { label: 'Chlorinated solvents', value: 'chlorinated' },
  { label: 'Aromatic solvents', value: 'aromatic' },
];

const TEMP_MODES = [
  { label: '40–80 °C', value: '40-80' },
  { label: '20–100 °C', value: '20-100' },
  { label: 'Fixed 60 °C', value: 'fixed60' },
  { label: 'Step size 20 °C', value: 'step20' },
];

// Defaults to styrene + methyl methacrylate in chloroform at 60 °C — the
// textbook free-radical copolymerisation. ~150 literature entries for this
// monomer pair in the dataset; the model's "random to block like" prediction
// is supported by ~88% of them, so the landing screen demonstrates strong
// model-vs-literature agreement out of the box.
const DEFAULT_MONOMER1 = 'C=Cc1ccccc1'; // styrene
const DEFAULT_MONOMER2 = 'C=C(C)C(=O)OC'; // methyl methacrylate (canonical)
const DEFAULT_SOLVENT = 'ClC(Cl)Cl'; // chloroform

/**
 * Top-level Prediction page: molecule editors, polymerisation parameters and
 * the prediction results.
 *
 * The results area is rendered as a set of Blueprint sub-tabs ("Prediction",
 * "Condition optimization", "Architecture switch") so that only one results
 * panel is visible at a time. This keeps the page narrow enough for small
 * laptop screens. All prediction state lives here; the top-level App tabs are
 * unaffected.
 */
export function PredictTab() {
  const [monomer1Smiles, setMonomer1Smiles] = useState(DEFAULT_MONOMER1);
  const [monomer2Smiles, setMonomer2Smiles] = useState(DEFAULT_MONOMER2);
  const [solventSmiles, setSolventSmiles] = useState(DEFAULT_SOLVENT);
  const [temperature, setTemperature] = useState(60);
  const [method, setMethod] = useState('solvent');
  const [polytype, setPolytype] = useState('free radical');
  const [solventSet, setSolventSet] = useState('top3');
  const [temperatureMode, setTemperatureMode] = useState('step20');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PredictionResults | null>(null);
  const [resultsTab, setResultsTab] = useState<TabId>('prediction');

  const handlePredict = useCallback(async () => {
    if (!monomer1Smiles || !monomer2Smiles || !solventSmiles) {
      setError(
        'Please draw all three structures (Monomer 1, Monomer 2, Solvent).',
      );
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);
    setResultsTab('prediction');

    const params: PredictParams = {
      monomer1Smiles,
      monomer2Smiles,
      solventSmiles,
      temperature,
      method,
      polytype,
      solventSet,
      temperatureMode,
    };

    try {
      const res = await runPrediction(params);
      setResults(res);
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : String(error_));
    } finally {
      setLoading(false);
    }
  }, [
    monomer1Smiles,
    monomer2Smiles,
    solventSmiles,
    temperature,
    method,
    polytype,
    solventSet,
    temperatureMode,
  ]);

  return (
    <div className="predict-layout">
      {/* ── Top: settings toolbar (full width, horizontal, wraps) ── */}
      <div className="settings-bar">
        <div className="settings-bar-group">
          <h4>Polymerisation</h4>
          <div className="settings-bar-fields">
            <FormGroup label="Temperature (°C)" labelFor="temperature">
              <NumericInput
                id="temperature"
                value={temperature}
                onValueChange={(val) => setTemperature(val)}
                min={0}
                max={300}
                stepSize={5}
                minorStepSize={1}
                fill
              />
            </FormGroup>
            <FormGroup label="Method" labelFor="method">
              <HTMLSelect
                id="method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                fill
                options={METHODS}
              />
            </FormGroup>
            <FormGroup label="Type" labelFor="polytype">
              <HTMLSelect
                id="polytype"
                value={polytype}
                onChange={(e) => setPolytype(e.target.value)}
                fill
                options={POLYTYPES}
              />
            </FormGroup>
          </div>
        </div>

        <div className="settings-bar-group">
          <h4>Reaction Optimization</h4>
          <div className="settings-bar-fields">
            <FormGroup label="Solvent set" labelFor="solventSet">
              <HTMLSelect
                id="solventSet"
                value={solventSet}
                onChange={(e) => setSolventSet(e.target.value)}
                fill
                options={SOLVENT_SETS}
              />
            </FormGroup>
            <FormGroup label="Temperature range" labelFor="temperatureMode">
              <HTMLSelect
                id="temperatureMode"
                value={temperatureMode}
                onChange={(e) => setTemperatureMode(e.target.value)}
                fill
                options={TEMP_MODES}
              />
            </FormGroup>
          </div>
        </div>

        <div className="settings-bar-action">
          <Button
            size="large"
            intent="primary"
            loading={loading}
            onClick={() => {
              void handlePredict();
            }}
            icon="predictive-analysis"
          >
            Predict class
          </Button>
          {loading && (
            <span style={{ color: '#738091', fontSize: '0.78rem' }}>
              Running XTB… up to a minute on first request
            </span>
          )}
        </div>
      </div>

      {error && <div className="error-banner">⚠ {error}</div>}

      {/* ── Main area: monomers left, results right ── */}
      <div className="main-row">
        <div className="editors-col">
          <MoleculeEditor
            label="Monomer 1"
            smiles={monomer1Smiles}
            onSmilesChange={setMonomer1Smiles}
            templates={MONOMERS}
          />
          <MoleculeEditor
            label="Monomer 2"
            smiles={monomer2Smiles}
            onSmilesChange={setMonomer2Smiles}
            templates={MONOMERS}
          />
          <MoleculeEditor
            label="Solvent used for polymerisation"
            smiles={solventSmiles}
            onSmilesChange={setSolventSmiles}
            templates={SOLVENTS}
          />
        </div>

        <div className="results-col">
          {loading && !results && (
            <div className="loading-overlay">
              <Spinner size={48} intent="primary" />
              <span>
                Computing molecular descriptors and running prediction…
              </span>
            </div>
          )}
          {results && (
            <Tabs
              id="results-subtabs"
              className="results-subtabs"
              selectedTabId={resultsTab}
              onChange={(newTab) => setResultsTab(newTab)}
              renderActiveTabPanelOnly
            >
              <Tab
                id="prediction"
                title="Prediction"
                panel={
                  <PredictionCard
                    prediction={results.prediction}
                    solubilityIssue={results.solubilityIssue}
                    lookupClass={results.lookupClass}
                    lookupClassName={results.lookupClassName}
                  />
                }
              />
              <Tab
                id="optimization"
                title="Condition optimization"
                disabled={results.rxnopt.length === 0}
                panel={<OptimizationGrid predictions={results.rxnopt} />}
              />
              <Tab
                id="architecture"
                title="Architecture switch"
                disabled={!results.architectureSwitch}
                panel={
                  results.architectureSwitch ? (
                    <ArchitectureSwitch data={results.architectureSwitch} />
                  ) : undefined
                }
              />
              <Tab
                id="lookup"
                title="Nearest literature"
                disabled={results.nearestNeighbors.length === 0}
                panel={<NearestResults neighbors={results.nearestNeighbors} />}
              />
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
