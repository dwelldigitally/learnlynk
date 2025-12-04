import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PropertyCategory, SystemProperty } from '@/types/systemProperties';
import { useEffect } from 'react';

// Default system properties to seed for each category
const DEFAULT_PROPERTIES: Record<string, Array<{ key: string; label: string; description?: string; color?: string; icon?: string }>> = {
  program_level: [
    { key: 'certificate', label: 'Certificate', description: 'Short-term credential program', color: '#10B981', icon: 'Award' },
    { key: 'diploma', label: 'Diploma', description: 'Vocational or technical diploma', color: '#3B82F6', icon: 'FileText' },
    { key: 'associate', label: 'Associate Degree', description: '2-year undergraduate degree', color: '#8B5CF6', icon: 'GraduationCap' },
    { key: 'bachelor', label: "Bachelor's Degree", description: '4-year undergraduate degree', color: '#F59E0B', icon: 'GraduationCap' },
    { key: 'master', label: "Master's Degree", description: 'Graduate level degree', color: '#EF4444', icon: 'Award' },
    { key: 'doctoral', label: 'Doctoral Degree', description: 'Highest academic degree', color: '#EC4899', icon: 'Star' },
    { key: 'professional', label: 'Professional Certificate', description: 'Industry certification program', color: '#06B6D4', icon: 'Briefcase' },
  ],
  program_category: [
    { key: 'business', label: 'Business & Management', description: 'Business administration and management programs', color: '#3B82F6', icon: 'Briefcase' },
    { key: 'healthcare', label: 'Healthcare', description: 'Medical and health sciences programs', color: '#EF4444', icon: 'Heart' },
    { key: 'technology', label: 'Technology', description: 'IT and computer science programs', color: '#8B5CF6', icon: 'Cpu' },
    { key: 'creative_arts', label: 'Creative Arts', description: 'Design, media, and performing arts', color: '#EC4899', icon: 'Palette' },
    { key: 'hospitality', label: 'Hospitality & Tourism', description: 'Hotel management and tourism', color: '#F59E0B', icon: 'Hotel' },
    { key: 'engineering', label: 'Engineering', description: 'Engineering and technical programs', color: '#6366F1', icon: 'Wrench' },
    { key: 'education', label: 'Education', description: 'Teaching and educational programs', color: '#10B981', icon: 'BookOpen' },
    { key: 'law', label: 'Law & Legal Studies', description: 'Legal and paralegal programs', color: '#64748B', icon: 'Scale' },
    { key: 'science', label: 'Science', description: 'Natural and physical sciences', color: '#06B6D4', icon: 'Flask' },
  ],
  delivery_mode: [
    { key: 'in_person', label: 'In-Person', description: 'Traditional on-campus instruction', color: '#10B981', icon: 'Users' },
    { key: 'online', label: 'Online', description: 'Fully online delivery', color: '#3B82F6', icon: 'Globe' },
    { key: 'hybrid', label: 'Hybrid', description: 'Combination of in-person and online', color: '#8B5CF6', icon: 'Layers' },
    { key: 'blended', label: 'Blended', description: 'Integrated online and face-to-face', color: '#F59E0B', icon: 'Blend' },
    { key: 'self_paced', label: 'Self-Paced', description: 'Learn at your own pace', color: '#06B6D4', icon: 'Clock' },
  ],
  document_type: [
    { key: 'academic_transcript', label: 'Academic Transcript', description: 'Official academic records', color: '#3B82F6', icon: 'FileText' },
    { key: 'personal_statement', label: 'Personal Statement', description: 'Statement of purpose or motivation letter', color: '#8B5CF6', icon: 'PenTool' },
    { key: 'cv_resume', label: 'CV/Resume', description: 'Curriculum vitae or resume', color: '#10B981', icon: 'User' },
    { key: 'id_passport', label: 'ID/Passport', description: 'Government-issued identification', color: '#EF4444', icon: 'CreditCard' },
    { key: 'language_certificate', label: 'Language Certificate', description: 'English proficiency or other language tests', color: '#F59E0B', icon: 'Globe' },
    { key: 'recommendation_letter', label: 'Recommendation Letter', description: 'Letters of recommendation', color: '#EC4899', icon: 'Mail' },
    { key: 'portfolio', label: 'Portfolio', description: 'Work samples or creative portfolio', color: '#06B6D4', icon: 'Folder' },
    { key: 'proof_of_funds', label: 'Proof of Funds', description: 'Financial documentation', color: '#64748B', icon: 'DollarSign' },
    { key: 'medical_certificate', label: 'Medical Certificate', description: 'Health clearance or vaccination records', color: '#EF4444', icon: 'Heart' },
    { key: 'photo', label: 'Passport Photo', description: 'Recent passport-sized photograph', color: '#6366F1', icon: 'Camera' },
  ],
  payment_method: [
    { key: 'credit_card', label: 'Credit Card', description: 'Visa, Mastercard, Amex', color: '#3B82F6', icon: 'CreditCard' },
    { key: 'debit_card', label: 'Debit Card', description: 'Direct bank debit', color: '#10B981', icon: 'CreditCard' },
    { key: 'bank_transfer', label: 'Bank Transfer', description: 'Direct bank transfer', color: '#8B5CF6', icon: 'Building' },
    { key: 'wire_transfer', label: 'Wire Transfer', description: 'International wire transfer', color: '#F59E0B', icon: 'Send' },
    { key: 'check', label: 'Check', description: 'Personal or cashier\'s check', color: '#64748B', icon: 'FileCheck' },
    { key: 'cash', label: 'Cash', description: 'Cash payment', color: '#10B981', icon: 'Banknote' },
    { key: 'payment_plan', label: 'Payment Plan', description: 'Installment payment plan', color: '#EC4899', icon: 'Calendar' },
    { key: 'scholarship', label: 'Scholarship', description: 'Scholarship or grant', color: '#06B6D4', icon: 'Award' },
  ],
  fee_type: [
    { key: 'tuition', label: 'Tuition', description: 'Course tuition fees', color: '#3B82F6', icon: 'GraduationCap' },
    { key: 'registration', label: 'Registration Fee', description: 'One-time registration fee', color: '#10B981', icon: 'ClipboardList' },
    { key: 'application', label: 'Application Fee', description: 'Application processing fee', color: '#8B5CF6', icon: 'FileText' },
    { key: 'lab_fee', label: 'Lab Fee', description: 'Laboratory or practical fees', color: '#F59E0B', icon: 'Flask' },
    { key: 'material_fee', label: 'Material Fee', description: 'Books and materials', color: '#EF4444', icon: 'Book' },
    { key: 'technology_fee', label: 'Technology Fee', description: 'IT and technology fees', color: '#06B6D4', icon: 'Laptop' },
    { key: 'activity_fee', label: 'Student Activity Fee', description: 'Student activities and services', color: '#EC4899', icon: 'Users' },
    { key: 'late_fee', label: 'Late Payment Fee', description: 'Penalty for late payments', color: '#64748B', icon: 'AlertTriangle' },
    { key: 'graduation_fee', label: 'Graduation Fee', description: 'Graduation ceremony and certificate', color: '#6366F1', icon: 'Award' },
  ],
};

