<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-map" class="text-primary size-5" />
          <h2 class="font-semibold text-lg">MapKit JS</h2>
        </div>
        <UBadge :color="mapReady ? 'success' : 'warning'" variant="subtle" size="sm">
          {{ mapReady ? 'Active' : 'Loading…' }}
        </UBadge>
      </div>
    </template>

    <!-- Map container -->
    <div ref="mapContainer" class="w-full h-72 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
      <div v-if="!mapReady" class="absolute inset-0 flex items-center justify-center">
        <UIcon name="i-lucide-loader" class="size-6 animate-spin text-muted" />
      </div>
    </div>

    <template #footer>
      <div class="flex flex-wrap items-center gap-2">
        <UButton
          v-for="loc in locations"
          :key="loc.name"
          size="xs"
          :variant="activeLoc === loc.name ? 'solid' : 'soft'"
          color="neutral"
          @click="flyTo(loc)"
        >
          {{ loc.name }}
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
interface Location {
  name: string
  lat: number
  lng: number
  zoom: number
}

const locations: Location[] = [
  { name: 'Austin', lat: 30.2672, lng: -97.7431, zoom: 0.1 },
  { name: 'San Francisco', lat: 37.7749, lng: -122.4194, zoom: 0.08 },
  { name: 'New York', lat: 40.7128, lng: -74.006, zoom: 0.1 },
  { name: 'London', lat: 51.5074, lng: -0.1278, zoom: 0.15 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, zoom: 0.12 }
]

const config = useRuntimeConfig()
const mapContainer = ref<HTMLElement | null>(null)
const mapReady = ref(false)
const activeLoc = ref('Austin')
let map: mapkit.Map | null = null

function flyTo(loc: Location) {
  if (!map) return
  activeLoc.value = loc.name
  map.region = new mapkit.CoordinateRegion(
    new mapkit.Coordinate(loc.lat, loc.lng),
    new mapkit.CoordinateSpan(loc.zoom, loc.zoom)
  )
}

function initMap() {
  if (!mapContainer.value || !window.mapkit) return

  const token = config.public.mapkitToken as string
  if (!token) {
    console.warn('[MapKitDemo] No mapkitToken configured')
    return
  }

  mapkit.init({
    authorizationCallback: (done) => done(token)
  })

  const austin = locations[0]
  if (!austin) return

  map = new mapkit.Map(mapContainer.value, {
    showsCompass: mapkit.FeatureVisibility.Hidden,
    showsZoomControl: true,
    showsMapTypeControl: false,
    isRotationEnabled: false,
    region: new mapkit.CoordinateRegion(
      new mapkit.Coordinate(austin.lat, austin.lng),
      new mapkit.CoordinateSpan(austin.zoom, austin.zoom)
    )
  })

  mapReady.value = true
}

onMounted(() => {
  // MapKit script may still be loading
  if (typeof window.mapkit?.init === 'function') {
    initMap()
  }
  else {
    // Poll until available (loaded async)
    const interval = setInterval(() => {
      if (typeof window.mapkit?.init === 'function') {
        clearInterval(interval)
        initMap()
      }
    }, 200)
    // Give up after 10s
    setTimeout(() => clearInterval(interval), 10000)
  }
})

onUnmounted(() => {
  map?.destroy()
  map = null
})
</script>
