"use strict";

/////////////////////////
// VARIABLES
/////////////////////////

// INPUTS
const cardholderInput = document.querySelector("#name"),
  cardNumberInput = document.querySelector("#card-number"),
  cardMonthInput = document.querySelector("#month"),
  cardYearInput = document.querySelector("#year"),
  cardCVCInput = document.querySelector("#cvc");

// MESSAGES ON INPUTS
const cardholderMessage = document.querySelector("#message-1"),
  cardNumberMessage = document.querySelector("#message-2"),
  cardDateMessage = document.querySelector("#message-3"),
  cardCVCMessage = document.querySelector("#message-4");

// OUTPUTS - ON CARD
const cardholderOutput = document.querySelector(".front-card__name"),
  cardNumberOutput = document.querySelector(".front-card__number"),
  cardMonthOutput = document.querySelector(".front-card__date-1"),
  cardYearOutput = document.querySelector(".front-card__date-2"),
  cardCVCOutput = document.querySelector(".back-card__cvc"),
  btnSubmit = document.querySelector("#btn-confirm"),
  btnContinue = document.querySelector(".btn-continue");

// BASIC INPUTS
const nameResert = "Jane Appleseed",
  numberResert = "0000 0000 0000 0000",
  dateResert = "00",
  cvcResert = "000",
  basicMessage = "Can't be blank";

// FORM CONTAINERS
const formContent = document.querySelector(".form-content"),
  formContainer = document.querySelector(".form-container");

// SUBMIT CONTENT
const submitMessage = document.createElement("div");
submitMessage.classList.add("submit-container");
submitMessage.innerHTML = `
      <img src="./images/icon-complete.svg" alt="" aria-hidden="true" />
      <h2>Thank you</h2>
      <p>We've added your card details</p>
      <a href="#" class="btn btn-continue">
      Continue
      </a>`;

// VALIDATIONS
const invalidChars = ["-", "+", "e"];
const numberInputs = [cardNumberInput, cardMonthInput, cardYearInput, cardCVCInput];

const allInputs = [cardholderInput, cardNumberInput, cardMonthInput, cardYearInput, cardCVCInput];

// OBJECTS
const allDataObject = {
  input1: [cardholderInput, cardholderOutput, nameResert, cardholderMessage, 56],
  input2: [cardNumberInput, cardNumberOutput, numberResert, cardNumberMessage, 16],
  input3: [cardMonthInput, cardMonthOutput, dateResert, cardDateMessage, 2],
  input4: [cardYearInput, cardYearOutput, dateResert, cardDateMessage, 2],
  input5: [cardCVCInput, cardCVCOutput, cvcResert, cardCVCMessage, 3],
};

/////////////////////////
// FUNCTIONS
/////////////////////////
const resetInputs = function (input) {
  input.value = "";
};

const resetOutputs = function (output, reset) {
  output.textContent = reset;
};

const inputUpdate = function (input, output, reset) {
  output.textContent = input.value;

  if (input.value === "") {
    resetOutputs(output, reset);
  }
};

const checkMaxInput = function (input, maxLength) {
  if (Number(input.value) > Number(input.max)) {
    input.value = input.value.slice(0, maxLength);
  }
};

const addWarningMessage = function (input, message) {
  message.classList.remove("hidden");
  input.classList.add("error-label");
};

const removeWarningMessage = function (input, message) {
  message.classList.add("hidden");
  input.classList.remove("error-label");
};

/////////////////////////
// EVENTS HANDLERS
/////////////////////////
numberInputs.forEach((input) => {
  input.addEventListener("input", function () {
    this.value = this.value.replace(/[e\+\-]/gi, "");
  });
});

numberInputs.forEach((input) => {
  input.addEventListener("keydown", function (e) {
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  });
});

allInputs.forEach((input) => {
  input.addEventListener("focus", function () {
    for (const [key, value] of Object.entries(allDataObject)) {
      if (value[0].id == input.id) removeWarningMessage(value[0], value[3]);
    }
  });
});

allInputs.forEach((input) => {
  input.addEventListener("input", function () {
    for (const [key, value] of Object.entries(allDataObject)) {
      if (value[0].id == input.id) {
        checkMaxInput(value[0], value[4]);
        inputUpdate(value[0], value[1], value[2]);
      }
    }
  });
});

cardNumberInput.addEventListener("input", function () {
  const cardNumber = cardNumberOutput.innerHTML;
  const rawNumber = [...cardNumber];
  const cardNumberFormatted = [];

  if (rawNumber) {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0 && i != 0) {
        cardNumberFormatted.push(" ");
      }
      cardNumberFormatted.push(rawNumber[i]);
    }
  }

  cardNumberOutput.textContent = cardNumberFormatted.join("");

  if (cardNumberInput.value === "") {
    cardNumberOutput.textContent = numberResert;
  }
});

/////////////////////////
// FORM SUBMIT
/////////////////////////
btnSubmit.addEventListener("click", function (e) {
  e.preventDefault();

  allInputs.forEach((i) => {
    for (const [key, value] of Object.entries(allDataObject)) {
      if (value[0].id == i.id && value[0].value == "") {
        value[3].textContent = basicMessage;
        addWarningMessage(value[0], value[3]);
      }
    }
  });

  // CVC Check
  if (Number(cardCVCInput.value.length) <= 2) {
    cardCVCMessage.textContent = "Too short";
    addWarningMessage(cardCVCInput, cardCVCMessage);
  } else {
    removeWarningMessage(cardCVCInput, cardCVCMessage);
  }

  // DATE Check
  if (Number(cardYearInput.value.length) > 1 && Number(cardMonthInput.value.length) > 1) {
    removeWarningMessage(cardYearInput, cardDateMessage);
    removeWarningMessage(cardMonthInput, cardDateMessage);
  }
  if (Number(cardMonthInput.value) > 12) {
    cardDateMessage.textContent = "Enter correct month";
    addWarningMessage(cardMonthInput, cardDateMessage);
  }

  // CARD NUMBER Check
  if (Number(cardNumberInput.value.length) < 16) {
    cardNumberMessage.textContent = "Card number is to short. Enter 16 digits";
    addWarningMessage(cardNumberInput, cardNumberMessage);
  } else {
    removeWarningMessage(cardNumberInput, cardNumberMessage);
  }

  // CARD HOLDER Check
  if (!cardholderInput.checkValidity()) {
    cardholderMessage.textContent = "Wrong format, letters only";
    addWarningMessage(cardholderInput, cardholderMessage);
  } else {
    removeWarningMessage(cardholderInput, cardholderMessage);
  }

  // VALIDATION
  if (
    cardholderInput.checkValidity() &&
    cardNumberInput.value.length === 16 &&
    cardMonthInput.value.length >= 1 &&
    cardMonthInput.value <= 12 &&
    cardYearInput.value.length === 2 &&
    cardCVCInput.value.length === 3
  ) {
    formContainer.classList.add("hidden");
    formContent.appendChild(submitMessage);
  }
});

/////////////////////////
// BACK TO INITINAL STATE - RESET ALL
/////////////////////////
formContent.addEventListener("click", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("btn-continue")) {
    formContainer.classList.remove("hidden");
    formContent.removeChild(submitMessage);

    for (const [key, value] of Object.entries(allDataObject)) {
      resetOutputs(value[1], value[2]);
    }

    allInputs.forEach((input) => {
      resetInputs(input);
    });
  }
});
