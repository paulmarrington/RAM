import * as http  from 'http';

const options = (method: string, api: string) => {
  return {
    method:   method,
    host:     'localhost',
    port:     3000,
    path:     '/api/1/'+api ,
    headers:  {}
  };
};

const request = (method: string, api: string, body?: {}) => {
  const opts = options(method, api);
  const body_as_json = body ? JSON.stringify(body) : '';
  if (body) {
    opts.headers = {
      'Content-Type':   'application/json',
      'Content-Length': body_as_json.length
    };
  }
  return new Promise((resolve, reject) => {
    const data = [];
    const getter = http.request(opts, (response) => {
      if (response.statusCode !== 200) {
        return reject(response.statusMessage);
      }
      response.on('data', (chunk) => data.push(chunk));
      response.on('end', () => {
        const response = JSON.parse(data.join(''));
        resolve(response.data ? response.data : response);
      });
    });
    getter.end(body_as_json);
    getter.on('error', (err) => reject(err));
  });
};

export const get = (api: string) => request('GET', api);
export const post = (api: string, body: {}) => request('POST', api, body);
export const put = (api: string, body: {}) => request('PUT', api, body);
export const deleter = (api: string) => request('DELETE', api);
export const uuid = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });