<script lang="ts" setup>
definePageMeta({
	auth: {
		authRequirement: 'unauthenticated'
	}
});

const email = ref('');
const password = ref('');

const error = ref('');

const login = async () => {
	const res = await fetch('http://localhost:3000/api/user/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email.value,
			password: password.value
		})
	})
		.catch(_ => ({
			success: false
		}))
		.then(_ => ({
			success: true
		}));

	if (res.success) await navigateTo('/test');
	else error.value = 'Invalid email or password';
};
</script>

<template>
	<div>
		<h1>LOGIN</h1>
		<form name="login-form">
			<div class="mb-3">
				<p class="text-danger">{{ error }}</p>
			</div>
			<div class="mb-3">
				<label for="email">email: </label>
				<input id="email" v-model="email" type="text" />
			</div>
			<div class="mb-3">
				<label for="password">Password: </label>
				<input id="password" v-model="password" type="password" />
			</div>
			<button class="btn btn-outline-dark" type="submit" @click.prevent="login()">Login</button>
		</form>
	</div>
</template>
