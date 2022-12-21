import { io } from 'socket.io-client'

class Socket {
  public static connect(url: string) {
    return io('localhost:3000')
  }
}

export default Socket
