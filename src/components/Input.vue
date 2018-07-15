<template>
  <div class="input-container" :class="{ 'has-icon': icon }">
    <input :placeholder="placeholder" @input="update" type="text" v-model="proxy" />
    <div class="icon" v-if="icon">
      <img :src="icon" />
    </div>
    <SuggestionList
      v-if="proxy"
      @selected="onSelect"
      :suggestions="suggestions"
    />
    <img @click="clearContent" :src="Clear" class="clear" v-if="proxy.length" />
  </div>
</template>
<script>
import Clear from '@/assets/clear.svg';
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
      Clear,
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
    clearContent() {
      this.proxy = '';
      this.$emit('input', this.proxy);
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
  .clear {
    top: 50%;
    right: 1em;
    width: 1em;
    height: 1em;
    cursor: pointer;
    position: absolute;
    transform: translateY(-50%);
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
