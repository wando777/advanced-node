export interface UUIDGenerator {
  generate: (input: UUIDGenerator.Input) => UUIDGenerator.Output
}

export namespace UUIDGenerator {
  export type Input = { key: string }
  export type Output = string
}
