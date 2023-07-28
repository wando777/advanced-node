import { type AccountModel } from './account-model'

type FacebookAccountModel = {
  facebookId: string
  name: string
  email: string
}

export class FacebookAccount {
  userId?: string
  name: string
  email: string
  facebookId: string

  constructor(
    facebookAccountData: FacebookAccountModel,
    accountData?: AccountModel
  ) {
    this.userId = accountData?.userId
    this.name = accountData?.name ?? facebookAccountData.name
    this.email = facebookAccountData.email
    this.facebookId = facebookAccountData.facebookId
  }
}
