export class UserProfile {
  initials?: string
  pictureUrl?: string
  constructor(readonly id: string) { }

  setPicture({ pictureUrl, name }: { pictureUrl?: string, name?: string }): void {
    this.pictureUrl = pictureUrl
    if (name !== undefined && pictureUrl === undefined) {
      name = name.toUpperCase()
      const firstLetters = name.match(/\b(.)/g) ?? []
      if (firstLetters.length > 1) {
        this.initials = `${firstLetters.shift() ?? ''}${firstLetters.pop() ?? ''}`
      } else {
        this.initials = name?.substring(0, 2)
      }
    }
  }
}
