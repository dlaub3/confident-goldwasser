export const UUIDv4_URL = "https://www.uuidgenerator.net/api/version4";

const client: Client = {
  get: (input, init) => fetch(input, init),
};

export interface Client {
  get: (
    input: RequestInfo,
    init?: RequestInit | undefined,
  ) => Promise<Response>;
}

export interface HttpEnv {
  client: Client;
}

export const env: HttpEnv = {
  client,
};
