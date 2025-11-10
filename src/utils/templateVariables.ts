export interface TemplateVariable {
  key: string;
  label: string;
  description: string;
  category: 'lead' | 'payment' | 'company';
}

export const TEMPLATE_VARIABLES: TemplateVariable[] = [
  // Lead variables
  {
    key: '{{lead_name}}',
    label: 'Lead Name',
    description: 'Full name of the lead',
    category: 'lead'
  },
  {
    key: '{{lead_email}}',
    label: 'Lead Email',
    description: 'Email address of the lead',
    category: 'lead'
  },
  
  // Payment variables
  {
    key: '{{amount}}',
    label: 'Amount',
    description: 'Payment amount',
    category: 'payment'
  },
  {
    key: '{{currency}}',
    label: 'Currency',
    description: 'Currency code (USD, CAD, etc.)',
    category: 'payment'
  },
  {
    key: '{{payment_type}}',
    label: 'Payment Type',
    description: 'Type of payment (Tuition, Fee, etc.)',
    category: 'payment'
  },
  {
    key: '{{due_date}}',
    label: 'Due Date',
    description: 'Payment due date',
    category: 'payment'
  },
  {
    key: '{{invoice_number}}',
    label: 'Invoice Number',
    description: 'Unique invoice identifier',
    category: 'payment'
  },
  {
    key: '{{payment_date}}',
    label: 'Payment Date',
    description: 'Date payment was received',
    category: 'payment'
  },
  
  // Company variables
  {
    key: '{{company_name}}',
    label: 'Company Name',
    description: 'Your company/institution name',
    category: 'company'
  },
  {
    key: '{{company_address}}',
    label: 'Company Address',
    description: 'Your company address',
    category: 'company'
  }
];

export const getVariablesByCategory = (category: 'lead' | 'payment' | 'company') => {
  return TEMPLATE_VARIABLES.filter(v => v.category === category);
};

export const getAllVariableKeys = () => {
  return TEMPLATE_VARIABLES.map(v => v.key);
};
