type RouteAuthenticationRequirement = 'authenticated' | 'unauthenticated' | 'either';

type MiddlewareMeta = {
	authRequirement?: RouteAuthenticationRequirement;
	navigateIfFailed?: string;
};

declare module '#app' {
	interface PageMeta {
		auth?: MiddlewareMeta;
	}
}

declare module 'vue-router' {
	interface RouteMeta {
		auth?: MiddlewareMeta;
	}
}

const defaultRedirect: Record<RouteAuthenticationRequirement, string> = {
	authenticated: '/login',
	unauthenticated: '/',
	either: '/'
};

export default defineNuxtRouteMiddleware(async to => {
	const metaAuth = to.meta.auth;

	const authRequirement = metaAuth?.authRequirement ?? 'either';
	const navigateIfFailed = metaAuth?.navigateIfFailed ?? defaultRedirect[authRequirement];

	// If the route doesn't care if authenticated or not
	if (authRequirement === 'either') return;

	const session = useUserSession();

	if (
		(authRequirement === 'authenticated' && !session.loggedIn.value) ||
		(authRequirement === 'unauthenticated' && session.loggedIn.value)
	) {
		return navigateTo(navigateIfFailed);
	}

	return;
});
