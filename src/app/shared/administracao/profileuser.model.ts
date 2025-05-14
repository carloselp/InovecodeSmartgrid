export class ProfileUserNewModel {
  constructor(
    public id_user: number,
    public id_profile: number
  ){}
}

export class ProfileUserModel {
  constructor(
    public id: number,
    public id_profile: number,
    public profile_name: string
  ){}
}
