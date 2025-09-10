import RequestInput from '../interfaces/RequestInput';
declare function makeAuthorizedPostRequest(
  endpoint: string,
  audience: string,
  data: RequestInput
): Promise<Response>;
export default makeAuthorizedPostRequest;
