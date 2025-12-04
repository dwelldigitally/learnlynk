import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, subMonths, startOfDay, subDays, startOfWeek, subWeeks } from 'date-fns';

interface DashboardStats {
  leadsToday: number;
  leadsYesterday: number;
  leadsTrend: 'up' | 'down' | 'neutral';
  leadsTrendValue: string;
  
  totalStudents: number;
  
  pendingApplications: number;
  applicationsLastWeek: number;
  applicationsTrend: 'up' | 'down' | 'neutral';
  applicationsTrendValue: string;
  
  revenueThisMonth: number;
  revenueLastMonth: number;
  revenueTrend: 'up' | 'down' | 'neutral';
  revenueTrendValue: string;
  
  conversionRate: number;
  conversionRateLastWeek: number;
  conversionTrend: 'up' | 'down' | 'neutral';
  conversionTrendValue: string;
  
  tasksDueToday: number;
}

const getTrend = (current: number, previous: number): 'up' | 'down' | 'neutral' => {
  if (current > previous) return 'up';
  if (current < previous) return 'down';
  return 'neutral';
};

const getTrendValue = (current: number, previous: number, label: string): string => {
  if (previous === 0) {
    if (current > 0) return `+${current} ${label}`;
    return `No change ${label}`;
  }
  const diff = current - previous;
  const percentage = Math.round((diff / previous) * 100);
  return `${diff >= 0 ? '+' : ''}${percentage}% ${label}`;
};

const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${amount.toFixed(0)}`;
};

async function fetchDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const todayStart = startOfDay(now).toISOString();
  const yesterdayStart = startOfDay(subDays(now, 1)).toISOString();
  const thisMonthStart = startOfMonth(now).toISOString();
  const lastMonthStart = startOfMonth(subMonths(now, 1)).toISOString();
  const lastMonthEnd = startOfMonth(now).toISOString();
  const thisWeekStart = startOfWeek(now).toISOString();
  const lastWeekStart = startOfWeek(subWeeks(now, 1)).toISOString();
  const lastWeekEnd = startOfWeek(now).toISOString();

  // Run all queries in parallel for efficiency
  const [
    leadsToday,
    leadsYesterday,
    totalStudents,
    pendingApplications,
    applicationsLastWeek,
    revenueThisMonth,
    revenueLastMonth,
    totalLeads,
    convertedLeads,
    totalLeadsLastWeek,
    convertedLeadsLastWeek,
    tasksDueToday
  ] = await Promise.all([
    // Leads today
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart),
    
    // Leads yesterday
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterdayStart)
      .lt('created_at', todayStart),
    
    // Total students
    supabase
      .from('students')
      .select('*', { count: 'exact', head: true }),
    
    // Pending applications (no decision yet)
    supabase
      .from('applicants')
      .select('*', { count: 'exact', head: true })
      .is('decision', null),
    
    // Applications created last week
    supabase
      .from('applicants')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', lastWeekStart)
      .lt('created_at', lastWeekEnd),
    
    // Revenue this month (from financial_records with status='paid')
    supabase
      .from('financial_records')
      .select('amount')
      .eq('status', 'paid')
      .gte('created_at', thisMonthStart),
    
    // Revenue last month
    supabase
      .from('financial_records')
      .select('amount')
      .eq('status', 'paid')
      .gte('created_at', lastMonthStart)
      .lt('created_at', lastMonthEnd),
    
    // Total leads (for conversion rate)
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true }),
    
    // Converted leads
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'converted'),
    
    // Total leads last week (for conversion trend)
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', lastWeekStart)
      .lt('created_at', lastWeekEnd),
    
    // Converted leads last week
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'converted')
      .gte('created_at', lastWeekStart)
      .lt('created_at', lastWeekEnd),
    
    // Tasks due today
    supabase
      .from('lead_tasks')
      .select('*', { count: 'exact', head: true })
      .gte('due_date', todayStart)
      .lt('due_date', startOfDay(subDays(now, -1)).toISOString())
      .neq('status', 'completed')
  ]);

  // Calculate values
  const leadsTodayCount = leadsToday.count ?? 0;
  const leadsYesterdayCount = leadsYesterday.count ?? 0;
  
  const totalStudentsCount = totalStudents.count ?? 0;
  
  const pendingAppsCount = pendingApplications.count ?? 0;
  const appsLastWeekCount = applicationsLastWeek.count ?? 0;
  
  const revenueThisMonthSum = (revenueThisMonth.data ?? []).reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const revenueLastMonthSum = (revenueLastMonth.data ?? []).reduce((sum, r) => sum + Number(r.amount || 0), 0);
  
  const totalLeadsCount = totalLeads.count ?? 0;
  const convertedLeadsCount = convertedLeads.count ?? 0;
  const conversionRateValue = totalLeadsCount > 0 ? Math.round((convertedLeadsCount / totalLeadsCount) * 100) : 0;
  
  const totalLeadsLastWeekCount = totalLeadsLastWeek.count ?? 0;
  const convertedLeadsLastWeekCount = convertedLeadsLastWeek.count ?? 0;
  const conversionRateLastWeekValue = totalLeadsLastWeekCount > 0 
    ? Math.round((convertedLeadsLastWeekCount / totalLeadsLastWeekCount) * 100) 
    : 0;
  
  const tasksDueTodayCount = tasksDueToday.count ?? 0;

  return {
    leadsToday: leadsTodayCount,
    leadsYesterday: leadsYesterdayCount,
    leadsTrend: getTrend(leadsTodayCount, leadsYesterdayCount),
    leadsTrendValue: getTrendValue(leadsTodayCount, leadsYesterdayCount, 'from yesterday'),
    
    totalStudents: totalStudentsCount,
    
    pendingApplications: pendingAppsCount,
    applicationsLastWeek: appsLastWeekCount,
    applicationsTrend: getTrend(pendingAppsCount, appsLastWeekCount),
    applicationsTrendValue: getTrendValue(pendingAppsCount, appsLastWeekCount, 'from last week'),
    
    revenueThisMonth: revenueThisMonthSum,
    revenueLastMonth: revenueLastMonthSum,
    revenueTrend: getTrend(revenueThisMonthSum, revenueLastMonthSum),
    revenueTrendValue: getTrendValue(revenueThisMonthSum, revenueLastMonthSum, 'vs last month'),
    
    conversionRate: conversionRateValue,
    conversionRateLastWeek: conversionRateLastWeekValue,
    conversionTrend: getTrend(conversionRateValue, conversionRateLastWeekValue),
    conversionTrendValue: `${conversionRateValue > conversionRateLastWeekValue ? '+' : ''}${conversionRateValue - conversionRateLastWeekValue}% change`,
    
    tasksDueToday: tasksDueTodayCount
  };
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export { formatCurrency };
export type { DashboardStats };
