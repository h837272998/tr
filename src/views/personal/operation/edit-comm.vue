<template>
  <article-detail :is-edit="true" />
</template>

<script>
  import ArticleDetail from './components/ArticleDetail-comm'

  export default {
    name: 'EditForm',
    components: { ArticleDetail }
  }
</script>

