import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import type { AppSettings } from "@/types/settings";
import { Shield, Bell, User, Users } from "lucide-react";

interface SettingsTabsProps {
  initialSettings: AppSettings;
}

export const SettingsTabs = ({ initialSettings }: SettingsTabsProps) => {
  const [settings, setSettings] = useState<AppSettings>(initialSettings);

  const saveTab = (label: string) => {
    toast.success(`${label} salvo com sucesso.`);
  };

  return (
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="first-name">Nome</Label>
                <Input
                  id="first-name"
                  value={settings.profile.firstName}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, firstName: event.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="last-name">Sobrenome</Label>
                <Input
                  id="last-name"
                  value={settings.profile.lastName}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, lastName: event.target.value },
                    }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.profile.email}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, email: event.target.value },
                    }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={settings.profile.phone}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, phone: event.target.value },
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => saveTab("Perfil")}>Salvar perfil</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="partner">
        <Card className="rounded-lg border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Parceiro de casa</CardTitle>
            <p className="text-sm text-gray-600">Gerencie a conexão com quem divide a casa com você.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <p className="font-medium text-gray-900">{settings.partner.name}</p>
                <p className="text-sm text-gray-500">{settings.partner.email}</p>
                <p className="text-xs text-green-600">Conectado desde {settings.partner.connectedSince}</p>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ativo</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">Gerenciar</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Convidar parceiro</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="privacy">
        <Card className="rounded-lg border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Privacidade e Segurança</CardTitle>
            <p className="text-sm text-gray-600">Controle as permissões da sua conta.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <div>
                <p className="font-medium text-gray-900">Autenticação em 2 fatores</p>
                <p className="text-sm text-gray-600">Aumenta a segurança da sua conta.</p>
              </div>
              <Switch
                checked={settings.privacy.twoFactorEnabled}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    privacy: { ...prev.privacy, twoFactorEnabled: checked },
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <div>
                <p className="font-medium text-gray-900">Compartilhar dados de uso</p>
                <p className="text-sm text-gray-600">Ajuda a melhorar o produto.</p>
              </div>
              <Switch
                checked={settings.privacy.shareUsageData}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    privacy: { ...prev.privacy, shareUsageData: checked },
                  }))
                }
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">Alterar senha</Button>
              <Button variant="outline">Exportar dados</Button>
              <Button variant="destructive">Excluir conta</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card className="rounded-lg border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <p className="text-sm text-gray-600">Escolha como deseja receber avisos.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <div>
                <p className="font-medium text-gray-900">Notificações por e-mail</p>
                <p className="text-sm text-gray-600">Receba novidades por e-mail.</p>
              </div>
              <Switch
                checked={settings.notifications.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, emailNotifications: checked },
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <div>
                <p className="font-medium text-gray-900">Novas despesas</p>
                <p className="text-sm text-gray-600">Quando seu parceiro adicionar despesas.</p>
              </div>
              <Switch
                checked={settings.notifications.newExpenses}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, newExpenses: checked },
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <div>
                <p className="font-medium text-gray-900">Lembretes de acerto</p>
                <p className="text-sm text-gray-600">Resumo semanal de pendências.</p>
              </div>
              <Switch
                checked={settings.notifications.settlementReminders}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, settlementReminders: checked },
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <div>
                <p className="font-medium text-gray-900">Atualizações da lista de compras</p>
                <p className="text-sm text-gray-600">Quando itens forem adicionados ou concluídos.</p>
              </div>
              <Switch
                checked={settings.notifications.shoppingUpdates}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, shoppingUpdates: checked },
                  }))
                }
              />
            </div>

            <div className="flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => saveTab("Notificações")}>Salvar notificações</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
