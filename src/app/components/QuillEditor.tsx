"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useEffect, useRef } from "react";
import type ReactQuillType from "react-quill-new";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface QuillEditorProps {
  value: string;
  onChange: (val: string) => void;
  onEnterPress?: () => void;
}

export default function QuillEditor({
  value,
  onChange,
  onEnterPress,
}: QuillEditorProps) {
  const quillRef = useRef<ReactQuillType | null>(null);

  useEffect(() => {
    if (!quillRef.current) return;

    const quill = quillRef.current.getEditor?.();
    if (quill) {
      quill.root.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          onEnterPress?.();
        }
      });
    }
  }, [onEnterPress]);

  return <ReactQuill theme="snow" value={value} onChange={onChange} />;
}
