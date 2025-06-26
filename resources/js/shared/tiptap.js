import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

/**
 * TipTap Editor Alpine Component
 *
 * This file exports an initialiser for a reusable rich text editor component.
 * It uses TipTap for the actual editor, with Alpine.js for reactivity.
 *
 * You can delete this file if you never want to use a rich text editor in one of your views.
 *
 * @example
 * import { startAlpine } from './shared/alpine.js'
 * import { registerTiptapEditor } from './shared/tiptap.js'
 * // Register tiptap first
 * registerTiptapEditor()
 * // Then start Alpine
 * startAlpine()
 */
export const registerTiptapEditor = () => {
  Alpine.data('editor', (content) => {
    let editor

    return {
      updatedAt: Date.now(),
      init() {
        const _this = this
        editor = new Editor({
          element: this.$refs.element,
          extensions: [StarterKit],
          content: content,
          onCreate({ editor }) {
            _this.updatedAt = Date.now()
          },
          onUpdate({ editor }) {
            _this.updatedAt = Date.now()
          },
          onSelectionUpdate({ editor }) {
            _this.updatedAt = Date.now()
          },
        })
      },
      isLoaded() {
        return editor
      },
      isActive(type, opts = {}) {
        return editor.isActive(type, opts)
      },
      toggleHeading(opts) {
        editor.chain().toggleHeading(opts).focus().run()
      },
      toggleBold() {
        editor.chain().focus().toggleBold().run()
      },
      toggleItalic() {
        editor.chain().toggleItalic().focus().run()
      },
    }
  })
  console.log('Registered TipTap editor')
}
