<template>
  <div id="app">
    <FlockBanner v-if="bannerMsg.length">
      {{ bannerMsg }}
    </FlockBanner>
    <l-map :zoom="zoom" :center="center">
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker :lat-lng="center"></l-marker>
    </l-map>
  </div>
</template>

<script>
import Components from '@flockos/vue-components';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';

const { L } = window;
const accessToken = 'pk.eyJ1IjoiZGl2eWFtc3VwZXJiIiwiYSI6ImNpeXY1MGdtNDAwMHYzMnFoeG9sbW5vN2gifQ.NjxieTUN_mNsyRv7NjUWCw';
export default {
  name: 'app',
  components: {
    LMap,
    LMarker,
    LTileLayer,
    ...Components,
  },
  data() {
    return {
      bannerMsg: '',
      map: null,
      zoom: 13,
      url: `https://api.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=${accessToken}`,
      center: L.latLng(0, 0),
    };
  },
  created() {
    navigator.geolocation.getCurrentPosition(
      this.createMap,
      this.createMapFailed,
      {
        enableHighAccuracy: true,
      },
    );
  },
  methods: {
    createMapFailed(e) {
      this.bannerMsg = `Error creating map. ${e.message}`;
    },
    createMap({ coords: { latitude, longitude } }) {
      this.center = L.latLng(latitude, longitude);
      /* this.map = new mapboxgl.Map({
        container: 'mapid',
        style: 'mapbox://styles/mapbox/streets-v10',
      }); */
    },
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}
</style>
