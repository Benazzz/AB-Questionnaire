async function getData() {
    const url = "https://opentdb.com/api.php?amount=10";
    try {
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json()
        return json;
    } catch (error) {
        console.error(error.message);
    }
}

async function main() {
    const data = await getData();
    const totalQuestions = 10;

    if(!data || !data.results) {
        console.error("No data received");
    }

    const questionEl = document.querySelector(".question");
    const numberEl = document.querySelector(".number");
    const answersEl = document.querySelector(".answers");

    let currentIndex = 0;
    let score = 0;

    function loadQuestion(index) {
        const questionData = data.results[index];
        questionEl.innerHTML = questionData.question;
        numberEl.innerHTML = `${index + 1}/${totalQuestions}`
        answersEl.innerHTML = "";
        
        const answers = [questionData.correct_answer, ...questionData.incorrect_answers];
        answers.sort(() => Math.random() - 0.5);

        answers.forEach(answer => {
            const div = document.createElement("div");
            div.innerHTML = answer;
            answersEl.appendChild(div);

            div.addEventListener("click", () => {
                if(answer === questionData.correct_answer) {
                    score++;
                }

                currentIndex++;

                if(currentIndex >= totalQuestions) {
                    showFinalScreen();
                }
                else {
                    loadQuestion(currentIndex);
                }
            })
        })
    }

    function showFinalScreen() {
        questionEl.innerHTML = `You got ${score}/${totalQuestions} points!`;
        numberEl.innerHTML = "";
        answersEl.innerHTML = "";
        
        const tryAgainBtn = document.createElement("div");
        tryAgainBtn.innerHTML = "Try Again"
        tryAgainBtn.addEventListener("click", () => {
            currentIndex = 0;
            score = 0;
            main();
        })

        answersEl.appendChild(tryAgainBtn);
    }

    loadQuestion(currentIndex);
}

main()