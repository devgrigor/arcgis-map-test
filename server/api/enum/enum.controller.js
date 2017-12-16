'use strict';
import config from '../../config/environment';
const enums = config.shared;

/**
 * @api {get} /enums/ Get all enums
 * @apiName getEnum
 * @apiGroup Enum
 *
 *
 * @apiPermission any
 */
export function index(req, res) {
    res.status(200).json(enums);

}

export default enums;
