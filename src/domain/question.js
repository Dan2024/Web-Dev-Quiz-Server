import dbClient from '../utils/dbClient.js';

export default async function getQuestions(category, numOfQuestions) {
	const questionsByCat = await dbClient.question.findMany({
		where: {
			categories: {
				some: {
					text: {
						contains: category,
					},
				},
			},
		},
		include: { answer: true, options: true },
	});

	const shuffledQuestions = questionsByCat.sort(() => 0.5 - Math.random());
	const questions = shuffledQuestions.slice(0, numOfQuestions);
	const formattedQuestions = questions.map((question) => {
		return {
			id: question.id,
			text: question.text,
			answer: question.answer.text,
			options: shuffle([...question.options, question.answer]),
		};
	});

	return formattedQuestions;
}

function shuffle(array) {
	let currentIndex = array.length,
		randomIndex;

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}
