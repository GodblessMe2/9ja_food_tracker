import '@babel/polyfill';
import axios from "axios";
import Swal from 'sweetalert2';
import { login, register, logout } from './login';
import { getFoodName } from './food';

// Dom Element
const signInForm = document.getElementById('signInForm');
const RegisterForm = document.getElementById('signUpForm');
const forgetPassword = document.getElementById('forgetPassword');
const logOut = document.getElementById('logout');
const searchForm = document.getElementById('foodForm');


if(signInForm) {
  signInForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // console.log(email, password);
    login(email, password);

    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
  })
}

if(RegisterForm) {
  RegisterForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name2').value;
    const email = document.getElementById('email2').value;
    const password = document.getElementById('password2').value;
    register(name, email, password);

    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
  })
}

if(forgetPassword) {
  forgetPassword.addEventListener('click', async e => {
    await Swal.fire({
      title: 'Enter Your Email',
      input: 'email',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      focusConfirm: false,
      preConfirm: function(email) {
        return new Promise((resolve, reject) => {
          if (email) {
            axios({
              method: 'POST',
              url: 'http://127.0.0.1:5000/api/v1/users/forgotPassword',
              data: {
                email
              }
            })
            .then(result => {
              if (result.data.status === 'Success') {
                Swal.fire({
                  icon: 'success',
                  title: result.data.message
                })
              }
              resolve();
            })
            .catch(error => {
              Swal.showValidationMessage(
                `Request failed: ${error.response.data.message}`
              )
              reject();
            })
          }
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
  })
}

if(logOut) {
  logOut.addEventListener('click', logout);
}

// if(searchForm) {
//   searchForm.addEventListener('click', e => {
//     e.preventDefault();
//     // const searchInput = document.getElementById('item-name').value;
//     console.log('hello');
//   })
// }
