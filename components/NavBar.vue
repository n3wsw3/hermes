<template>
	<div class="border-b-2 border-primary border-opacity-50 p-4">
		<NavigationMenu class="container flex justify-between max-w-[1400px]">
			<div class="flex gap-3">
				<NuxtLink to="/" class="uppercase font-bold text-[42px] leading-none align-bottom"> Hermes </NuxtLink>
				<NavigationMenuList>
					<NavigationMenuItem v-for="component in navbar" :key="component.key">
						<template v-if="component.children">
							<NavigationMenuTrigger>
								<NavigationMenuLink>
									{{ component.displayName ?? $t(component.key) }}
								</NavigationMenuLink>
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
									<li v-if="component.to" class="col-span-2">
										<NuxtLink
											:to="component.to"
											class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
											v-if="!component.disabled"
										>
											<NavigationMenuLink>
												<div class="text-lg text-center font-medium leading-none">
													{{ component.displayName ?? $t(component.key) }}
												</div>
												<p v-if="component.description" class="line-clamp-2 text-sm leading-snug text-muted-foreground">
													{{ component.description }}
												</p>
											</NavigationMenuLink>
										</NuxtLink>
										<NavigationMenuLink
											v-else
											class="cursor-not-allowed block select-none space-y-1 rounded-md p-3 leading-none"
										>
											<div class="text-lg text-center font-medium leading-none">
												{{ component.displayName ?? $t(component.key) }}
											</div>
											<p v-if="component.description" class="line-clamp-2 text-sm leading-snug text-muted-foreground">
												{{ component.description }}
											</p>
										</NavigationMenuLink>
										<Separator />
									</li>
									<li v-for="child in component.children" :key="child.key">
										<NuxtLink
											:to="child.to"
											class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
											v-if="!child.disabled"
										>
											<NavigationMenuLink as-child>
												<div class="text-sm font-medium leading-none">{{ child.displayName ?? $t(child.key) }}</div>
												<p v-if="child.description" class="line-clamp-2 text-sm leading-snug text-muted-foreground">
													{{ child.description }}
												</p>
											</NavigationMenuLink>
										</NuxtLink>
										<NavigationMenuLink
											v-else
											class="cursor-not-allowed block select-none space-y-1 rounded-md p-3 leading-none"
										>
											<div class="text-sm font-medium leading-none">{{ child.displayName ?? $t(child.key) }}</div>
											<p v-if="child.description" class="line-clamp-2 text-sm leading-snug text-muted-foreground">
												{{ child.description }}
											</p>
										</NavigationMenuLink>
									</li>
								</ul>
							</NavigationMenuContent>
						</template>
						<template v-else>
							<template v-if="component.to">
								<NuxtLink :to="component.to" :exact-active-class="activeClass" v-if="!component.disabled">
									<NavigationMenuLink :class="navigationMenuTriggerStyle()">
										{{ component.displayName ?? $t(component.key) }}
									</NavigationMenuLink>
								</NuxtLink>
								<NavigationMenuLink
									v-else
									class="cursor-not-allowed block select-none space-y-1 rounded-md p-3 leading-none"
								>
									{{ component.displayName ?? $t(component.key) }}
								</NavigationMenuLink>
							</template>
							<template v-else>
								<NavigationMenuLink>
									{{ component.displayName ?? $t(component.key) }}
								</NavigationMenuLink>
							</template>
						</template>
					</NavigationMenuItem>
				</NavigationMenuList>
			</div>
			<NavigationMenuList>
				<NavigationMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger as-child>
							<Button variant="outline" class="w-9 h-9 p-0">
								<Icon
									icon="radix-icons:moon"
									class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
								/>
								<Icon
									icon="radix-icons:sun"
									class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
								/>
								<span class="sr-only">Toggle theme</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem @click="colorMode.preference = 'light'"> Light </DropdownMenuItem>
							<DropdownMenuItem @click="colorMode.preference = 'dark'"> Dark </DropdownMenuItem>
							<DropdownMenuItem @click="colorMode.preference = 'system'"> System </DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger as-child>
							<Button variant="outline" class="w-9 h-9 p-0">
								<Icon :icon="currentFlag" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />

								<span class="sr-only">Select Language</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem v-for="locale in localesWithInfo" :key="locale.code" @click="setLocale(locale.code)">
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
				<template v-else>
					<NavigationMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger as-child>
								<Button variant="secondary" size="icon" class="rounded-full">
									<CircleUser class="h-5 w-5" />
									<span class="sr-only">Toggle user menu</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>My Account</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Settings</DropdownMenuItem>
								<DropdownMenuItem>Support</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem @click="async () => await logout()">{{ $t('logout') }}</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</NavigationMenuItem>
				</template>
			</NavigationMenuList>
		</NavigationMenu>
	</div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { navigationMenuTriggerStyle } from './ui/navigation-menu';
import { CircleUser } from 'lucide-vue-next';

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

const localesWithInfo = computed(() =>
	locales.value.map(loc => ({
		...loc,
		icon: flags[loc.code as keyof typeof flags] ?? flags.unknown
	}))
);

interface NavigationMenuItem {
	key: string;
	displayName?: string;
	description?: string;
	to?: string;
	disabled?: boolean;
	children?: NavigationMenuItem[];
}

const navbar = computed<NavigationMenuItem[]>(() => [
	{
		key: 'home',
		to: '/'
	},
	{
		key: 'allgames',
		to: '/games',
		description: 'This is where the magic happens',
		children: [
			{
				key: 'games.blackjack',
				to: '/games/blackjack',
				description: 'Play blackjack against the dealer'
			},
			{
				key: 'games.roulette',
				to: '/games/roulette',
				description: 'Spin the wheel and win big'
			},
			{
				key: 'games.RockPaperScissors',
				to: '/games/rock-paper-scissors'
			},
			{
				key: 'games.poker',
				to: '/games/poker',
				disabled: true
			}
		]
	},
	{
		key: 'leaderboard',
		to: '/leaderboard'
	}
]);
</script>
