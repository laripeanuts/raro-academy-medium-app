import React from 'react';
import { RitchTextEditorProps } from './RitchTextEditor.type';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

export const RitchTextEditor: React.FC<RitchTextEditorProps> = ({
  label,
  name,
  onChange,
  value,
}) => {
  const mdParser = new MarkdownIt();
  function handleEditorChange({ html, text }: any) {
    if (onChange) {
      onChange(text || "");
    }
  }

  function onImageUpload(file: any) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (data: any) => {
        resolve(data.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  return (
    <>
      <label
        htmlFor={name}
        className="block my-2 text-xs font-semibold text-gray-600 uppercase"
      >
        {label}
      </label>
      <MdEditor
        style={{ height: "500px" }}
        renderHTML={(text) => mdParser.render(text)}
        value={value}
        onChange={handleEditorChange}
        onImageUpload={onImageUpload}
      />
    </>
  );
};