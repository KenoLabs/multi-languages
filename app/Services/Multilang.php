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

namespace Multilang\Services;

use Espo\Core\Utils\Json;
use Treo\Core\Utils\Layout;
use Treo\Core\Utils\Metadata;
use Treo\Services\AbstractService;

/**
 * Class Multilang
 *
 * @author r.ratsun <r.ratsun@treolabs.com>
 */
class Multilang extends AbstractService
{
    /**
     * @return bool
     */
    public function updateLayouts(): bool
    {
        // exit is multi-lang inactive
        if (!$this->getConfig()->get('isMultilangActive', false)) {
            return false;
        }

        /** @var bool $isUpdated */
        $isUpdated = false;

        foreach ($this->getMetadata()->get(['entityDefs'], []) as $scope => $data) {
            if (!isset($data['fields'])) {
                continue 1;
            }
            foreach ($data['fields'] as $field => $row) {
                if (!empty($row['multilangLocale'])) {
                    foreach (['detail', 'detailSmall'] as $layoutName) {
                        if (!in_array($field, $this->getLayoutFields($scope, $layoutName))) {
                            $this->updateLayout($scope, $layoutName, $field);
                            $isUpdated = true;
                        }
                    }
                }
            }
        }

        if ($isUpdated) {
            $this->getLayout()->save();
        }

        return true;
    }

    /**
     * @param string $scope
     * @param string $layout
     * @param string $field
     *
     * @return bool
     */
    protected function updateLayout(string $scope, string $layout, string $field): bool
    {
        $data = Json::decode($this->getLayout()->get($scope, $layout), true);
        $data[0]['rows'][] = [['name' => $field], false];

        $this->getLayout()->set($data, $scope, $layout);

        return true;
    }

    /**
     * @param string $scope
     * @param string $layout
     *
     * @return array
     */
    protected function getLayoutFields(string $scope, string $layout): array
    {
        $fields = [];
        foreach (Json::decode($this->getLayout()->get($scope, $layout), true) as $row) {
            foreach ($row['rows'] as $item) {
                foreach ($item as $v) {
                    if (isset($v['name'])) {
                        $fields[] = $v['name'];
                    }
                }
            }
        }

        return $fields;
    }

    /**
     * @return Layout
     */
    protected function getLayout(): Layout
    {
        return $this->getContainer()->get('layout');
    }

    /**
     * @return Metadata
     */
    protected function getMetadata(): Metadata
    {
        return $this->getContainer()->get('metadata');
    }
}
