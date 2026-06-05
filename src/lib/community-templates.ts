import fs from "node:fs";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import {
  DATA_DIR,
  COMMUNITY_TEMPLATES_FILE,
} from "@/lib/constants";
import { CommunityTemplate } from "@/lib/schemas";

interface StoredTemplate extends CommunityTemplate {}

function getFilePath(): string {
  const dir = path.join(process.cwd(), DATA_DIR);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, COMMUNITY_TEMPLATES_FILE);
}

function loadTemplates(): StoredTemplate[] {
  try {
    const filePath = getFilePath();
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
}

function saveTemplates(templates: StoredTemplate[]): void {
  const filePath = getFilePath();
  fs.writeFileSync(filePath, JSON.stringify(templates, null, 2), "utf-8");
}

export function getAllTemplates(): CommunityTemplate[] {
  return loadTemplates().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addTemplate(
  template: Omit<CommunityTemplate, "id" | "createdAt" | "downloads">
): CommunityTemplate {
  const templates = loadTemplates();
  const newTemplate: CommunityTemplate = {
    ...template,
    id: uuidv4(),
    downloads: 0,
    createdAt: new Date().toISOString(),
  };
  templates.push(newTemplate);
  saveTemplates(templates);
  return newTemplate;
}

export function incrementTemplateDownloads(id: string): boolean {
  const templates = loadTemplates();
  const idx = templates.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  templates[idx].downloads += 1;
  saveTemplates(templates);
  return true;
}
