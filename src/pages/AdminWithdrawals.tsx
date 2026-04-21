
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Filter,
  Search,
  Eye
} from "lucide-react";
import { toast } from "sonner";

interface WithdrawalRequest {
  id: string;
  user_id: string;
  requested_points: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_at?: string;
  admin_note?: string;
  profiles?: {
    display_name: string;
    email: string;
    withdrawal_method?: string;
    withdrawal_details?: any;
  };
}

export default function AdminWithdrawals() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [adminNote, setAdminNote] = useState("");

  const { data: withdrawalRequests = [], isLoading } = useQuery({
    queryKey: ["admin-withdrawal-requests", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("withdrawal_requests")
        .select(`
          *,
          profiles!withdrawal_requests_user_id_fkey (
            display_name,
            email,
            withdrawal_method,
            withdrawal_details
          )
        `)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Query error:", error);
        throw error;
      }
      return (data || []) as any;
    },
  });

  const updateWithdrawalMutation = useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      note 
    }: { 
      id: string; 
      status: "approved" | "rejected"; 
      note: string;
    }) => {
      const { error } = await supabase
        .from("withdrawal_requests")
        .update({
          status,
          admin_note: note,
          reviewed_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;

      // If approved, deduct points from user's balance
      if (status === "approved") {
        const request = withdrawalRequests.find(r => r.id === id);
        if (request) {
          const { error: pointsError } = await supabase
            .from("points_ledger")
            .insert([
              {
                user_id: request.user_id,
                amount: request.requested_points,
                type: "debit",
                event_code: `withdrawal_${id}`,
                note: `Withdrawal approved - ${request.requested_points} points`,
                event_metadata: {
                  withdrawal_id: id,
                  admin_note: note
                }
              }
            ]);

          if (pointsError) throw pointsError;
        }
      }
    },
    onSuccess: (_, { status }) => {
      toast.success(`Withdrawal ${status} successfully`);
      setSelectedRequest(null);
      setAdminNote("");
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawal-requests"] });
    },
    onError: (error) => {
      toast.error("Failed to update withdrawal request");
      console.error("Withdrawal update error:", error);
    },
  });

  const filteredRequests = withdrawalRequests.filter(request => {
    const matchesSearch = searchTerm === "" || 
      request.profiles?.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleApprove = () => {
    if (!selectedRequest) return;
    updateWithdrawalMutation.mutate({
      id: selectedRequest.id,
      status: "approved",
      note: adminNote
    });
  };

  const handleReject = () => {
    if (!selectedRequest) return;
    updateWithdrawalMutation.mutate({
      id: selectedRequest.id,
      status: "rejected", 
      note: adminNote
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const totalPending = withdrawalRequests.filter(r => r.status === "pending").length;
  const totalPendingAmount = withdrawalRequests
    .filter(r => r.status === "pending")
    .reduce((sum, r) => sum + r.requested_points, 0);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Withdrawal Management</h1>
          <p className="text-muted-foreground">Review and process user withdrawal requests</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{totalPending}</div>
            <div className="text-sm text-muted-foreground">Pending Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {totalPendingAmount.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Pending Points</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              ${(totalPendingAmount * 0.01).toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Pending USD Value</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by user name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No withdrawal requests found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{request.profiles?.display_name || "Unknown User"}</h3>
                        <Badge className={`${getStatusColor(request.status)} text-white`}>
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{request.profiles?.email}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {request.requested_points.toLocaleString()} points (${(request.requested_points * 0.01).toFixed(2)})
                        </span>
                        <span>{new Date(request.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setAdminNote(request.admin_note || "");
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Review Withdrawal Request</DialogTitle>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <Label>User</Label>
                                  <p className="font-medium">{selectedRequest.profiles?.display_name}</p>
                                </div>
                                <div>
                                  <Label>Amount</Label>
                                  <p className="font-medium">{selectedRequest.requested_points.toLocaleString()} points</p>
                                </div>
                                <div>
                                  <Label>USD Value</Label>
                                  <p className="font-medium">${(selectedRequest.requested_points * 0.01).toFixed(2)}</p>
                                </div>
                                <div>
                                  <Label>Method</Label>
                                  <p className="font-medium">{selectedRequest.profiles?.withdrawal_method || "Not specified"}</p>
                                </div>
                              </div>

                              {selectedRequest.profiles?.withdrawal_details && (
                                <div>
                                  <Label>Payment Details</Label>
                                  <div className="bg-muted p-3 rounded mt-1 text-sm">
                                    {typeof selectedRequest.profiles.withdrawal_details === 'string' 
                                      ? selectedRequest.profiles.withdrawal_details
                                      : JSON.stringify(selectedRequest.profiles.withdrawal_details, null, 2)
                                    }
                                  </div>
                                </div>
                              )}

                              <div>
                                <Label htmlFor="admin-note">Admin Note</Label>
                                <Textarea
                                  id="admin-note"
                                  value={adminNote}
                                  onChange={(e) => setAdminNote(e.target.value)}
                                  placeholder="Add a note about this withdrawal..."
                                  className="mt-1"
                                />
                              </div>

                              {selectedRequest.status === "pending" && (
                                <div className="flex gap-2">
                                  <Button 
                                    onClick={handleApprove}
                                    disabled={updateWithdrawalMutation.isPending}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button 
                                    onClick={handleReject}
                                    disabled={updateWithdrawalMutation.isPending}
                                    variant="destructive"
                                    className="flex-1"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
