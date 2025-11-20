<template>
  <div>
    <h1>Hello App!</h1>
    <nav>
      <RouterLink to="/">Go to Home</RouterLink>
      <RouterLink to="/counter">Go to About</RouterLink>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>
