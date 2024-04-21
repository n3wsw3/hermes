<template>
	<nav class="relative w-full flex items-center justify-between mb-8">
		<ul class="flex items-center min-w-0">
			<li class="min-w-0">
				<NuxtLink to="/" :class="defaultClass" :exact-active-class="activeClass" class="text-gray-400 hover:text-white">
					<span class="trucate relative"> {{ $t('home') }} </span>
				</NuxtLink>
			</li>
			<template v-if="!!loggedIn">
				<li class="min-w-0">
					<NuxtLink
						to="/pr-manager"
						:class="defaultClass"
						:exact-active-class="activeClass"
						class="text-gray-400 hover:text-white"
					>
						<span class="trucate relative"> {{ $t('prManager') }} </span>
					</NuxtLink>
				</li>
				<li class="min-w-0">
					<NuxtLink
						to="/new-pr"
						:class="defaultClass"
						:exact-active-class="activeClass"
						class="text-gray-400 hover:text-white"
					>
						<span class="trucate relative"> {{ $t('newPR') }}</span>
					</NuxtLink>
				</li>
			</template>
		</ul>
		<ul class="flex items-center min-w-0">
			<li class="min-w-0 mx-2">
				<USelectMenu v-model="locale" :options="availableLocales" />
			</li>
			<li class="min-w-0">
				<template v-if="!!loggedIn">
					<button
						@click="async () => await logout()"
						:class="defaultClass"
						class="before:bg-primary-400 hover:before:bg-primary-500 text-gray-900"
					>
						<span class="trucate relative"> Logout </span>
					</button>
				</template>
				<template v-else>
					<NuxtLink
						to="/login"
						:class="defaultClass"
						class="before:bg-primary-400 hover:before:bg-primary-500 text-gray-900 hover:text-gray-900"
						exact-active-class="after:bg-primary-500"
					>
						<span class="trucate relative"> {{ $t('signIn') }} </span>
					</NuxtLink>
				</template>
			</li>
		</ul>
	</nav>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession();

const defaultClass =
	'relative w-full flex items-center gap-1.5 px-2.5 py-3.5 rounded-md font-medium text-sm focus:outline-none focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-400 disabled:cursor-not-allowed disabled:opacity-75 before:absolute before:inset-x-0 before:inset-y-2 before:inset-px before:rounded-md hover:before:bg-gray-800/50 after:absolute after:bottom-0 after:inset-x-2.5 after:block after:h-[2px] after:mt-2';
const activeClass = 'after:bg-primary-500 text-white';
const { locale, setLocale, availableLocales } = useI18n();
</script>
