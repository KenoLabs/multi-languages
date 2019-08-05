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

declare(strict_types = 1);

namespace Multilang\Services;

use Revisions\Services\RevisionField as ParentRevisionField;
use Espo\ORM\EntityCollection;
use Espo\Core\Utils\Util;
use Espo\Core\Utils\Json;
use Slim\Http\Request;

/**
 * RevisionField service
 *
 * @author r.ratsun <r.ratsun@zinitsolutions.com>
 */
class RevisionField extends ParentRevisionField
{
    /**
     * @var array
     */
    protected $dependencies = [
        'config',
        'entityManager',
        'user',
        'metadata',
    ];

    /**
     * Prepare data
     *
     * @param array $params
     * @param EntityCollection $notes
     * @param Request $request
     *
     * @return array
     */
    protected function prepareData(array $params, EntityCollection $notes, Request $request): array
    {
        // prepare result
        $result = [
            'total' => 0,
            'list'  => []
        ];

        // prepare params
        $max    = (int) $request->get('maxSize');
        $offset = (int) $request->get('offset');
        if (empty($max)) {
            $max = $this->maxSize;
        }

        // get field type
        $fieldType = $this
            ->getInjection('metadata')
            ->get('entityDefs.'.$params['entity'].'.fields.'.$params['field'].'.type');

        if ($this->getConfig()->get('isMultilangActive')
            && in_array($fieldType, array_keys($this->getMultilangFields()))) {
            foreach ($notes as $note) {
                // prepare data
                $data = Json::decode(Json::encode($note->get('data')), true);

                // prepare list
                if (isset($data['fields']) && in_array($params['field'], $data['fields'])) {
                    $was       = $data['attributes']['was'][$params['field']];
                    $became    = $data['attributes']['became'][$params['field']];

                    if ($max > count($result['list']) && $result['total'] >= $offset && $was != $became) {
                        $result['list'][] = [
                            "id"       => $note->get('id'),
                            "date"     => $note->get('createdAt'),
                            "userId"   => $note->get('createdById'),
                            "userName" => $note->get('createdBy')->get('name'),
                            "locale"   => '',
                            "was"      => $data['attributes']['was'][$params['field']],
                            "became"   => $data['attributes']['became'][$params['field']],
                            "field"    => $params['field']
                        ];
                    }
                    $result['total'] = $result['total'] + 1;

                    foreach ($this->getConfig()->get('inputLanguageList') as $locale) {
                        // prepare data
                        $fieldName = Util::toCamelCase($params['field'].'_'.strtolower($locale));
                        $was       = $data['attributes']['was'][$fieldName];
                        $became    = $data['attributes']['became'][$fieldName];

                        if ($was != $became) {
                            if ($max > count($result['list']) && $result['total'] >= $offset) {
                                $result['list'][] = [
                                    "id"       => $note->get('id').$locale,
                                    "date"     => $note->get('createdAt'),
                                    "userId"   => $note->get('createdById'),
                                    "userName" => $note->get('createdBy')->get('name'),
                                    "locale"   => $locale,
                                    "was"      => $data['attributes']['was'][$fieldName],
                                    "became"   => $data['attributes']['became'][$fieldName],
                                    "field"    => $fieldName
                                ];
                            }
                            $result['total'] = $result['total'] + 1;
                        }
                    }
                }
            }
        } else {
            $result = parent::prepareData($params, $notes, $request);
        }

        return $result;
    }

    /**
     * Get multilang fields
     *
     * @return array
     */
    protected function getMultilangFields(): array
    {
        return $this->getInjection('metadata')->get('multilang.multilangFields');
    }
}
