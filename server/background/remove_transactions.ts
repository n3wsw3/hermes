import { consola } from "consola";
import { transactions } from "../database/schema";
import { and, isNull } from "drizzle-orm";

export default {
	id: 'remove_transactions',
	task: () => {
		consola.info('Removing transactions where both to and from is null');

		// Remove transactions where both to and from is null
		const db = useDb();
		db.transaction(async (tx) => {
			tx.delete(transactions).where(and(isNull(transactions.to), isNull(transactions.from)));
		});
	},
	interval: 1000 * 60 * 60 * 24
}
