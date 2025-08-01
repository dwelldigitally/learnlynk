import { ConditionalLogic, FormData } from '@/types/formBuilder';

export class ConditionalLogicEngine {
  static evaluateCondition(condition: ConditionalLogic, formData: FormData): boolean {
    const fieldValue = formData[condition.field];
    const targetValue = condition.value;

    switch (condition.operator) {
      case 'equals':
        return fieldValue === targetValue;
      
      case 'not_equals':
        return fieldValue !== targetValue;
      
      case 'contains':
        if (typeof fieldValue === 'string' && typeof targetValue === 'string') {
          return fieldValue.includes(targetValue);
        }
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(targetValue);
        }
        return false;
      
      case 'not_contains':
        if (typeof fieldValue === 'string' && typeof targetValue === 'string') {
          return !fieldValue.includes(targetValue);
        }
        if (Array.isArray(fieldValue)) {
          return !fieldValue.includes(targetValue);
        }
        return true;
      
      case 'greater_than':
        return Number(fieldValue) > Number(targetValue);
      
      case 'less_than':
        return Number(fieldValue) < Number(targetValue);
      
      case 'is_empty':
        return !fieldValue || 
               fieldValue === '' || 
               (Array.isArray(fieldValue) && fieldValue.length === 0);
      
      case 'is_not_empty':
        return fieldValue && 
               fieldValue !== '' && 
               (!Array.isArray(fieldValue) || fieldValue.length > 0);
      
      default:
        return false;
    }
  }

  static evaluateConditions(conditions: ConditionalLogic[], formData: FormData): boolean {
    if (!conditions || conditions.length === 0) {
      return true;
    }

    // For now, we'll use AND logic by default
    // In the future, we can enhance this to support the logic property
    return conditions.every(condition => this.evaluateCondition(condition, formData));
  }

  static shouldShowField(
    showWhen: ConditionalLogic[] | undefined,
    hideWhen: ConditionalLogic[] | undefined,
    formData: FormData
  ): boolean {
    // If hideWhen conditions are met, don't show the field
    if (hideWhen && hideWhen.length > 0) {
      const shouldHide = this.evaluateConditions(hideWhen, formData);
      if (shouldHide) {
        return false;
      }
    }

    // If showWhen conditions exist, they must be met
    if (showWhen && showWhen.length > 0) {
      return this.evaluateConditions(showWhen, formData);
    }

    // If no conditions, show by default
    return true;
  }
}