/* eslint-disable @typescript-eslint/naming-convention */
// All snake_case properties below match the Python API response shape.

export interface NearestNeighbor {
  monomer1_smiles: string;
  monomer2_smiles: string;
  solvent_name: string;
  temperature: number;
  method: string;
  polytype: string;
  predicted_class_name: string;
  similarity: number;
  doi?: string;
  doi_url?: string;
}

export interface PreprocessResponse {
  success: boolean;
  error?: string;
  features: Record<string, number | null>;
  nearest_neighbors: NearestNeighbor[];
  solubility_issue: boolean | null;
}

export interface PredictResponse {
  // /predict does not always return a success field — check presence of
  // predicted_class_name instead to confirm a valid response.
  success?: boolean;
  error?: string;
  predicted_class: number;
  predicted_class_name: string;
  class_probabilities: Record<string, number>;
  confidence: number;
  timestamp?: string;
  solubility_issue?: boolean | null;
}

export interface OptimizePrediction {
  solvent_name: string;
  solvent_smiles?: string;
  solvent_logp: number;
  temperature: number;
  method: string;
  polytype: string;
  predicted_class: number;
  predicted_class_name: string;
  confidence: number;
  solubility_issue: boolean | null;
}

export interface OptimizeResponse {
  success?: boolean;
  predictions: OptimizePrediction[];
}

export interface CounterfactualReference {
  doi: string;
  doi_url: string;
  monomer1_name: string;
  monomer2_name: string;
}

export interface Counterfactual {
  predicted_class: number;
  predicted_class_name: string;
  solvent_name: string;
  temperature: number;
  delta_logp: number;
  delta_temperature: number;
  confidence: number;
  reference: CounterfactualReference | null;
}

export interface ArchitectureSwitchResponse {
  success: boolean;
  error?: string;
  baseline: {
    predicted_class_name: string;
    solvent_name: string;
    temperature: number;
  };
  n_evaluated: number;
  counterfactuals: Counterfactual[];
}

export interface FormState {
  monomer1Smiles: string;
  monomer2Smiles: string;
  solventSmiles: string;
  temperature: number;
  method: string;
  polytype: string;
  solventSet: string;
  temperatureMode: string;
}

export interface PredictionResults {
  prediction: PredictResponse;
  nearestNeighbors: NearestNeighbor[];
  solubilityIssue: boolean | null;
  rxnopt: OptimizePrediction[];
  architectureSwitch: ArchitectureSwitchResponse | null;
}
