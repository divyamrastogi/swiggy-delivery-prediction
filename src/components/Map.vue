<template>
  <div class="map">
  </div>
</template>

<script>
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hpcmdqbiIsImEiOiJjampsNjVmYTYyNGhnM3JteG82ejJyNzNhIn0.e2zSwRb06-oK5pE4vjVK1A';

export default {
  mounted() {
    console.log(this.$el);
    mapboxgl.Map({
      container: this.$el,
      style: 'mapbox://styles/mapbox/streets-v10',
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
