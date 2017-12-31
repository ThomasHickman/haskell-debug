import net = require('net')
import os = require('os')
import readline = require('readline')
import { Message } from './message'

const PIPE_NAME = 'haskell-debug'

const connectionPath = os.platform() === 'win32' ?
  '\\\\.\\pipe\\' + PIPE_NAME : `/tmp/${PIPE_NAME}.sock`
const client = net.connect(connectionPath)

const rl = readline.createInterface({
  input: process.stdin,
})

let ignoreOutput = false

rl.on('line', (text: string) => {
  if (ignoreOutput) {
    ignoreOutput = false
    return
  }
  client.write(text + '\n')
})

let totalData = ''
client.on('data', (data: Buffer) => {
  onData(data.toString())
})

function onData(data: string) {
  const newLinePos = data.indexOf('\n')
  if (newLinePos !== -1) {
    totalData += data.slice(0, newLinePos)
    onMessage(JSON.parse(totalData) as Message)
    totalData = ''
    onData(data.slice(newLinePos + 1))
  } else {
    totalData += data
  }
}

function onMessage(message: Message) {
  if (message.type === 'message') {
    process.stdout.write(message.content)
  } else if (message.type === 'display-command') {
    process.stdout.write(message.command + '\n')
    ignoreOutput = true
    rl.write('\n')
  } else if (message.type === 'destroy-prompt') {
    rl.close()
  } else if (message.type === 'close') {
    process.exit()
  } else if (message.type === 'user-input') {
    rl.prompt()
  }
}
