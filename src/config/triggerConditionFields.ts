// Trigger condition fields - imports from central lead properties definition
import { 
  getLeadPropertiesForConditions, 
  OPERATOR_LABELS,
  getLeadPropertyCategories 
} from './leadProperties';

export interface TriggerConditionField {
  key: string;
  label: string;
  category: string;
  type: 'text' | 'select' | 'number' | 'date' | 'boolean' | 'array';
  operators: string[];
  options?: { label: string; value: string }[];
  dynamicOptions?: string;
  placeholder?: string;
}

// Get all trigger condition fields from central definition
export const triggerConditionFields: TriggerConditionField[] = getLeadPropertiesForConditions();

// Re-export operator labels from central definition
export const operatorLabels = OPERATOR_LABELS;

// Re-export field categories from central definition  
export const fieldCategories = getLeadPropertyCategories();
