import { ApiClient } from '@ems/api-client';
import { getAccessToken } from './authToken';

/** Android emulator reaches the host at 10.0.2.2; iOS simulator uses localhost.
 *  TODO(config): source from react-native-config per build. */
const API_URL = 'http://localhost:4000';

export const api = new ApiClient({
  baseUrl: API_URL,
  getAccessToken: () => getAccessToken(),
});
