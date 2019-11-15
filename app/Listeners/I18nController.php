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
 * Class I18nController
 *
 * @author r.ratsun <r.ratsun@treolabs.com>
 */
class I18nController extends AbstractListener
{
    /**
     * @param Event $event
     */
    public function afterActionRead(Event $event)
    {
        if (empty($this->getConfig()->get('isMultilangActive'))) {
            return false;
        }

        // get locales
        if (empty($locales = $this->getConfig()->get('inputLanguageList', []))) {
            return false;
        }

        // get result
        $result = $event->getArgument('result');

        // get entity defs
        $entityDefs = $this->getContainer()->get('metadata')->get('entityDefs');

        foreach ($entityDefs as $scope => $data) {
            if (!isset($data['fields']) || !is_array($data['fields'])) {
                continue 1;
            }
            foreach ($data['fields'] as $field => $params) {
                if (!empty($params['isMultilang'])) {
                    if (isset($result[$scope]['fields'][$field])) {
                        $value = $result[$scope]['fields'][$field];
                    } elseif (isset($result['Global']['fields'][$field])) {
                        $value = $result['Global']['fields'][$field];
                    } else {
                        continue 1;
                    }
                    foreach ($locales as $locale) {
                        $multilangField = $field . ucfirst(Util::toCamelCase(strtolower($locale)));
                        $result[$scope]['fields'][$multilangField] = $value . ' (' . $locale . ')';
                    }
                }
            }
        }
        $event->setArgument('result', $result);
    }
}