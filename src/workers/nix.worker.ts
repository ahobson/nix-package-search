import { db } from './../config/DBConfig'
import {
  NixMessage,
  SendNixMessageFunction,
  isNixStartParseAndLoadMessage,
} from './../config/messages'

import { parseAndLoad } from './../util/dbLoader'

const sendMessage: SendNixMessageFunction = (msg: NixMessage) => {
  postMessage(msg)
}

onmessage = (message: MessageEvent) => {
  if (isNixStartParseAndLoadMessage(message.data)) {
    parseAndLoad(db, sendMessage)
  }
}
