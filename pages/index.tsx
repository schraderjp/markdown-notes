import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import CodeMirror, { useCodeMirror } from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { ViewUpdate } from '@codemirror/view';
import { useCallback } from 'react';
import { languages } from '@codemirror/language-data';
import { cursorDocEnd } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';

type Theme = 'light' | 'dark';

const Home: NextPage = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [value, setValue] = useState('');
  const editor = useRef<HTMLDivElement>(null);
  const onChange = useCallback((value: string, viewUpdate: ViewUpdate) => {
    setValue(value);
  }, []);
  const { setContainer, view } = useCodeMirror({
    container: editor.current,
    extensions: [
      markdown({ base: markdownLanguage, codeLanguages: languages }),
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

    const transaction = view?.state.update({
      changes: {
        from: 0,
        to: view?.state?.doc.length,
        insert: body.note.content,
      },
    });

    if (transaction && view) {
      view?.dispatch(transaction);
      cursorDocEnd(view);
    }
  };
  const onThemeChange = () => {
    if (theme === 'light') setTheme('dark');
    if (theme === 'dark') setTheme('light');
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
