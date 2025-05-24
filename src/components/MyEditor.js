// components/MyEditor.jsx
import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const MyEditor = () => {
  const [editorData, setEditorData] = useState('');

  return (
    <div>
      <h2>CKEditor in React</h2>
      <CKEditor
        editor={ClassicEditor}
        data="<p>Hello from CKEditor!</p>"
        onChange={(event, editor) => {
          const data = editor.getData();
          setEditorData(data);
        }}
      />
      <div style={{ marginTop: '20px' }}>
        <h3>Editor Data:</h3>
        <div>{editorData}</div>
      </div>
    </div>
  );
};

export default MyEditor;


