import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Trash2, Maximize2, Minimize2 } from "lucide-react";

interface PythonEditorProps {
  isHidden?: boolean;
}

const PythonEditor = ({ isHidden = false }: PythonEditorProps) => {
  const [code, setCode] = useState(`# כתוב כאן קוד פייתון
print("שלום עולם!")

# נסה לשנות את הקוד ולהריץ אותו
`);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setOutput("מריץ קוד...");
    
    try {
      // Using Pyodide via CDN for client-side Python execution
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: "python",
          version: "3.10",
          files: [
            {
              content: code,
            },
          ],
        }),
      });

      const data = await response.json();
      
      if (data.run) {
        const result = data.run.output || data.run.stderr || "הקוד רץ בהצלחה (ללא פלט)";
        setOutput(result);
      } else {
        setOutput("שגיאה בהרצת הקוד");
      }
    } catch (error) {
      console.error("Error running Python code:", error);
      setOutput("שגיאה בחיבור לשרת ההרצה");
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput("");
  };

  if (isHidden) return null;

  return (
    <div className={`flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden ${isExpanded ? 'fixed inset-4 z-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <span className="font-medium text-sm">עורך פייתון</span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col min-h-0">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 p-4 font-mono text-sm bg-background resize-none focus:outline-none focus:ring-0 border-none"
          dir="ltr"
          style={{ minHeight: "150px" }}
          placeholder="כתוב כאן קוד פייתון..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 py-2 border-t border-border bg-muted/30">
        <Button
          size="sm"
          onClick={runCode}
          disabled={isRunning}
          className="gap-2"
        >
          <Play className="h-4 w-4" />
          {isRunning ? "מריץ..." : "הרץ קוד"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={clearOutput}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          נקה פלט
        </Button>
      </div>

      {/* Output */}
      <div className="border-t border-border">
        <div className="px-4 py-2 bg-muted/50 text-sm font-medium border-b border-border">
          פלט:
        </div>
        <pre
          className="p-4 font-mono text-sm bg-background overflow-auto"
          dir="ltr"
          style={{ minHeight: "100px", maxHeight: "200px" }}
        >
          {output || "הפלט יופיע כאן לאחר הרצת הקוד..."}
        </pre>
      </div>
    </div>
  );
};

export default PythonEditor;
