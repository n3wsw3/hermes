<template>
	<div class="text-center w-96 mx-auto">
		<Header1>Privacy Policy</Header1>
		<p class="my-3">
			We collect as much data as possible on our users and
			sell it to the highest bidder.
		</p>

		<p class="my-3">
			If you are looking to buy data, please contact us using the form below.
			We'll get back to you as soon as possible.
		</p>

		<Header2>
			Contact Us
		</Header2>
		<AutoForm class="grid gap-3 text-left" :schema="formSchema" @submit="submitForm" :field-config="fieldConfig">
			<Button>
				Submit
			</Button>
		</AutoForm>

	</div>
</template>

<script lang="ts" setup>
import { z } from 'zod';

const formSchema = z.object({
	email: z.string().email(),
	phone: z.string(),
	company: z.string().describe("Name of Company or Government Agency"),
});

const fieldConfig = {
	email: {
		inputProps: {
			placeholder: 'e.g. mary@nsa.gov'
		}
	},
	company: {
		inputProps: {
			placeholder: 'e.g. NSA'
		}
	},
	phone: {
		inputProps: {
			placeholder: 'e.g. (415) 273-9164'
		}
	}
};

const submitForm = (data: z.infer<typeof formSchema>) => {
	alert("Thank you for your interest in buying data. We will be in touch shortly.");
};

</script>
