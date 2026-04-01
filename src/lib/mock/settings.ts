import type { AppSettings } from "@/types/settings";

export const mockSettings: AppSettings = {
  profile: {
    firstName: "João",
    lastName: "Silva",
    email: "joao@example.com",
    phone: "+55 (11) 99999-9999",
  },
  roommate: {
    name: "Alex Silva",
    email: "alex@example.com",
    connectedSince: "Setembro de 2025",
  },
  privacy: {
    twoFactorEnabled: true,
    shareUsageData: false,
  },
  notifications: {
    emailNotifications: true,
    newExpenses: true,
    settlementReminders: false,
    shoppingUpdates: true,
  },
};
