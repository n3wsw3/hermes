<template>
	<div class="border-b-2 border-primary border-opacity-50 p-4">
		<NavigationMenu class="w-full max-w-full flex justify-between container">
			<div class="flex gap-3">
				<NuxtLink to="/" class="uppercase font-bold text-[42px] leading-none align-bottom">
					Hermes
				</NuxtLink>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NuxtLink to="/" :exact-active-class="activeClass">
							<NavigationMenuLink :class="navigationMenuTriggerStyle()">
								{{ $t('home') }}
							</NavigationMenuLink>
						</NuxtLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NuxtLink to="/games" :exact-active-class="activeClass">
							<NavigationMenuLink :class="navigationMenuTriggerStyle()">
								{{ $t('games') }}
							</NavigationMenuLink>
						</NuxtLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NuxtLink to="/leaderboard" :exact-active-class="activeClass">
							<NavigationMenuLink :class="navigationMenuTriggerStyle()">
								{{ $t('leaderboard') }}
							</NavigationMenuLink>
						</NuxtLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</div>
			<NavigationMenuList>
				<NavigationMenuItem>

					<DropdownMenu>
						<DropdownMenuTrigger as-child>
							<Button variant="outline" class="w-9 h-9 p-0">
								<Icon icon="radix-icons:moon"
									class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
								<Icon icon="radix-icons:sun"
									class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
								<span class="sr-only">Toggle theme</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem @click="colorMode.preference = 'light'">
								Light
							</DropdownMenuItem>
							<DropdownMenuItem @click="colorMode.preference = 'dark'">
								Dark
							</DropdownMenuItem>
							<DropdownMenuItem @click="colorMode.preference = 'system'">
								System
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</NavigationMenuItem>
				<NavigationMenuItem>

					<DropdownMenu>
						<DropdownMenuTrigger as-child>
							<Button variant="outline" class="w-9 h-9 p-0">
								<Icon :icon="currentFlag"
									class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />

								<span class="sr-only">Select Language</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem v-for="locale in localesWithInfo" :key="locale.code"
								@click="setLocale(locale.code)">
								<Icon :icon="locale.icon" class="mr-2" />
								{{ locale.name }}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</NavigationMenuItem>
				<template v-if="!loggedIn">
					<NavigationMenuItem>
						<NuxtLink to="/login" :exact-active-class="activeClass">
							<NavigationMenuLink :class="navigationMenuTriggerStyle()">
								{{ $t('signIn') }}
							</NavigationMenuLink>
						</NuxtLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NuxtLink to="/register" :exact-active-class="activeClass">
							<NavigationMenuLink :class="navigationMenuTriggerStyle()">
								{{ $t('register') }}
							</NavigationMenuLink>
						</NuxtLink>
					</NavigationMenuItem>
				</template>
				<NavigationMenuItem v-else>
					<Button class="h-9" @click="async () => await logout()">
						{{ $t('logout') }}
					</Button>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	</div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { navigationMenuTriggerStyle } from './ui/navigation-menu';

const colorMode = useColorMode();

const { loggedIn } = useUserSession();

const activeClass = 'border-b-primary border-b-2 inline-block';
const { locale, setLocale, locales } = useI18n();

const flags = {
	en: 'emojione-v1:flag-for-united-states',
	sv: 'emojione-v1:flag-for-sweden',
	unknown: 'fluent-mdl2:unknown'
};

const currentFlag = computed(() => flags[locale.value as keyof typeof flags] ?? flags.unknown);
const currentFullName = computed(() => locales.value.find(loc => loc.code === locale.value)?.name ?? 'Unknown');

const localesWithInfo = computed(() => locales.value.map(loc => ({
	...loc,
	icon: flags[loc.code as keyof typeof flags] ?? flags.unknown
})));

</script>
