/**
 * Auto-save Drafts Utilities
 * Automatically save and restore form drafts
 */

const DRAFT_PREFIX = 'draft-';
const DRAFT_TIMESTAMP_SUFFIX = '-timestamp';

export interface DraftInfo {
  exists: boolean;
  timestamp?: Date;
  data?: any;
}

/**
 * Save draft to localStorage
 */
export function saveDraft<T>(formType: string, data: T): void {
  try {
    localStorage.setItem(`${DRAFT_PREFIX}${formType}`, JSON.stringify(data));
    localStorage.setItem(
      `${DRAFT_PREFIX}${formType}${DRAFT_TIMESTAMP_SUFFIX}`,
      new Date().toISOString()
    );
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
}

/**
 * Load draft from localStorage
 */
export function loadDraft<T>(formType: string): T | null {
  try {
    const stored = localStorage.getItem(`${DRAFT_PREFIX}${formType}`);
    if (!stored) return null;

    return JSON.parse(stored) as T;
  } catch (error) {
    console.error('Failed to load draft:', error);
    return null;
  }
}

/**
 * Get draft info (exists, timestamp)
 */
export function getDraftInfo(formType: string): DraftInfo {
  try {
    const data = localStorage.getItem(`${DRAFT_PREFIX}${formType}`);
    const timestampStr = localStorage.getItem(
      `${DRAFT_PREFIX}${formType}${DRAFT_TIMESTAMP_SUFFIX}`
    );

    if (!data) {
      return { exists: false };
    }

    const timestamp = timestampStr ? new Date(timestampStr) : undefined;
    return {
      exists: true,
      timestamp,
      data: JSON.parse(data)
    };
  } catch (error) {
    console.error('Failed to get draft info:', error);
    return { exists: false };
  }
}

/**
 * Clear draft from localStorage
 */
export function clearDraft(formType: string): void {
  try {
    localStorage.removeItem(`${DRAFT_PREFIX}${formType}`);
    localStorage.removeItem(`${DRAFT_PREFIX}${formType}${DRAFT_TIMESTAMP_SUFFIX}`);
  } catch (error) {
    console.error('Failed to clear draft:', error);
  }
}

/**
 * Get all drafts
 */
export function getAllDrafts(): Record<string, DraftInfo> {
  const drafts: Record<string, DraftInfo> = {};

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(DRAFT_PREFIX) && !key.endsWith(DRAFT_TIMESTAMP_SUFFIX)) {
        const formType = key.replace(DRAFT_PREFIX, '');
        drafts[formType] = getDraftInfo(formType);
      }
    }
  } catch (error) {
    console.error('Failed to get all drafts:', error);
  }

  return drafts;
}

/**
 * Clear all drafts
 */
export function clearAllDrafts(): void {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(DRAFT_PREFIX)) {
        keys.push(key);
      }
    }
    keys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear all drafts:', error);
  }
}

/**
 * Format time ago for draft timestamp
 */
export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else {
    return date.toLocaleDateString();
  }
}
