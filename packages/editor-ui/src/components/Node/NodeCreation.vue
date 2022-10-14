<template>
	<div>
		<div v-if="!createNodeActive" :class="[$style.nodeButtonsWrapper, showStickyButton ? $style.noEvents : '']" @mouseenter="onCreateMenuHoverIn">
			<div :class="$style.nodeCreatorButton">
				<n8n-icon-button size="xlarge" icon="plus" @click="openNodeCreator" :title="$locale.baseText('nodeView.addNode')"/>
				<div :class="[$style.addStickyButton, showStickyButton ? $style.visibleButton : '']" @click="addStickyNote">
					<n8n-icon-button size="medium" type="secondary" :icon="['far', 'note-sticky']" :title="$locale.baseText('nodeView.addSticky')"/>
				</div>
			</div>
		</div>
		<node-creator :active="createNodeActive" @nodeTypeSelected="nodeTypeSelected" @closeNodeCreator="closeNodeCreator" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import * as CanvasHelpers from "@/views/canvasHelpers";
import {DEFAULT_STICKY_HEIGHT, DEFAULT_STICKY_WIDTH, STICKY_NODE_TYPE} from "@/constants";

export default Vue.extend({
	name: 'node-creation',
	components: {
		NodeCreator: () => import('@/components/Node/NodeCreator/NodeCreator.vue'),
	},
	props: {
		nodeViewScale: {
			type: Number,
			required: true,
		},
		createNodeActive: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			showStickyButton: false,
		};
	},
	methods: {
		onCreateMenuHoverIn(mouseinEvent: MouseEvent) {
			const buttonsWrapper = mouseinEvent.target as Element;

			// Once the popup menu is hovered, it's pointer events are disabled so it's not interfering with element underneath it.
			this.showStickyButton = true;
			const moveCallback = (mousemoveEvent: MouseEvent) => {
				if (buttonsWrapper) {
					const wrapperBounds = buttonsWrapper.getBoundingClientRect();
					const wrapperH = wrapperBounds.height;
					const wrapperW = wrapperBounds.width;
					const wrapperLeftNear = wrapperBounds.left;
					const wrapperLeftFar = wrapperLeftNear + wrapperW;
					const wrapperTopNear = wrapperBounds.top;
					const wrapperTopFar = wrapperTopNear + wrapperH;
					const inside = ((mousemoveEvent.pageX > wrapperLeftNear && mousemoveEvent.pageX < wrapperLeftFar) && (mousemoveEvent.pageY > wrapperTopNear && mousemoveEvent.pageY < wrapperTopFar));
					if (!inside) {
						this.showStickyButton = false;
						document.removeEventListener('mousemove', moveCallback, false);
					}
				}
			};
			document.addEventListener('mousemove', moveCallback, false);
		},
		openNodeCreator() {
			this.$emit('toggleNodeCreator', { source: 'add_node_button', createNodeActive: true });
		},
		addStickyNote() {
			if (document.activeElement) {
				(document.activeElement as HTMLElement).blur();
			}

			const offset: [number, number] = [...(this.$store.getters.getNodeViewOffsetPosition as [number, number])];

			const position = CanvasHelpers.getMidCanvasPosition(this.nodeViewScale, offset);
			position[0] -= DEFAULT_STICKY_WIDTH / 2;
			position[1] -= DEFAULT_STICKY_HEIGHT / 2;

			this.$emit('addNode', {
				nodeTypeName: STICKY_NODE_TYPE,
				position,
			});
		},
		closeNodeCreator() {
			this.$emit('toggleNodeCreator', { createNodeActive: false });
		},
		nodeTypeSelected(nodeTypeName: string) {
			this.$emit('addNode', { nodeTypeName });
			this.closeNodeCreator();
		},
	},
});
</script>

<style lang="scss" module>
.nodeButtonsWrapper {
	position: fixed;
	width: 150px;
	height: 200px;
	top: 0;
	right: 0;
	display: flex;
}

.addStickyButton {
	margin-top: var(--spacing-2xs);
	opacity: 0;
	transition: .1s;
	transition-timing-function: linear;
}

.visibleButton {
	opacity: 1;
	pointer-events: all;
}

.noEvents {
	pointer-events: none;
}

.nodeCreatorButton {
	position: fixed;
	text-align: center;
	top: 80px;
	right: 20px;
	pointer-events: all !important;

	button {
		position: relative;
	}
}
</style>