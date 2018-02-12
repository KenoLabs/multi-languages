<?php
declare(strict_types = 1);

namespace Espo\Modules\Multilang\Configs;

return [
    'multilangFields' => [
        "varcharMultiLang" => [
            "fieldType" => "varchar"
        ],
        "textMultiLang" => [
            "fieldType" => "text"
        ],
        "enumMultiLang" => [
            "fieldType" => "enum"
        ],
        "multiEnumMultiLang" => [
            "fieldType" => "multiEnum"
        ],
        "arrayMultiLang" => [
            "fieldType" => "array"
        ]
    ]
];
