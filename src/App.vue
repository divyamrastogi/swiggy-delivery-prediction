<template>
  <div id="app">
    <FlockBanner v-if="bannerMsg.length">
      {{ bannerMsg }}
    </FlockBanner>
    <div class="control">
      <Input
        :icon="Search"
        v-model="search"
        :suggestions="suggestions"
        placeholder="Search"
        @input="getSuggestions"
        @selected="chooseSuggestion"
      />
    </div>
    <l-map :zoom="zoom" :center="center" :options="options">
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker :lat-lng="location"></l-marker>
      <l-rectangle
        :key="index"
        v-for="(option, index) in rectangles"
        :bounds="option.bounds"
        :color="option.color"
        :fillColor="option.color"
        :fillOpacity="0.3"
        :weight="1"
      ></l-rectangle>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LRectangle } from 'vue2-leaflet';
import Components from '@flockos/vue-components';
import debounce from 'lodash.debounce';
import Geohash from 'latlon-geohash';
import MapboxClient from 'mapbox';
import Search from './assets/search.svg';
import Input from './components/Input.vue';
import dummyData from './utils/data';

const { L } = window;
const client = new MapboxClient(process.env.VUE_APP_MAPBOX_KEY);
const colors = ['#D0021B', '#D02C02', '#D05D02', '#E49D14', '#E6BB01', '#EFE401', '#B3E202', '#69E202', '#00ECA4'];

export default {
  name: 'app',
  components: {
    LMap,
    LMarker,
    LRectangle,
    LTileLayer,
    Input,
    ...Components,
  },
  data() {
    return {
      bannerMsg: '',
      map: null,
      search: '',
      Search,
      suggestions: [],
      options: {
        zoomControl: false,
        attributionControl: false,
      },
      rectangles: [],
      zoom: 13,
      url: `https://api.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=${process.env.VUE_APP_MAPBOX_KEY}`,
      center: L.latLng(0, 0),
      location: L.latLng(0, 0),
    };
  },
  mounted() {
    const options = {
      timeout: 100000,
    };
    navigator.geolocation.getCurrentPosition(
      this.createMap,
      this.createMapFailed,
      options,
    );
    navigator.geolocation.watchPosition(
      debounce(this.updateLocation, 1000),
      this.updateLocationFailed,
      options,
    );
    this.$http.get('')
      .then(this.populateHeatMap)
      .catch(this.populateOldHeatMap);
  },
  methods: {
    chooseSuggestion(place) {
      this.suggestions = [];
      if (place.center) {
        const [longitude, latitude] = place.center;
        this.center = L.latLng(latitude, longitude);
        this.zoom = 16;
      }
      // We just need to center the map on this particular location.
    },
    getSuggestions(query) {
      client.geocodeForward(query, (err, data) => {
        if (data) {
          this.showSuggestions(data.features);
        } else {
          this.suggestions = [];
        }
      });
    },
    showSuggestions(results) {
      this.suggestions = results;
    },
    getBounds(geohash) {
      // Killer jugaad, replace first five digits with Bangalore's digits
      const newGeohash = geohash.replace(/^[0-9a-zA-Z]{5}/, 'tdr1t');
      const { sw, ne } = Geohash.bounds(newGeohash);
      return [[sw.lat, sw.lon], [ne.lat, ne.lon]];
    },
    getColor(weight) {
      return colors[parseInt(10 * weight, 10)];
    },
    populateHeatMap(data) {
      this.rectangles = data.map(({ geohash, weight }) => {
        const bounds = this.getBounds(geohash);
        const color = this.getColor(weight);
        return {
          bounds,
          color,
        };
      });
    },
    populateOldHeatMap() {
      console.log('Could not populate heat map!');
      this.populateHeatMap(dummyData);
    },
    getLatLng({ latitude, longitude }) {
      return L.latLng(latitude, longitude);
    },
    createMapFailed(e) {
      this.bannerMsg = `Error creating map. ${e.message}`;
    },
    updateLocation({ coords: { latitude, longitude } }) {
      this.location = L.latLng(latitude, longitude);
    },
    updateLocationFailed() {
      // Do nothing for now.
    },
    createMap({ coords: { latitude, longitude } }) {
      this.center = L.latLng(latitude, longitude);
    },
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
}
.control {
  position: fixed;
  z-index: 401;
  top: 1em;
  left: 1em;
  right: 1em;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}
</style>
