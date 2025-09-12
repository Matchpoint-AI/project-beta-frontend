import RequestInput from '../interfaces/RequestInput';

// The function to make an authorized POST request
async function makeAuthorizedPostRequest(
  endpoint: string,
  _audience: string,
  data: RequestInput
): Promise<Response> {
  // Prepare the headers
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'Bearer YOUR_ACTUAL_TOKEN'); // Replace with your actual token

  // Convert the data to JSON
  const body = JSON.stringify(data);

  // Make the fetch request
  const response = await fetch(endpoint, {
    method: 'POST',
    mode: 'no-cors', // Note: 'no-cors' mode should be used carefully
    headers: headers,
    body: body,
  });

  return response;
}

export default makeAuthorizedPostRequest;
