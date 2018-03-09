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

namespace Espo\Modules\Multilang\Listeners;

use Espo\Modules\TreoCrm\Listeners\AbstractListener;
use Espo\Core\Utils\Json;

/**
 * SettingsController listener
 *
 * @author r.ratsun <r.ratsun@zinitsolutions.com>
 */
class SettingsController extends AbstractListener
{

    /**
     * Before update
     *
     * @param array $data
     *
     * @return void
     */
    public function afterUpdate(array $data): void
    {
        // regenerate multilang fields
        $data = Json::decode(Json::encode($data), true);
        if (isset($data['data']['inputLanguageList']) || $data['data']['isMultilangActive']) {
            $this->getContainer()->get('dataManager')->rebuild();
        }
    }
}
