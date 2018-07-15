<template>
  <div class="select" @click="open = !open" :class="{ open }">
    <div class="selected">{{ selected.text }}</div>
    <img class="caret" :src="Caret" />
    <SuggestionList
      v-if="open"
      @selected="onSelect"
      :suggestions="options"
    />
  </div>
</template>
<script>
import Caret from '@/assets/caret.svg';
import SuggestionList from './SuggestionList.vue';

export default {
  components: {
    SuggestionList,
  },
  data() {
    return {
      Caret,
      selected: this.value,
      open: false,
    };
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: Object,
    options: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    onSelect(item) {
      this.open = !this.open;
      this.selected = item;
      this.$emit('selected', item);
    },
  },
};
</script>
<style lang="scss" scoped>
.select {
  @include box();
  cursor: pointer;
  padding-right: 2em;
  position: relative;
  display: inline-block;
  .selected {
    line-height: 18px;
  }
  &.open .caret {
    transform: translateY(-50%) rotateX(180deg);
  }
  .caret {
    position: absolute;
    right: 1em;
    transition: 0.2s ease-in-out transform;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
