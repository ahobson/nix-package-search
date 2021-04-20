declare module 'worker-loader!*' {
  function createInstance(): Worker
  export = createInstance
}
