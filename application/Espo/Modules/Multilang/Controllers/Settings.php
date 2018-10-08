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

declare(strict_types=1);

namespace Espo\Modules\Multilang\Controllers;

/**
 * Controller Settings
 *
 * @author r.ratsun <r.ratsun@zinitsolutions.com>
 */
class Settings extends \Treo\Controllers\Settings
{
    /**
     * @inheritdoc
     */
    protected function prepareTabList(array $config): array
    {
        // get config
        $config = parent::prepareTabList($config);

        if (!empty($config['twoLevelTabList'])) {
            $newTabList = [];
            foreach ($config['twoLevelTabList'] as $item) {
                if (is_string($item)) {
                    if ($this->getMetadata()->get("scopes.$item.tab")) {
                        $newTabList[] = $item;
                    }
                } else {
                    if (!empty($item->items)) {
                        $newSubItems = [];
                        foreach ($item->items as $subItem) {
                            if ($this->getMetadata()->get("scopes.$subItem.tab")) {
                                $newSubItems[] = $subItem;
                            }
                        }
                        $item->items = $newSubItems;
                    }
                    $newTabList[] = $item;
                }
            }
            $config['twoLevelTabList'] = $newTabList;
        }

        return $config;
    }
}
