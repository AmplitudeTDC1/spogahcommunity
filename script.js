// about us popup
function openPopup() {
  const popup = document.getElementById("aboutPopup");
  if (popup) popup.style.display = "flex";
}

function closePopup() {
  const popup = document.getElementById("aboutPopup");
  if (popup) popup.style.display = "none";
}

// our mission popup
function openMissionPopup() {
  const popup = document.getElementById("missionPopup");
  if (popup) popup.style.display = "flex";
}

function closeMissionPopup() {
  const popup = document.getElementById("missionPopup");
  if (popup) popup.style.display = "none";
}

// Registration form handling
document.addEventListener("DOMContentLoaded", function () {
  // Form elements
  const joinBtn = document.getElementById("join-btn");
  const membershipForm = document.getElementById("membershipForm");
  const closeBtn = document.querySelector(".close-btn");
  const fullNameInput = document.getElementById("full-name");
  const namePlaceholder = document.getElementById("user-name-placeholder");
  const declarationCheckbox = document.getElementById("declaration");
  const submitButton = document.getElementById("submit");
  const generatedCodeInput = document.getElementById("generated-code");
  const membershipCategorySelect =
    document.getElementById("membershipCategory");
  const successModal = document.getElementById("successModal");
  const closeModalBtn = document.getElementById("closeModal");

  // Google Sheets URL
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbypCm1owcwdV5YLkOnbrIL6IqJ3bL7tXArks9zI-020vKZ86cW29pkXWEVSyH4wZ-Fs/exec";

  // Initialize form
  function initForm() {
    generateReferenceCode();
    if (declarationCheckbox && submitButton) {
      submitButton.disabled = !declarationCheckbox.checked;
    }
    setupEventListeners();
  }

  // Generate reference code
  function generateReferenceCode() {
    if (generatedCodeInput) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      generatedCodeInput.value =
        "SPG-" +
        Array.from({ length: 6 }, () =>
          chars.charAt(Math.floor(Math.random() * chars.length))
        ).join("");
    }
  }

  // Show form with selected membership category
  function showForm(category = "Monthly") {
    if (membershipCategorySelect) {
      membershipCategorySelect.value = category; // Set the selected category
    }

    membershipForm.style.display = "block";
    setTimeout(() => {
      membershipForm.classList.add("visible");
    }, 10);
  }

  // Hide form
  function hideForm() {
    membershipForm.classList.remove("visible");
    setTimeout(() => {
      membershipForm.style.display = "none";
    }, 300);
  }

  // Event listeners
  function setupEventListeners() {
    // Show form on "Join" button click
    if (joinBtn) {
      joinBtn.addEventListener("click", () => showForm());
    }

    // Hide form
    if (closeBtn) {
      closeBtn.addEventListener("click", hideForm);
    }

    // Membership plan buttons - dynamically set category
    document.querySelectorAll(".select-plan").forEach((button) => {
      button.addEventListener("click", function () {
        const selectedCategory = this.getAttribute("data-plan") || "Monthly"; // Get category from button
        showForm(selectedCategory); // Pass it to the form
      });
    });

    // Name input updates
    if (fullNameInput && namePlaceholder) {
      fullNameInput.addEventListener("input", function () {
        const name = this.value.trim() || "________";
        namePlaceholder.textContent = name;

        const declarationTextInput =
          document.getElementById("declaration-text");
        if (declarationTextInput) {
          declarationTextInput.value = `I, ${name}, hereby declare that the information provided above is true and accurate to the best of my knowledge. I understand and agree to abide by the rules and regulations of the Spogah Barter Community.`;
        }
      });
    }

    // Declaration checkbox
    if (declarationCheckbox && submitButton) {
      declarationCheckbox.addEventListener("change", function () {
        submitButton.disabled = !this.checked;
      });
    }

    // Form submission
    if (membershipForm) {
      membershipForm.addEventListener("submit", handleSubmit);
    }

    // Close success modal
    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", function () {
        successModal.classList.remove("show");
      });
    }
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();

    const name = fullNameInput.value.trim() || "________";
    const declarationText = `I, ${name}, hereby declare that the information provided above is true and accurate to the best of my knowledge. I understand and agree to abide by the rules and regulations of the Spogah Barter Community.`;

    document.getElementById("declaration-text").value = declarationText;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="spinner"></span> Submitting...';
    }

    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
      alert("Please verify you are not a bot!");
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Register";
      }
      return;
    }

    const formData = new FormData(membershipForm);
    formData.set("declaration-text", declarationText);
    formData.append("g-recaptcha-response", recaptchaResponse);

    fetch(scriptURL, { method: "POST", body: formData })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        showSuccess();
        resetForm();
        grecaptcha.reset();
      })
      .catch((error) => {
        console.error("Error!", error.message);
        alert("Registration failed. Please try again later.");
      })
      .finally(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Register";
        }
      });
  }

  // Show success modal
  function showSuccess() {
    if (successModal) {
      successModal.classList.add("show");
    }
  }

  // Reset form
  function resetForm() {
    if (membershipForm) membershipForm.reset();
    generateReferenceCode();
    if (declarationCheckbox) declarationCheckbox.checked = false;
    if (submitButton) submitButton.disabled = true;
    hideForm();
  }

  // Initialize the form
  initForm();
});
