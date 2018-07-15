<template>
  <ul v-if="suggestions.length" class="list">
    <li
      v-for="(item, index) in suggestions"
      :key="index"
      @click="select(item)"
    >
      {{ item.text }}
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    suggestions: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    select(item) {
      this.$emit('selected', item);
    },
  },
};
</script>
<style lang="scss" scoped>
.list {
  @include box();
  position: absolute;
  top: 3em;
  list-style: none;
  margin: 0;
  padding: 0;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: scroll;
  li {
    padding: 12px;
    cursor: pointer;
    &:hover {
      background: #f9f9f9;
    }
  }
}
</style>

