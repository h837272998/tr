<template>
  <div :id="id" />
</template>

<script>
// deps for editor
import 'codemirror/lib/codemirror.css' // codemirror
import 'tui-editor/dist/tui-editor.css' // editor ui
import 'tui-editor/dist/tui-editor-contents.css' // editor content

import Editor from 'tui-editor'
import defaultOptions from './default-options'
import SparkMD5 from 'spark-md5'
import { upload_v1} from "@/api/file";

export default {
  name: 'MarkdownEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: false,
      default() {
        return 'markdown-editor-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    options: {
      type: Object,
      default() {
        return defaultOptions
      }
    },
    mode: {
      type: String,
      default: 'markdown'
    },
    height: {
      type: String,
      required: false,
      default: '300px'
    },
    language: {
      type: String,
      required: false,
      default: 'en_US' // https://github.com/nhnent/tui.editor/tree/master/src/js/langs
    }
  },
  data() {
    return {
      editor: null
    }
  },
  computed: {
    editorOptions() {
      const options = Object.assign({}, defaultOptions, this.options)
      options.initialEditType = this.mode
      options.height = this.height
      options.language = this.language
      return options
    }
  },
  watch: {
    value(newValue, preValue) {
      if (newValue !== preValue && newValue !== this.editor.getValue()) {
        this.editor.setValue(newValue)
      }
    },
    language(val) {
      this.destroyEditor()
      this.initEditor()
    },
    height(newValue) {
      this.editor.height(newValue)
    },
    mode(newValue) {
      this.editor.changeMode(newValue)
    }
  },
  mounted() {
    this.initEditor()
  },
  destroyed() {
    this.destroyEditor()
  },
  methods: {
    initEditor() {
      this.editor = new Editor({
        el: document.getElementById(this.id),
        hooks: {
          addImageBlobHook: this.addImageBlobHook.bind(this),
        },
        ...this.editorOptions
      })
      if (this.value) {
        this.editor.setValue(this.value)
      }
      this.editor.on('change', () => {
        this.$emit('input', this.editor.getValue())
      })
    },
    addImageBlobHook(blob, callback) {
      var fileReader = new FileReader()
      var md5 = ''
      fileReader.readAsBinaryString(blob)
      var _this = this
      fileReader.onload = function (e) {
        var spark = new SparkMD5()
        spark.appendBinary(e.target.result)
        md5 = spark.end()
        // console.info('md5',md5)
        const data = new FormData()
        data.append('file', blob)
        data.append('md5', md5)
        const notify = _this.$notify({
          title: '上传图像中...',
          duration: 0,
          iconClass: 'el-icon-loading'
        });
        upload_v1(data).then(resp => {
          if (resp.code == 200 && resp.data) {
            const base = process.env.VUE_APP_BASE_API + '/f/files/image'
            notify.close()
            _this.$notify({
              title: '上传成功！',
              type: 'success'
            })
            callback(base + resp.data.url, resp.data.filename);
          }
        }).catch(err => {

        });
      }
      // callback('https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png','name')
    },
    destroyEditor() {
      if (!this.editor) return
      this.editor.off('change')
      this.editor.remove()
    },
    setValue(value) {
      this.editor.setValue(value)
    },
    getValue() {
      return this.editor.getValue()
    },
    setHtml(value) {
      this.editor.setHtml(value)
    },
    getHtml() {
      return this.editor.getHtml()
    }
  }
}
</script>
