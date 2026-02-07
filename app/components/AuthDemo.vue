<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-shield-check" class="text-primary size-5" />
          <h2 class="font-semibold text-lg">Authentication</h2>
        </div>
        <UBadge v-if="user" color="success" variant="subtle" size="sm">Signed In</UBadge>
        <UBadge v-else color="neutral" variant="subtle" size="sm">Guest</UBadge>
      </div>
    </template>

    <!-- Signed-in state -->
    <div v-if="user" class="space-y-4">
      <div class="flex items-center gap-3">
        <UAvatar :text="user.email?.charAt(0).toUpperCase()" size="lg" />
        <div>
          <p class="font-medium text-sm">{{ user.email }}</p>
          <p class="text-xs text-muted">Provider: {{ user.provider || 'email' }}</p>
        </div>
      </div>
      <UButton block color="neutral" variant="soft" icon="i-lucide-log-out" :loading="loading" @click="logout">
        Sign Out
      </UButton>
    </div>

    <!-- Auth form -->
    <div v-else class="space-y-4">
      <div class="flex gap-1">
        <UButton
          :variant="mode === 'login' ? 'solid' : 'ghost'"
          color="neutral"
          size="sm"
          class="flex-1"
          @click="mode = 'login'"
        >
          Sign In
        </UButton>
        <UButton
          :variant="mode === 'signup' ? 'solid' : 'ghost'"
          color="neutral"
          size="sm"
          class="flex-1"
          @click="mode = 'signup'"
        >
          Sign Up
        </UButton>
      </div>

      <form class="space-y-3" @submit.prevent="submit">
        <UFormField label="Email">
          <UInput
            v-model="email"
            type="email"
            placeholder="you@example.com"
            icon="i-lucide-mail"
            required
          />
        </UFormField>
        <UFormField label="Password">
          <UInput
            v-model="password"
            type="password"
            placeholder="••••••••"
            icon="i-lucide-lock"
            required
          />
        </UFormField>

        <UButton type="submit" block :loading="loading" icon="i-lucide-arrow-right">
          {{ mode === 'login' ? 'Sign In' : 'Create Account' }}
        </UButton>
      </form>

      <UDivider label="or" />

      <UButton
        block
        color="neutral"
        variant="soft"
        icon="i-lucide-apple"
        disabled
      >
        Sign in with Apple
      </UButton>
      <p class="text-xs text-center text-muted">
        Apple Sign-In requires keys configured in <code>.env</code>
      </p>
    </div>

    <!-- Error/success toast -->
    <div v-if="message" class="mt-3">
      <UAlert
        :color="messageType === 'error' ? 'error' : 'success'"
        :title="message"
        :icon="messageType === 'error' ? 'i-lucide-alert-circle' : 'i-lucide-check-circle'"
        variant="subtle"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface AuthUser {
  id: string
  email: string
  provider?: string
}

const mode = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')
const loading = ref(false)
const user = ref<AuthUser | null>(null)
const message = ref('')
const messageType = ref<'error' | 'success'>('success')

function showMessage(msg: string, type: 'error' | 'success' = 'success') {
  message.value = msg
  messageType.value = type
  setTimeout(() => { message.value = '' }, 4000)
}

// Check session on mount
onMounted(async () => {
  try {
    const data = await $fetch<AuthUser>('/api/auth/me')
    user.value = data
  }
  catch {
    // Not logged in
  }
})

async function submit() {
  loading.value = true
  message.value = ''
  const endpoint = mode.value === 'login' ? '/api/auth/login' : '/api/auth/signup'
  try {
    const data = await $fetch<AuthUser>(endpoint, {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    user.value = data
    showMessage(mode.value === 'login' ? 'Signed in!' : 'Account created!')
    email.value = ''
    password.value = ''
  }
  catch (err: any) {
    showMessage(err?.data?.message || err?.message || 'Something went wrong', 'error')
  }
  finally {
    loading.value = false
  }
}

async function logout() {
  loading.value = true
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    showMessage('Signed out')
  }
  catch (err: any) {
    showMessage(err?.data?.message || 'Logout failed', 'error')
  }
  finally {
    loading.value = false
  }
}
</script>
