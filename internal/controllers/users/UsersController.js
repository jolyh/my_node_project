import { AppError, errorTypes } from '../../errors/AppError.js';
import User from '../../models/users/user.js';

class UsersController {

    constructor(userService) {
        if (!userService) throw new AppError(
            errorTypes.INTERNAL_ERRORS.CONTROLLER_MISSING_REQUIRED_SERVICE,
            "UsersController requires a userService"
        );
        this.userService = userService;
    }

    async list(req, res) {
        const users = await this.userService.listUsers(req.currentUser);
        res.status(200).json({ users: users.map(User.sanitize) });
    }

}

export default UsersController;