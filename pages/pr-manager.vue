<template>
	<div>
		<h1>PR Manager</h1>
		<h2>Your PR</h2>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	auth: {
		authRequirement: 'authenticated'
	}
});
</script>
