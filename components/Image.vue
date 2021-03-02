<template functional>
    <v-card v-if="props.srcset != null">
        <v-img :src="props.srcset.medium" />
        <v-card-title class="py-5 px-3">
            <v-row class="mx-0">
                <span class="caption">{{ props.photo.camera.instrument }}</span>
                <v-spacer />
                <span class="caption">{{ $options.format(new Date(props.photo.date_taken_utc), 'MM/dd/yyyy h:mma') }}</span>
            </v-row>
        </v-card-title>
    </v-card>
</template>
<script>
import { format } from 'date-fns';
export default {
    props: ['srcset', 'photo'],
    format
}
</script>
