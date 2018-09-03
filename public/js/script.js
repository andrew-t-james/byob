const form = document.querySelector('#form');
const emailInput = document.querySelector('.email');
const appNameInput = document.querySelector('.appName');
const tokenCode = document.querySelector('p');

form.addEventListener('submit', getValues);

function getValues(event) {
  event.preventDefault();
  const email = emailInput.value;
  const appName = appNameInput.value;
  getToken(email, appName);
}


async function getToken(email, appName) {
  const url = 'http://localhost:3000/api/v1/authorization';
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, app_name: appName })
  };
  const response = await fetch(url, options);
  const token = await response.json(response);
  tokenCode.append(`${token.token}`);
}