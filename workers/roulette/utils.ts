import { encodeHex } from "hex";

export const sleep = (ms: number): Promise<null> =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const makeid = (length: number) => {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
};

export const hashText = async (input: string) => {
	const hash = await crypto.subtle.digest(
		"SHA-256",
		new TextEncoder().encode(input),
	);
	return encodeHex(hash);
};
