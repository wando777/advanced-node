export interface TokenGenerator {
  generateToken: (input: TokenGenerator.Input) => Promise<TokenGenerator.Output>
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
