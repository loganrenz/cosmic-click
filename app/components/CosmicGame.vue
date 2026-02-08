<script setup lang="ts">
interface CosmicObject {
  id: number
  type: 'star' | 'planet' | 'comet' | 'asteroid' | 'blackhole'
  emoji: string
  points: number
  x: number
  y: number
  size: number
  lifespan: number
  born: number
  exiting: boolean
}

interface ScorePopup {
  id: number
  x: number
  y: number
  points: number
  color: string
}

const OBJECT_TYPES = [
  { type: 'star' as const, emoji: '⭐', points: 10, size: 36, lifespan: 2500, weight: 40 },
  { type: 'planet' as const, emoji: '🪐', points: 25, size: 44, lifespan: 2000, weight: 25 },
  { type: 'comet' as const, emoji: '☄️', points: 50, size: 40, lifespan: 1200, weight: 20 },
  { type: 'asteroid' as const, emoji: '🌑', points: 15, size: 32, lifespan: 3000, weight: 10 },
  { type: 'blackhole' as const, emoji: '🕳️', points: -30, size: 48, lifespan: 1800, weight: 5 },
]

const GAME_DURATION = 30 // seconds
const MAX_OBJECTS = 6

const score = ref(0)
const highScore = ref(0)
const timeLeft = ref(GAME_DURATION)
const isPlaying = ref(false)
const objects = ref<CosmicObject[]>([])
const scorePopups = ref<ScorePopup[]>([])
const objectsClicked = ref(0)
const objectsMissed = ref(0)
const gameField = ref<HTMLElement | null>(null)
const combo = ref(0)
const maxCombo = ref(0)

let nextId = 0
let gameTimer: ReturnType<typeof setInterval> | null = null
let spawnTimer: ReturnType<typeof setInterval> | null = null
let cleanupTimer: ReturnType<typeof setInterval> | null = null

// Load high score from localStorage
onMounted(() => {
  const saved = localStorage.getItem('cosmic-click-high-score')
  if (saved) highScore.value = parseInt(saved, 10)
})

function pickObjectType() {
  const totalWeight = OBJECT_TYPES.reduce((s, o) => s + o.weight, 0)
  let r = Math.random() * totalWeight
  for (const t of OBJECT_TYPES) {
    r -= t.weight
    if (r <= 0) return t
  }
  return OBJECT_TYPES[0]
}

function spawnObject() {
  if (objects.value.length >= MAX_OBJECTS) return
  const t = pickObjectType()
  const field = gameField.value
  if (!field) return

  const padding = 60
  const x = padding + Math.random() * (field.clientWidth - padding * 2)
  const y = padding + Math.random() * (field.clientHeight - padding * 2)

  const obj: CosmicObject = {
    id: nextId++,
    type: t.type,
    emoji: t.emoji,
    points: t.points,
    x,
    y,
    size: t.size,
    lifespan: t.lifespan,
    born: Date.now(),
    exiting: false,
  }
  objects.value.push(obj)
}

function clickObject(obj: CosmicObject) {
  if (obj.exiting || !isPlaying.value) return

  const points = obj.type === 'blackhole' ? obj.points : obj.points * (1 + Math.floor(combo.value / 5))
  score.value = Math.max(0, score.value + points)
  objectsClicked.value++

  if (obj.type !== 'blackhole') {
    combo.value++
    if (combo.value > maxCombo.value) maxCombo.value = combo.value
  } else {
    combo.value = 0
  }

  // Show score popup
  const color = obj.type === 'blackhole' ? '#ef4444' : '#a78bfa'
  scorePopups.value.push({
    id: nextId++,
    x: obj.x,
    y: obj.y - 10,
    points,
    color,
  })
  setTimeout(() => {
    scorePopups.value = scorePopups.value.filter(p => p.id !== scorePopups.value[0]?.id)
  }, 800)

  // Remove object with exit animation
  obj.exiting = true
  setTimeout(() => {
    objects.value = objects.value.filter(o => o.id !== obj.id)
  }, 250)
}

function cleanupExpired() {
  const now = Date.now()
  for (const obj of objects.value) {
    if (!obj.exiting && now - obj.born > obj.lifespan) {
      obj.exiting = true
      objectsMissed.value++
      combo.value = 0
      setTimeout(() => {
        objects.value = objects.value.filter(o => o.id !== obj.id)
      }, 250)
    }
  }
}

function startGame() {
  score.value = 0
  timeLeft.value = GAME_DURATION
  objects.value = []
  scorePopups.value = []
  objectsClicked.value = 0
  objectsMissed.value = 0
  combo.value = 0
  maxCombo.value = 0
  isPlaying.value = true

  gameTimer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      endGame()
    }
  }, 1000)

  spawnTimer = setInterval(spawnObject, 600)
  cleanupTimer = setInterval(cleanupExpired, 100)
}

