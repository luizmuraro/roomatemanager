import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, Shield, User, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useGenerateInvite, useHousehold } from "@/hooks/useHousehold";
import { useMe, useUpdateMe } from "@/hooks/useUser";
import { getApiErrorMessage } from "@/lib/api-errors";

export const Settings = () => {
  const { user } = useAuth();
  const meQuery = useMe();
  const householdQuery = useHousehold();
  const updateMe = useUpdateMe();
  const generateInvite = useGenerateInvite();

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const me = meQuery.data?.data;
    if (me) {
      setName(me.name);
      setAvatarUrl(me.avatarUrl ?? "");
    }
  }, [meQuery.data]);

  useEffect(() => {
    if (meQuery.isError) {
      toast.error(getApiErrorMessage(meQuery.error, "Falha ao carregar perfil."));
    }
  }, [meQuery.isError, meQuery.error]);

  useEffect(() => {
    if (householdQuery.isError) {
      toast.error(getApiErrorMessage(householdQuery.error, "Falha ao carregar dados da casa."));
    }
  }, [householdQuery.isError, householdQuery.error]);

  const me = meQuery.data?.data;
  const household = householdQuery.data?.data;
  const partner = household?.members.find((member) => member.id !== user?.id) ?? null;

  const handleSaveProfile = async () => {
    try {
      await updateMe.mutateAsync({
        name: name.trim(),
        avatarUrl: avatarUrl.trim() ? avatarUrl.trim() : undefined,
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Falha ao atualizar perfil."));
    }
  };

  const handleCopyInviteCode = async () => {
    if (!household?.inviteCode) {
      toast.error("Codigo de convite indisponivel.");
      return;
    }

    try {
      await navigator.clipboard.writeText(household.inviteCode);
      toast.success("Codigo copiado!");
    } catch {
      toast.error("Nao foi possivel copiar o codigo.");
    }
  };

  const handleGenerateInvite = async () => {
    try {
      await generateInvite.mutateAsync();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Falha ao gerar novo codigo."));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">Configurações</h1>
        <p className="text-sm text-gray-600">Gerencie sua conta e preferências do aplicativo.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 p-1 md:grid-cols-4">
          <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" />Perfil</TabsTrigger>
          <TabsTrigger value="partner" className="gap-2"><Users className="h-4 w-4" />Parceiro</TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2"><Shield className="h-4 w-4" />Privacidade</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" />Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="rounded-lg border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <p className="text-sm text-gray-600">Atualize suas informações pessoais.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {meQuery.isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="settings-name">Nome</Label>
                    <Input
                      id="settings-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="settings-email">E-mail</Label>
                    <Input id="settings-email" value={me?.email ?? ""} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="settings-avatar">Avatar URL</Label>
                    <Input
                      id="settings-avatar"
                      value={avatarUrl}
                      onChange={(event) => setAvatarUrl(event.target.value)}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleSaveProfile}
                      disabled={updateMe.isPending}
                    >
                      Salvar perfil
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partner">
          <Card className="rounded-lg border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Parceiro de casa</CardTitle>
              <p className="text-sm text-gray-600">Gerencie convite e dados da sua casa.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {householdQuery.isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                    <div>
                      <p className="font-medium text-gray-900">{partner?.name ?? "Sem parceiro conectado"}</p>
                      <p className="text-sm text-gray-500">{partner?.email ?? "Convide alguem para compartilhar a casa"}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {partner ? "Ativo" : "Pendente"}
                    </Badge>
                  </div>

                  <div className="space-y-2 rounded-lg border border-gray-200 p-3">
                    <Label htmlFor="invite-code">Codigo de convite</Label>
                    <div className="flex gap-2">
                      <Input id="invite-code" value={household?.inviteCode ?? ""} disabled />
                      <Button variant="outline" onClick={handleCopyInviteCode}>Copiar</Button>
                    </div>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleGenerateInvite}
                      disabled={generateInvite.isPending}
                    >
                      Gerar novo codigo
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card className="rounded-lg border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Privacidade e Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Configurações avançadas serão integradas nas próximas etapas.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="rounded-lg border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Preferências de notificação serão integradas nas próximas etapas.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
