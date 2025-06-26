console.log('Loaded app.js')

import { startAlpine } from './shared/alpine.js'
import { registerTiptapEditor } from './shared/tiptap.js'

// Register any components that use Alpine first
registerTiptapEditor()

// Then start Alpine
startAlpine()
