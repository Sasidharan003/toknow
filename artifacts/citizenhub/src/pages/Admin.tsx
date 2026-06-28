import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ShieldAlert, Check, X, ShieldCheck, Mail, Phone, MapPin, Calendar, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Lawyer {
  id: number;
  name: string;
  specialization: string;
  experience: string;
  courts: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  status: string;
}

interface Complaint {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function Admin() {
  const [pendingLawyers, setPendingLawyers] = useState<Lawyer[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loadingLawyers, setLoadingLawyers] = useState(true);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

  // Fetch pending advocates
  const fetchPendingLawyers = async () => {
    try {
      const res = await fetch(`${BASE}/api/lawyers?status=pending`);
      if (res.ok) {
        const data = await res.json();
        setPendingLawyers(data);
      }
    } catch (err) {
      console.error("Failed to load pending advocates:", err);
    } finally {
      setLoadingLawyers(false);
    }
  };

  // Fetch civic complaints
  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${BASE}/api/complaints`);
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      }
    } catch (err) {
      console.error("Failed to load complaints:", err);
    } finally {
      setLoadingComplaints(false);
    }
  };

  useEffect(() => {
    // Verify admin access
    fetch(`${BASE}/api/auth/me`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.user || d.user.role !== "admin") {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You do not have permissions to access the Admin Console.",
          });
          setLocation("/");
        } else {
          fetchPendingLawyers();
          fetchComplaints();
        }
      });
  }, []);

  const handleApproveLawyer = async (id: number) => {
    try {
      const res = await fetch(`${BASE}/api/lawyers/${id}/approve`, { method: "POST" });
      if (res.ok) {
        toast({
          title: "Advocate Approved",
          description: "The lawyer registration has been approved and listed.",
        });
        setPendingLawyers(pendingLawyers.filter((l) => l.id !== id));
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: "Failed to approve lawyer registration.",
      });
    }
  };

  const handleRejectLawyer = async (id: number) => {
    try {
      const res = await fetch(`${BASE}/api/lawyers/${id}/reject`, { method: "POST" });
      if (res.ok) {
        toast({
          title: "Advocate Rejected",
          description: "The lawyer registration request has been declined.",
        });
        setPendingLawyers(pendingLawyers.filter((l) => l.id !== id));
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: "Failed to decline lawyer registration.",
      });
    }
  };

  const handleToggleComplaintStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === "Pending" ? "Resolved" : "Pending";
    try {
      const res = await fetch(`${BASE}/api/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }), // Mock database inserts/updates
      });
      if (res.ok) {
        toast({
          title: "Status Updated",
          description: `Complaint status updated to ${nextStatus}.`,
        });
        fetchComplaints(); // reload
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update complaint status.",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-primary" /> Admin Control Console
        </h1>
        <p className="text-muted-foreground mt-1 font-medium">Verify lawyer registrations and resolve reported public grievances</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Lawyers Moderation Panel */}
        <div className="bg-card border rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold flex items-center gap-2 pb-3 border-b">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Pending Advocates Approvals ({pendingLawyers.length})
          </h2>

          {loadingLawyers ? (
            <div className="flex justify-center py-12">
              <span className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : pendingLawyers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="font-semibold text-sm">No Pending Approvals</p>
              <p className="text-xs mt-1">All lawyer registration requests have been processed.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {pendingLawyers.map((l) => (
                <div key={l.id} className="border bg-slate-950/40 p-4 rounded-xl space-y-3 relative group">
                  <div>
                    <h3 className="font-semibold text-sm">{l.name}</h3>
                    <p className="text-xs text-primary font-bold mt-0.5">{l.specialization}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground font-semibold">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {l.district}, Tamil Nadu
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {l.experience}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> {l.email}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> {l.phone}
                    </div>
                  </div>

                  <div className="pt-3 border-t flex gap-2 justify-end">
                    <button
                      onClick={() => handleRejectLawyer(l.id)}
                      className="px-3 py-1.5 border border-red-500/20 hover:border-red-500/50 text-red-500 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer bg-red-500/5"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => handleApproveLawyer(l.id)}
                      className="px-3 py-1.5 border border-emerald-500/20 hover:border-emerald-500/50 text-emerald-500 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer bg-emerald-500/5"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Complaints Moderation Panel */}
        <div className="bg-card border rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold flex items-center gap-2 pb-3 border-b">
            <ClipboardList className="w-5 h-5 text-primary" /> Civic Grievances &amp; Complaints ({complaints.length})
          </h2>

          {loadingComplaints ? (
            <div className="flex justify-center py-12">
              <span className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="font-semibold text-sm">No Complaints Filed</p>
              <p className="text-xs mt-1">Grievances submitted by citizens will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {complaints.map((c) => (
                <div key={c.id} className="border bg-slate-950/40 p-4 rounded-xl space-y-2 relative group">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-semibold text-sm">{c.title}</h3>
                    <Badge variant={c.status === "Resolved" ? "default" : "outline"} className={c.status === "Resolved" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" : ""}>
                      {c.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">{c.description}</p>
                  
                  <div className="pt-2 border-t flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
                    <span>Filed: {new Date(c.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => handleToggleComplaintStatus(c.id, c.status)}
                      className="px-2.5 py-1.5 border border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-primary rounded-lg font-bold transition-all cursor-pointer"
                    >
                      {c.status === "Resolved" ? "Re-open Complaint" : "Mark Resolved"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
