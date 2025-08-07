export interface Event<T = any> {
  event: string;
  data: T;
}