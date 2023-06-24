import '@babel/polyfill';
import axios from "axios";
import Swal from 'sweetalert2';
import { login, register, logout } from './login';
import { UI, StorageCtrl, itemCtrl } from './app';
import { resetPassword } from './resetPassword';
import { getFoodName } from './food';
import { chartResult } from './chart';

// Dom Element
const signInForm = document.getElementById('signInForm');
const RegisterForm = document.getElementById('signUpForm');
const forgetPassword = document.getElementById('forgetPassword');
const logOut = document.getElementById('logout');
const changePassword = document.getElementById('changePassword')
const searchForm = document.getElementById('foodForm');


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
              if (result.data.status === 'success') {
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
              );
              reject();
            })
          }
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
  })
}

if(changePassword) {
  changePassword.addEventListener('submit', e => {
    e.preventDefault();
    const token = document.getElementById('token').value;
    const password = document.getElementById('password').value;
    resetPassword(token, password);

    document.getElementById('password').value = '';
  })
}


if(logOut) {
  logOut.addEventListener('click', logout);
}

const AppCtrl = (() => {
  const loadEventListeners = () => {
    const UISelectors = UI.getSelectors();

    if(UISelectors.deleteBtn) {
      document.querySelector(UISelectors.itemList).addEventListener('click', DeleteItemMeal);
    }

    document.querySelector(UISelectors.addBtn).addEventListener('click', AddMealSubmit);

    // Clear items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    
  }

  // Add Meal submit function
  const AddMealSubmit = async (e) => {
    const input = UI.getItemInput();

    e.preventDefault();
    try {
      if (input.name !== '') {
        const arr = input.name.split(" ");
        for (let i = 0; i < arr.length; i++) {
          arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        const inputRes = arr.join(" ");

        const foodItems = await getFoodName(inputRes);
        const newItem = itemCtrl.addItem(foodItems.name, foodItems.calories, foodItems.fat, foodItems.carbohydrate, foodItems.protein)

        UI.addListMeal(newItem);

        itemCtrl.setCurrentItem(newItem);

        // Get the total Nutrition
        const getTotalNutrient = itemCtrl.getTotalNutrients();

        UI.showTotalNutrient(getTotalNutrient);
  

        // Store In LS
        StorageCtrl.storeItem(newItem);
        // Clear Field
        UI.clearInput();
      }
    } catch (err) {
      console.error(err);
      UI.clearInput();
    }
    
  }

  const DeleteItemMeal = (e) => {
    if(e.target.classList.contains('delete-btn')) {
      let listId = e.target.parentNode.id;
      
      // Break into an array
      const listIdArr = listId.split('-');

      // Get the actual id
      const id = parseInt(listIdArr[1]);
      const itemId = itemCtrl.getItemById(id)

      itemCtrl.setCurrentItem(itemId);

      const currentItem = itemCtrl.getCurrentItem();
      
      // Delete from data structure
      itemCtrl.deleteItem(currentItem.id);

      // Delete from the UI
      UI.deleteListItem(currentItem.id);

      const getTotalNutrient = itemCtrl.getTotalNutrients();
      
      UI.showTotalNutrient(getTotalNutrient);

      
      // Delete from local storage
      StorageCtrl.deleteItemFromStorage(currentItem.id);
    }

    e.preventDefault();
  }

  const clearAllItemsClick = (e) => {
    itemCtrl.clearAllItems();

    // Get Total Nutrient
    const getTotalNutrient = itemCtrl.getTotalNutrients();
    
    UI.showTotalNutrient(getTotalNutrient);

    // Remove from UI
    UI.removeItems();

    // Clear all from local storage
    StorageCtrl.clearItemsFromStorage();
    e.preventDefault();
  }

  return {
    init: function () {
      const item = itemCtrl.getItems();

      UI.populateItemList(item);

      const getTotalNutrient = itemCtrl.getTotalNutrients();
      
      UI.showTotalNutrient(getTotalNutrient);
      // Load event listener call
      loadEventListeners();
    }
  }
})()

AppCtrl.init();


