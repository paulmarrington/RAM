import * as http  from 'http';
import * as agent  from 'superagent';

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

  private buildPath(postfix: string) {
    return this.server + this.urlPrefix + postfix;
  }

  public get = <T>(api: string) =>
    agent.get(this.buildPath(api));

  public post = <T, B>(api: string, body: B) =>
    agent.post(this.buildPath(api)).send(body);

  public put = <T, B>(api: string, body: B) =>
    agent.put(this.buildPath(api)).send(body);

  public delete = <T>(api: string) =>
    agent.delete(this.buildPath(api));

  public promisify(request: agent.SuperAgentRequest): Promise<agent.Response> {
    return new Promise((resolver, reject) =>
      request.end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolver(res);
        }
      }));
  }
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

