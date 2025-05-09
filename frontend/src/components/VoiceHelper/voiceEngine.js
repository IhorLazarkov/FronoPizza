var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

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
console.log({ recognition });

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
    console.log("On speech end");
    finalRecognizedWords.split(" ").forEach((word) => {

        const lcWord = word.toString().toLowerCase().trim();
        console.log("processing word: ", lcWord);

        if (action.includes(lcWord)) {
            commandStractured.intent += 1
        }
        if (target.includes(lcWord)) {
            commandStractured.target += 1
        }
        if (product.includes(lcWord)) {
            console.log("product was recognized: ", lcWord);
            products.push(lcWord)
            commandStractured.product += 1
        }
        if (finalActions.includes(lcWord)) {
            commandStractured.finalAction += 1
        }
    })

    console.log("Dispatching event");
    const event = new CustomEvent("data", {
        detail: {
            products,
            commandStractured,
            finalRecognizedWords
        }
    })
    eventTarget.dispatchEvent(event);
    console.log("Dispatching event end");
}

recognition.onerror = function (event) {
    console.log("Error: " + event.error);
}

window.recognition = recognition
window.eventTarget = eventTarget;