function endGame() {
  isPlaying.value = false
  if (gameTimer) clearInterval(gameTimer)
  if (spawnTimer) clearInterval(spawnTimer)
  if (cleanupTimer) clearInterval(cleanupTimer)
  gameTimer = null
  spawnTimer = null
  cleanupTimer = null

  if (score.value > highScore.value) {
    highScore.value = score.value
    localStorage.setItem('cosmic-click-high-score', String(score.value))
  }
}

onUnmounted(() => {
  if (gameTimer) clearInterval(gameTimer)
  if (spawnTimer) clearInterval(spawnTimer)
  if (cleanupTimer) clearInterval(cleanupTimer)
})

const gameOver = computed(() => !isPlaying.value && objectsClicked.value > 0)
const timerColor = computed(() => {
  if (timeLeft.value <= 5) return 'text-red-400'
  if (timeLeft.value <= 10) return 'text-yellow-400'
  return 'text-green-400'
})

// Generate static background stars
const backgroundStars = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 3,
  size: 1 + Math.random() * 2,
}))
</script>

<template>
  <div class="w-full max-w-3xl mx-auto">
    <!-- HUD -->
    <div class="flex items-center justify-between mb-4 px-2">
      <div class="flex items-center gap-4">
        <div class="text-center">
          <div class="text-xs uppercase tracking-wider text-gray-400">Score</div>
          <div class="text-2xl font-bold font-display text-violet-400">{{ score }}</div>
        </div>
        <div v-if="combo > 2 && isPlaying" class="text-center">
          <div class="text-xs uppercase tracking-wider text-amber-400">Combo</div>
          <div class="text-lg font-bold text-amber-300">x{{ combo }}</div>
        </div>
      </div>

      <div class="text-center">
        <div class="text-xs uppercase tracking-wider text-gray-400">Time</div>
        <div class="text-2xl font-bold font-display" :class="timerColor">{{ timeLeft }}s</div>
      </div>

      <div class="text-center">
        <div class="text-xs uppercase tracking-wider text-gray-400">Best</div>
        <div class="text-2xl font-bold font-display text-yellow-400">{{ highScore }}</div>
      </div>
    </div>

    <!-- Game field -->
    <div
      ref="gameField"
      class="cosmic-field w-full"
      :class="{ 'ring-2 ring-violet-500/50': isPlaying }"
      style="height: 420px;"
    >
      <!-- Starfield background -->
      <div class="starfield">
        <div
          v-for="s in backgroundStars"
          :key="s.id"
          class="star"
          :style="{
            left: s.x + '%',
            top: s.y + '%',
            width: s.size + 'px',
            height: s.size + 'px',
            animationDelay: s.delay + 's',
          }"
        />
      </div>

      <!-- Cosmic objects -->
      <div
        v-for="obj in objects"
        :key="obj.id"
        class="cosmic-object"
        :class="obj.exiting ? 'cosmic-exit' : 'cosmic-enter'"
        :style="{
          left: obj.x + 'px',
          top: obj.y + 'px',
          fontSize: obj.size + 'px',
        }"
        @click.stop="clickObject(obj)"
      >
        {{ obj.emoji }}
      </div>

      <!-- Score popups -->
      <div
        v-for="popup in scorePopups"
        :key="popup.id"
        class="score-popup"
        :style="{
          left: popup.x + 'px',
          top: popup.y + 'px',
          color: popup.color,
        }"
      >
        {{ popup.points > 0 ? '+' : '' }}{{ popup.points }}
      </div>

      <!-- Start / Game Over overlay -->
      <div
        v-if="!isPlaying"
        class="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl z-10"
      >
        <template v-if="gameOver">
          <h2 class="text-3xl font-bold font-display text-white mb-2">Time's Up!</h2>
          <p class="text-5xl font-bold font-display text-violet-400 mb-1">{{ score }}</p>
          <p class="text-sm text-gray-300 mb-1">
            {{ objectsClicked }} clicked · {{ objectsMissed }} missed
          </p>
          <p v-if="maxCombo > 2" class="text-sm text-amber-300 mb-4">
            Max combo: x{{ maxCombo }}
          </p>
          <p v-if="score >= highScore && score > 0" class="text-yellow-400 font-bold mb-4">
            New High Score!
          </p>
          <UButton size="xl" color="primary" @click="startGame">
            Play Again
          </UButton>
        </template>
        <template v-else>
          <h2 class="text-3xl font-bold font-display text-white mb-3">Cosmic Click</h2>
          <p class="text-gray-300 mb-6 text-center max-w-xs">
            Click cosmic objects before they vanish!<br>
            Avoid black holes. Build combos for bonus points.
          </p>
          <UButton size="xl" color="primary" @click="startGame">
            Start Game
          </UButton>
        </template>
      </div>
    </div>

    <!-- Legend -->
    <div class="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
      <span>⭐ +10</span>
      <span>🪐 +25</span>
      <span>☄️ +50</span>
      <span>🌑 +15</span>
      <span>🕳️ −30</span>
    </div>
  </div>
</template>
