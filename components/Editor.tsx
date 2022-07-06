import { useEffect, useRef, useState } from 'react';
import { minimalSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { boldKeyBinding } from '../utilities/codemirror/bold';
import {
  Compartment,
  EditorState,
  Facet,
  StateEffect,
  StateField,
} from '@codemirror/state';

type Theme = 'light' | 'dark';

interface EditorProps {
  initialValue?: string;
}

const Editor = ({ initialValue = '' }: EditorProps) => {
  const wrapper = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<EditorView | null>(null);
  const initialized = useRef(false);

  // Compartments to allow for reconfiguring dynamically
  const allowMultiple = new Compartment();

  function setMultipleSelection(view: EditorView, value: boolean) {
    view.dispatch({
      effects: allowMultiple.reconfigure(
        EditorState.allowMultipleSelections.of(false)
      ),
    });
  }

  useEffect(() => {
    if (initialized.current === true) return;
    if (wrapper.current && !editor) {
      let view = new EditorView({
        doc: initialValue,
        parent: wrapper.current,
        extensions: [
          minimalSetup,

          allowMultiple.of(EditorState.allowMultipleSelections.of(true)),
          markdown({ base: markdownLanguage, codeLanguages: languages }),
          keymap.of([boldKeyBinding]),
        ],
      });
      setEditor(view);
      initialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapper.current]);

  return (
    <>
      <button
        onClick={() =>
          console.log(editor?.state.facet(EditorState.allowMultipleSelections))
        }
      >
        Multi Selection Value
      </button>
      <button
        onClick={() => {
          if (editor === null) return;
          setMultipleSelection(editor, false);
          console.log('done');
        }}
      >
        Multi Selection to False
      </button>
      <div ref={wrapper} />
    </>
  );
};

export default Editor;
