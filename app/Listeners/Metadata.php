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
use Espo\Core\Utils\Util;
use function foo\func;

/**
 * Class Metadata
 *
 * @author r.ratsun@treolabs.com
 */
class Metadata extends AbstractListener
{
    /**
     * All MultiLang fields
     *
     * @access protected
     * @var array
     */
    protected $fieldsMultiLang
        = [
            'textMultiLang'      => [
                'fieldType'        => 'text',
                'typeNestedFields' => 'text',
                'paramsDefault'    => false
            ],
            'varcharMultiLang'   => [
                'fieldType'        => 'varchar',
                'typeNestedFields' => 'varchar',
                'paramsDefault'    => false
            ],
            'enumMultiLang'      => [
                'typeNestedFields' => 'enum',
                'fieldType'        => 'enum',
                'isOptions'        => true,
                'paramsDefault'    => true
            ],
            'multiEnumMultiLang' => [
                'typeNestedFields' => 'multiEnum',
                'fieldType'        => 'multiEnum',
                'isOptions'        => true,
                'paramsDefault'    => true
            ],
            'arrayMultiLang'     => [
                'typeNestedFields' => 'array',
                'fieldType'        => 'array',
                'isOptions'        => true,
                'paramsDefault'    => true
            ],
            'wysiwygMultiLang'   => [
                'typeNestedFields' => 'wysiwyg',
                'fieldType'        => 'wysiwyg',
                'paramsDefault'    => false
            ]
        ];


    /**
     * Default field definitions for nested fields.
     *
     * @access protected
     * @var string
     */
    protected $multiLangFieldDefs
        = [
            'layoutListDisabled'       => true,
            'layoutDetailDisabled'     => true,
            'layoutFiltersDisabled'    => true,
            'layoutMassUpdateDisabled' => true,
            'customizationDisabled'    => true
        ];

    /**
     * Modify
     *
     * @param Event $event
     */
    public function modify(Event $event)
    {
        // get data
        $data = $event->getArgument('data');

        // get languages
        $languages = $this->getContainer()->get('config')->get('inputLanguageList') ?? [];

        // add get MultiLang metadata
        $multilangMetadata = $this->getMultiLangMetadata($languages);

        // load additional metadata for multilang fields
        foreach ($multilangMetadata as $fieldName => $fieldData) {
            if (isset($data['fields'][$fieldName])) {
                $data['fields'][$fieldName] = array_merge_recursive($data['fields'][$fieldName], $fieldData);
            }
        }

        // modify fields in entity to multilang type
        $data['entityDefs'] = $this->modifyEntityFieldsToMultilang($data['entityDefs'], $multilangMetadata);

        // set data
        $event->setArgument('data', $data);
    }

    /**
     * Change fields type to multilang type
     *
     * @param array $entityDefs
     * @param array $multilangMetadata
     *
     * @return array
     */
    protected function modifyEntityFieldsToMultilang(array $entityDefs, array $multilangMetadata): array
    {
        // get isMultilangActive param
        $isMultilangActive = $this->getContainer()->get('config')->get('isMultilangActive');

        // search multilang fields in entity
        foreach ($entityDefs as $entityName => $defs) {
            if (!empty($defs['fields']) && is_array($defs['fields'])) {
                foreach ($defs['fields'] as $fieldName => $feidsDefs) {
                    // check is a multilang field
                    if (isset($feidsDefs['isMultilang']) ?? false) {
                        $multilangType = $this->getMultilangTypeName($feidsDefs['type']);

                        if (isset($multilangType)) {
                            // change fields type  on type multilang
                            if ($isMultilangActive) {
                                $entityDefs[$entityName]['fields'][$fieldName]['type'] = $multilangType;
                            }

                            // load additional multilang fields to entity
                            foreach ($multilangMetadata[$multilangType]['fields'] as $lPrefix => $additionalData) {
                                $entityDefs[$entityName]['fields'] = array_merge(
                                    $entityDefs[$entityName]['fields'],
                                    [$fieldName . ucfirst(Util::toCamelCase($lPrefix)) => $additionalData]
                                );
                            }
                        }
                    }
                }
            }
        }

        return $entityDefs;
    }

    /**
     * Get multilang type name
     * (examle: $fieldType = 'text' - return 'textMultilang')
     *
     * @param string $fieldType
     *
     * @return null|string
     */
    protected function getMultilangTypeName(string $fieldType)
    {
        // find if exists multilang type
        foreach ($this->fieldsMultiLang as $multilangTypeName => $data) {
            // find if exists multilang type
            if ($data['fieldType'] === $fieldType) {
                return $multilangTypeName;
            }
        }
    }

    /**
     * Get Metadata for multiLang fields
     *
     * @param array $languages
     *
     * @access protected
     * @return array
     */
    protected function getMultiLangMetadata(array $languages = [])
    {
        $metadataFields = [];

        foreach ($this->fieldsMultiLang as $fields => $data) {
            $metadataFields[$fields]['actualFields'] = [''];
            $metadataFields[$fields]['fields'] = [];

            //Set data for all type multiLang fields
            foreach ($languages as $language) {
                $language = Util::toCamelCase(strtolower($language));
                $metadataFields[$fields]['actualFields'][] = $language;
                $metadataFields[$fields]['fields'][$language] = $this->multiLangFieldDefs;
                $metadataFields[$fields]['fields'][$language]['type'] = $data['typeNestedFields'];

                //If fields is enum and multiEnum - set options
                if ($data['isOptions'] ?? false) {
                    $metadataFields[$fields]['params'][] = $this->getOptionsMultiLang($language);
                }
            }
        }

        return $metadataFields;
    }

    /**
     * Get options for enum and multiEnum fields
     *
     * @param string $language
     *
     * @return array
     */
    protected function getOptionsMultiLang(string $language): array
    {
        $options = [];
        $options['name'] = 'options' . ucfirst($language);
        $options['type'] = 'array';
        $options['view'] = 'multilang:views/admin/field-manager/fields/optionsMultiLang';

        return $options;
    }
}
