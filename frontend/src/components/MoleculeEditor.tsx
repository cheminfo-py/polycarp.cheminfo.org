import { Button, Dialog, DialogBody, DialogFooter } from '@blueprintjs/core';
import { useCallback, useState } from 'react';
import type { CanvasEditorOnChangeMolecule } from 'react-ocl';
import { CanvasMoleculeEditor } from 'react-ocl';

import type { Template } from '../data/monomers.ts';

import { MoleculeDisplay } from './MoleculeDisplay.tsx';
import { TemplateDialog } from './TemplateDialog.tsx';

interface Props {
  label: string;
  smiles: string;
  onSmilesChange: (smiles: string) => void;
  templates: Template[];
}

const EDITOR_W = 680;
const EDITOR_H = 460;

export function MoleculeEditor({
  label,
  smiles,
  onSmilesChange,
  templates,
}: Props) {
  const [editorKey, setEditorKey] = useState(0);
  const [editorInitialSmiles, setEditorInitialSmiles] = useState(smiles);
  const [draftSmiles, setDraftSmiles] = useState(smiles);
  const [showEditor, setShowEditor] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleOpenEditor = useCallback(() => {
    setEditorInitialSmiles(smiles);
    setDraftSmiles(smiles);
    setEditorKey((k) => k + 1);
    setShowEditor(true);
  }, [smiles]);

  const handleEditorChange = useCallback(
    (event: CanvasEditorOnChangeMolecule) => {
      const newSmiles = event.getSmiles();
      if (newSmiles) setDraftSmiles(newSmiles);
    },
    [],
  );

  const handleDone = useCallback(() => {
    onSmilesChange(draftSmiles);
    setShowEditor(false);
  }, [draftSmiles, onSmilesChange]);

  const handleCancel = useCallback(() => {
    setShowEditor(false);
  }, []);

  const handleTemplateSelect = useCallback(
    (templateSmiles: string) => {
      onSmilesChange(templateSmiles);
      setShowTemplates(false);
    },
    [onSmilesChange],
  );

  return (
    <>
      <div className="molecule-card">
        <div className="molecule-card-header">
          <span className="molecule-card-label">{label}</span>
          <Button
            size="small"
            variant="minimal"
            intent="primary"
            onClick={() => setShowTemplates(true)}
          >
            Templates
          </Button>
        </div>
        <div
          className="molecule-card-preview"
          onClick={handleOpenEditor}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleOpenEditor();
          }}
        >
          <MoleculeDisplay smiles={smiles} width={220} height={140} />
          <div className="molecule-card-overlay">
            <span className="molecule-card-edit-hint">✏ Edit</span>
          </div>
        </div>
      </div>

      <Dialog
        isOpen={showEditor}
        onClose={handleCancel}
        title={`Edit — ${label}`}
        style={{ width: EDITOR_W + 2 }}
      >
        <DialogBody style={{ padding: 0, overflow: 'hidden' }}>
          <CanvasMoleculeEditor
            key={editorKey}
            inputValue={editorInitialSmiles}
            inputFormat="smiles"
            onChange={handleEditorChange}
            width={EDITOR_W}
            height={EDITOR_H}
          />
        </DialogBody>
        <DialogFooter
          actions={
            <Button intent="primary" onClick={handleDone}>
              Done
            </Button>
          }
        >
          <Button variant="minimal" onClick={handleCancel}>
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>

      <TemplateDialog
        isOpen={showTemplates}
        title={`Select ${label}`}
        templates={templates}
        onSelect={handleTemplateSelect}
        onClose={() => setShowTemplates(false)}
      />
    </>
  );
}
