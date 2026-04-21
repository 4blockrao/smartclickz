import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSocialAccounts, type SocialPlatform } from "@/hooks/useSocialAccounts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  ArrowLeft,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  tiktok: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  ),
  youtube: Youtube,
  linkedin: Linkedin,
};

const platformColors = {
  facebook: "from-blue-500 to-blue-600",
  instagram: "from-pink-500 to-purple-600",
  twitter: "from-blue-400 to-blue-500",
  tiktok: "from-black to-gray-800",
  youtube: "from-red-500 to-red-600",
  linkedin: "from-blue-600 to-blue-700",
};

const SocialConnect: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { accounts, isLoading, addAccount, deleteAccount, isAdding, isDeleting } =
    useSocialAccounts(user?.id);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    platform: "" as SocialPlatform,
    username: "",
    profile_url: "",
    follower_count: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.platform || !formData.username || !formData.profile_url) {
      return;
    }

    addAccount(
      {
        platform: formData.platform,
        username: formData.username,
        profile_url: formData.profile_url,
        follower_count: formData.follower_count ? parseInt(formData.follower_count) : undefined,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setFormData({
            platform: "" as SocialPlatform,
            username: "",
            profile_url: "",
            follower_count: "",
          });
        },
      }
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      verified: "bg-green-500",
      pending: "bg-yellow-500",
      rejected: "bg-red-500",
    };
    return variants[status as keyof typeof variants] || "bg-gray-500";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative px-4 sm:px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
              Connect Social Accounts
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
              Link your social media accounts to participate in campaigns and earn points by
              completing tasks on your connected platforms.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Info Card */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Why Connect Your Accounts?</h3>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Complete social media tasks and campaigns</li>
                    <li>• Earn points for likes, shares, follows, and comments</li>
                    <li>• Verified accounts unlock higher-paying tasks</li>
                    <li>• Track your performance across platforms</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Account Button */}
          <div className="flex justify-end mb-6">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Social Account
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-white/20 text-white">
                <DialogHeader>
                  <DialogTitle>Add Social Account</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Connect a social media account to start earning from campaigns.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select
                      value={formData.platform}
                      onValueChange={(value) =>
                        setFormData({ ...formData, platform: value as SocialPlatform })
                      }
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20">
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">Twitter/X</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="username">Username/Handle</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="@yourhandle"
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="profile_url">Profile URL</Label>
                    <Input
                      id="profile_url"
                      type="url"
                      value={formData.profile_url}
                      onChange={(e) => setFormData({ ...formData, profile_url: e.target.value })}
                      placeholder="https://..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="follower_count">Follower Count (Optional)</Label>
                    <Input
                      id="follower_count"
                      type="number"
                      value={formData.follower_count}
                      onChange={(e) =>
                        setFormData({ ...formData, follower_count: e.target.value })
                      }
                      placeholder="1000"
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={isAdding}
                  >
                    {isAdding ? "Adding..." : "Add Account"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Connected Accounts */}
          <div className="grid gap-4">
            {accounts.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">No Accounts Connected</h3>
                  <p className="text-slate-400 mb-4">
                    Connect your social media accounts to start earning points from campaigns.
                  </p>
                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Account
                  </Button>
                </CardContent>
              </Card>
            ) : (
              accounts.map((account) => {
                const Icon = platformIcons[account.platform];
                const colorClass = platformColors[account.platform];

                return (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:border-white/30 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full bg-gradient-to-r ${colorClass} flex items-center justify-center`}
                            >
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-white font-semibold capitalize">
                                  {account.platform}
                                </h3>
                                <Badge
                                  className={`${getStatusBadge(
                                    account.verification_status
                                  )} text-white text-xs`}
                                >
                                  {account.verification_status}
                                </Badge>
                              </div>
                              <p className="text-slate-300 text-sm">{account.username}</p>
                              {account.follower_count && (
                                <p className="text-slate-400 text-xs mt-1">
                                  {account.follower_count.toLocaleString()} followers
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {getStatusIcon(account.verification_status)}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-300 hover:text-white hover:bg-white/10"
                              onClick={() => window.open(account.profile_url, "_blank")}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              onClick={() => deleteAccount(account.id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {account.verification_status === "pending" && (
                          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <p className="text-yellow-200 text-sm">
                              ⏳ Your account is pending verification. Admin will review within 24-48
                              hours.
                            </p>
                          </div>
                        )}

                        {account.verification_status === "rejected" && (
                          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-red-200 text-sm">
                              ❌ Verification failed. Please ensure the profile URL is correct and
                              publicly accessible.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialConnect;
