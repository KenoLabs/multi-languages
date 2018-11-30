/*
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

Espo.define('multilang:views/record/list', 'class-replace!multilang:views/record/list', function (Dep) {

    return Dep.extend({

        fetchAttributeListFromLayout() {
            let list = [];
            this.listLayout.forEach(item => {
                if (!item.name) return;
                let field = item.name;
                let fieldType = this.getMetadata().get(['entityDefs', this.scope, 'fields', field, 'type']);
                if (!fieldType) return;
                let isMultiLang = this.getMetadata().get(['entityDefs', this.scope, 'fields', field, 'isMultilang']);
                if (isMultiLang) {
                    list.push(field);
                    (this.getConfig().get('inputLanguageList') || []).forEach(lang => {
                        list.push(lang.split('_').reduce((prev, curr) => prev + Espo.Utils.upperCaseFirst(curr.toLowerCase()), field));
                    });
                } else {
                    this.getFieldManager().getAttributeList(fieldType, field).forEach(attribute => {
                        list.push(attribute);
                    });
                }
            });
            return list;
        },
    });
});
