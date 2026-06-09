import { workspace } from "../mock/workspace";

export function getSuggestions(input: string, appId: string) {
  const app = workspace.find((a) => a.id === appId);

  if (!app) return [];

  const allPatterns = app.steps.flatMap((s) => s.patterns);

  if (!input) return allPatterns;

  return allPatterns.filter((p) =>
    p.toLowerCase().includes(input.toLowerCase()),
  );
}
