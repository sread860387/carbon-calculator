/**
 * useAutosave Hook
 * Automatically save and restore form drafts
 */

import { useEffect, useState } from 'react';
import { saveDraft, loadDraft, clearDraft, getDraftInfo, formatTimeAgo } from '../utils/autosave';
import type { DraftInfo } from '../utils/autosave';

interface UseAutosaveOptions {
  formType: string;
  data: any;
  enabled?: boolean;
  debounceMs?: number;
}

export function useAutosave({ formType, data, enabled = true, debounceMs = 1000 }: UseAutosaveOptions) {
  const [draftInfo, setDraftInfo] = useState<DraftInfo>({ exists: false });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load draft info on mount
  useEffect(() => {
    const info = getDraftInfo(formType);
    setDraftInfo(info);
  }, [formType]);

  // Auto-save with debounce
  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(() => {
      // Only save if data has meaningful content
      const hasContent = Object.values(data || {}).some(value =>
        value !== null && value !== undefined && value !== ''
      );

      if (hasContent) {
        saveDraft(formType, data);
        setLastSaved(new Date());
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [data, enabled, debounceMs, formType]);

  /**
   * Load the saved draft
   */
  const loadSavedDraft = () => {
    return loadDraft(formType);
  };

  /**
   * Clear the draft
   */
  const clearSavedDraft = () => {
    clearDraft(formType);
    setDraftInfo({ exists: false });
    setLastSaved(null);
  };

  /**
   * Get time ago string for last save
   */
  const getLastSavedText = () => {
    if (!lastSaved && !draftInfo.timestamp) return null;

    const timestamp = lastSaved || draftInfo.timestamp;
    if (!timestamp) return null;

    return formatTimeAgo(timestamp);
  };

  return {
    draftInfo,
    lastSaved,
    loadSavedDraft,
    clearSavedDraft,
    getLastSavedText,
    hasDraft: draftInfo.exists
  };
}
