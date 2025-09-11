export type ApiResult<TData = any> = {
  readonly body: TData
  readonly ok: boolean
  readonly status: number
  readonly statusText: string
  readonly url: string
  readonly headers?: Record<string,unknown>
}