// Seed default properties for a category if none exist
async function seedDefaultProperties(userId: string, category: PropertyCategory): Promise<void> {
  const defaults = DEFAULT_PROPERTIES[category];
  if (!defaults) return;

  const propertiesToInsert = defaults.map((prop, index) => ({
    user_id: userId,
    category,
    property_key: prop.key,
    property_label: prop.label,
    property_description: prop.description,
    color: prop.color,
    icon: prop.icon,
    order_index: index + 1,
    is_active: true,
    is_system: true,
  }));

  await supabase
    .from('system_properties' as any)
    .insert(propertiesToInsert);
}

// Generic hook to fetch properties for a category with auto-seeding
function usePropertyOptionsForCategory(category: PropertyCategory) {
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading, refetch } = useQuery({
    queryKey: ['property-options', category],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('system_properties' as any)
        .select('*')
        .eq('user_id', user.id)
        .eq('category', category)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error(`Error fetching ${category} properties:`, error);
        return [];
      }

      // If no properties exist, seed defaults
      if (!data || data.length === 0) {
        await seedDefaultProperties(user.id, category);
        
        // Re-fetch after seeding
        const { data: seededData } = await supabase
          .from('system_properties' as any)
          .select('*')
          .eq('user_id', user.id)
          .eq('category', category)
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        return (seededData || []) as unknown as SystemProperty[];
      }

      return (data || []) as unknown as SystemProperty[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Transform to options format
  const options = properties.map(prop => ({
    value: prop.property_key,
    label: prop.property_label,
    description: prop.property_description,
    color: prop.color,
    icon: prop.icon,
  }));

  return { options, properties, isLoading, refetch };
}

// Specific hooks for each category
export function useDocumentTypeOptions() {
  return usePropertyOptionsForCategory('document_type');
}

export function useProgramLevelOptions() {
  return usePropertyOptionsForCategory('program_level');
}

export function useProgramCategoryOptions() {
  return usePropertyOptionsForCategory('program_category');
}

export function useDeliveryModeOptions() {
  return usePropertyOptionsForCategory('delivery_mode');
}

export function usePaymentMethodOptions() {
  return usePropertyOptionsForCategory('payment_method');
}

export function useFeeTypeOptions() {
  return usePropertyOptionsForCategory('fee_type');
}

// Generic hook that can be used with any category
export function usePropertyOptions(category: PropertyCategory) {
  return usePropertyOptionsForCategory(category);
}
