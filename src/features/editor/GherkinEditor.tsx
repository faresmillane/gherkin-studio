import Editor from "@monaco-editor/react";
import { stepSuggestions } from "../../core/steps/step.catalog";
import type * as Monaco from "monaco-editor";

const pages = [
  {
    name: "_LoginPage",
    elements: ["SubmitButton", "EmailField", "PasswordField"],
  },
  {
    name: "_DashboardPage",
    elements: ["Header", "UserMenu", "LogoutButton"],
  },
  {
    name: "users",
    elements: ["fares", "lea", "moi"],
  },
];

type CompletionMode = "keyword" | "step" | "page" | "element";

type GherkinContext = {
  mode: CompletionMode;
  pageName: string | null;
  keyword: string | null;
};

function getGherkinContext(line: string, column: number): GherkinContext {
  const beforeCursor = line.slice(0, column - 1);

  const stepKeywordMatch = beforeCursor.match(
    /^\s*(Given|When|Then|And|But)\b/,
  );
  const keyword = stepKeywordMatch?.[1] ?? null;

  if (!keyword) {
    return {
      mode: "keyword",
      pageName: null,
      keyword: null,
    };
  }

  const quoteCount = (beforeCursor.match(/"/g) ?? []).length;

  // 0 quote = step context
  if (quoteCount === 0) {
    return {
      mode: "step",
      pageName: null,
      keyword,
    };
  }

  // 1 quote = page context (inside the first quoted string)
  if (quoteCount === 1) {
    return {
      mode: "page",
      pageName: null,
      keyword,
    };
  }

  // 2+ quotes and odd count = inside second quoted string => element context
  if (quoteCount >= 3 && quoteCount % 2 === 1) {
    const pageName = beforeCursor.match(/"([^"]+)"/)?.[1] ?? null;

    return {
      mode: "element",
      pageName,
      keyword,
    };
  }

  // 2 quotes and closed page quote, no second quote yet:
  // we keep step mode so the user can continue typing, or trigger suggestions manually.
  return {
    mode: "step",
    pageName: null,
    keyword,
  };
}

function buildKeywordSuggestions(monaco: typeof Monaco) {
  return [
    "Feature",
    "Scenario",
    "Background",
    "Scenario Outline",
    "Examples",
    "Given",
    "When",
    "Then",
    "And",
    "But",
  ].map((k) => ({
    label: k,
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: [
      "Feature",
      "Scenario",
      "Background",
      "Scenario Outline",
      "Examples",
    ].includes(k)
      ? `${k}: `
      : `${k} `,
  }));
}

export default function GherkinEditor() {
  return (
    <div style={{ height: "100%" }}>
      <Editor
        height="100%"
        defaultLanguage="gherkin"
        theme="fun-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 24,
          fontFamily: "Fira Code, monospace",
          padding: { top: 20, bottom: 20 },
          lineNumbers: "on",
          glyphMargin: true,
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 0,
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          quickSuggestions: {
            other: true,
            comments: false,
            strings: true,
          },
          suggestOnTriggerCharacters: true,
          tabCompletion: "on",
          suggest: {
            showIcons: true,
          },
          acceptSuggestionOnEnter: "on",
        }}
        beforeMount={(monaco) => {
          monaco.languages.register({ id: "gherkin" });

          monaco.languages.setMonarchTokensProvider("gherkin", {
            tokenizer: {
              root: [
                [/^\s*Feature:/, "keyword.feature"],
                [/^\s*Scenario Outline:/, "keyword.scenario"],
                [/^\s*Background:/, "keyword.scenario"],
                [/^\s*Scenario:/, "keyword.scenario"],
                [
                  /^\s*(Scenario Outline:|Scenario:|Background:)(.*)$/,
                  ["keyword.scenario", "scenario.title"],
                ],
                [/^\s*Examples:/, "keyword.examples"],
                [/^\s*(Given|When|Then|And|But)/, "keyword.step"],
                [/".*?"/, "string"],
                [/^#.*$/, "comment"],
                [/^@.*$/, "tag"],
              ],
            },
          });

          monaco.editor.defineTheme("fun-dark", {
            base: "vs-dark",
            inherit: true,

            rules: [
              // =========================
              // GHERKIN KEYWORDS
              // =========================

              {
                token: "keyword.feature",
                foreground: "C792EA",
                fontStyle: "bold",
              },

              {
                token: "keyword.scenario",
                foreground: "82AAFF",
                fontStyle: "bold",
              },

              {
                token: "keyword.background",
                foreground: "89DDFF",
                fontStyle: "bold",
              },

              {
                token: "keyword.examples",
                foreground: "E5C07B",
                fontStyle: "bold",
              },

              {
                token: "keyword.step",
                foreground: "7EE787",
                fontStyle: "bold",
              },
              {
                token: "scenario.title",
                foreground: "7EE787",
                fontStyle: "bold",
              },
              {
                token: "string",
                foreground: "FFCB6B",
              },
              {
                token: "tag",
                foreground: "C792EA",
                fontStyle: "bold",
              },
            ],

            colors: {
              // =========================
              // EDITOR
              // =========================

              "editor.background": "#0F1117",

              "editor.foreground": "#E6EDF3",

              "editor.lineHighlightBackground": "#161B22",

              "editorCursor.foreground": "#82AAFF",

              "editor.selectionBackground": "#264F78",

              "editor.inactiveSelectionBackground": "#1D2A3A",

              // =========================
              // SUGGESTIONS
              // =========================

              "editorSuggestWidget.background": "#161B22",

              "editorSuggestWidget.border": "#30363D",

              "editorSuggestWidget.foreground": "#E6EDF3",

              "editorSuggestWidget.selectedBackground": "#223047",

              "editorSuggestWidget.highlightForeground": "#82AAFF",

              // =========================
              // HOVER
              // =========================

              "editorHoverWidget.background": "#161B22",

              "editorHoverWidget.border": "#30363D",

              // =========================
              // ERRORS / WARNINGS
              // =========================

              "editorError.foreground": "#F85149",

              "editorWarning.foreground": "#E3B341",

              // =========================
              // GUTTER
              // =========================

              "editorGutter.background": "#0F1117",

              // =========================
              // INPUTS
              // =========================

              "input.background": "#0D1117",

              "input.border": "#30363D",

              "input.foreground": "#E6EDF3",
            },
          });
        }}
        onMount={(editor, monaco) => {
          monaco.editor.setTheme("fun-dark");

          const model = editor.getModel();
          if (model) {
            monaco.editor.setModelLanguage(model, "gherkin");
          }

          editor.onDidChangeModelContent(() => {
            const model = editor.getModel();
            const position = editor.getPosition();

            if (!model || !position) return;

            const line = model.getLineContent(position.lineNumber);
            const before = line.slice(0, position.column - 1);

            const quoteCount = (before.match(/"/g) ?? []).length;

            const insideString = quoteCount % 2 === 1;

            if (insideString) {
              editor.trigger("manual", "editor.action.triggerSuggest", {});
            }
          });

          monaco.languages.registerCompletionItemProvider("gherkin", {
            triggerCharacters: ['"', ".", " "],

            provideCompletionItems: (model, position) => {
              const line = model.getLineContent(position.lineNumber);
              const context = getGherkinContext(line, position.column);

              const beforeCursor = line.slice(0, position.column - 1);

              // helper range factory (IMPORTANT FIX GLOBAL)
              const getRangeFromQuote = () => {
                const openQuoteIndex = beforeCursor.lastIndexOf('"');

                return {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: openQuoteIndex + 2,
                  endColumn: position.column,
                };
              };

              // =========================
              // 1. KEYWORDS (strict only when no context)
              // =========================
              if (context.mode === "keyword") {
                return {
                  suggestions: buildKeywordSuggestions(monaco),
                };
              }

              // =========================
              // 2. PAGE MODE (ONLY pages)
              // =========================
              if (context.mode === "page") {
                return {
                  suggestions: pages.map((p) => ({
                    label: p.name,
                    kind: monaco.languages.CompletionItemKind.Module,
                    insertText: p.name,
                    range: getRangeFromQuote(),
                  })),
                };
              }

              // =========================
              // 3. ELEMENT MODE (ONLY elements of page)
              // =========================
              if (context.mode === "element" && context.pageName) {
                const foundPage = pages.find(
                  (p) => p.name === context.pageName,
                );

                if (!foundPage) {
                  // fallback propre -> propose pages
                  return {
                    suggestions: pages.map((p) => ({
                      label: p.name,
                      kind: monaco.languages.CompletionItemKind.Module,
                      insertText: p.name,
                      range: getRangeFromQuote(),
                    })),
                  };
                }

                return {
                  suggestions: foundPage.elements.map((el) => ({
                    label: el,
                    kind: monaco.languages.CompletionItemKind.Field,
                    insertText: el,
                    range: getRangeFromQuote(),
                  })),
                };
              }

              // =========================
              // 4. STEP MODE (ONLY steps)
              // =========================
              if (context.mode === "step" && context.keyword) {
                const line = model.getLineContent(position.lineNumber);
                const cleanLine = line.trimStart();
                const keywordMatch = cleanLine.match(
                  /^\s*(Given|When|Then|And|But)\b/,
                );
                const keywordLength = keywordMatch?.[1]?.length ?? 0;

                const range = {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: keywordLength + 2,
                  endColumn: Math.max(position.column, keywordLength + 2),
                };

                return {
                  suggestions: stepSuggestions.map((step) => ({
                    label: step.label,
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: step.insertText,
                    insertTextRules:
                      monaco.languages.CompletionItemInsertTextRule
                        .InsertAsSnippet,
                    detail: step.category,
                    range,
                  })),
                };
              }

              // =========================
              // 5. DEFAULT SAFE FALLBACK
              // =========================
              return {
                suggestions: buildKeywordSuggestions(monaco),
              };
            },
          });
        }}
      />
    </div>
  );
}
