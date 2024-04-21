<script setup lang="ts">
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const props = defineProps({
	modelValue: Date
});

const emit = defineEmits(['update:model-value', 'close']);

const date = computed({
	get: () => props.modelValue,
	set: value => {
		emit('update:model-value', value);
		emit('close');
	}
});
</script>

<template>
	<Datepicker v-model="date" />
</template>

<style>
:root,
.dp__theme_light,
.dp__theme_dark {
	--dp-background-color: rgb(var(--color-gray-900));
	--dp-text-color: #fff;
	--dp-hover-color: rgb(var(--color-primary-400));
	--dp-hover-text-color: #fff;
	--dp-hover-icon-color: #fff;
	--dp-primary-color: rgb(var(--color-primary-400));
	--dp-primary-disabled-color: rgb(var(--color-primary-800));
	--dp-primary-text-color: rgb(var(--color-gray-900));
	--dp-secondary-color: rgb(var(--color-gray-500));
	--dp-border-color: rgb(var(--color-gray-700));
	--dp-menu-border-color: #2d2d2d;
	--dp-border-color-hover: rgb(var(--color-gray-700));
	--dp-disabled-color: rgb(var(--color-gray-800));
	--dp-disabled-color-text: rgb(var(--color-gray-600));
	--dp-scroll-bar-background: rgb(var(--color-gray-800));
	--dp-scroll-bar-color: rgb(var(--color-gray-500));
	--dp-success-color: fuchsia;
	--dp-success-color-disabled: fuchsia;
	--dp-icon-color: rgb(var(--color-primary-400));
	--dp-danger-color: fuchsia;
	--dp-marker-color: fuchsia;
	--dp-tooltip-color: fuchsia;
	--dp-highlight-color: rgb(var(--color-primary-400));
	--dp-range-between-dates-background-color: var(--dp-hover-color, #484848);
	--dp-range-between-dates-text-color: var(--dp-hover-text-color, #fff);
	--dp-range-between-border-color: var(--dp-hover-color, #fff);
}

.dp__disabled,
.dp__disabled:hover,
.dp__disabled:focus,
.dp__disabled:active,
.dp__disabled:disabled {
	border-color: rgb(var(--color-gray-800));
	cursor: not-allowed;
}
</style>
