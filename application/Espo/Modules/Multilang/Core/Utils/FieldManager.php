<?php
/**
 * Multilang
 * Free Extension
 * Copyright (c) Zinit Solutions GmbH
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

namespace Espo\Modules\Multilang\Core\Utils;

use Espo\Modules\TreoCrm\Core\Utils\FieldManager as TreoFieldManager;
use Espo\Core\Utils\Util;

/**
 * FieldManager util
 *
 * @author r.ratsun <r.ratsun@zinitsolutions.com>
 */
class FieldManager extends TreoFieldManager
{
    /**
     * @var array
     */
    protected $multilangConfig = null;

    /**
     * Get attribute list by type
     *
     * @param string $scope
     * @param string $name
     * @param string $type
     *
     * @return array
     */
    protected function getAttributeListByType(string $scope, string $name, string $type): array
    {
        // get field type
        $fieldType = $this->getMetadata()->get('entityDefs.'.$scope.'.fields.'.$name.'.type');

        // prepare result
        $result = parent::getAttributeListByType($scope, $name, $type);

        // for multilang fields
        if (in_array($fieldType, $this->getMultilangFields()) && !empty($defs = $this->getMFieldDefs($fieldType))) {
            $result = [$name];
            if (isset($defs[$type.'Fields'])) {
                foreach ($defs[$type.'Fields'] as $locale) {
                    $result[] = Util::toCamelCase($name.'_'.$locale);
                }
            }
        }

        return !empty($result) ? $result : [];
    }

    /**
     * Get field defs
     *
     * @param string $fieldType
     *
     * @return array
     */
    protected function getMFieldDefs(string $fieldType): array
    {
        $defs = $this->getMetadata()->get('fields.'.$fieldType);
        if (is_object($defs)) {
            $defs = get_object_vars($defs);
        }

        return !empty($defs) ? $defs : [];
    }

    /**
     * Get multilang fields
     *
     * @return array
     */
    protected function getMultilangFields(): array
    {
        // get config
        $config = $this->getMultilangConfig();

        return (!empty($config['multilangFields'])) ? array_keys($config['multilangFields']) : [];
    }

    /**
     * Get multilang config
     *
     * @return array
     */
    protected function getMultilangConfig(): array
    {
        if (is_null($this->multilangConfig)) {
            $this->multilangConfig = include 'application/Espo/Modules/Multilang/Configs/ModuleConfig.php';
        }

        return $this->multilangConfig;
    }
}
