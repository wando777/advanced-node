export interface UploadFile {
  upload: (input: UploadFile.Input) => Promise<UploadFile.Output>
}

namespace UploadFile {
  export type Input = { file: Buffer, key: string }
  export type Output = string
}
