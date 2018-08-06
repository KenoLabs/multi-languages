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

namespace Espo\Modules\Multilang\Configs;

return [
    'Multilang'       => [
        'languageList' => [
            'af_ZA',
            'az_AZ',
            'be_BY',
            'bg_BG',
            'bn_IN',
            'bs_BA',
            'ca_ES',
            'cs_CZ',
            'cy_GB',
            'da_DK',
            'de_DE',
            'el_GR',
            'en_GB',
            'es_MX',
            'en_US',
            'es_ES',
            'et_EE',
            'eu_ES',
            'fa_IR',
            'fi_FI',
            'fo_FO',
            'fr_CA',
            'fr_FR',
            'ga_IE',
            'gl_ES',
            'gn_PY',
            'he_IL',
            'hi_IN',
            'hr_HR',
            'hu_HU',
            'hy_AM',
            'id_ID',
            'is_IS',
            'it_IT',
            'ja_JP',
            'ka_GE',
            'km_KH',
            'ko_KR',
            'ku_TR',
            'lt_LT',
            'lv_LV',
            'mk_MK',
            'ml_IN',
            'ms_MY',
            'nb_NO',
            'nn_NO',
            'ne_NP',
            'nl_NL',
            'pa_IN',
            'pl_PL',
            'ps_AF',
            'pt_BR',
            'pt_PT',
            'ro_RO',
            'ru_RU',
            'sk_SK',
            'sl_SI',
            'sq_AL',
            'sr_RS',
            'sv_SE',
            'sw_KE',
            'ta_IN',
            'te_IN',
            'th_TH',
            'tl_PH',
            'tr_TR',
            'uk_UA',
            'ur_PK',
            'vi_VN',
            'zh_CN',
            'zh_HK',
            'zh_TW',
        ]
    ],
    'multilangFields' => [
        'varcharMultiLang'   => [
            'fieldType' => 'varchar'
        ],
        'textMultiLang'      => [
            'fieldType' => 'text'
        ],
        'enumMultiLang'      => [
            'fieldType' => 'enum'
        ],
        'multiEnumMultiLang' => [
            'fieldType' => 'multiEnum'
        ],
        'arrayMultiLang'     => [
            'fieldType' => 'array'
        ]
    ]
];
