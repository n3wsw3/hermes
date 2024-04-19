export const sendVerifyEmail = async (email: string, token: string) => {
	const body = JSON.stringify({
		Messages: [
			{
				From: {
					Email: 'noreply@n3wsw3.com',
					Name: 'PR-Piloten'
				},
				To: [
					{
						Email: email
					}
				],
				Subject: 'Verify your email',
				TextPart: `Your code is: ${token}`
			}
		]
	});

	const response = await fetch('https://api.mailjet.com/v3.1/send', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${btoa(process.env.NUXT_MAILJET_API_KEY + ':' + process.env.NUXT_MAILJET_SECRET_KEY)}`
		},
		body
	});
};
