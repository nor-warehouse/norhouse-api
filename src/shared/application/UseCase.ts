export interface UseCase<Request = any, Response = any> {
  execute(request?: Request): Promise<Response> | Response;
}
