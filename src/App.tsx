import { useMemo, useState, useEffect } from "react";
import GherkinEditor from "./features/editor/GherkinEditor";
import { useWorkspace } from "./core/hooks/useWorkspace";
import type { FlatNode } from "./core/hooks/useWorkspace";
import { ChevronRight, ChevronDown, Folder, FileText } from "lucide-react";

type ThemeMode = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem("theme") as ThemeMode) || "dark";
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  return { theme, setTheme, toggleTheme };
}

// =========================
// PATH NORMALIZATION
// =========================
function normalizePath(path: string) {
  return (path || "").replace(/\\/g, "/").toLowerCase();
}

// =========================
// SECTION DETECTION (ROBUST)
// =========================
function getSection(file: FlatNode): "features" | "pages" | "services" | null {
  const p = normalizePath(file.path);

  if (p.includes("features")) return "features";
  if (p.includes("pages")) return "pages";
  if (p.includes("services")) return "services";

  return null;
}

// =========================
// GROUP BY FOLDER (SAFE)
// =========================
function groupByFolder(files: FlatNode[], section: string) {
  return files.reduce(
    (acc, file) => {
      const p = normalizePath(file.path);

      const parts = p.split("/");
      const idx = parts.findIndex((x) => x === section);

      const folder = parts[idx + 1] || "root";

      if (!acc[folder]) acc[folder] = [];
      acc[folder].push(file);

      return acc;
    },
    {} as Record<string, FlatNode[]>,
  );
}

export default function App() {
  const { theme, toggleTheme } = useTheme();

  const { files, selectedFile, content, selectFile, saveFile } = useWorkspace();

  const [openedFolders, setOpenedFolders] = useState<Record<string, boolean>>(
    {},
  );

  const toggleFolder = (folder: string) => {
    setOpenedFolders((prev) => ({
      ...prev,
      [folder]: !prev[folder],
    }));
  };

  // =========================
  // SAFE FILTERS
  // =========================
  const features = useMemo(
    () =>
      files.filter((f) => f?.type === "file" && getSection(f) === "features"),
    [files],
  );

  const pages = useMemo(
    () =>
      files.filter(
        (f) => f?.type === "file" && normalizePath(f.path).includes("/pages/"),
      ),
    [files],
  );

  const steps = useMemo(
    () =>
      files.filter((f) => f?.type === "file" && getSection(f) === "services"),
    [files],
  );

  const groupedFeatures = useMemo(
    () => groupByFolder(features, "features"),
    [features],
  );

  const normalizedPages = useMemo(() => {
    return pages.map((p) => ({
      name: p.name.trim().replace(".page.js", ""),
      elements: p.elements ?? [],
    }));
  }, [pages]);

  // =========================
  // RENDER TREE
  // =========================
  const renderTree = (title: string, grouped: Record<string, FlatNode[]>) => (
    <div className="sidebarSection">
      <div className="sidebarTitle">
        {title} ({Object.values(grouped).flat().length})
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="treeItem" style={{ opacity: 0.6 }}>
          Aucun fichier
        </div>
      ) : (
        Object.entries(grouped).map(([folder, items]) => {
          const isOpen = !!openedFolders[folder];

          return (
            <div key={folder} className="treeFolder">
              <div
                className="treeFolderHeader"
                onClick={() => toggleFolder(folder)}
              >
                {isOpen ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
                <Folder size={14} />
                <span>{folder.toUpperCase()}</span>
              </div>

              {isOpen && (
                <div className="treeFolderContent">
                  {items.map((file) => (
                    <div
                      key={file.path}
                      className={`treeItem ${
                        selectedFile?.path === file.path ? "active" : ""
                      }`}
                      onClick={() => selectFile(file)}
                    >
                      <FileText size={14} />
                      <span>{file.name}</span>

                      {file.elements?.length ? (
                        <span className="badge">{file.elements.length}</span>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  // =========================
  // FLAT LIST
  // =========================
  const renderFlatList = (title: string, list: FlatNode[]) => (
    <div className="sidebarSection">
      <div className="sidebarTitle">
        {title} ({list.length})
      </div>

      {list.length === 0 ? (
        <div className="treeItem" style={{ opacity: 0.6 }}>
          Aucun fichier
        </div>
      ) : (
        list.map((file) => (
          <div
            key={file.path}
            className={`treeItem ${
              selectedFile?.path === file.path ? "active" : ""
            }`}
            onClick={() => selectFile(file)}
          >
            <FileText size={14} />
            <span>{file.name}</span>

            {file.elements?.length ? (
              <span className="badge">{file.elements.length}</span>
            ) : null}
          </div>
        ))
      )}
    </div>
  );

  // =========================
  // UI
  // =========================

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logoBar">
          <span className="logoTitle">Gherkin Studio</span>

          <div className={`themeSwitch ${theme}`} onClick={toggleTheme}>
            <div className="themeSwitchThumb">
              {theme === "dark" ? "🌙" : "☀️"}
            </div>
          </div>
        </div>

        {renderTree("FEATURES", groupedFeatures)}
        {renderFlatList("PAGES", pages)}
        {renderFlatList("STEPS", steps)}
      </aside>

      <main className="workspace">
        <section className="editorContainer">
          <div className="editorToolbar">
            {selectedFile && (
              <div className="editorTab active">
                {selectedFile.name}

                {selectedFile.elements?.length ? (
                  <span className="badge">{selectedFile.elements.length}</span>
                ) : null}
              </div>
            )}
          </div>

          <div className="editorBody">
            <GherkinEditor
              value={content}
              onChange={saveFile}
              theme={`fun-${theme}`}
              pages={normalizedPages}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
