import { classColor } from '../archColors.ts';
import type { PredictResponse } from '../types.ts';

interface Props {
  prediction: PredictResponse;
  solubilityIssue: boolean | null;
}

/**
 * Card showing predicted polymer architecture class with confidence probabilities.
 * @param root0
 * @param root0.prediction
 * @param root0.solubilityIssue
 */
export function PredictionCard({ prediction, solubilityIssue }: Props) {
  const {
    predicted_class_name: predictedClassName,
    predicted_class: predictedClass,
    confidence,
    class_probabilities: classProbabilities,
    timestamp,
  } = prediction;

  const sortedProbs = Object.entries(classProbabilities).toSorted(
    ([, a], [, b]) => b - a,
  );
  const mainColor = classColor(predictedClassName, predictedClass);

  return (
    <div className="prediction-card">
      <h2>Prediction result</h2>
      {timestamp && <div className="prediction-timestamp">{timestamp}</div>}

      <div className="predicted-class-row">
        <span className="predicted-class-label">Predicted class:</span>
        <span
          className="predicted-class-name"
          style={{ background: mainColor }}
        >
          {predictedClassName}
        </span>
        {solubilityIssue && (
          <span className="solubility-warning">⚠ Solubility issue</span>
        )}
      </div>

      <div className="confidence-row">
        <span className="confidence-label">Confidence:</span>
        <span className="confidence-value">
          {(confidence * 100).toFixed(1)}%
        </span>
        <div className="confidence-bar-wrap">
          <div
            className="confidence-bar"
            style={{ width: `${confidence * 100}%`, background: mainColor }}
          />
        </div>
      </div>

      <div className="class-probs-title">Class Probabilities</div>
      <table className="class-probs-table">
        <tbody>
          {sortedProbs.map(([name, prob]) => {
            // Colour by the class name, not the sorted-rank loop index.
            const color = classColor(name);
            const isPredicted =
              name.toLowerCase() === predictedClassName.toLowerCase();
            return (
              <tr key={name} className={isPredicted ? 'predicted' : ''}>
                <td>
                  <span className="class-dot" style={{ background: color }} />
                  {name}
                </td>
                <td className="class-prob-bar-cell">
                  <div className="class-prob-bar-bg">
                    <div
                      className="class-prob-bar"
                      style={{ width: `${prob * 100}%`, background: color }}
                    />
                  </div>
                </td>
                <td style={{ textAlign: 'right', minWidth: 46 }}>
                  {(prob * 100).toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
