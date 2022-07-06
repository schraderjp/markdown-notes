import React from 'react';
import { NextPage } from 'next';
import Editor from '../components/Editor';

const EditorPage: NextPage = () => {
  return <Editor initialValue="# Test" />;
};

export default EditorPage;
