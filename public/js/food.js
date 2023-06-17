import axios from "axios";
import Swal from 'sweetalert2'


const foodList = document.getElementById('foodList');

export const getFoodName = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:5000/api/v1/foods',
    })
    
    // console.log(res.data.data.foodItem);
    if (res.data.status === 'success') {
      return res.data.data.foodItem;
    }

  } catch (error) {
    console.log(error);
  }
}
