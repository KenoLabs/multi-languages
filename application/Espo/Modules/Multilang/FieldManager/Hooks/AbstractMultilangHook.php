<?php
/**
 * Multilang Free Extension Copyright (c) Zinit Solutions GmbH
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

declare(strict_types = 1);

namespace Espo\Modules\Multilang\FieldManager\Hooks;

use Espo\Core\Utils\FieldManager\Hooks\Base;

/**
 * Class AbstractMultilangHook
 *
 * @author y.haiduchyk <y.haiduchyk@zinitsolutions.com>
 */
abstract class AbstractMultilangHook extends Base
{

    /**
     * Modified fieldsDefs
     *
     * @var array
     */
    protected $modifedFieldsDefs;

    /**
     * Replace defs on modifedFieldsDefs defs
     *
     * @param string $scope
     * @param string $name
     * @param array  $defs
     * @param array  $options
     */
    public function beforeSave(string $scope, string $name, array &$defs, array $options)
    {
        $defs = array_merge($defs, $this->modifedFieldsDefs, ['isMultilang' => true]);
    }
}
