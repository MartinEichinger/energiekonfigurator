import axios from 'axios';

const debug = true;

export async function getData(url, method) {
  const response = axios.request({ url: url, method: method }); //await

  let res = (await response).data;

  if (debug) console.log('api: ', res);
  return res;
}
