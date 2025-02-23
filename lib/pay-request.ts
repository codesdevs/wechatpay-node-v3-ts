import { Output } from './interface-v2';
import { IPayRequest } from './pay-request.interface';
import request from 'superagent';

export class PayRequest implements IPayRequest {
  get name() {
    return 'default';
  }

  async post(url: string, params: Record<string, any>, headers: Record<string, any>): Promise<Output> {
    try {
      const result = await request
        .post(url)
        .send(params)
        .set(headers);
      return {
        status: result.status,
        data: result.body,
      };
    } catch (error) {
      const err = JSON.parse(JSON.stringify(error));
      return {
        status: err.status as number,
        errRaw: err,
        error: err?.response?.text,
      };
    }
  }

  async get(url: string, headers: Record<string, any>): Promise<Output> {
    try {
      const result = await request.get(url).set(headers);

      let data: any = {};
      if (result.type === 'text/plain') {
        data = {
          status: result.status,
          data: result.text,
        };
      } else {
        data = {
          status: result.status,
          data: result.body,
        };
      }

      return data;
    } catch (error) {
      const err = JSON.parse(JSON.stringify(error));
      return {
        status: err.status,
        errRaw: err,
        error: err?.response?.text,
      };
    }
  }
}
