export class DashboardSolaplantGeracaoModel {
  constructor(
    public createdAt: string,
    public name: string,
    public value: number
  ) {
  }
}

export class DashboardSolaplantMedicaoModel {
  constructor(
    public name: string,
    public value: number
  ) {
  }
}
