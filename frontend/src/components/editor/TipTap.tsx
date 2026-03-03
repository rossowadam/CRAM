"use client"
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ToolBar } from "./ToolBar";
import Heading from "@tiptap/extension-heading"

export default function TipTap({
    description,
    onChange,
}:{
    description: string 
    onChange: (richText: string) => void
}) {
    const editor = useEditor({
        extensions: [StarterKit.configure({

        }), Heading.configure({
            HTMLAttributes:{
                class: 'text-xl font-bold',
                levels: [2],
            }
        })],
        content: description,
        editorProps: {
            attributes: {
                class: "rounded-md border min-h-[150px] border-0 input bg-background w-full max-h-[500px] overflow-y-auto"
            }, 
        },
        onUpdate({editor}){
            onChange(editor.getHTML())
            console.log(editor.getHTML())
        },
    })

    return (
        <div className="flex flex-col justify-stretch min-h-[250px] border-1 p-2 border-foreground rounded-lg">
            <ToolBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}