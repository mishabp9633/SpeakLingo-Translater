// Selecting all dropdown containers, input language dropdown, and output language dropdown.
const dropdowns = document.querySelectorAll(".dropdown-container"),
  inputLanguageDropdown = document.querySelector("#input-language"),
  outputLanguageDropdown = document.querySelector("#output-language");

// Function to populate language dropdown menus with options.
function populateDropdown(dropdown, options) {
  dropdown.querySelector("ul").innerHTML = "";
  options.forEach((option) => {
    const li = document.createElement("li");
    const title = option.name + " (" + option.native + ")";
    li.innerHTML = title;
    li.dataset.value = option.code;
    li.classList.add("option");
    dropdown.querySelector("ul").appendChild(li);
  });
}

// Populating the input and output language dropdowns with language options.
populateDropdown(inputLanguageDropdown, inputLanguages);
populateDropdown(outputLanguageDropdown, outputLanguages);

// Handling user interactions with the language dropdowns.
dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", (e) => {
    dropdown.classList.toggle("active");
  });

  // Handling language selection within the dropdown.
  dropdown.querySelectorAll(".option").forEach((item) => {
    item.addEventListener("click", (e) => {
      dropdown.querySelectorAll(".option").forEach((item) => {
        item.classList.remove("active");
      });
      item.classList.add("active");
      const selected = dropdown.querySelector(".selected");
      selected.innerHTML = item.innerHTML;
      selected.dataset.value = item.dataset.value;
      translate();
    });
  });
});

// Closing dropdowns when clicking outside.
document.addEventListener("click", (e) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
});

// Selecting swap button, input language, output language, input text, and output text elements.
const swapBtn = document.querySelector(".swap-position"),
  inputLanguage = inputLanguageDropdown.querySelector(".selected"),
  outputLanguage = outputLanguageDropdown.querySelector(".selected"),
  inputTextElem = document.querySelector("#input-text"),
  outputTextElem = document.querySelector("#output-text");

// Handling the language swap button click.
swapBtn.addEventListener("click", (e) => {
  const temp = inputLanguage.innerHTML;
  inputLanguage.innerHTML = outputLanguage.innerHTML;
  outputLanguage.innerHTML = temp;

  const tempValue = inputLanguage.dataset.value;
  inputLanguage.dataset.value = outputLanguage.dataset.value;
  outputLanguage.dataset.value = tempValue;

  // Swapping input and output text.
  const tempInputText = inputTextElem.value;
  inputTextElem.value = outputTextElem.value;
  outputTextElem.value = tempInputText;

  // Triggering translation with the new settings.
  translate();
});

// Translates the input text using the Google Translate API.
function translate() {
  const inputText = inputTextElem.value;
  const inputLanguage =
    inputLanguageDropdown.querySelector(".selected").dataset.value;
  const outputLanguage =
    outputLanguageDropdown.querySelector(".selected").dataset.value;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(
    inputText
  )}`;
  
  // Fetching translation data from Google Translate API.
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      outputTextElem.value = json[0].map((item) => item[0]).join("");
    })
    .catch((error) => {
      console.log(error);
    });
}

// Limiting input text to 5000 characters and updating the character count.
inputTextElem.addEventListener("input", (e) => {
  if (inputTextElem.value.length > 5000) {
    inputTextElem.value = inputTextElem.value.slice(0, 5000);
  }
  translate();
});

// Selecting the dark mode checkbox and enabling dark mode when checked.
const darkModeCheckbox = document.getElementById("dark-mode-btn");

darkModeCheckbox.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

// Updating the input character count.
const inputChars = document.querySelector("#input-chars");

inputTextElem.addEventListener("input", (e) => {
  inputChars.innerHTML = inputTextElem.value.length;
});

// Selecting the voice container for text-to-speech functionality.
const voiceContainer = document.querySelector(".voice_container");

// Enabling text-to-speech for the translated text.
voiceContainer.addEventListener("click", () => {
  const outputText = outputTextElem.value;

  if ("speechSynthesis" in window) {
    const speechSynthesis = window.speechSynthesis;
    const speechText = new SpeechSynthesisUtterance(outputText);

    speechSynthesis.speak(speechText);
  } else {
    alert("Your browser does not support speech synthesis.");
  }
});

// Enabling speech recognition for input.
document.getElementById("speeker_container").addEventListener("click", function () {
  var recognition = new webkitSpeechRecognition();
  recognition.lang = "ml-IN";

  recognition.onresult = function (event) {
    var transcript = event.results[0][0].transcript;
    inputTextElem.value = transcript;
    translate();
  };

  recognition.start();
});


// Selecting the "Download" button.
const downloadBtn = document.querySelector(".download-btn");

downloadBtn.addEventListener("click", () => {
  const outputText = outputTextElem.value;

  if (outputText.trim() !== "") {
    const blob = new Blob([outputText], { type: "text/plain" });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);

    downloadLink.download = "translated_output.txt";

    downloadLink.click();
  } else {
    alert("There is no content to download.");
  }
});



const uploadDocument = document.querySelector("#upload-document"),
  uploadTitle = document.querySelector("#upload-title");

uploadDocument.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (
    // file.type === "application/pdf" ||
    file.type === "text/plain" ||
    file.type === "application/msword" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    uploadTitle.innerHTML = file.name;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      inputTextElem.value = e.target.result;
      translate();
    };
  } else {
    alert("Please upload a valid file");
  }
});