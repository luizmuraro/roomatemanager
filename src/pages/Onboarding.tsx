import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Link2, Loader2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api-errors";
import { useCreateHousehold, useJoinHousehold } from "@/hooks/useHousehold";

type OnboardingMode = "create" | "join";

const Onboarding = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<OnboardingMode>("create");
  const [householdName, setHouseholdName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const createHousehold = useCreateHousehold();
  const joinHousehold = useJoinHousehold();

  const isSubmitting = createHousehold.isPending || joinHousehold.isPending;

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await createHousehold.mutateAsync({ name: householdName.trim() });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Falha ao criar apartamento."));
    }
  };

  const handleJoin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await joinHousehold.mutateAsync({ inviteCode: inviteCode.toUpperCase().trim() });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Falha ao entrar no apartamento."));
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/70 shadow-lg">
        <CardHeader>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Home className="h-6 w-6" />
          </div>
          <CardTitle className="mt-3 text-2xl">Vamos configurar sua casa</CardTitle>
          <CardDescription>
            Crie um apartamento novo ou entre com um codigo de convite.
          </CardDescription>

          <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
            <Button
              type="button"
              variant={mode === "create" ? "default" : "ghost"}
              onClick={() => setMode("create")}
              className="w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar apartamento
            </Button>
            <Button
              type="button"
              variant={mode === "join" ? "default" : "ghost"}
              onClick={() => setMode("join")}
              className="w-full"
            >
              <Link2 className="mr-2 h-4 w-4" />
              Entrar com codigo
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {mode === "create" ? (
            <form className="space-y-4" onSubmit={handleCreate}>
              <div className="space-y-2">
                <Label htmlFor="household-name">Nome do apartamento</Label>
                <Input
                  id="household-name"
                  value={householdName}
                  onChange={(event) => setHouseholdName(event.target.value)}
                  placeholder="Ex.: Apartamento 302"
                  minLength={2}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Criar apartamento
              </Button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleJoin}>
              <div className="space-y-2">
                <Label htmlFor="invite-code">Codigo de convite (6 digitos)</Label>
                <Input
                  id="invite-code"
                  value={inviteCode}
                  onChange={(event) => setInviteCode(event.target.value.toUpperCase())}
                  placeholder="ABC123"
                  maxLength={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Entrar no apartamento
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
