import fs from 'node:fs'
import path from 'node:path'

export default (event: any) => {
  const url = event.path || ''
  if (url.startsWith('/models/')) {
    // Strip query parameters
    const cleanPath = url.split('?')[0]
    // Check if the file exists in the public directory
    const filePath = path.join(process.cwd(), 'public', cleanPath)
    
    if (!fs.existsSync(filePath)) {
      event.node.res.statusCode = 404
      event.node.res.setHeader('Content-Type', 'text/plain')
      event.node.res.end('Model file not found')
      return
    }
  }
}
