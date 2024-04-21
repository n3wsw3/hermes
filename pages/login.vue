<script lang="ts" setup>
import { z } from 'zod';
import { login as sendLogin } from '~/utils/auth';

definePageMeta({
	auth: {
		authRequirement: 'unauthenticated'
	}
});

const schema = z.object({
	email: z.string().min(1, 'Email is required').email('Invalid email'),
	password: z.string().min(1, 'Password is required')
});

const state = reactive({
	email: '',
	password: ''
});

const error = ref<string | null>(null);

const login = async () => {
	await sendLogin(state).catch(err => (error.value = err.message));
};
</script>

<template>
	<div class="max-w-96 mx-auto px-4 py-5 sm:p-6 rounded-lg ring-1 ring-gray-800 bg-gray-900 mt-20">
		<h1 class="text-3xl sm:text-4xl font-bold text-white tracking-tight">{{ $t('signIn') }}</h1>
		<UForm :schema="schema" :state="state" class="space-y-4 mt-4" @submit="login">
			<UFormGroup :label="$t('email')" name="email">
				<UInput v-model="state.email" autocomplete="username" />
			</UFormGroup>

			<UFormGroup :label="$t('password')" name="password">
				<UInput v-model="state.password" type="password" autocomplete="current-password" />
			</UFormGroup>

			<UButton type="submit"> {{ $t('signIn') }} </UButton>
		</UForm>
	</div>
</template>
