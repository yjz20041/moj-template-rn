import Fetch, { setProxyConfig } from '@music/mosi-rn-util/es/fetch';
import { proxyConfig } from '@config/app.config';

setProxyConfig(proxyConfig);

export default Fetch;
