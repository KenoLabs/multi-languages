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

Espo.define('multilang:views/fields/enum-multilang', ['views/fields/enum', 'multilang:views/fields/shared-multilang'],
    (Dep, SharedMultilang) => Dep.extend({

        listTemplate: 'multilang:fields/enum-multilang/list',

        editTemplate: 'multilang:fields/enum-multilang/edit',

        detailTemplate: 'multilang:fields/enum-multilang/detail',

        langFieldNameList: [],

        setup() {
            Dep.prototype.setup.call(this);

            let inputLanguageList = this.getConfig().get('isMultilangActive') ? this.getConfig().get('inputLanguageList') : [];
            this.langFieldNameList = Array.isArray(inputLanguageList) ? inputLanguageList.map(lang => this.getInputLangName(lang)) : [];

            if (this.model.isNew() && this.defs.params && this.defs.params.default) {
                let data = {};
                this.langFieldNameList.forEach(name => data[name] = this.defs.params.default, this);
                this.model.set(data);
            }
            SharedMultilang.prototype.addClickAndCaretToField.call(this);
        },

        data() {
            let data = Dep.prototype.data.call(this);
            data.valueList = this.langFieldNameList.map(name => {
                let value = this.model.get(name);
                return {
                    name: name,
                    params: {
                        options: this.model.getFieldParam(this.name, `options${name.replace(this.name, '')}`)
                    },
                    translatedOptions: (data.translatedOptions || {})[`options${name.replace(this.name, '')}`],
                    value: value,
                    isNotEmpty: value !== null && value !== '',
                    shortLang: name.slice(-4, -2).toLowerCase() + '_' + name.slice(-2).toUpperCase(),
                    customLabel: this.options.customLabel
                }
            }, this);
            data.translatedOptions = (data.translatedOptions || {})['options'];
            return data;
        },

        fetch() {
            let data = Dep.prototype.fetch.call(this);
            this.langFieldNameList.forEach(name => data[name] = this.$el.find(`[name="${name}"]`).val());
            return data;
        },

        validateRequired() {
            let error = false;
            if (this.isRequired()) {
                error = !this.model.get(this.name);

                this.langFieldNameList.forEach(name => error = error || !this.model.get(name), this);

                if (error) {
                    let msg = this.translate('fieldIsRequired', 'messages').replace('{field}', this.translate(this.name, 'fields', this.model.name));
                    this.showValidationMessage(msg);
                }
            }
            return error;
        },

        showRequiredSign() {
            Dep.prototype.showRequiredSign.call(this);
            this.langFieldNameList.forEach(name => this.$el.find(`[data-name=${name}] .required-sign`).show(), this);
        },

        hideRequiredSign() {
            Dep.prototype.hideRequiredSign.call(this);
            this.langFieldNameList.forEach(name => this.$el.find(`[data-name=${name}] .required-sign`).hide(), this);
        },

        getInputLangName(lang) {
            return lang.split('_').reduce((prev, curr) => prev + Espo.utils.upperCaseFirst(curr.toLowerCase()), this.name);
        }

    })
);

