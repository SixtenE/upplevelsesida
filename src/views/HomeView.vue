<script lang="ts" setup>
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import CardTitle from '@/components/ui/card/CardTitle.vue'

const handleSubmit = () => {
  // Handle form submission logic here
}
</script>

<template>
  <main class="container mx-auto max-w-xl flex min-h-screen flex-col justify-center">
    <Card>
      <CardHeader>
        <CardTitle>Sök bland upplevelser</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit">
          <div class="flex gap-4">
            <Input id="checkout-7j9-card-number-uw1" placeholder="1234 5678 9012 3456" required />
            <Separator orientation="vertical" />
            <Input id="checkout-7j9-card-number-uw1" placeholder="1234 5678 9012 3456" required />
          </div>
        </form>
      </CardContent>
    </Card>
  </main>
</template>
