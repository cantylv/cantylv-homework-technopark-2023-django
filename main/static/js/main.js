// получили массив div-ов
let questions = document.getElementsByClassName("question-statistic")
let answers = document.getElementsByClassName("answer-statistic")
let checkForms = document.getElementsByClassName("isRightAnswer")

// получаем токен, чтобы можно было делать js инъекции в работе программы
const csrftoken = getCookie('csrftoken')

if (questions.length) {
    let objectType = 'Q'  // соответствует вопросу
    // подпишем кнопки на клик
    for (let i = 0; i < questions.length; ++i) {
        let current_question = questions[i]
        let block_likes = current_question.children[0]
        let block_dislikes = current_question.children[1]
        let question_id = current_question.getAttribute("question_id")
        block_likes.children[1].addEventListener('click', () => {
            changeReaction(block_likes.children[0], question_id, objectType, 'L', '/changeReaction/', csrftoken)
        })
        block_dislikes.children[1].addEventListener('click', () => {
            changeReaction(block_dislikes.children[0], question_id, objectType, 'D', '/changeReaction/', csrftoken)
        })
        // L - ставим лайк, D - дизлайк
    }
}

if (answers.length) {
    let objectType = 'A'  // соответствует ответу
    // подпишем кнопки на клик
    for (let i = 0; i < answers.length; ++i) {
        let current_answer = answers[i]
        let block_likes = current_answer.children[0]
        let block_dislikes = current_answer.children[1]
        let answer_id = current_answer.getAttribute("answer_id")
        block_likes.children[1].addEventListener('click', () => {
            changeReaction(block_likes.children[0], answer_id, objectType, 'L', '/changeReaction/', csrftoken)
        })
        block_dislikes.children[1].addEventListener('click', () => {
            changeReaction(block_dislikes.children[0], answer_id, objectType, 'D', '/changeReaction/', csrftoken)
        })
        if (checkForms.length) {
            // checkForms[i].children[0] --> чекбокс
            checkForms[i].children[0].addEventListener('change', () => {
                changeReaction(checkForms[i].children[1], answer_id, objectType, 'C', '/rightAnswer/', csrftoken)
            })
        }
        // L - ставим лайк, D - дизлайк
    }
}


function changeReaction(object, object_id, objectType, operation, url, csrftoken) {

    const req = new Request(url, {
        method: 'POST',
        body: JSON.stringify({
            "object_id": object_id,
            "objectType": objectType,
            "operation": operation
        }),
        headers: {'X-CSRFToken': csrftoken},
        mode: 'same-origin'
    })

    if (operation === 'C') {
        fetch(req)
            .then((response) => {
                return response.json()
            })
            .then(data => {
                console.log(data)
                if (data.status === 200) {
                    if (data.isRightAnswer) {
                        object.innerHTML = "Correct"
                    } else {
                        object.innerHTML = "Is correct ?"
                    }
                } else {
                    console.log(data.status, ': ', data.message)
                }
            })

    } else {
        fetch(req)
            .then((response) => {
                return response.json()
            })
            .then(data => {
                if (data.status === 200) {
                    if (data.needAddReaction) {
                        object.innerHTML = Number(object.innerHTML) + 1
                    } else {
                        object.innerHTML = Number(object.innerHTML) - 1
                    }
                } else {
                    console.log(data.status, ': ', data.message)
                }
            })
            .catch(error => console.error('Error:', error));
    }

}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}





