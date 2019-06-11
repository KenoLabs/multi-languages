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

namespace Multilang\Core\Utils;

use Espo\Core\Utils\Util;
use Treo\Core\Utils\FieldManager as TreoFieldManager;

/**
 * FieldManager util
 *
 * @author r.ratsun <r.ratsun@zinitsolutions.com>
 */
class FieldManager extends TreoFieldManager
{
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
        $fieldType = $this->getMetadata()->get('entityDefs.' . $scope . '.fields.' . $name . '.type');

        // prepare result
        $result = parent::getAttributeListByType($scope, $name, $type);

        // for multilang fields
        if (in_array($fieldType, $this->getMultilangFields()) && !empty($defs = $this->getMFieldDefs($fieldType))) {
            $result = [$name];
            if (isset($defs[$type . 'Fields'])) {
                foreach ($defs[$type . 'Fields'] as $locale) {
                    $result[] = Util::toCamelCase($name . '_' . $locale);
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
        $defs = $this->getMetadata()->get('fields.' . $fieldType);
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
        return $this->getMetadata()->get('multilang.multilangFields');
    }
}
