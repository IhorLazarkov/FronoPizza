var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
var SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

let finalRecognizedWords = ""
let products = []
let commandStractured
const eventTarget = new EventTarget();

// vacabulary
const action = ['i', 'to', 'want', 'like', 'love', 'would', 'look'];
const target = ['pizza', 'cheese']
const product = ['pepperoni', 'hawaiian', 'veggie']
const additionActions = ['add', 'add to', 'buy']
const cleanupActions = ['clear', 'clear all']
const finalActions = ['checkout', 'pay', 'order', 'buy']

const recognition = new SpeechRecognition();
// console.log({ recognition });

if (SpeechGrammarList) {
    const speechRecognitionList = new SpeechGrammarList();
    const grammarActions = '#JSGF V1.0; grammar actions; public <action> = ' + action.join(' | ') + ' ;'
    const grammarTargets = '#JSGF V1.0; grammar products; public <target> = ' + target.join(' | ') + ' ;'
    const grammarProducts = '#JSGF V1.0; grammar products; public <product> = ' + product.join(' | ') + ' ;'
    const grammarAdditionActions = '#JSGF V1.0; grammar products; public <addition> = ' + additionActions.join(' | ') + ' ;'
    const grammarCleaupActions = '#JSGF V1.0; grammar products; public <cleanup> = ' + cleanupActions.join(' | ') + ' ;'
    const grammarFinalActions = '#JSGF V1.0; grammar products; public <final> = ' + finalActions.join(' | ') + ' ;'
    speechRecognitionList.addFromString(grammarActions, 0.16);
    speechRecognitionList.addFromString(grammarTargets, 0.16);
    speechRecognitionList.addFromString(grammarProducts, 0.16);
    speechRecognitionList.addFromString(grammarAdditionActions, 0.16);
    speechRecognitionList.addFromString(grammarCleaupActions, 0.16);
    speechRecognitionList.addFromString(grammarFinalActions, 0.16);
    recognition.grammars = speechRecognitionList;
}

recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.maxAlternatives = 1;

recognition.onresult = function (event) {
    //reset
    products = []
    commandStractured = {
        intent: 0,
        target: 0,
        product: 0,
        finalAction: 0
    }
    //get the recognized sentence
    finalRecognizedWords = event.results[0][0].transcript
}

recognition.onspeechend = function () {
    finalRecognizedWords.split(" ").forEach((word) => {

        const lcWord = word.toString().toLowerCase().trim();

        if (action.includes(lcWord)) {
            commandStractured.intent += 1
        }
        if (target.includes(lcWord)) {
            commandStractured.target += 1
        }
        if (product.includes(lcWord)) {
            products.push(lcWord)
            commandStractured.product += 1
        }
        if (finalActions.includes(lcWord)) {
            commandStractured.finalAction += 1
        }
    })

    eventTarget.dispatchEvent(new CustomEvent("data", {
        detail: {
            products,
            commandStractured,
            finalRecognizedWords
        }
    }));
}

recognition.onerror = function (event) {
    console.err("Error: " + event.error);
}

window.recognition = recognition
window.eventTarget = eventTarget;