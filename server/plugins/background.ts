import {consola} from 'consola';
import tasks from '~/server/background';

type BackgroundTask = {
	id: string;
	task: () => void;
	interval: number;
};

const background_tasks: Array<NodeJS.Timeout> = [];

export default defineNitroPlugin(async (nuxtApp) => {

	const addBackgroundTask = (task: BackgroundTask) => {
		// consola.info(`Adding background task: ${task.id}`);
		const task_id = setInterval(task.task, task.interval);
		background_tasks.push(task_id);
	};

	// Get all ts files from the server/background directory
	tasks.forEach(task => addBackgroundTask(task));

	consola.success('Background tasks started');

	nuxtApp.hooks.hook('close', async () => {
		background_tasks.forEach(task => clearTimeout(task));
		consola.success('Background tasks cleared');
	});
});
