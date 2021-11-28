export const UUIDv4_URL = "https://www.uuidgenerator.net/api/version4";

const client = {
  get: (url: string) => fetch(url),
};

export interface Client {
  get: (url: string) => Promise<Response>;
}

export interface HttpEnv {
  client: Client;
}

export const env: HttpEnv = {
  client,
};
