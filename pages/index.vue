<script lang="ts" setup>
definePageMeta({
	auth: {
		authRequirement: 'authenticated'
	}
});

const logout = async () => {
	await fetch('http://localhost:3000/api/user/logout', {
		method: 'POST'
	});
	await navigateTo('/login');
};

</script>

<template>
	<div>
		<h1>TEST</h1>
		<button class="btn btn-outline-dark" @click="logout()">Logout</button>
		<NuxtWelcome />
	</div>
</template>
