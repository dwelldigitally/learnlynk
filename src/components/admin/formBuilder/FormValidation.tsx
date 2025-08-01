import { FormField, FormData, FormErrors, ValidationRule } from '@/types/formBuilder';

export class FormValidation {
  static validateField(field: FormField, value: any): string | null {
    if (!field.validation || field.validation.length === 0) {
      return null;
    }

    for (const rule of field.validation) {
      const error = this.validateRule(rule, value, field);
      if (error) {
        return error;
      }
    }

    return null;
  }

  static validateRule(rule: ValidationRule, value: any, field: FormField): string | null {
    switch (rule.type) {
      case 'required':
        if (!value || value === '' || (Array.isArray(value) && value.length === 0)) {
          return rule.message || `${field.label} is required`;
        }
        break;

      case 'min_length':
        if (typeof value === 'string' && value.length < Number(rule.value)) {
          return rule.message || `${field.label} must be at least ${rule.value} characters`;
        }
        break;

      case 'max_length':
        if (typeof value === 'string' && value.length > Number(rule.value)) {
          return rule.message || `${field.label} must not exceed ${rule.value} characters`;
        }
        break;

      case 'pattern':
        if (typeof value === 'string' && rule.value) {
          const regex = new RegExp(rule.value);
          if (!regex.test(value)) {
            return rule.message || `${field.label} format is invalid`;
          }
        }
        break;

      case 'min_value':
        if (Number(value) < Number(rule.value)) {
          return rule.message || `${field.label} must be at least ${rule.value}`;
        }
        break;

      case 'max_value':
        if (Number(value) > Number(rule.value)) {
          return rule.message || `${field.label} must not exceed ${rule.value}`;
        }
        break;

      case 'file_size':
        if (value instanceof File) {
          const maxSizeBytes = Number(rule.value) * 1024 * 1024; // Convert MB to bytes
          if (value.size > maxSizeBytes) {
            return rule.message || `${field.label} must be smaller than ${rule.value}MB`;
          }
        } else if (Array.isArray(value)) {
          const maxSizeBytes = Number(rule.value) * 1024 * 1024;
          const oversizedFile = value.find((file: File) => file.size > maxSizeBytes);
          if (oversizedFile) {
            return rule.message || `All files in ${field.label} must be smaller than ${rule.value}MB`;
          }
        }
        break;

      case 'file_type':
        if (value instanceof File) {
          const allowedTypes = rule.value.split(',').map((type: string) => type.trim().toLowerCase());
          const fileExtension = '.' + value.name.split('.').pop()?.toLowerCase();
          if (!allowedTypes.includes(fileExtension) && !allowedTypes.includes(value.type)) {
            return rule.message || `${field.label} must be one of: ${rule.value}`;
          }
        } else if (Array.isArray(value)) {
          const allowedTypes = rule.value.split(',').map((type: string) => type.trim().toLowerCase());
          const invalidFile = value.find((file: File) => {
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            return !allowedTypes.includes(fileExtension) && !allowedTypes.includes(file.type);
          });
          if (invalidFile) {
            return rule.message || `All files in ${field.label} must be one of: ${rule.value}`;
          }
        }
        break;
    }

    return null;
  }

  static validateForm(fields: FormField[], formData: FormData, visibleFields: Set<string>): FormErrors {
    const errors: FormErrors = {};

    for (const field of fields) {
      // Only validate visible and enabled fields
      if (!field.enabled || !visibleFields.has(field.id)) {
        continue;
      }

      const error = this.validateField(field, formData[field.id]);
      if (error) {
        errors[field.id] = error;
      }
    }

    return errors;
  }

  static hasErrors(errors: FormErrors): boolean {
    return Object.keys(errors).length > 0;
  }
}