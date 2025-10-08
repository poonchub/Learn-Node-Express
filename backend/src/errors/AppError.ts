export class AppError extends Error {
  public status: number
  public code?: string | undefined
  constructor(message: string, status = 500, code?: string) {
    super(message)
    this.status = status
    this.code = code
  }
}