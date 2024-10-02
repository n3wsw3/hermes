<script lang="ts" setup>
import type { z } from 'zod';
import { loginSchema } from '~/server/types';
import { login as sendLogin } from '~/utils/auth';

definePageMeta({
	auth: {
		authRequirement: 'unauthenticated'
	}
});

const error = ref<string | null>(null);
const isLoading = ref(false);

const formSchema = loginSchema;
const fieldConfig = {
	password: {
		inputProps: {
			type: 'password',
			placeholder: '••••••••'
		}
	},
	email: {
		inputProps: {
			placeholder: 'email@example.com'
		}
	}
};

const login = async (data: z.infer<typeof formSchema>) => {
	isLoading.value = true;
	await sendLogin(data).catch(err => (error.value = err.message));
	isLoading.value = false;
};
</script>

<template>
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Sign In</h1>
				<p class="text-sm text-muted-foreground">Enter your email and password below to sign in.</p>
			</div>

			<AutoForm :schema="formSchema" @submit="login" class="grid gap-3" :field-config="fieldConfig">
				<p class="text-sm font-medium text-destructive text-center">
					{{ error }}
				</p>

				<Button :disabled="isLoading"> Sign In with Email </Button>
			</AutoForm>
		</div>
	</div>
</template>
