export const logout = async (redirect?: string) => {
	await fetch('http://localhost:3000/api/user/logout', {
		method: 'POST'
	});
	useUserSession().fetch();
	await navigateTo(redirect ?? '/');
};

export const login = async (state: { email: string; password: string }, redirect?: string): Promise<void> => {
	const res = await fetch('http://localhost:3000/api/user/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(state)
	})
		.catch(_ => ({
			success: false
		}))
		.then(_ => ({
			success: true
		}));

	if (res.success) {
		useUserSession().fetch();
		await navigateTo('/');
	} else {
		throw new Error('Invalid email or password');
	}
};
