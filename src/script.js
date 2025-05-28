/**
 * Morse code translator module
 * @module morse
 */
const morse = (function () {
    const alpha = {
        A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....",
        I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.",
        Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--",
        X: "-..-", Y: "-.--", Z: "--..", " ": "/",
        "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....",
        "6": "-....", "7": "--...", "8": "---..", "9": "----.", "0": "-----",
        ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--",
        "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...",
        ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-",
        "\"": ".-..-.", "$": "...-..-", "@": ".--.-."
    };

    function flipObject(obj) {
        const flipped = {};
        for (const key in obj) {
            if (Object.hasOwn(obj, key)) {
                flipped[obj[key]] = key;
            }
        }
        return flipped;
    }

    const morseToAlpha = flipObject(alpha);
    morseToAlpha["|"] = " ";

    /**
     * Encodes text to Morse code
     * @param {string} str - Input text
     * @returns {string} Morse code
     */
    function encode(str) {
        return str
            .toUpperCase()
            .split("")
            .map(char => alpha[char] || "")
            .join(" ")
            .replace(/ +/g, " ")
            .replace(/ \/ /g, " / ");
    }

    /**
     * Decodes Morse code to text
     * @param {string} str - Morse code
     * @returns {string} Decoded text
     */
    function decode(str) {
        return str
            .replace(/\|/g, " / ")
            .split(" ")
            .map(code => code === "/" ? " " : (morseToAlpha[code] || ""))
            .join("")
            .replace(/ +/g, " ")
            .trim();
    }

    return {
        encode,
        decode,
        silent: function () { return true; }
    };
})();

/**
 * Validates input for text or Morse code
 * @param {string} str - Input string
 * @returns {boolean} True if valid, false otherwise
 */
function validateInput(str) {
    const validText = /^[A-Z0-9\s.,?!'()/:;=+\-_"$@]*$/i;
    const validMorse = /^[.\-/\s]*$/;
    return validText.test(str) || validMorse.test(str);
}

/**
 * Checks if input is Morse code
 * @param {string} str - Input string
 * @returns {boolean} True if Morse code, false otherwise
 */
function isMorseCode(str) {
    const morseChars = ['/', '-', '.', ' '];
    let morseCount = 0;
    for (let i = 0; i < str.length; i++) {
        if (morseChars.includes(str[i])) morseCount++;
    }
    // If most characters are morse symbols, treat as morse
    return morseCount > str.length * 0.6;
}

/**
 * Updates character counters for input and output
 */
function updateCharCounters() {
    const msgInput = document.getElementById("msgInput");
    const msgOutput = document.getElementById("msgOutput");
    document.getElementById("charCounter").textContent = `${msgInput.value.length} characters`;
    document.getElementById("outputCounter").textContent = `${msgOutput.value.length} characters`;
}

/**
 * Main translation function
 */
function MorseTranslator() {
    const msgInput = document.getElementById("msgInput");
    const msgOutput = document.getElementById("msgOutput");
    const statusIndicator = document.getElementById("statusIndicator");
    const statusText = document.getElementById("statusText");

    if (!msgInput.value.trim()) {
        msgOutput.value = "";
        statusIndicator.style.display = "none";
        updateCharCounters();
        return;
    }

    if (!validateInput(msgInput.value)) {
        msgOutput.value = "";
        statusIndicator.style.display = "flex";
        statusText.textContent = "Invalid input: Only letters, numbers, punctuation, and Morse symbols allowed.";
        statusIndicator.classList.remove("success");
        statusIndicator.classList.add("error");
        updateCharCounters();
        return;
    }

    statusIndicator.style.display = "flex";
    statusIndicator.classList.remove("error");
    statusIndicator.classList.add("success");

    try {
        let result = "";
        if (isMorseCode(msgInput.value)) {
            result = morse.decode(msgInput.value.trim());
            statusText.textContent = "Morse → Text";
        } else {
            result = morse.encode(msgInput.value.trim());
            statusText.textContent = "Text → Morse";
        }
        msgOutput.value = result;
    } catch (error) {
        msgOutput.value = "";
        statusText.textContent = "Translation error!";
        statusIndicator.classList.add("error");
    }

    updateCharCounters();
}

/**
 * Clears input and output fields
 */
function clearAll() {
    const msgInput = document.getElementById("msgInput");
    const msgOutput = document.getElementById("msgOutput");
    const statusIndicator = document.getElementById("statusIndicator");
    msgInput.value = "";
    msgOutput.value = "";
    statusIndicator.style.display = "none";
    updateCharCounters();
    msgInput.focus();
}

/**
 * Copies output to clipboard with visual feedback
 */
function copyOutput() {
    const msgOutput = document.getElementById("msgOutput");
    const btn = document.getElementById("copyBtn");
    if (msgOutput.value) {
        navigator.clipboard.writeText(msgOutput.value).then(() => {
            btn.classList.add("copied");
            btn.innerHTML = `<i class="material-icons">check</i> Copied!`;
            setTimeout(() => {
                btn.classList.remove("copied");
                btn.innerHTML = `<i class="material-icons">content_copy</i> Copy Result`;
            }, 1200);
        });
    }
}

/**
 * Swaps input and output content
 */
function swapContent() {
    const msgInput = document.getElementById("msgInput");
    const msgOutput = document.getElementById("msgOutput");
    const temp = msgInput.value;
    msgInput.value = msgOutput.value;
    msgOutput.value = temp;
    MorseTranslator();
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    updateCharCounters();
    document.getElementById("msgInput").focus();

    document.getElementById("msgInput").addEventListener("input", MorseTranslator);
    document.getElementById("clearBtn").addEventListener("click", clearAll);
    document.getElementById("copyBtn").addEventListener("click", copyOutput);
    document.getElementById("swapBtn").addEventListener("click", swapContent);
});