export const StorageCtrl = (() => {
  // Public Methods
  return{
    storeItem: (item) =>{
      // User ID and add it to items
      const userID = JSON.parse(localStorage.getItem('userID'));

      let items;

      // Check if any items in ls
      if(localStorage.getItem('items'+userID) === null){
        items = [];
        // Push new item
        items.push(item);
        // Set ls
        localStorage.setItem('items'+userID, JSON.stringify(items));
      } else {
        // Get what is already in ls
        items = JSON.parse(localStorage.getItem('items'+userID));

        // Push new item
        items.push(item);

        // Re set ls
        localStorage.setItem('items'+userID, JSON.stringify(items));
      }
    },

   getItemsFromStorage: () => {
    const userID = JSON.parse(localStorage.getItem('userID'));
    let items
    if(localStorage.getItem('items'+userID) === null) {
      items = [];
    } else {
      items = JSON.parse(localStorage.getItem('items'+userID));
    }
    return items;
   },

   deleteItemFromStorage: id => {
    const userID = JSON.parse(localStorage.getItem('userID'));
    let items = JSON.parse(localStorage.getItem('items'+userID));
      items.forEach(function(item, index){
        if(id === item.id){
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items'+userID, JSON.stringify(items));
   },

   clearItemsFromStorage: () => {
    const userID = JSON.parse(localStorage.getItem('userID'));
    localStorage.removeItem('items'+userID);
   }
  }
})();


// UI Controller
export const UI = (() => {
  const UISelectors = {
    itemNameInput: '#item-name',
    addBtn: '.add-btn',
    deleteBtn: '.delete-btn',
    clearBtn: '.clear-btn',
    totalCount: '.total-count',
    itemList: '#item-list',
    listItems: '#item-list tr',
    user_id: 'select#user_id',
  }

  return {
    populateItemList: (items) => {
      let html = '';
      items.forEach((item) => {
        html += `
        <tr id="item-${item.id}">
          <td>${item.name}</td>
          <td>${item.calories}</td>
          <td>${item.fat}</td>
          <td>${item.carbohydrates}</td>
          <td>${item.protein}</td>
          <td class="delete-btn fa fa-trash"></td>
        </tr>
        `
      });
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: () => {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
      }
    },

    addListMeal: (item) => {
      const tableRow = document.createElement('tr');
      tableRow.id = `item-${item.id}`;
      tableRow.innerHTML = `
      <td>${item.name}</td>
      <td>${item.calories}</td>
      <td>${item.fat}</td>
      <td>${item.carbohydrates}</td>
      <td>${item.protein}</td>
      <td class="delete-btn fa fa-trash"></td>`

      document.querySelector(UISelectors.itemList).insertAdjacentElement('Afterbegin', tableRow);
    },

    showTotalNutrient: (getTotalNutrient) => {
      let html = '';
      html += `
        <li class="btn blue darken-1">Calories: ${getTotalNutrient[0]}</li>
        <li class="btn waves-effect waves-light">Fat: ${getTotalNutrient[1]}</li>
        <li class="btn amber accent-4">Carbohydrates: ${getTotalNutrient[2]}</li>
        <li class="btn deep-orange accent-4">Protein: ${getTotalNutrient[3]}</li>
      `
      document.querySelector(UISelectors.totalCount).innerHTML = html;
    },

    deleteListItem: id => {
      const itemId = `#item-${id}`;

      const item = document.querySelector(itemId);
      item.remove();
    },

    clearInput: () => {
      document.querySelector(UISelectors.itemNameInput).value = '';
    },

    hideList: () => {
      document.querySelector(UISelectors.itemList).style.display = 'none'
    },

    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      });
    },

    getSelectors: () => {
      return UISelectors;
    }

  }

})();


// Item Controller
export const itemCtrl = (function () {
  const Item = function (id, name, calories, fat, carbohydrates, protein) {
    this.id = id,
    this.name = name,
    this.calories = calories,
    this.fat = fat,
    this.carbohydrates = carbohydrates,
    this.protein = protein;
  }

  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
    totalFat: 0,
    totalCarbohydrates: 0,
    totalProtein: 0
  }
  return {
    getItems: () => {
      return data.items;
    },

    addItem: (name, calories, fat, carbohydrates, protein) => {
      // Create Id
      let ID;
      // Create ID
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      calories = parseInt(calories);
      fat = parseInt(fat);
      carbohydrates = parseInt(carbohydrates);
      protein = parseInt(protein);

      // Create new Item 
      const newItem = new Item(ID, name, calories, fat, carbohydrates, protein);

      // Add items Array
      data.items.push(newItem);
      return newItem;
    },

    getTotalNutrients: () => {
      let totalCal = 0;
      let totalFat = 0;
      let totalCar = 0;
      let totalPro = 0;
      data.items.forEach((item) => {
        totalCal += item.calories;
        totalFat += item.fat;
        totalCar += item.carbohydrates;
        totalPro += item.protein;
      });
      
      data.totalCalories = totalCal
      data.totalFat = totalFat
      data.totalCarbohydrates = totalCar
      data.totalProtein = totalPro;

      return [
        data.totalCalories, 
        data.totalFat, 
        data.totalCarbohydrates, 
        data.totalProtein
      ]
    },

    clearAllItems: () => {
      data.items = [];
    },

    getItemById: id => {
      let found = null;
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },

    deleteItem: id => {
      const ids = data.items.map(item => {
        return item.id;
      })

      const index = ids.indexOf(id);

      // Remove item 
      data.items.splice(index, 1);
    },

    setCurrentItem: item => {
      data.currentItem = item;
    },

    getCurrentItem: () => {
      return data.currentItem;
    },

    logData: function () {
      return data;
    }
  }
})()