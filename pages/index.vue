<template>
  <v-layout
    column
    justify-center
    align-center
  >
      <ImageGrid />
  </v-layout>
</template>

<script>
const ImageGrid = () => import('~/components/ImageGrid');
export default {
  components: {
    ImageGrid
  },
  mounted() {
    console.log(this);
    //this.$store.dispatch('photos/getPhotos');
  }
}
</script>
