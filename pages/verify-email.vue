<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';
import { useToast } from '~/components/ui/toast';
import { verifyEmail as sendVerifyEmail } from '~/utils/auth';

definePageMeta({
	auth: {
		authRequirement: 'authenticated'
	}
});

// get "token" and "userId" from the query params
const {
	query: { token: tokens }
} = useRoute();

const stringOrFirst = (value: string | null | (string | null)[]) => {
	if (typeof value === 'string' || !value) {
		return value;
	} else {
		return value[0];
	}
};

const { toast } = useToast();

const token = ref(stringOrFirst(tokens) ?? '');
const isLoading = ref(false);

const resendIsLoading = ref(false);

const resendVerificationEmail = async () => {
	try {
		resendIsLoading.value = true;
		// await sendEmailVerification();
		await new Promise(resolve => setTimeout(resolve, 2000));
		throw new Error('Not implemented');
	} catch (err) {
		toast({
			title: 'Error',
			description: String(err),
			variant: 'destructive'
		});
	} finally {
		resendIsLoading.value = false;
	}
};

const verifyEmail = async () => {
	if (!token.value) {
		return;
	}
	isLoading.value = true;

	const {success, error} = await sendVerifyEmail(token.value);

	if (success) {
		toast({
			title: 'Success',
			description: 'Email verified successfully',
			variant: 'default'
		});
	} else {
		toast({
			title: 'Error',
			description: error,
			variant: 'destructive'
		});
	}

	isLoading.value = false;
};

onMounted(async () => {
	verifyEmail();
});
</script>

<template>
	<div class="p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Verify Email</h1>
				<p class="text-sm text-muted-foreground">
					We have sent an email to your email address. Please enter the code below to
					verify your email address.
				</p>
			</div>

			<div class="flex gap-2">
				<Input v-model="token" placeholder="Enter verification code" class="flex-1" :disabled="isLoading || resendIsLoading" />
				<Button @click="verifyEmail" :disabled="isLoading || resendIsLoading">
					<Loader2 v-if="isLoading" class="w-5 h-5 mr-2 animate-spin" />
					Verify Email
				</Button>
			</div>

			<div class="flex flex-col space-y-2">
				<Button variant="outline" @click="resendVerificationEmail" class="w-full" :disabled="isLoading || resendIsLoading">
					<Loader2 v-if="resendIsLoading" class="w-5 h-5 mr-2 animate-spin" />
					Resend Verification Email
				</Button>
			</div>
		</div>
	</div>
</template>
