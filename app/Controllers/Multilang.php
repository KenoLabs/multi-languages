<?php
/**
 * Multilang
 * Free Extension
 * Copyright (c) TreoLabs GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
 */

declare(strict_types=1);

namespace Multilang\Controllers;

use Espo\Core\Controllers\Base;
use Espo\Core\Exceptions\BadRequest;
use Treo\Core\Slim\Http\Request;

/**
 * Class Multilang
 *
 * @author r.ratsun <r.ratsun@treolabs.com>
 */
class Multilang extends Base
{
    /**
     * @ApiDescription(description="Update layouts")
     * @ApiMethod(type="POST")
     * @ApiRoute(name="/Multilang/action/updateLayouts")
     * @ApiReturn(sample="'bool'")
     *
     * @param array   $params
     * @param array   $data
     * @param Request $request
     *
     * @return bool
     * @throws BadRequest
     */
    public function actionUpdateLayouts($params, $data, $request)
    {
        if (!$request->isPost()) {
            throw new BadRequest();
        }

        return $this->getService('Multilang')->updateLayouts();
    }
}
