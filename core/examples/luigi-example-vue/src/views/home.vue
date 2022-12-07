<template>
  <div>
    <h1>Home</h1>
    <div>
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data: () => ({
    message: '',
  }),
  components: {},
  methods: {},
  created() {
    this.luigiClient.addInitListener((initialContext) => {
      this.message = 'Luigi Client initialized.';
    });
    this.luigiClient.addContextUpdateListener((updatedContext) => {
      this.message = 'Luigi Client updated.';
    });
  },
};
</script>

<style scoped lang="scss">
</style>
