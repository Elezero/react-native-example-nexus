import axios from 'axios';

// export const VendeYaImagePath = 'https://image.tmdb.org/t/p/w500';

export default axios.create({
  baseURL: 'http://192.168.1.90:81/OfflineSync',
  headers: {
    Autorization: '',
  },
});
