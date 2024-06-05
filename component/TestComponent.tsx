"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import ReactQuill, { ReactQuillProps } from "react-quill";
import { useMemo, useRef } from "react";
import { useEditorStore } from "@/store/editorStore";
import { useRouter } from "next/navigation";

const colors = [
  "transparent",
  "white",
  "red",
  "yellow",
  "green",
  "blue",
  "purple",
  "gray",
  "black",
];
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "color",
  "image",
  "background",
  "align",
];

const TestComponent = dynamic(
  async () => {
    const { default: QuillComponent } = await import("react-quill");

    function ReactQuillComponent(props: ReactQuillProps) {
      const fileInput = useRef<HTMLInputElement | null>(null);
      const quillRef = useRef<ReactQuill>(null);
      const editorTitle = useEditorStore((state) => state.editorTitle);
      const updateTitle = useEditorStore((state) => state.updateTitle);
      const editorContent = useEditorStore((state) => state.editorContent);
      const updateContent = useEditorStore((state) => state.updateContent);
      const router = useRouter();

      const modules = useMemo(
        () => ({
          toolbar: {
            container: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [{ align: ["right", "center", "justify"] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              [{ color: colors }],
              [{ background: colors }],
            ],
            handlers: {
              image: () => {
                fileInput.current?.click();
              },
            },
          },
        }),
        []
      );

      const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {
        const file = e.target.files?.[0];
        if (file) {
          const formData = new FormData();
          formData.append("file", file);

          try {
            const response = await fetch(
              "http://43.203.231.182:5000/api/img/",
              {
                method: "POST",
                body: formData,
              }
            );

            if (response.ok) {
              const data = await response.json();
              const imageUrl = data.imgUrl;
              const quillEditor = quillRef.current?.getEditor();
              const range = quillEditor?.getSelection()?.index;
              if (range !== null && range !== undefined) {
                quillEditor?.insertEmbed(range, "image", imageUrl);
              }
            } else {
              console.error("Image upload failed");
            }
          } catch (error) {
            console.error("Error uploading image:", error);
          }
        }
      };

      const createContent = async () => {
        try {
          const response = await fetch(
            "http://43.203.231.182:5000/api/contents/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: editorTitle,
                content: editorContent,
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            alert("글이 등록되었습니다.");
            updateTitle("");
            updateContent("");
            router.push("/");
          }
        } catch (error) {
          console.error(error);
        }
      };

      return (
        <>
          <input
            type="text"
            value={editorTitle}
            onChange={(e) => {
              updateTitle(e.target.value);
            }}
            className="title-input"
            placeholder="제목"
          />
          <input
            type="file"
            ref={fileInput}
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
          <QuillComponent
            ref={quillRef}
            formats={formats}
            modules={modules}
            value={editorContent}
            onChange={updateContent}
            {...props}
          />
          <button onClick={createContent}>글 등록</button>
        </>
      );
    }

    return ReactQuillComponent;
  },
  {
    loading: () => <div></div>,
    ssr: false,
  }
);

export default TestComponent;
