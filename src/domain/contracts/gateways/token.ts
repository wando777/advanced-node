export interface TokenGenerator {
  generate: (input: TokenGenerator.Input) => Promise<TokenGenerator.Output>
}

export namespace TokenGenerator {
  export type Input = {
    key: string
    expirationInMs: number
  }
  export type Token = {
    value: string
  }
  export type Output = Token
}

export interface TokenValidator {
  validate: (params: TokenValidator.Params) => Promise<TokenValidator.Result>
}

export namespace TokenValidator {
  export type Params = {
    token: string
  }
  export type Result = string
}
