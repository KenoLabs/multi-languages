/*
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

Espo.define('multilang:views/admin/field-manager/edit', 'class-replace!multilang:views/admin/field-manager/edit',
    Dep => Dep.extend({

        data() {
            const data = Espo.Utils.cloneDeep(Dep.prototype.data.call(this));

            data.hasDynamicLogicPanel = !this.defs.hideMultilang;
            data.paramList = data.paramList.filter(item => !this.getPreventedFields().includes(item.name));

            return data;
        },

        createFieldView(type, name, readOnly, params, options, callback) {
            if (!this.getPreventedFields().includes(name)) {
                Dep.prototype.createFieldView.call(this, type, name, readOnly, params, options, callback)
            }
        },

        getPreventedFields() {
            const fields = [];
            if (this.defs.hideMultilang) {
                fields.push('readOnly', 'required');

                if (['enum', 'multiEnum'].includes(this.model.get('type'))) {
                    fields.push('default', 'fontSize', 'isSorted');
                }
            }

            return fields;
        },

        updateLanguage() {
            Dep.prototype.updateLanguage.call(this);

            const langData = this.getLanguage().data;
            if (this.scope in langData && this.model.get('isMultilang')) {
                ['', ...(this.getConfig().get('inputLanguageList') || [])].forEach(lang => {
                    const suffix = lang.split('_').reduce((prev, curr) => prev + Espo.Utils.upperCaseFirst(curr.toLowerCase()), '');
                    const translatesKey = `translatedOptions${suffix}`;
                    const nameKey = `${this.model.get('name')}${suffix}`;

                    if (['array', 'enum', 'multiEnum'].includes(this.model.get('type')) && this.model.get(translatesKey)) {
                        langData[this.scope].options = langData[this.scope].options || {};
                        langData[this.scope]['options'][nameKey] = this.model.get(translatesKey) || {};
                    }
                });
            }
        }

    })
);
