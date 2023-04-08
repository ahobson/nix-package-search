import { generateUpdate } from '../src/generate/generate'

async function main() {
  try {
    await generateUpdate()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

if (require.main) {
  main()
}
