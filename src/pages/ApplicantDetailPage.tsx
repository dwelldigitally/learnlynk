import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ModernAdminLayout } from "@/components/admin/ModernAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ApplicantService } from "@/services/applicantService";
import { Applicant } from "@/types/applicant";
import { ApplicantStageTracker } from "@/components/admin/applicants/ApplicantStageTracker";
import { AISuggestionsCard } from "@/components/admin/applicants/AISuggestionsCard";
import { ArrowLeft, Mail, Phone, Download } from "lucide-react";

const paymentStatuses = ["pending", "partial", "completed", "refunded"] as const;

const ApplicantDetailPage: React.FC = () => {
  const { applicantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [applicant, setApplicant] = useState<any | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<typeof paymentStatuses[number]>("pending");

  useEffect(() => {
    if (!applicantId) return;
    const load = async () => {
      try {
        setLoading(true);
        const data = await ApplicantService.getApplicantById(applicantId);
        setApplicant(data);
        setNotesDraft(data?.notes || "");
        setPaymentStatus((data?.payment_status || "pending") as any);
        document.title = data?.master_records
          ? `${data.master_records.first_name} ${data.master_records.last_name} — Applicant`
          : "Applicant — Detail";
      } catch (e) {
        console.error(e);
        toast({ title: "Error", description: "Failed to load applicant", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [applicantId, toast]);

  const handleApprove = async () => {
    if (!applicant) return;
    try {
      setSaving(true);
      await ApplicantService.approveApplicant(applicant.id, "Approved on detail page");
      toast({ title: "Approved", description: "Applicant moved to student stage" });
      const refreshed = await ApplicantService.getApplicantById(applicant.id);
      setApplicant(refreshed);
    } catch (e) {
      toast({ title: "Error", description: "Could not approve applicant", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    if (!applicant) return;
    try {
      setSaving(true);
      await ApplicantService.rejectApplicant(applicant.id, "Rejected on detail page");
      toast({ title: "Rejected", description: "Applicant rejected" });
      const refreshed = await ApplicantService.getApplicantById(applicant.id);
      setApplicant(refreshed);
    } catch (e) {
      toast({ title: "Error", description: "Could not reject applicant", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSample = async () => {
    try {
      setSaving(true);
      const created = await ApplicantService.createSampleApplicant();
      toast({ title: "Sample applicant created", description: `${created.master_records?.first_name || 'Sample'} ${created.master_records?.last_name || ''}`.trim() });
      navigate(`/admin/applicants/detail/${created.id}`);
    } catch (e) {
      toast({ title: "Error", description: "Could not create sample applicant", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSubstageChange = async (value: string) => {
    if (!applicant) return;
    try {
      setSaving(true);
      const updated = await ApplicantService.updateApplicantSubstage(applicant.id, value);
      setApplicant(updated);
      toast({ title: "Stage updated", description: `Moved to ${value.replace("_", " ")}` });
    } catch (e) {
      toast({ title: "Error", description: "Could not update stage", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handlePaymentSave = async () => {
    if (!applicant) return;
    try {
      setSaving(true);
      const updated = await ApplicantService.updateApplicant(applicant.id, { payment_status: paymentStatus });
      setApplicant(updated);
      toast({ title: "Payment updated", description: `Status: ${paymentStatus}` });
    } catch (e) {
      toast({ title: "Error", description: "Could not update payment", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleNotesSave = async () => {
    if (!applicant) return;
    try {
      setSaving(true);
      const updated = await ApplicantService.updateApplicant(applicant.id, { notes: notesDraft });
      setApplicant(updated);
      toast({ title: "Notes saved" });
    } catch (e) {
      toast({ title: "Error", description: "Could not save notes", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleApproveAllDocs = async () => {
    if (!applicant) return;
    try {
      setSaving(true);
      const submitted = Array.isArray(applicant.documents_submitted) ? applicant.documents_submitted : [];
      const updated = await ApplicantService.updateApplicant(applicant.id, {
        documents_approved: submitted,
        substage: (submitted.length > 0 ? "under_review" : applicant.substage) as any,
      });
      setApplicant(updated);
      toast({ title: "Documents approved", description: "All submitted docs marked approved" });
    } catch (e) {
      toast({ title: "Error", description: "Could not update documents", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const applicantName = useMemo(() => {
    if (!applicant?.master_records) return "Applicant";
    return `${applicant.master_records.first_name} ${applicant.master_records.last_name}`;
  }, [applicant]);

  if (loading) {
    return (
      <ModernAdminLayout>
        <div className="p-6">Loading applicant...</div>
      </ModernAdminLayout>
    );
  }

  if (!applicant) {
    return (
      <ModernAdminLayout>
        <div className="p-6 space-y-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="px-0">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>No applicant found.</div>
              <div className="flex gap-2">
                <Button onClick={handleCreateSample} disabled={saving}>Create sample applicant</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="p-6 space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/admin/applicants" className="hover:underline">Applicants</Link>
              <span>/</span>
              <span>{applicantName}</span>
            </div>
            <h1 className="text-2xl font-semibold mt-1">{applicantName}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="outline">Program: {applicant.program}</Badge>
              <Badge variant="secondary">Stage: {String(applicant.substage).replace("_", " ")}</Badge>
              <Badge variant="outline">Payment: {String(applicant.payment_status).toUpperCase()}</Badge>
              {applicant.decision && (
                <Badge variant={applicant.decision === "approved" ? "default" : "destructive"}>
                  Decision: {String(applicant.decision).toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button disabled={saving} onClick={handleApprove}>Approve</Button>
            <Button disabled={saving} variant="destructive" onClick={handleReject}>Reject</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Stage tracker */}
            <Card>
              <CardHeader>
                <CardTitle>Application Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ApplicantStageTracker substage={String(applicant.substage)} />
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Badge variant="outline">Submitted: {Array.isArray(applicant.documents_submitted) ? applicant.documents_submitted.length : 0}</Badge>
                  <Badge variant="outline">Approved: {Array.isArray(applicant.documents_approved) ? applicant.documents_approved.length : 0}</Badge>
                  <Button size="sm" variant="secondary" onClick={handleApproveAllDocs}>Mark all approved</Button>
                </div>
                <Separator />
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium mb-2">Submitted</div>
                    <ul className="space-y-2">
                      {(applicant.documents_submitted || []).map((doc: string) => (
                        <li key={doc} className="flex items-center justify-between p-2 rounded-md border">
                          <span className="truncate mr-2">{doc}</span>
                          <Button size="icon" variant="ghost" title="Download">
                            <Download className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                      {(!applicant.documents_submitted || applicant.documents_submitted.length === 0) && (
                        <div className="text-sm text-muted-foreground">No documents submitted yet.</div>
                      )}
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium mb-2">Approved</div>
                    <ul className="space-y-2">
                      {(applicant.documents_approved || []).map((doc: string) => (
                        <li key={doc} className="flex items-center justify-between p-2 rounded-md border">
                          <span className="truncate mr-2">{doc}</span>
                          <Badge>Approved</Badge>
                        </li>
                      ))}
                      {(!applicant.documents_approved || applicant.documents_approved.length === 0) && (
                        <div className="text-sm text-muted-foreground">No documents approved yet.</div>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Label htmlFor="notes">Internal notes</Label>
                <Input id="notes" value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} placeholder="Add notes for the team..." />
                <div className="text-xs text-muted-foreground">Last updated: {new Date(applicant.updated_at).toLocaleString()}</div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleNotesSave} disabled={saving}>Save Notes</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Applicant Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {applicant.master_records?.email || "-"}</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {applicant.master_records?.phone || "-"}</div>
                <div>Applied: {new Date(applicant.created_at).toLocaleDateString()}</div>
                {applicant.application_deadline && (
                  <div>Deadline: {new Date(applicant.application_deadline).toLocaleDateString()}</div>
                )}
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">Amount: {applicant.payment_amount ? `$${applicant.payment_amount}` : "N/A"}</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={paymentStatus} onValueChange={(v) => setPaymentStatus(v as any)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentStatuses.map((s) => (
                        <SelectItem key={s} value={s}>{s.toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={handlePaymentSave} disabled={saving}>Save</Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <AISuggestionsCard onApply={(title) => toast({ title: "Sequence queued", description: title })} />
          </div>
        </div>
      </div>
    </ModernAdminLayout>
  );
};

export default ApplicantDetailPage;
