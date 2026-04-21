
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
  max?: number;
}

export default function TagsInput({ value, onChange, placeholder, label, max = 10 }: TagsInputProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag) && value.length < max) {
      onChange([...value, tag]);
      setInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      {label && <div className="mb-1 font-medium">{label}</div>}
      <div className="flex gap-2 mb-1 flex-wrap">
        {value.map(tag => (
          <span
            key={tag}
            className="bg-accent text-xs text-accent-foreground rounded px-2 py-1 mr-1 flex items-center"
          >
            {tag}
            <button type="button" className="ml-1 text-xs text-destructive" aria-label="Remove"
              onClick={() => removeTag(tag)}>
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button type="button" onClick={addTag} size="sm"
          disabled={!input.trim() || value.length >= max}>Add</Button>
      </div>
      <div className="text-xs text-muted-foreground mt-1">{`${value.length}/${max} chosen`}</div>
    </div>
  );
}
