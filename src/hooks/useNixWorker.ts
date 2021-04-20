// Import your worker
// eslint-disable-next-line import/no-webpack-loader-syntax
import createWorker from 'worker-loader!../workers/nix.worker'

const nixWorker = createWorker()

export const useNixWorker = () => nixWorker
