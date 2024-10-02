<script lang="ts" setup>
import type { z } from 'zod';
import { registerSchema } from '~/server/types';

definePageMeta({
	auth: {
		authRequirement: 'unauthenticated'
	}
});

const error = ref<string | null>(null);
const isLoading = ref(false);

const formSchema = registerSchema;
const fieldConfig = {
	password: {
		inputProps: {
			type: 'password',
			placeholder: '••••••••'
		}
	},
	confirmPassword: {
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
	await register(data).catch(err => (error.value = err.message));
	isLoading.value = false;
};

</script>

<template>
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">
					Register
				</h1>
				<p class="text-sm text-muted-foreground">
					Enter your email and password below to register. You need to use a chalmers email (ends with
					@chalmers.se) to register.
				</p>
			</div>

			<AutoForm :schema="formSchema" @submit="login" class="grid gap-3" :field-config="fieldConfig">
				<p class="text-sm font-medium text-destructive text-center">
					{{ error }}
				</p>

				<Button :disabled="isLoading">
					Register
				</Button>
			</AutoForm>

			<p class="px-8 text-center text-sm text-muted-foreground">
				By clicking register, you agree to our
				<a href="/terms" class="underline underline-offset-4 hover:text-primary">
					Terms of Service
				</a>
				and
				<a href="/privacy" class="underline underline-offset-4 hover:text-primary">
					Privacy Policy
				</a>
				.
			</p>
		</div>
	</div>

</template>
