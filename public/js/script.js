const getToken = async () => {
  const bodyObj = {email: 'jojo@gmail.com'};
  const url = 'http://localhost:3000/api/v1/authorization';
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(bodyObj)
  };
  const response = await fetch(url, options);
  const token = await response.json();
  return token;
};

const token = getToken();

console.log(token);

const getUsers = async () => {
  const url = 'http://localhost:3000/api/v1/users';
  const response = await fetch(url);
  const users = await response.json();
  appendUsers(users);
};

const appendUsers = (users) => {
  users.forEach(user => {
    $('.user-table').append(`
      <tr>
        <td>${user.id}</td>
        <td>
          <button id="${user.id}">
            ${user.first_name}
          </button>
        </td>
          <button id="${user.id}">
            ${user.last_name}
          </button>
        </td>
      </tr>
    `);
  });
};

const getRoutes = async () => {
  const url = 'http://localhost:3000/api/v1/saved_routes';
  const response = await fetch(url);
  const routes = await response.json();
  appendUsers(routes);
};

const appendRoutes = (routes) => {
  routes.forEach(route => {
    $('.routes-table').append(`
      <tr>
        <td>${route.id}</td>
        <td>${route.name}</td>
        <td>${route.start_location}</td>
        <td>${route.end_location}</td>
        <td>${route.user_id}</td>
      </tr>
    `);
  });
};

getUsers();