import { useEffect, useState } from "react";

type TreeNode = {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: TreeNode[];
  elements?: string[];
};

export type FlatNode = {
  name: string;
  path: string;
  type: "file" | "directory";
  depth: number;
  elements?: string[];
};

type SelectedFile = {
  name: string;
  path: string;
  content?: string;
  elements?: string[];
};

// =========================
// SAFE NORMALIZATION
// =========================
function normalizePath(path: string) {
  return (path || "").replace(/\\/g, "/");
}

// =========================
// FLATTEN TREE (SAFE)
// =========================
export function flattenTree(nodes: TreeNode[], depth = 0): FlatNode[] {
  if (!Array.isArray(nodes)) return [];

  let result: FlatNode[] = [];

  for (const node of nodes) {
    if (!node) continue;

    result.push({
      name: node.name ?? "",
      path: normalizePath(node.path ?? ""),
      type: node.type ?? "file",
      depth,
      elements: node.elements ?? [],
    });

    if (Array.isArray(node.children) && node.children.length > 0) {
      result = result.concat(flattenTree(node.children, depth + 1));
    }
  }

  return result;
}

// =========================
// HOOK
// =========================
export function useWorkspace() {
  const [files, setFiles] = useState<FlatNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [content, setContent] = useState<string>("");

  const [pageElements, setPageElements] = useState<Record<string, string[]>>(
    {},
  );

  // =========================
  // LOAD WORKSPACE TREE
  // =========================
  useEffect(() => {
    fetch("http://localhost:3001/api/files/workspace")
      .then(async (r) => {
        const raw = await r.json();
        console.log("🔥 RAW BACKEND DATA:", raw);

        // NORMALISATION ROBUSTE
        const data = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw?.workspace)
              ? raw.workspace
              : [];

        console.log("✅ NORMALIZED TREE:", data);

        const flat = flattenTree(data);
        console.log("✅ FLAT TREE:", flat);

        setFiles(flat);

        const index: Record<string, string[]> = {};

        const collect = (nodes: TreeNode[]) => {
          for (const node of nodes || []) {
            if (node?.type === "file" && node?.elements?.length) {
              index[normalizePath(node.path)] = node.elements;
            }
            if (node?.children) collect(node.children);
          }
        };

        collect(data);
        setPageElements(index);
      })
      .catch((err) => {
        console.error("Workspace fetch error:", err);
      });
  }, []);

  // =========================
  // SELECT FILE
  // =========================
  const selectFile = async (file: FlatNode) => {
    if (!file || file.type !== "file") return;

    try {
      const res = await fetch(
        `http://localhost:3001/api/files/file?path=${encodeURIComponent(
          file.path,
        )}`,
      );

      if (!res.ok) {
        console.error("Failed to load file");
        return;
      }

      const data: {
        content: string;
        elements?: string[];
      } = await res.json();

      setSelectedFile({
        name: file.name,
        path: file.path,
        content: data.content ?? "",
        elements: data.elements ?? file.elements ?? [],
      });

      setContent(data.content ?? "");
    } catch (err) {
      console.error("selectFile error:", err);
    }
  };

  // =========================
  // SAVE FILE
  // =========================
  const saveFile = async (newContent: string) => {
    if (!selectedFile) return;

    setContent(newContent);

    try {
      await fetch("http://localhost:3001/api/files/file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: selectedFile.path,
          content: newContent,
        }),
      });
    } catch (err) {
      console.error("saveFile error:", err);
    }
  };

  // =========================
  // AUTOCOMPLETE HELPERS
  // =========================
  const getAllElements = () => {
    return Object.values(pageElements).flat();
  };

  return {
    files,
    selectedFile,
    content,
    selectFile,
    saveFile,

    // autocomplete
    pageElements,
    getAllElements,
  };
}
