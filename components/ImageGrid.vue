<template>
    <v-container fluid>

        <v-row>
            <v-col v-for="photo in photos" :key="photo.imageid" cols="12" xs="6" md="4" lg="3" xl="3" @click="showImage(photo)">
                <v-lazy :options="{threshold:.5}" transition="fade-transition" min-height="200">
                    <p-image :photo="photo" :srcset="photo.image_files" :camera="photo.camera" />
                </v-lazy>
            </v-col>
        </v-row>
        <v-dialog v-model="showImageDialog" max-width="80%" scrollable>
            <v-card v-if="showImageDialog">
                <v-card-title>                    
                    <span class="caption">{{ selectedImage.camera.instrument }}</span>
                    <v-divider vertical class="mx-3" />
                    <span class="caption">{{ formatDate(selectedImage.date_taken_utc, 'MM/dd/yyyy HH:mma') }}</span>
                    <v-spacer />
                    <v-btn icon close @click="showImageDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="pb-0">
                    <v-img :src="selectedImage.image_files.full_res" max-height="98%" />
                </v-card-text>
                <v-card-actions class="px-5">
                    <span class="caption">
                        {{ selectedImage.caption }}
                    </span>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog :value="loading" hide-overlay>
            <div class="text-center">
                <v-progress-circular v-if="loading" indeterminate size="50" width="5" color="blue"></v-progress-circular>
            </div>
        </v-dialog>
    </v-container>
</template>
<script>
import { sortBy } from 'lodash-es';
const PImage = () => import('~/components/Image');
import { format } from 'date-fns';
export default {
    props: [],
    components: {
        'p-image': PImage
    },
    data() {
        return {
            bottom: false,
            loading: false,
            photos: [],
            page: 1,
            config: {},
            sol: -1,
            max: 1000,
            showImageDialog: false,
            selectedImage: {},
            requesting: false
        }
    },
    computed: {
        //photos() {
        //    return this.$store.state.photos.photos;
        //}
    },
    async mounted() {
        await this.getLatestSol();
        window.addEventListener('scroll', () => {
            this.bottom = this.bottomVisible();
            if (this.bottom) {
                this.page++;
                this.getPhotos();
            }
        });
        this.getPhotos();

    },
    created() {
    },
    methods: {
        async getLatestSol() {
            this.loading = true;
            const endpoint = `https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json&latest=true`;
            const data = await this.$axios.$get(endpoint);
            this.config = data;
            this.loading = false;
        },
        async getPhotos() {
            //if (this.max > this.photos.length && this.max !== 1000) {
            //    this.max = 1000;
            //}
            if (this.requesting || this.config.latest_sol == 0) {
                return;
            }
            this.requesting = true;
            this.loading = true;
            const endpoint = `https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json&sol=${this.config.latest_sol}&page=1`;
            const result = await this.$axios.$get(endpoint);
            this.max = result.num_images;
            
            const photos = [...result.images, ...this.photos];
            this.photos = sortBy(photos, (p) => new Date(p.date_taken_utc));
            //this.photos = orderBy(photos, ['date_taken_utc'], ['desc']);
            this.config.latest_sol--;
            this.loading = false;
            this.requesting = false;
            //this.photos.push(...result.images);
            //return result.images;
        },
        showImage(image) {
            this.selectedImage = image;
            this.showImageDialog = true;
        },
        bottomVisible() {
            const scrollY = window.scrollY;
            const visible = document.documentElement.clientHeight;
            const pageHeight = document.documentElement.scrollHeight;
            const bottomOfPage = visible + scrollY >= pageHeight;
            return bottomOfPage || pageHeight < visible;
        },
        formatDate(date, f) {
            return format(new Date(date), f);
        }
    }
}
</script>