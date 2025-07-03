export interface ResponseInterface<T = any> {
  storeProcedure: string;
  data: T;
}
