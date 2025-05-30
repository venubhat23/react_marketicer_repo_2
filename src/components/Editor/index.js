import React, { useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const MyEditor = ({ value, onChange }) => {
  // You can add TinyMCE plugins and configuration here if needed

  return (
    <Editor
      apiKey="kyzi2iw9mxwjzebfqfbv9ppb8h8iz3oh99he954kmgy1y53t"
      value={value} // Bind the value to the parent state (postContent)
      init={{
        plugins: 'emoticons',
        toolbar: 'bold italic emoticons',
        menubar: false,
        height: 200,
        statusbar: false, // Removes the status bar at the bottom
        branding: false,  // Removes the "Build with" branding
      }}
      onEditorChange={(content, editor) => {
        onChange(content); // Pass the content to the parent component via onChange
      }}
    />
  );
};

export default MyEditor;
