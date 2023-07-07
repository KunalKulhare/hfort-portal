import React, { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const TextEditor = ({ initialValue, getContent }) => {
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );
    const handleEditorChange = (state) => {
        setEditorState(state);
        getContent(convertToRaw(editorState.getCurrentContent()));
    };

    return (
        <div>
            <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                value={initialValue}
                onChange={(content) => getContent(content)}
                toolbar={{
                    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'remove', 'history'],
                    inline: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true },
                }}
            />
        </div>
    );
}

export default TextEditor;