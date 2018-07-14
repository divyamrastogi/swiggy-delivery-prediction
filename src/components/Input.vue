<template>
  <div class="input-container" :class="{ 'has-icon': icon }">
    <input :placeholder="placeholder" @input="update" type="text" v-model="proxy" />
    <div class="icon" v-if="icon">
      <img :src="icon" />
    </div>
    <ul v-if="suggestions.length" class="list">
      <li
        v-for="(item, index) in suggestions"
        :key="index"
        @click="select(item)"
      >
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'input',
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
    select(item) {
      this.proxy = item.text;
      this.$emit('selected', item);
    },
  },
};
</script>
<style lang="scss" scoped>
@mixin box() {
  font-size: 1em;
  padding: 12px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  box-sizing: border-box;
  background: white;
}
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
.list {
  @include box();
  position: absolute;
  top: 3.5em;
  list-style: none;
  margin: 0;
  padding: 0;
  left: 0;
  right: 0;
  li {
    padding: 12px;
    cursor: pointer;
    &:hover {
      background: #f9f9f9;
    }
  }
}
.has-icon input {
  padding-left: 2.25em;
}
input {
  @include box();
  border: none;
  &:focus {
    outline: none;
  }
}
</style>
