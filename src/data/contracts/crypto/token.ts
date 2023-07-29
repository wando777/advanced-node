export interface TokenGenerator {
  generateToken: (input: TokenGenerator.Input) => Promise<void>
}

export namespace TokenGenerator {
  export type Input = {
    key: string
  }
}
