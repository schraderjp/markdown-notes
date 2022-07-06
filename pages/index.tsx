import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { basicSetup, useCodeMirror } from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { xcodeLight } from '@uiw/codemirror-theme-xcode';
import {
  ViewUpdate,
  keymap,
  dropCursor,
  highlightSpecialChars,
  drawSelection,
} from '@codemirror/view';
import { useCallback } from 'react';
import { bracketMatching } from '@codemirror/language';
import { searchKeymap, search, selectMatches } from '@codemirror/search';
import { closeBrackets } from '@codemirror/autocomplete';
import { languages } from '@codemirror/language-data';
import { cursorDocEnd, history, standardKeymap } from '@codemirror/commands';
import { boldKeyBinding, bold } from '../utilities/codemirror/bold';
import { EditorState, Extension } from '@codemirror/state';

const Home: NextPage = () => {
  const [theme, setTheme] = useState<'light' | Extension | 'dark' | undefined>(
    xcodeLight
  );
  const [value, setValue] = useState('');
  const editor = useRef<HTMLDivElement>(null);
  const onChange = useCallback((value: string, viewUpdate: ViewUpdate) => {
    setValue(value);
  }, []);
  const { setContainer, view } = useCodeMirror({
    container: editor.current,
    basicSetup: false,
    extensions: [
      bracketMatching(),
      drawSelection(),
      closeBrackets(),
      dropCursor(),
      search(),
      highlightSpecialChars(),
      markdown({ base: markdownLanguage, codeLanguages: languages }),
      keymap.of(standardKeymap),
      keymap.of(searchKeymap),
      keymap.of([boldKeyBinding]),
      EditorState.allowMultipleSelections.of(true),
      history(),
    ],
    onChange: onChange,
    autoFocus: true,
    theme: theme,
    value: value,
    minHeight: '200px',
  });

  const getSavedNote = async (noteId: string | number) => {
    if (typeof noteId === 'number') noteId = noteId.toString();
    const data = await fetch('/api/notes', {
      method: 'POST',
      body: noteId,
    });
    const body = await data.json();

    view?.setState(
      EditorState.create({
        doc: body.note.content,
        extensions: [
          basicSetup({
            allowMultipleSelections: false,
            syntaxHighlighting: true,
            highlightActiveLine: false,
            lineNumbers: false,
            foldGutter: false,
          }),
        ],
      })
    );

  };
  const onThemeChange = () => {
    if (theme === xcodeLight) setTheme('dark');
    if (theme === 'dark') setTheme(xcodeLight);
  };

  useEffect(() => {
    if (editor.current) {
      setContainer(editor.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor.current]);

  return (
    <div>
      <Head>
        <title>Markdown Notes</title>
        <meta name="description" content="Markdown Notes App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome</h1>
        <button onClick={onThemeChange}>Change Theme</button>
        <button
          onClick={() => {
            if (view) bold(view);
          }}
        >
          Bold
        </button>
        <button
          onClick={async () => {
            if (view) {
              view?.focus();
              await getSavedNote(1);
              cursorDocEnd(view);
            }
          }}
        >
          Add Test Note
        </button>
        <button
          onClick={() => {
            if (view?.state) {
              console.log(cursorDocEnd(view));
            }
          }}
        >
          Focus
        </button>
      </main>
      <div ref={editor} />
    </div>
  );
};

export default Home;
