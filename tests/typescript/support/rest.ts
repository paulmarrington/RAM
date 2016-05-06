/// <reference path="../../typings/main.d.ts" />

import * as agent  from 'superagent';

export class RestCalls {
  private server: string;
  private urlPrefix: string = '/api/v1/';

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