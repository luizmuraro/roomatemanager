export interface ProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface PartnerSettings {
  name: string;
  email: string;
  connectedSince: string;
}

export interface PrivacySettings {
  twoFactorEnabled: boolean;
  shareUsageData: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  newExpenses: boolean;
  settlementReminders: boolean;
  shoppingUpdates: boolean;
}

export interface AppSettings {
  profile: ProfileSettings;
  partner: PartnerSettings;
  privacy: PrivacySettings;
  notifications: NotificationSettings;
}
