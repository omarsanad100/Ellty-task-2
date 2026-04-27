import 'dotenv/config'
import app from './app.js'

const HOST = process.env.DEV_SERVER_HOST ?? 'localhost'
const PORT = Number(process.env.PORT) || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`)
})
