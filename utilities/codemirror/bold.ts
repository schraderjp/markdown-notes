import { ChangeSpec, EditorState, SelectionRange, Transaction, TransactionSpec } from "@codemirror/state";
import {EditorView} from '@codemirror/view'

  export function bold(view: EditorView) {
    const transaction = view.state.changeByRange((range)=> {
        const originalText = view.state.sliceDoc(range.from, range.to);
        const regex = /\*\*.*\*\*/g;
        let newText;
        let newTo;
        let newFrom;
        if (originalText.match(regex)) {
            newText = originalText.slice(2, originalText.length-2)
            newTo = range.to - 4;
            newFrom = range.from;
        } else {
            newText = `**${originalText}**`
            newTo = range.to + 4;
            newFrom = range.from;
        }
        return {
            range: range.extend(newFrom, newTo),
            changes: {
                from: range.from,
                insert: newText,
                to: range.to,
              },
        }
    });

    view.dispatch(transaction);

    return true;
  }

  export const boldKeyBinding = {
    key: 'Ctrl-b',
    run: bold,
  }