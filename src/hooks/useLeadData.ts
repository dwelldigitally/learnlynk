import { useState, useEffect } from 'react';
import { leadDataService, LeadCommunication, LeadDocument, LeadTask, LeadAcademicJourney } from '@/services/leadDataService';

export function useLeadCommunications(leadId: string) {
  const [communications, setCommunications] = useState<LeadCommunication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunications = async () => {
    if (!leadId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await leadDataService.getCommunications(leadId);
      if (error) {
        setError(error.message || 'Failed to fetch communications');
      } else {
        setCommunications(data || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch communications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunications();
  }, [leadId]);

  return { communications, loading, error, refetch: fetchCommunications };
}

export function useLeadDocuments(leadId: string) {
  const [documents, setDocuments] = useState<LeadDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    if (!leadId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await leadDataService.getDocuments(leadId);
      if (error) {
        setError(error.message || 'Failed to fetch documents');
      } else {
        setDocuments(data || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [leadId]);

  return { documents, loading, error, refetch: fetchDocuments };
}

export function useLeadTasks(leadId: string) {
  const [tasks, setTasks] = useState<LeadTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    if (!leadId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await leadDataService.getTasks(leadId);
      if (error) {
        setError(error.message || 'Failed to fetch tasks');
      } else {
        setTasks(data || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [leadId]);

  return { tasks, loading, error, refetch: fetchTasks };
}

export function useLeadAcademicJourney(leadId: string) {
  const [journey, setJourney] = useState<LeadAcademicJourney | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJourney = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await leadDataService.getAcademicJourney(leadId);
      if (error) {
        setError(error.message || 'Failed to fetch academic journey');
      } else {
        setJourney(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch academic journey');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!leadId) return;
    fetchJourney();
  }, [leadId]);

  return { journey, loading, error, refetch: fetchJourney };
}