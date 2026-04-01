import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { mockSettings } from "@/lib/mock-data";

export const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">Configurações</h1>
        <p className="text-sm text-gray-600">Gerencie sua conta e preferências do aplicativo.</p>
      </div>
      <SettingsTabs initialSettings={mockSettings} />
    </div>
  );
};

export default Settings;
