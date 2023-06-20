export const StorageCtrl = (() => {
  // Public Methods
  return{
    storeItem: (item) =>{
      let items;
      // Check if any items in ls
      if(localStorage.getItem('items') === null){
        items = [];
        // Push new item
        items.push(item);
        // Set ls
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Get what is already in ls
        items = JSON.parse(localStorage.getItem('items'));

        // Push new item
        items.push(item);

        // Re set ls
        localStorage.setItem('items', JSON.stringify(items));
      }
    },

   getItemsFromStorage: () => {
    let items
    if(localStorage.getItem('items') === null) {
      items = [];
    } else {
      items = JSON.parse(localStorage.getItem('items'));
    }
    return items;
   },

   deleteItemFromStorage: id => {
    let items = JSON.parse(localStorage.getItem('items'));
    console.log(items);
      items.forEach(function(item, index){
        if(id === item.id){
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
   },

   clearItemsFromStorage: () => {
    localStorage.removeItem('items');
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
        name: document.querySelector(UISelectors.itemNameInput).value
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
    // items : [
      // {name: 'Moi Moi', calories: 1200, fat: 30, carbohydrates: 20, protein: 100},
      // {name: 'Akara', calories: 1000, fat: 20, carbohydrates: 30, protein: 70}
    // ],
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