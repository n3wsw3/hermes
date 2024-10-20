export default defineI18nConfig(() => ({
	legacy: false,
	locale: 'en',
	messages: {
		en: {
			home: 'Home',
			leaderboard: 'Leaderboard',
			allgames: 'All Games',
			games: {
				blackjack: 'Blackjack',
				roulette: 'Roulette',
				RockPaperScissors: 'Rock Paper Scissors',
				poker: 'Poker'
			},
			prManager: 'PR Manager',
			newPR: 'New PR',
			signIn: 'Sign In',
			logout: 'Logout',
			register: 'Register',
			email: 'Email',
			password: 'Password',
			new_pr: {
				title: 'New PR',
				description:
					'Here you can create a PR for your event. By using this tool, we will automatically publish your event to the most commonly used platforms within the student division. They will of course also be available on this website.',
				information: 'Information',
				event_name: 'Event Name',
				event_name_placeholder: 'Ex: The Bestestest AS Ever Imagined!',
				location: 'Location',
				location_placeholder: 'Ex: Basen, Råttan',
				poster: 'Poster',
				event_description: 'Description',
				event_description_placeholder: 'Tell people a little more about your event. Markdown is supported!',
				start_end_datetime: 'Start and End Datetime',
				start_end_datetime_event: 'When will the event take place? Maybe even multiple days!',
				needs_registration: 'Needs Registration',
				has_price: 'Has Price',
				registration: 'Registration',
				start_end_datetime_registration: 'Specify when the registration is open',
				registration_information: 'Registration Information',
				registration_information_placeholder: 'Where and how will the registration take place? Markdown is supported!',
				price: 'Price',
				price_placeholder: 'Ex: 100 SEK, Non-Alc/Alc 100 SEK/150 SEK',
				price_information: 'Price Information',
				price_information_placeholder: 'Where and how will you take payment? Markdown is supported!',
				submit: 'Create PR'
			}
		},
		sv: {
			home: 'Hem',
			leaderboard: 'Leaderboard',
			allgames: 'Alla Spel',
			games: {
				blackjack: 'Blackjack',
				roulette: 'Roulette',
				RockPaperScissors: 'Sten Sax Påse',
				poker: 'Poker'
			},
			prManager: 'PR Hanterare',
			newPR: 'Nytt PR',
			signIn: 'Logga in',
			logout: 'Logga ut',
			register: 'Registrera',
			email: 'E-post',
			password: 'Lösenord',
			new_pr: {
				title: 'Nytt PR',
				description:
					'Här kan du skapa ett PR för ditt event. Genom att använda detta verktyg kommer vi automatiskt att publisera ditt event till de populäraste platformarna datasektionen använder. PR:et kommer självklart också vara tillgängligt på denna hemsida.',
				information: 'Information',
				event_name: 'Eventnamn',
				event_name_placeholder: 'Ex: The Bestestest AS Ever Imagined!',
				location: 'Plats',
				location_placeholder: 'Ex: Basen, Råttan',
				poster: 'Poster',
				event_description: 'Beskrivning',
				event_description_placeholder: 'Berätta mer om ditt event. Även med Markdown!',
				start_end_datetime: 'Start och Slut Datum och Tid',
				start_end_datetime_event: 'När är eventet?',
				needs_registration: 'Behöver anmälan',
				has_price: 'Kostar pengar',
				registration: 'Anmälan',
				start_end_datetime_registration: 'Specificera när anmälan är öppen',
				registration_information: 'Information om anmälan',
				registration_information_placeholder: 'När och hur anmäler man sig? Även med Markdown!',
				price: 'Pris',
				price_placeholder: 'Ex: 100 SEK, Non-Alk/Alk 100 SEK/150 SEK',
				price_information: 'Information om pris',
				price_information_placeholder: 'Var och hur kommer betalning att ske? Även med Markdown!',
				submit: 'Skapa PR'
			}
		}
	}
}));
