import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles } from "lucide-react";
import contextOptions from "@/components/ui/contextOptions";

export default function PromptInput({ onSend, context, setContext, disabled, input: inputProp, setInput: setInputProp }) {
    const [input, setInput] = useState("");
    // Use controlled input if provided from parent, else local state
    const value = inputProp !== undefined ? inputProp : input;
    const setValue = setInputProp !== undefined ? setInputProp : setInput;

    return (
        <form
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-3 space-y-3 shadow-lg"
            onSubmit={e => {
                e.preventDefault();
                if (value.trim() && !disabled) {
                    onSend(value);
                    setValue("");
                }
            }}
        >
            {/* Top area: context dropdown */}
            {setContext && (
                <div className="flex flex-wrap items-center gap-2">
                    <Badge
                        variant="secondary"
                        className="rounded-full px-3 py-1 text-xs bg-zinc-800 text-zinc-300 border border-zinc-700"
                    >
                        <Sparkles className="w-3 h-3 mr-1 inline" />
                        Context
                    </Badge>
                    <select
                        className="rounded-lg px-3 py-1.5 text-xs bg-zinc-800 text-zinc-200 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={context}
                        onChange={e => setContext(e.target.value)}
                        disabled={disabled}
                    >
                        {contextOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Input */}
            <Input
                placeholder="Ask anything... (e.g., Explain photosynthesis)"
                className="border-none bg-transparent text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-0 text-sm"
                value={value}
                onChange={e => setValue(e.target.value)}
                disabled={disabled}
            />

            {/* Bottom bar */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        AI Ready
                    </span>
                </div>

                <Button 
                    size="sm" 
                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4" 
                    type="submit" 
                    disabled={!value.trim() || disabled}
                >
                    {disabled ? (
                        <>
                            <span className="animate-spin mr-2">⏳</span>
                            Thinking...
                        </>
                    ) : (
                        <>
                            <Send className="h-4 w-4 mr-1" />
                            Send
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
