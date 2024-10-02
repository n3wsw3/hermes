<template>
	<div>
		<Header1>{{ $t('new_pr.title') }}</Header1>
		<p class="text-gray-500">{{ $t('new_pr.description') }}</p>
		<!-- <UForm :state="state" class="flex gap-3 flex-col">
			<Header2>{{ $t('new_pr.information') }}</Header2>
			<UFormGroup :label="$t('new_pr.event_name')" class="flex-1">
				<UInput :placeholder="$t('new_pr.event_name_placeholder')" v-model="eventName" />
			</UFormGroup>
			<UFormGroup :label="$t('new_pr.location')" class="flex-1">
				<UInput :placeholder="$t('new_pr.location_placeholder')" v-model="location" />
			</UFormGroup>
			<UFormGroup :label="$t('new_pr.poster')" class="flex-1">
				<UInput type="file" accept="image/*" v-model="poster" @change="getFileObject" />
			</UFormGroup>
			<UFormGroup :label="$t('new_pr.event_description')" class="flex-1">
				<UTextarea :placeholder="$t('new_pr.event_description_placeholder')" v-model="description" />
			</UFormGroup>
			<UFormGroup :label="$t('new_pr.start_end_datetime')" class="flex-1">
				<DateTimeRangePicker :placeholder="$t('new_pr.start_end_datetime_event')" v-model="whenIsEvent" />
			</UFormGroup>
			<div class="flex gap-3">
				<UFormGroup name="toggle" :label="$t('new_pr.needs_registration')">
					<UToggle v-model="needsRegistration" />
				</UFormGroup>
				<UFormGroup name="toggle" :label="$t('new_pr.has_price')">
					<UToggle v-model="hasPrice" />
				</UFormGroup>
			</div>

			<Header2>{{ $t('new_pr.registration') }}</Header2>
			<UFormGroup :label="$t('new_pr.start_end_datetime')" class="flex-1">
				<DateTimeRangePicker
					:placeholder="$t('new_pr.start_end_datetime_registration')"
					:disabled="!needsRegistration"
					v-model="registrationStartEndDatetime"
				/>
			</UFormGroup>
			<UFormGroup :label="$t('new_pr.registration_information')" class="flex-1">
				<UTextarea
					:placeholder="$t('new_pr.registration_information_placeholder')"
					:disabled="!needsRegistration"
					v-model="registrationInformation"
				/>
			</UFormGroup>

			<Header2>{{ $t('new_pr.price') }}</Header2>
			<UFormGroup :label="$t('new_pr.price')" class="flex-1">
				<UInput :placeholder="$t('new_pr.price_placeholder')" :disabled="!hasPrice" v-model="price" />
			</UFormGroup>
			<UFormGroup :label="$t('new_pr.price_information')" class="flex-1">
				<UTextarea
					:placeholder="$t('new_pr.price_information_placeholder')"
					:disabled="!hasPrice"
					v-model="priceInformation"
				/>
			</UFormGroup>

			<Header2>External Providers</Header2>
			<p class="text-gray-500">These external providers will be used to publish information about your event.</p>
			<div v-for="provider in externalProviders" class="flex gap-3 items-center">
				<UToggle :on-icon="provider.icon" v-model="provider.value" />
				<span>
					{{ provider.name }}
				</span>
			</div>

			<UButton class="ml-auto flex justify-center w-fit">{{ $t('new_pr.submit') }}</UButton>
		</UForm> -->
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	auth: {
		authRequirement: 'authenticated'
	}
});

/**
 * Name
 * Location
 * Description
 * Start Datetime
 * End Datetime
 *
 * Price
 * Mandatory Registration
 * Registration Deadline
 * Registration Link
 *
 * External Providers
 */

type ExternalProvider = {
	name: string;
	icon: string;
	link: string;
	value: boolean;
};

type Registration = {
	startEndDatetime: [Date, Date];
	registrationInformation: string;
};

type Price = {
	price: number;
	priceInformation: string;
};

type Info = {
	name: string;
	location: string;
	poster: File;
	description: string;
	startEndDatetime: [Date, Date];
	needsRegistration: boolean;
	hasPrice: boolean;
};

type MaybePrice = { hasPrice: true; price: Price } | { hasPrice: false };
type MaybeRegistraion = { needsRegistration: true; registration: Registration } | { needsRegistration: false };

type PartialMaybePrice = { hasPrice: true; price: Partial<Price> } | { hasPrice: false };
type PartialMaybeRegistraion =
	| { needsRegistration: true; registration: Partial<Registration> }
	| { needsRegistration: false };

type NewPR = Info & MaybePrice & MaybeRegistraion;
type PartialNewPR = Partial<Info> & PartialMaybePrice & PartialMaybeRegistraion;

const externalProviders = ref<Array<ExternalProvider>>([
	{
		name: 'Student Division Discord Server',
		icon: 'i-logos-discord-icon',
		link: '921740760368439367',
		value: true
	},
	{
		name: 'Student Division Facebook Group',
		icon: 'i-logos-facebook',
		link: 'https://www.facebook.com/groups/2448360328510288',
		value: true
	}
]);

const getFileObject = async (event: FileList) => {
	const file = event[0];
	if (file) {
		posterFile.value = file;
	}
};

const eventName = ref<string>('');
const location = ref<string>('');
const poster = ref<string>('');
const posterFile = ref<File | null>(null);
const description = ref<string>('');
const whenIsEvent = ref<Array<Date>>([]);

const needsRegistration = ref<boolean>(true);
const hasPrice = ref<boolean>(true);

const registrationStartEndDatetime = ref<Array<Date>>([]);
const registrationInformation = ref<string>('');

const price = ref<number | null>(null);
const priceInformation = ref<string>('');

const state = computed<PartialNewPR>(() => {
	let res: PartialNewPR = {
		name: eventName.value,
		location: location.value,
		description: description.value,
		startEndDatetime: whenIsEvent.value as [Date, Date],
		needsRegistration: false,
		hasPrice: false
	};

	if (whenIsEvent.value.length === 2) {
		res.startEndDatetime = whenIsEvent.value as [Date, Date];
	}
	if (posterFile.value) {
		res.poster = posterFile.value;
	}

	if (needsRegistration.value) {
		// @ts-ignore
		res.needsRegistration = true;
		// @ts-ignore
		res.registration = {
			startEndDatetime: registrationStartEndDatetime.value as [Date, Date],
			registrationInformation: registrationInformation.value
		};
	}

	if (hasPrice.value) {
		// @ts-ignore
		res.hasPrice = true;
		// @ts-ignore
		res.price = {
			price: price.value,
			priceInformation: priceInformation.value
		};
	}

	return res;
});
</script>
