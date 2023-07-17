import axios from 'axios';
import Swal from 'sweetalert2';

export const getFoodName = async (foodItem) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/foods/${foodItem}`,
    });

    if (res.data.status === 'success') {
      return res.data.data.foodItem;
    }
  } catch (err) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: 'error',
      title: err.response.data.message,
    });
  }
};
