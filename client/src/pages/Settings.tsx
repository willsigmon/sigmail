import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { Settings as SettingsIcon, Mail, Key, Link as LinkIcon, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [gmailClientId, setGmailClientId] = useState("");
  const [gmailClientSecret, setGmailClientSecret] = useState("");

  const { data: emailAccounts, refetch: refetchAccounts } = trpc.emailAccounts.list.useQuery();
  const { data: integrations, refetch: refetchIntegrations } = trpc.integrations.list.useQuery();

  const connectGmailMutation = trpc.emailAccounts.connect.useMutation();

  const handleConnectGmail = async () => {
    try {
      const result = await connectGmailMutation.mutateAsync({
        provider: "gmail",
        email: "user@gmail.com", // This would come from OAuth flow
      });
      toast.success("Gmail account connected!");
      refetchAccounts();
    } catch (error) {
      toast.error("Failed to connect Gmail account");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and integrations</p>
        </div>

        {/* Email Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Accounts
            </CardTitle>
            <CardDescription>Connect and manage your email accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {emailAccounts && emailAccounts.length > 0 ? (
              <div className="space-y-3">
                {emailAccounts.map((account: any) => (
                  <div key={account.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{account.email}</p>
                        <p className="text-sm text-muted-foreground capitalize">{account.provider}</p>
                      </div>
                    </div>
                    <Badge variant={account.isActive ? "default" : "secondary"}>
                      {account.isActive ? (
                        <>
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Connected
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-1 h-3 w-3" />
                          Disconnected
                        </>
                      )}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No email accounts connected</p>
            )}

            <Separator />

            <div>
              <h4 className="font-medium mb-3">Connect New Account</h4>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleConnectGmail}
                  disabled={connectGmailMutation.isPending}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Connect Gmail Account
                </Button>
                <p className="text-xs text-muted-foreground">
                  Note: You'll need to set up OAuth credentials in Google Cloud Console first
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Keys
            </CardTitle>
            <CardDescription>Configure API keys for external services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key">OpenAI API Key</Label>
              <Input
                id="openai-key"
                type="password"
                placeholder="sk-..."
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Currently using built-in LLM service
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="anthropic-key">Anthropic API Key (Optional)</Label>
              <Input
                id="anthropic-key"
                type="password"
                placeholder="sk-ant-..."
                disabled
              />
              <p className="text-xs text-muted-foreground">
                For Claude integration
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Integrations
            </CardTitle>
            <CardDescription>Connect with other services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {integrations && integrations.length > 0 ? (
              integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium capitalize">{integration.service}</p>
                    <p className="text-sm text-muted-foreground">
                      Connected {integration.lastSyncedAt ? new Date(integration.lastSyncedAt).toLocaleDateString() : 'recently'}
                    </p>
                  </div>
                  <Badge variant={integration.isActive ? "default" : "secondary"}>
                    {integration.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No integrations configured</p>
            )}

            <Separator />

            <div className="grid gap-2 md:grid-cols-2">
              <Button variant="outline" disabled>
                <LinkIcon className="mr-2 h-4 w-4" />
                Connect Slack
              </Button>
              <Button variant="outline" disabled>
                <LinkIcon className="mr-2 h-4 w-4" />
                Connect Calendar
              </Button>
              <Button variant="outline" disabled>
                <LinkIcon className="mr-2 h-4 w-4" />
                Connect Drive
              </Button>
              <Button variant="outline" disabled>
                <LinkIcon className="mr-2 h-4 w-4" />
                Connect Notion
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Additional integrations coming soon
            </p>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Preferences
            </CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Preference settings coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

