<template>
  <div id="app">
    <FlockBanner v-if="bannerMsg.length">
      {{ bannerMsg }}
    </FlockBanner>
    <div class="control">
      <Input
        :icon="Search"
        v-model="search"
        style="width: 60%"
        :suggestions="suggestions"
        placeholder="Search"
        @input="getSuggestions"
        @selected="chooseSuggestion"
      />
      <Select
        style="width: 36%; margin-left: 4%"
        @selected="populateHeatMap"
        :options="timeSlots"
        v-model="chosenTime"
      />
    </div>
    <l-map ref="map" :zoom="zoom" :center="center" :options="options">
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker :icon="executiveIcon" :lat-lng="location"></l-marker>
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
    <div class="current-location" @click="bringToCenter">
      <img :src="Locate" alt="">
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LRectangle } from 'vue2-leaflet';
import Components from '@flockos/vue-components';
import Geohash from 'latlon-geohash';
import MapboxClient from 'mapbox';
import Search from './assets/search.svg';
import Locate from './assets/locate.svg';
import ExecutiveIcon from './assets/rider.svg';
import Input from './components/Input.vue';
import Select from './components/Select.vue';


const { L } = window;
const amOrPm = (slot) => {
  const newSlot = slot % 12;
  if (newSlot === 0) {
    return 'AM';
  }
  return slot < 12 ? 'AM' : 'PM';
};
const getHour = (slot) => {
  if (slot <= 12) {
    if (slot === 0) {
      return 12;
    }
    return slot;
  }
  return (slot % 12) || 12;
};
const client = new MapboxClient(process.env.VUE_APP_MAPBOX_KEY);
const colors = ['#D0021B', '#D02C02', '#D05D02', '#E49D14', '#E6BB01', '#EFE401', '#B3E202', '#69E202', '#00ECA4', '#02CEE2'].reverse();
// eslint-disable-next-line
const timeSlots = Array.apply(null, { length: 24 })
  .map(Number.call, Number)
  .map(slot => ({
    text: `${getHour(slot)} ${amOrPm(slot)} - ${getHour(slot + 1)} ${amOrPm(slot + 1)}`,
  }));
const date = new Date();

export default {
  name: 'app',
  components: {
    LMap,
    LMarker,
    LRectangle,
    LTileLayer,
    ...Components,
    Input,
    Select,
  },
  data() {
    return {
      Search,
      Locate,
      bannerMsg: '',
      chosenTime: timeSlots[(date.getHours() + 1) % 24],
      map: null,
      search: '',
      data: null,
      timeSlots,
      executiveIcon: L.icon({
        iconUrl: ExecutiveIcon,
      }),
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
      this.updateLocation,
      this.updateLocationFailed,
      options,
    );
    this.$http.get('hot-zone.json')
      .then(({ data }) => {
        this.data = data;
        this.populateHeatMap(this.chosenTime);
      });
  },
  methods: {
    bringToCenter() {
      this.$refs.map.mapObject
        .panTo(this.location)
        .setZoom(16);
      // this.center = L.latLng(this.location);
    },
    chooseSuggestion(place) {
      this.suggestions = [];
      if (place.center) {
        const [longitude, latitude] = place.center;
        this.center = L.latLng(latitude, longitude);
        this.$refs.map.mapObject.setZoom(16);
      }
      // We just need to center the map on this particular location.
    },
    getSuggestions(query) {
      if (query) {
        client.geocodeForward(query, {
          proximity: {
            latitude: this.location.lat,
            longitude: this.location.lng,
          },
        }, (err, data) => {
          if (data) {
            this.showSuggestions(data.features);
          } else {
            this.suggestions = [];
          }
        });
      } else {
        this.suggestions = [];
      }
    },
    showSuggestions(results) {
      this.suggestions = results;
    },
    getBounds(geohash) {
      // Killer jugaad, replace first five digits with Bangalore's digits
      const newGeohash = geohash.replace(/^[0-9a-zA-Z]{4}/, 'tdr1');
      const { sw, ne } = Geohash.bounds(newGeohash);
      return [[sw.lat, sw.lon], [ne.lat, ne.lon]];
    },
    getColor(weight) {
      return colors[parseInt(10 * weight, 10)];
    },
    populateHeatMap(chosenTime) {
      if (this.data) {
        this.rectangles = this.data[timeSlots.findIndex(slot => slot.text === chosenTime.text)]
          .map(({ geohash, weight }) => {
            const bounds = this.getBounds(geohash);
            const color = this.getColor(weight);
            return {
              bounds,
              color,
            };
          });
      }
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
.current-location {
  position: fixed;
  cursor: pointer;
  display: flex;
  justify-content: center;
  width: 2em;
  height: 2em;
  z-index: 401;
  bottom: 1em;
  right: 1em;
  @include box();
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}
</style>
