import {RestCalls} from '../support/rest';
import {config} from '../bootstrap';

const rest = new RestCalls(config.host, config.port);

/**
 * Reusable test steps for authentication.
 */
export default class AuthHelper {
    public KNOWN_IDENTITIES = {
        'jenscatering_identity_1': 'PUBLIC_IDENTIFIER:ABN:jenscatering_identity_1',
        'jennifermaxims_identity_1': 'LINK_ID:MY_GOV:jennifermaxims_identity_1'
    };

    public logIn = (identity:string) => {
        rest.setHeader('X-RAM-Identity-IdValue', identity);

        // return rest.promisify(rest.post(`/v1/simulators/authenticator/authenticate`, {credentials: identity})).then(response => {
        //     return response;
        // });
    };
}

