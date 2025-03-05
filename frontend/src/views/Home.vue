<template>
  <div class="home">
    <header>
      <h2>Welcome to Tissea {{ username }}</h2>
      <button class="logout-button" @click="handleLogout">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right"
          viewBox="0 0 16 16">
          <path fill-rule="evenodd"
            d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
          <path fill-rule="evenodd"
            d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
        </svg>
        <span>Logout</span>
      </button>
    </header>

    <div>
      <div class="select-container">
        <!-- Category Select -->
        <div class="select-wrapper">
          <label for="category">Select a category</label>
          <select v-model="selectedCategory" @change="fetchLines">
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="select-wrapper">
          <!-- Line Select -->
          <label for="line">Select a line</label>
          <select v-model="selectedLine" @change="fetchStops" :disabled="!selectedCategory">
            <option v-for="line in lines" :key="line.id" :value="line.id">
              {{ line.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Responsive OpenStreetMap -->
      <div class="map-container">
        <l-map :center="mapCenter" :zoom="mapZoom" class="map">
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
import markerIcon from '@/assets/marker-icon.png' // Import custom marker icon

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
    const mapZoom = ref(12)
    const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

    // GeoJSON data for displaying stops
    const geojson = ref({
      type: "FeatureCollection",
      features: [],
    })

    // Custom marker icon
    const customIcon = L.icon({
      iconUrl: markerIcon,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    })

    const geojsonOptions = {
      pointToLayer: (feature, latLng) => {
        return L.marker(latLng, { icon: customIcon }).bindPopup(feature.properties.name)
      },
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
              },
            })),
          }

          // update map center to the first stop
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

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h2 {
  margin-block: .5rem 1rem;
}

.logout-button {
  padding: 5px 10px;
  display: flex;
  gap: 5px;
  cursor: pointer;
}

.select-container {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

select {
  display: block;
  margin: 5px 0;
  padding: 5px;
  width: 150px;
}

.map-container {
  width: 100%;
  height: 500px;
}

.map {
  width: 100%;
  height: 100%;
}

@media (max-width: 1024px) {
  .map-container {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .select-container {
    flex-direction: column;
    gap: 1rem;
  }

  .map-container {
    height: 350px;
  }
}

@media (max-width: 480px) {
  .map-container {
    height: 300px;
  }

  select {
    width: 100%;
  }
}
</style>