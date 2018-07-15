<template>
  <div class="input-container" :class="{ 'has-icon': icon }">
    <input :placeholder="placeholder" @input="update" type="text" v-model="proxy" />
    <div class="icon" v-if="icon">
      <img :src="icon" />
    </div>
    <SuggestionList
      @selected="onSelect"
      :suggestions="suggestions"
    />
  </div>
</template>
<script>
import SuggestionList from './SuggestionList.vue';

export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  components: {
    SuggestionList,
  },
  props: {
    value: String,
    icon: String,
    placeholder: String,
    suggestions: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      proxy: this.value,
    };
  },
  methods: {
    update(event) {
      this.$emit('input', event.target.value);
    },
    onSelect(item) {
      this.proxy = item.text;
      this.$emit('selected', item);
    },
  },
};
</script>
<style lang="scss" scoped>
.input-container {
  position: relative;
  display: inline-block;
  .icon {
    width: 1em;
    height: 1em;
    left: 1.25em;
    top: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
  }
}
.has-icon input {
  padding-left: 2.25em;
}
input {
  width: 100%;
  @include box();
  border: none;
  &:focus {
    outline: none;
  }
}
</style>
