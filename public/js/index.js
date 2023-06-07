import '@babel/polyfill';
import { login, register } from './login';

// Dom Element
const signInForm = document.getElementById('signInForm');
const RegisterForm = document.getElementById('signUpForm');

if(signInForm) {
  signInForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
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


