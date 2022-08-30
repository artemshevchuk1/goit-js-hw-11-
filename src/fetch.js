import axios from 'axios';
const KEY =  '29436484-c6ad55a4fc43be985da26569b'
const BASE_URL = 'https://pixabay.com/api/';

async function fetchImages(query, page, perPage) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );

    return response;
  } catch (error) {
    console.log(error);
  }
}

export { fetchImages }