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

namespace Espo\Modules\Multilang\Listeners;

use Espo\Modules\TreoCore\Listeners\AbstractListener;
use Espo\Core\Utils\Json;

/**
 * Settings listener
 *
 * @author r.ratsun <r.ratsun@zinitsolutions.com>
 */
class Settings extends AbstractListener
{

    /**
     * Before update
     *
     * @param array $data
     *
     * @return void
     */
    public function afterActionUpdate(array $data): void
    {
        // regenerate multilang fields
        if (isset($data['data']->inputLanguageList) || !empty($data['data']->isMultilangActive)) {
            $this->getContainer()->get('dataManager')->rebuild();
        }
    }
}
