export class AppConstants {

  public static get baseServidor(): string { return "https://inovecode-back.azurewebsites.net/"}
  public static get baseLogin(): string { return this.baseServidor + 'api/Login/v1' }
  public static get baseUser(): string { return this.baseServidor + 'api/Users/v1' }
  public static get baseSystemProfileUsers(): string { return this.baseServidor + 'api/SystemProfileUsers/v1' }
  public static get baseSystemPageUsers(): string { return this.baseServidor + 'api/SystemPageUsers/v1' }
  public static get baseSystemPages(): string { return this.baseServidor + 'api/SystemPages/v1' }
  public static get baseSystemPageProfiles(): string { return this.baseServidor + 'api/SystemPageProfiles/v1' }
  public static get baseSystemProfiles(): string { return this.baseServidor + 'api/SystemProfiles/v1' }
  public static get baseSolarPlant(): string { return this.baseServidor + 'api/SystemSolarplants/v1' }
  public static get baseSolarInverter(): string { return this.baseServidor + 'api/SystemSolarinverters/v1' }
  public static get baseDashboardSolarplant(): string { return this.baseServidor + 'api/Dashboard/Solarplant/v1' }

}

