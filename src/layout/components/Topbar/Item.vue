
<script>
import { isExternal } from '@/utils/validate'
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    title: {
      type: String,
      default: ''
    },
  },
  render(h, context) {
    const { title } = context.props
    const vnodes = []

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  },
  methods: {
    linkProps(url) {
      if (isExternal(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to: url
      }
    }
  }
}
</script>
