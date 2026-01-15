/**
 * Template Selector Component
 * Load, save, and manage entry templates
 */

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { getTemplates, saveTemplate, deleteTemplate, recordTemplateUsage, type Template } from '../../utils/templates';

interface TemplateSelectorProps<T> {
  type: string;
  currentData: Partial<T>;
  onLoad: (data: Partial<T>) => void;
  excludeFields?: string[];
}

export function TemplateSelector<T>({ type, currentData, onLoad, excludeFields = [] }: TemplateSelectorProps<T>) {
  const [templates, setTemplates] = useState<Template<T>[]>(getTemplates<T>(type));
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  const refreshTemplates = () => {
    setTemplates(getTemplates<T>(type));
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    // Remove excluded fields from template data
    const templateData = { ...currentData };
    excludeFields.forEach(field => {
      delete (templateData as any)[field];
    });

    saveTemplate<T>(type, {
      name: templateName,
      description: templateDescription || undefined,
      data: templateData
    });

    setTemplateName('');
    setTemplateDescription('');
    setShowSaveDialog(false);
    refreshTemplates();
    alert('Template saved successfully!');
  };

  const handleLoadTemplate = (template: Template<T>) => {
    recordTemplateUsage(type, template.id);
    onLoad(template.data);
    setShowLoadDialog(false);
    refreshTemplates();
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteTemplate(type, id);
      refreshTemplates();
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setShowLoadDialog(true)}
        disabled={templates.length === 0}
      >
        📋 Load Template {templates.length > 0 && `(${templates.length})`}
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setShowSaveDialog(true)}
      >
        💾 Save as Template
      </Button>

      {/* Save Template Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Save as Template</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name *
                </label>
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Studio A Monthly Entry"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <Input
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="e.g., Standard entry for our main studio"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-xs text-blue-800">
                  This template will save your current form values for quick reuse.
                  {excludeFields.length > 0 && ` (${excludeFields.join(', ')} will not be saved)`}
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowSaveDialog(false);
                  setTemplateName('');
                  setTemplateDescription('');
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSaveTemplate}
              >
                Save Template
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Load Template Dialog */}
      {showLoadDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Load Template</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {templates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No templates saved yet</p>
                  <p className="text-sm mt-1">Save your first template to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {templates
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                    .map((template) => (
                      <div
                        key={template.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-800">{template.name}</h4>
                              {template.useCount > 0 && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                  Used {template.useCount}x
                                </span>
                              )}
                            </div>
                            {template.description && (
                              <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                            )}
                            <div className="flex gap-4 text-xs text-gray-500">
                              <span>Created: {template.createdAt.toLocaleDateString()}</span>
                              {template.lastUsed && (
                                <span>Last used: {template.lastUsed.toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              type="button"
                              variant="primary"
                              size="sm"
                              onClick={() => handleLoadTemplate(template)}
                            >
                              Load
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowLoadDialog(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
