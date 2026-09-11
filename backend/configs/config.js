import dbConfig from '#configs/db.config';
import jwtConfig from '#configs/jwt.config';

import { UserConstraints } from '@project/shared/user.js';

const config = Object.freeze({
    // User
    MIN_NAME_LENGTH: UserConstraints.name.min,
    MAX_NAME_LENGTH: UserConstraints.name.max,
    MIN_PASSWORD_LENGTH: UserConstraints.password.min,
    MAX_PASSWORD_LENGTH: UserConstraints.password.max,

    // JWT configuration
    jwt: jwtConfig,

    db : dbConfig
});

export default Object.freeze(config);