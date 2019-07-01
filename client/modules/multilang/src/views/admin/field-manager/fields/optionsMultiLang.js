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

Espo.define('multilang:views/admin/field-manager/fields/optionsMultiLang', 'views/admin/field-manager/fields/options',
    Dep => Dep.extend({

        editTemplate: 'multilang:admin/field-manager/fields/optionMultilang/edit',

        setup() {
            Dep.prototype.setup.call(this);

            this.translatedOptions = {};
            var list = this.model.get(this.name) || [];
            list.forEach(function (value) {
                this.translatedOptions[value] = this.translateMultilangOption(value, this.name, this.options.field, this.options.scope);
            }, this);
            this.on('addValueToOptions', (value) => {
                this.addValue(value);
            });
            this.on('removeValueFromOptions', (value) => {
                this.removeValue(value);
            });
        },

        fetch() {
            let data = Dep.prototype.fetch.call(this) || {};

            data.translatedOptions = {};
            data.translatedOptions[this.name] = {};
            (data[this.name] || []).forEach(value => {
                let valueSanitized = this.getHelper().stripTags(value);
                let valueInternal = valueSanitized.replace(/"/g, '-quote-').replace(/\\/g, '-backslash-');
                let translatedValue = this.$el.find('input[name="translatedValue"][data-value="'+valueInternal+'"]').val() || value;
                data.translatedOptions[this.name][value] = translatedValue.toString();
            });

            //Check if exists other options and add it
            if (typeof this.model.attributes.translatedOptions === 'object') {
                for (var key in this.model.attributes.translatedOptions) {
                    if (typeof data.translatedOptions[key] !== 'object') {
                        data.translatedOptions[key] = this.model.attributes.translatedOptions[key];
                    }
                }
            }

            return data;
        },

        translateMultilangOption: function (value, category, field, scope) {
            var translation = this.getLanguage().translate(field, 'options', scope);
            if (typeof translation != 'object') {
                translation = {};
            }
            return translation[category][value] || value;
        },
    })
);