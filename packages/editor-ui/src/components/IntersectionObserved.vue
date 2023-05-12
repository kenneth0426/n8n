<template>
	<span ref="observed">
		<slot></slot>
	</span>
</template>

<script lang="ts">
import emitter from '@/mixins/emitter';

import { defineComponent } from 'vue';

export default defineComponent({
	mixins: [emitter],

	name: 'IntersectionObserved',
	props: ['enabled'],
	mounted() {
		if (!this.enabled) {
			return;
		}

		this.$nextTick(() => {
			this.$dispatch('IntersectionObserver', 'observe', this.$refs.observed);
		});
	},
	beforeDestroy() {
		if (this.enabled) {
			this.$dispatch('IntersectionObserver', 'unobserve', this.$refs.observed);
		}
	},
});
</script>
