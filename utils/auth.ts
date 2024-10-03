import type { z } from 'zod';
import type { registerSchema } from '~/server/types';

export const logout = async (redirect?: string) => {
	await fetch('/api/user/logout', {
		method: 'POST'
	});
	useUserSession().fetch();
	await navigateTo(redirect ?? '/');
};

export const login = async (state: { email: string; password: string }, redirect?: string): Promise<void> => {
	const res = await fetch('/api/user/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(state)
	})
		.then(res => (res.status === 200 ? { success: true } : { success: false }))
		.catch(_ => ({
			success: false
		}));
	if (res.success) {
		useUserSession().fetch();
		await navigateTo('/');
	} else {
		throw new Error('Invalid email or password');
	}
};

export const register = async (state: z.infer<typeof registerSchema>): Promise<void> => {
	const res = await fetch('api/user/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(state)
	})
		.then(res => (res.status === 201 ? { success: true } : { success: false }))
		.catch(_ => ({
			success: false
		}));
	if (res.success) {
		useUserSession().fetch();
		await navigateTo('/');
	} else {
		throw new Error('Something went wrong (the email is probably already in use)');
	}
};

export const verifyEmail = async (token: string): Promise<{success: true, error: null } | {success: false, error: string}> => {
	try {
		const res = await fetch('api/user/verifyEmail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ token })
		});

		const data = await res.json<{message: string}>();

		if (res.status === 200) {
			return { success: true, error: null };
		} else {
			return { success: false, error: data.message };
		}
	} catch (e) {
		return { success: false, error: 'Something went wrong' };
	}
};
