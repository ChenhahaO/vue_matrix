import router from '@/router'

export default () => {
  // 定义发送消息的函数
  const sendMessageToParent = (message: any) => {
    if (window.parent) {
      window.parent.postMessage(message, '*')
      console.log('Received message for parent: 登录成功')
    }
  }

  // 接收消息
  const messageHandler = (event: MessageEvent) => {
    sessionStorage.setItem('isThirdLogin', 'true')
    sessionStorage.setItem('token', event.data.token)
    console.log('Received message from parent:', event.data)
    const message = {
      loginSuccess: true,
    }
    sendMessageToParent(message)
    router.replace({ path: event.data.path })
  }

  window.addEventListener('message', messageHandler)
}
