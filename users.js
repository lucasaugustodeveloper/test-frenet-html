const _firstName = document.querySelector('input[name=firstName]');
const _lastName = document.querySelector('input[name=lastName]');
const _userName = document.querySelector('input[name=userName]');
const _email = document.querySelector('input[name=email]');
const _password = document.querySelector('input[name=password]');
const _phone = document.querySelector('input[name=phone]');
const _alert = document.querySelector('#alert');


const _boxUser = document.querySelector('#user');
const _searchUserInput = document.querySelector('input[name=searchUsername]');
const $btnSearchUser = document.querySelector('#button-search-user');
const $btnUserEdit = document.querySelector('#btn_edit') || null;
const $btnUserDelete = document.querySelector('#btn_delete') || null;

const $btnCreateUser = document.querySelector('#btn.create');
const $btnUpdateUser = document.querySelector('#btn.update');

const api = axios.create({
  baseURL: 'https://frontend-test.frenet.dev/v1'
});

const templateUser = ({ name, username, email, phone, status }) => (`
  <div class="card" style="width: 18rem;">
    <img src="./assets/images/600x400.png" class="card-img-top" alt="Placeholder Image">

    <div class="card-body">
      <h5 class="card-title">${name}</h5>
      <p class="card-text"><strong>Username:</strong> ${username}</p>
      <p class="card-text"><strong>Email:</strong> ${email}</p>
      <p class="card-text"><strong>Phone:</strong> ${phone}</p>
      <p class="card-text ${status !== 2 ? 'status-inactive' : 'status-active'}">Status:</p>

      <button
        type="button"
        class="btn btn-primary"
        id="btn_edit"
        onclick="btnUserEdit()"
      >
        <i class="bi bi-pencil-fill"></i>
      </button>
      <button
        type="button"
        class="btn btn-danger"
        id="btn_delete"
        onclick="btnUserDelete()"
      >
        <i class="bi bi-trash-fill"></i>
      </button>
    </div>
  </div>
`);

const btnUserDelete = () => {
  api.delete(`/user/${_searchUserInput.value}`)
    .then(() => {
      _alert.classList.add('alert-success');
      _alert.classList.remove('hidden');
      _alert.textContent = 'User delete!';

      _boxUser.innerHTML = '';
    })
    .catch(() => {
      _alert.classList.add('alert-danger');
      _alert.classList.remove('hidden');
      _alert.textContent = 'User not found!';
    });
};

const btnUserEdit = () => {
  const {
    firstName,
    lastName,
    username,
    email,
    phone,
  } = JSON.parse(localStorage.getItem('infoUser'));

  _firstName.value = firstName;
  _lastName.value = lastName,
  _userName.value = username;
  _email.value = email;
  _phone.value = phone;

  $btnCreateUser.textContent = 'Update user';
  $btnCreateUser.classList.remove('create');
  $btnCreateUser.classList.add('update');
};

const createUser = (data) => {
  console.log('create', data);
  api.post('/user', data)
    .then(() => {
      _alert.classList.add('alert-success');
      _alert.classList.remove('hidden');
      _alert.classList.remove('alert-danger');
      _alert.textContent = 'Create user success!';
    })
    .catch(() => {
      _alert.classList.add('alert-danger');
      _alert.classList.remove('hidden');
      _alert.textContent = 'User not create!';
    })
    .finally(() => {
      _firstName.value = '';
      _lastName.value = '';
      _userName.value = '';
      _email.value = '';
      _phone.value = '';
    });
};

const updateUser = (data) => {
  api.put(`/user/${_searchUserInput.value}`, data)
    .then(() => {
      _alert.classList.add('alert-success');
      _alert.classList.remove('hidden');
      _alert.classList.remove('alert-danger');
      _alert.textContent = 'User update!';
    })
    .catch(() => {
      _alert.classList.add('alert-danger');
      _alert.classList.remove('hidden');
      _alert.classList.remove('alert-success');
      _alert.textContent = 'User not update!';
    })
    .finally(() => {
      _firstName.value = '';
      _lastName.value = '';
      _userName.value = '';
      _email.value = '';
      _phone.value = '';
    });
};

$btnCreateUser.addEventListener('click', (e) => {
  e.preventDefault();

  const transformValues = {
    firstname: _firstName.value,
    lastname: _lastName.value,
    username: _userName.value,
    email: _email.value,
    password: _password.value,
    phone: _phone.value,
    userstatus: 2
  }

  for (const prop in transformValues) {
    if (transformValues[prop] === '') {
      alert('Fill all information');
      return false;
    }
  }

  if($btnCreateUser.classList.contains('create')) {
    createUser(transformValues);
  }
  if($btnCreateUser.classList.contains('update')) {
    updateUser(transformValues);
  }

  
});

$btnSearchUser.addEventListener('click', () => {
  if (_searchUserInput.value === '') {
    _alert.classList.add('alert-danger');
    _alert.classList.remove('hidden');
    _alert.textContent = 'Please insert username!';
    
    return false;
  }
  
  _alert.classList.add('hidden');
  _alert.textContent = '';

  api.get(`/user/${_searchUserInput.value}`)
    .then(({ data }) => {
      localStorage.setItem('infoUser', JSON.stringify(data));

      _boxUser.innerHTML = templateUser({
        name: `${data.firstName} ${data.lastName}`,
        username: data.username,
        email: data.email,
        phone: data.phone,
        status: data.userStatus
      });
    })
    .catch(() => {
      localStorage.clear();
      _alert.classList.add('alert-danger');
      _alert.classList.remove('hidden');
      _alert.textContent = 'User not found!';
      _boxUser.innerHTML = '';
    });
});
