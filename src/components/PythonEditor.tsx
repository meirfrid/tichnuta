import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Trash2, Loader2 } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);
  const pyodideRef = useRef<any>(null);

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;

    setIsLoading(true);
    try {
      // Load Pyodide script if not already loaded
      if (!(window as any).loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Pyodide"));
          document.head.appendChild(script);
        });
      }

      const pyodide = await (window as any).loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
      });
      pyodideRef.current = pyodide;
      return pyodide;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const runCode = async () => {
    setIsRunning(true);
    setOutput("טוען סביבת פייתון...");

    try {
      const pyodide = await loadPyodide();

      // Capture stdout and stderr
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

      try {
        pyodide.runPython(code);
        const stdout = pyodide.runPython("sys.stdout.getvalue()");
        const stderr = pyodide.runPython("sys.stderr.getvalue()");
        const result = (stdout || "") + (stderr || "");
        setOutput(result || "הקוד רץ בהצלחה (ללא פלט)");
      } catch (err: any) {
        setOutput(err.message || "שגיאה בהרצת הקוד");
      } finally {
        // Reset stdout/stderr
        pyodide.runPython(`
import sys
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);
      }
    } catch (error: any) {
      console.error("Error running Python code:", error);
      setOutput("שגיאה בטעינת סביבת הפייתון. נסה שוב.");
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput("");
  };

  if (isHidden) return null;

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <span className="font-medium text-sm">עורך פייתון</span>
      </div>

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

      <div className="flex items-center gap-2 px-4 py-2 border-t border-border bg-muted/30">
        <Button
          size="sm"
          onClick={runCode}
          disabled={isRunning || isLoading}
          className="gap-2"
        >
          {isRunning || isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isLoading ? "טוען..." : isRunning ? "מריץ..." : "הרץ קוד"}
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
