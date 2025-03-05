<template>
  <div class="home">
    <h2>Hello, {{ username }}</h2>
    <h3>Welcome to Tissea</h3>
    <!-- Logout Button -->
    <button @click="handleLogout">Logout</button>

    <div>
      <!-- Category Select -->
      <label for="category">Select Category:</label>
      <select v-model="selectedCategory" @change="fetchLines">
        <option value="" disabled>Select a category</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>

      <!-- Line Select -->
      <label for="line">Select Line:</label>
      <select v-model="selectedLine" @change="fetchStops" :disabled="!selectedCategory">
        <option value="" disabled>Select a line</option>
        <option v-for="line in lines" :key="line.id" :value="line.id">
          {{ line.name }}
        </option>
      </select>

      <!-- OpenStreetMap -->
      <div style="height:600px; width:800px;">
        <l-map :center="mapCenter" :zoom="mapZoom" style="height: 100%; width: 100%;">
          <l-tile-layer :url="tileLayerUrl" :attribution="tileLayerAttribution" />
          <l-geo-json :geojson="geojson" :options="geojsonOptions" />
        </l-map>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCategories, getLinesByCategory, getStopsByLine } from '@/services/mapService'
import { logout } from '@/services/authService'
import "leaflet/dist/leaflet.css"
import { LMap, LGeoJson, LTileLayer } from "@vue-leaflet/vue-leaflet"
import L from 'leaflet'

export default {
  components: {
    LMap,
    LGeoJson,
    LTileLayer,
  },

  setup() {
    const router = useRouter()
    const username = ref(localStorage.getItem('username') || 'Guest')

    // Data for categories, lines, and stops
    const categories = ref([])
    const lines = ref([])
    const stops = ref([])

    // Selected category and line
    const selectedCategory = ref(null)
    const selectedLine = ref(null)

    // Map properties
    const mapCenter = ref([43.6045, 1.4442])  // Default center (Toulouse)
    const mapZoom = ref(13)
    const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const tileLayerAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

    // GeoJSON data for displaying stops
    const geojson = ref({
      type: "FeatureCollection",
      features: [],
    })

    const geojsonOptions = {
      pointToLayer: (feature, latLng) => {
        return L.circleMarker(latLng, { radius: 8, color: 'blue' });
      },
      style: (feature) => ({
        color: feature.properties.type === "Route" ? "green" : "blue",
        weight: 3,
      }),
    }

    // Fetch categories on mount
    onMounted(async () => {
      categories.value = await getCategories()
    })

    // Fetch lines when category changes
    const fetchLines = async () => {
      if (selectedCategory.value) {
        lines.value = await getLinesByCategory(selectedCategory.value)
        selectedLine.value = null // Reset selected line
        stops.value = [] // Clear stops
        geojson.value.features = [] // Clear map points
      }
    }

    // Fetch stops when line changes
    const fetchStops = async () => {
      if (selectedCategory.value && selectedLine.value) {
        stops.value = await getStopsByLine(selectedCategory.value, selectedLine.value)

        if (stops.value.length > 0) {
          console.log(stops.value)

          // Update geojson dynamically with stops
          geojson.value = {
            type: "FeatureCollection",
            features: stops.value.map((stop) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [stop.longitude, stop.latitude],
              },
              properties: {
                name: stop.name,
                type: "Stop",
              },
            })),
          }

          // Optionally update map center to the first stop
          mapCenter.value = [stops.value[0].latitude, stops.value[0].longitude]
        }
      }
    }

    // Logout function
    const handleLogout = () => {
      logout()
      router.push('/login')
    }

    return {
      username,
      categories,
      lines,
      stops,
      selectedCategory,
      selectedLine,
      fetchLines,
      fetchStops,
      handleLogout,
      mapCenter,
      mapZoom,
      tileLayerUrl,
      tileLayerAttribution,
      geojson,
      geojsonOptions,
    }
  }
}
</script>

<style scoped>
.home {
  padding: 2rem;
}

select {
  display: block;
  margin: 10px 0;
  padding: 5px;
}
</style>
