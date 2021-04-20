export type NixProgressMessage = {
  cursor: number
}

export function isNixProgressMessage(obj: any): obj is NixProgressMessage {
  return 'cursor' in obj && typeof obj.cursor === 'number'
}

export type NixDownloadStartedMessage = {
  packageSize: number
  lastModifiedAt: number
}

export function isNixDownloadStartedMessage(
  obj: any
): obj is NixDownloadStartedMessage {
  return (
    'packageSize' in obj &&
    typeof obj.packageSize === 'number' &&
    'lastModifiedAt' in obj &&
    typeof obj.lastModifiedAt == 'number'
  )
}

export type NixDownloadFinishedMessage = {
  finished: boolean
}

export function isNixDownloadFinishedMessage(
  obj: any
): obj is NixDownloadFinishedMessage {
  return 'finished' in obj && typeof obj.finished === 'boolean'
}

export type NixStartParseAndLoadMessage = {
  op: string
}

export function isNixStartParseAndLoadMessage(
  obj: any
): obj is NixStartParseAndLoadMessage {
  return 'op' in obj && typeof obj.op === 'string' && obj.op === 'parseAndLoad'
}

export type NixMessage =
  | NixProgressMessage
  | NixDownloadStartedMessage
  | NixDownloadFinishedMessage
  | NixStartParseAndLoadMessage

export type SendNixMessageFunction = (msg: NixMessage) => void
