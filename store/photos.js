// Store to retrieve data from API
export const state = () => ({
    date: '',
    photos: []
});

export const actions = {
    async getPhotos({commit, state}, page) {
        const endpoint = `https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json&sol=80&page=${page}`;
        const result = await this.$axios.$get(endpoint);
        commit('setPhotos', result.images);
        return result.images;
    }
}

export const mutations = {
    setPhotos(state, photos) {
        state.photos = state.photos.concat(...photos);
    }
}