import { useInvoiceTemplates } from '@/services/paymentService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InvoiceTemplateSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function InvoiceTemplateSelector({ value, onChange }: InvoiceTemplateSelectorProps) {
  const { data: templates = [], isLoading } = useInvoiceTemplates();

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading templates...</div>;
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a template (default will be used if none selected)" />
      </SelectTrigger>
      <SelectContent>
        {templates.map((template) => (
          <SelectItem key={template.id} value={template.id}>
            {template.name} {template.is_default && '(Default)'}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
