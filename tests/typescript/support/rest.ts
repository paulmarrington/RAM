import * as http  from 'http';
import * as supertest from 'supertest';
const options = (method: string, api: string) => {
  return {
    method: method,
    host: 'localhost',
    port: 3000,
    path: '/api/1/' + api,
    headers: {}
  };
};

const request = (method: string, api: string, body?: {}) => {
  const opts = options(method, api);
  const body_as_json = body ? JSON.stringify(body) : '';
  if (body) {
    opts.headers = {
      'Content-Type': 'application/json',
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
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });


export class RestCalls {
  private server: string;
  private urlPrefix: string = '/api/1/';

  constructor(private serverAddress: string, private serverPort: number) {
    this.server = `${this.serverAddress}:${this.serverPort}`;
  }

  public get = <T>(api: string) =>
    supertest(this.server).get(this.urlPrefix + api);

  public post = <T, B>(api: string, body: B) =>
    supertest(this.server).post(this.urlPrefix + api).send(body);

  public put = <T, B>(api: string, body: B) =>
    supertest(this.server).put(this.urlPrefix + api).send(body);

  public delete = <T>(api: string) =>
    supertest(this.server).delete(this.urlPrefix + api);

}

//   public static request<T>(method: string, api: string, body?: {}): Promise<T> {
//     const opts = options(method, api);
//     const body_as_json = body ? JSON.stringify(body) : '';
//     if (body) {
//       opts.headers = {
//         'Content-Type': 'application/json',
//         'Content-Length': body_as_json.length
//       };
//     }
//     return new Promise((resolve, reject) => {
//       const data = [];
//       const getter = http.request(opts, (response) => {
//         if (response.statusCode !== 200) {
//           return reject(response.statusMessage);
//         }
//         response.on('data', (chunk) => data.push(chunk));
//         response.on('end', () => {
//           const response = JSON.parse(data.join(''));
//           resolve(response.data ? response.data : response);
//         });
//       });
//       getter.end(body_as_json);
//       getter.on('error', (err) => reject(err));
//     });
//   }
//   public static get<T>(api: string) {
//     return RestCalls.request<T>('GET', api);
//   }

//   public static post<T>(api: string, body: {}) {
//     return RestCalls.request<T>('POST', api, body);
//   }
//   public static put<T>(api: string, body: {}) {
//     return RestCalls.request<T>('PUT', api, body);
//   }
//   public static deleter<T>(api: string) {
//     return RestCalls.request<T>('DELETE', api);
//   }
//   public static uuid = () =>
//     'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
//       const r = Math.random() * 16 | 0;
//       const v = c === 'x' ? r : (r & 0x3 | 0x8);
//       return v.toString(16);
//     });
// }

