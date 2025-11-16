document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const form = document.querySelector("form.contactForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // prevent normal form submission

    let ferror = false;
    const emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    const formGroups = form.querySelectorAll(".form-group");

    // Validate inputs
    formGroups.forEach(group => {
      const input = group.querySelector("input, textarea");
      const validationDiv = group.querySelector(".validation");

      if (!input) return;

      let rule = input.getAttribute("data-rule");
      let exp;
      let ierror = false;

      if (rule !== undefined && rule !== null) {
        let pos = rule.indexOf(':');
        if (pos >= 0) {
          exp = rule.substr(pos + 1);
          rule = rule.substr(0, pos);
        }

        switch (rule) {
          case 'required':
            if (input.value.trim() === '') ierror = true;
            break;

          case 'minlen':
            if (input.value.trim().length < parseInt(exp)) ierror = true;
            break;

          case 'email':
            if (!emailExp.test(input.value.trim())) ierror = true;
            break;

          case 'checked':
            if (!input.checked) ierror = true;
            break;

          case 'regexp':
            let reg = new RegExp(exp);
            if (!reg.test(input.value.trim())) ierror = true;
            break;
        }

        if (ierror) {
          ferror = true;
          validationDiv.innerHTML = input.getAttribute("data-msg") || "Wrong Input";
          validationDiv.style.display = "block";
        } else {
          validationDiv.innerHTML = "";
          validationDiv.style.display = "none";
        }
      }
    });

    if (ferror) return false;

    // Prepare AJAX request
    const formData = new FormData(form);
    let action = form.getAttribute("action");
    if (!action) action = "";

    fetch(action, {
      method: "POST",
      body: formData,
    })
      .then(response => response.text())
      .then(msg => {
        // Always trigger alert on click
        alert("Email sent Successfully!");

        if (msg.trim() === "OK") {
          document.getElementById("sendmessage").classList.add("show");
          document.getElementById("errormessage").classList.remove("show");

          // Clear form inputs
          form.querySelectorAll("input, textarea").forEach(field => {
            field.value = "";
          });
        } else {
          document.getElementById("sendmessage").classList.remove("show");
          document.getElementById("errormessage").classList.add("show");
          document.getElementById("errormessage").innerHTML = msg;
        }
      })
      .catch(error => {
        alert("An error occurred: " + error);
      });

    return false;
  });
});
