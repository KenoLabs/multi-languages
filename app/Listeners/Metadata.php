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

namespace Multilang\Listeners;

use Treo\Listeners\AbstractListener;
use Treo\Core\EventManager\Event;
use Treo\Core\Utils\Util;

/**
 * Class Metadata
 *
 * @author r.ratsun@treolabs.com
 */
class Metadata extends AbstractListener
{
    /**
     * Modify
     *
     * @param Event $event
     */
    public function modify(Event $event)
    {
        // is multi-lang activated
        if (empty($this->getConfig()->get('isMultilangActive'))) {
            return false;
        }

        // get locales
        if (empty($locales = $this->getConfig()->get('inputLanguageList', []))) {
            return false;
        }

        // get data
        $data = $event->getArgument('data');

        /**
         * Set multi-lang params to few fields
         */
        $fields = ['bool', 'enum', 'multiEnum', 'text', 'varchar', 'wysiwyg'];
        foreach ($fields as $field) {
            $data['fields'][$field]['params'][] = [
                'name'    => 'isMultilang',
                'type'    => 'bool',
                'tooltip' => true
            ];
        }

        /**
         * Set multi-lang fields to entity defs
         */
        foreach ($data['entityDefs'] as $scope => $rows) {
            if (!isset($rows['fields']) || !is_array($rows['fields'])) {
                continue 1;
            }
            foreach ($rows['fields'] as $field => $params) {
                if (!empty($params['isMultilang'])) {
                    foreach ($locales as $locale) {
                        // prepare multi-lang field
                        $mField = $field . ucfirst(Util::toCamelCase(strtolower($locale)));

                        // prepare params
                        $mParams = $params;
                        if (isset($data['entityDefs'][$scope]['fields'][$mField])) {
                            if (in_array($mParams['type'], ['enum', 'multiEnum'])) {
                                $data['entityDefs'][$scope]['fields'][$mField]['options'] = $mParams['options'];
                                if (isset($mParams['optionColors'])) {
                                    $data['entityDefs'][$scope]['fields'][$mField]['optionColors'] = $mParams['optionColors'];
                                }
                            }
                            $mParams = array_merge($mParams, $data['entityDefs'][$scope]['fields'][$mField]);
                        }
                        $mParams['isMultilang'] = false;
                        $mParams['hideMultilang'] = true;
                        $mParams['multilangField'] = $field;
                        $mParams['isCustom'] = false;
                        $mParams['required'] = (in_array($mParams['type'], ['enum', 'multiEnum'])) ? false : $mParams['required'];
                        $mParams['readOnly'] = in_array($mParams['type'], ['enum', 'multiEnum']);

                        $data['entityDefs'][$scope]['fields'][$mField] = $mParams;
                    }
                }
            }
        }

        // set data
        $event->setArgument('data', $data);
    }
}
