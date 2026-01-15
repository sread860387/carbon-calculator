/**
 * Entry Templates System
 * Save and load templates for quick data entry
 */

export interface Template<T> {
  id: string;
  name: string;
  description?: string;
  data: Partial<T>;
  createdAt: Date;
  lastUsed?: Date;
  useCount: number;
}

const STORAGE_PREFIX = 'templates-';

/**
 * Get all templates for a specific type
 */
export function getTemplates<T>(type: string): Template<T>[] {
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${type}`);
    if (!stored) return [];

    const templates = JSON.parse(stored);
    // Convert date strings back to Date objects
    return templates.map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      lastUsed: t.lastUsed ? new Date(t.lastUsed) : undefined
    }));
  } catch {
    return [];
  }
}

/**
 * Save a new template
 */
export function saveTemplate<T>(type: string, template: Omit<Template<T>, 'id' | 'createdAt' | 'useCount'>): Template<T> {
  const templates = getTemplates<T>(type);

  const newTemplate: Template<T> = {
    ...template,
    id: `template-${Date.now()}-${Math.random()}`,
    createdAt: new Date(),
    useCount: 0
  };

  templates.push(newTemplate);
  localStorage.setItem(`${STORAGE_PREFIX}${type}`, JSON.stringify(templates));

  return newTemplate;
}

/**
 * Update an existing template
 */
export function updateTemplate<T>(type: string, id: string, updates: Partial<Template<T>>): void {
  const templates = getTemplates<T>(type);
  const index = templates.findIndex(t => t.id === id);

  if (index !== -1) {
    templates[index] = { ...templates[index], ...updates };
    localStorage.setItem(`${STORAGE_PREFIX}${type}`, JSON.stringify(templates));
  }
}

/**
 * Delete a template
 */
export function deleteTemplate(type: string, id: string): void {
  const templates = getTemplates(type);
  const filtered = templates.filter(t => t.id !== id);
  localStorage.setItem(`${STORAGE_PREFIX}${type}`, JSON.stringify(filtered));
}

/**
 * Record template usage
 */
export function recordTemplateUsage(type: string, id: string): void {
  const templates = getTemplates(type);
  const template = templates.find(t => t.id === id);

  if (template) {
    template.useCount++;
    template.lastUsed = new Date();
    localStorage.setItem(`${STORAGE_PREFIX}${type}`, JSON.stringify(templates));
  }
}

/**
 * Get most frequently used templates
 */
export function getFrequentTemplates<T>(type: string, limit: number = 5): Template<T>[] {
  const templates = getTemplates<T>(type);
  return templates
    .sort((a, b) => b.useCount - a.useCount)
    .slice(0, limit);
}

/**
 * Get recently used templates
 */
export function getRecentTemplates<T>(type: string, limit: number = 5): Template<T>[] {
  const templates = getTemplates<T>(type);
  return templates
    .filter(t => t.lastUsed)
    .sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0))
    .slice(0, limit);
}
