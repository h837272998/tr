<template>
  <article-detail :is-edit="false" />
</template>

<script>
  import ArticleDetail from './components/ArticleDetail-comm'

  export default {
    name: 'Communicate',
    components: { ArticleDetail }
  }
</script>

