const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
const websiteEl = document.getElementById('website');
let initTime = Date.now();

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  statusEl.textContent = '';
  statusEl.className = 'form-status';
  const submitTime = Date.now();
  const timeTaken = submitTime - initTime;

  if (timeTaken < 3000) {
    formSuccess();
    button.disabled = false;
    return
  }

  const data = Object.fromEntries(new FormData(form));

  if (data.website) {
      formSuccess();
      button.disabled = false;
  }
  else {
    try {const response = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error || 'Something went wrong.');
      }

      formSuccess();
    } 
    catch (error) {
      statusEl.textContent = error.message || 'Something went wrong. Please email hello@calicomedia.co instead.';
      statusEl.classList.add('form-status--error');
    } 
    finally {
      button.disabled = false;
    }
  }
});

function formSuccess() {
  form.reset();
  initTime = Date.now();
  statusEl.textContent = "Thanks, we'll be in touch within one business day.";
  statusEl.classList.add('form-status--success');
}
