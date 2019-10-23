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

Espo.define('multilang:views/fields/enum-multilang', ['views/fields/enum', 'multilang:views/fields/shared-multilang'],
    (Dep, SharedMultilang) => Dep.extend({

        listTemplate: 'multilang:fields/enum-multilang/list',

        editTemplate: 'multilang:fields/enum-multilang/edit',

        detailTemplate: 'multilang:fields/enum-multilang/detail',

        langFieldNameList: [],

        hideMainOption: false,

        expandLocales: false,

        hiddenLocales: [],

        _timeouts: {},

        areDestroyed: {},

        setup() {
            Dep.prototype.setup.call(this);

            this.hiddenLocales = this.options.hiddenLocales || this.model.getFieldParam(this.name, 'hiddenLocales') || this.hiddenLocales;

            this.langFieldNameList = this.getLangFieldNameList();

            if (this.model.isNew() && this.defs.params && this.defs.params.default) {
                let data = {};
                this.langFieldNameList.forEach(name => data[name] = this.defs.params.default, this);
                this.model.set(data);
            }

            this.on('customInvalid', function (name) {
                let label = this.getCellElement().find('.control-label[data-name="'+ name + '"]');
                let input = this.getCellElement().find('.form-control[name="'+ name + '"]');
                label.addClass('multilang-error-label');
                input.addClass('multilang-error-form-control');
                this.$el.one('click', function () {
                    label.removeClass('multilang-error-label');
                    input.removeClass('multilang-error-form-control');
                });
                this.once('render', function () {
                    label.removeClass('multilang-error-label');
                    input.removeClass('multilang-error-form-control');
                });
            }, this);

            Dep.prototype.setHiddenLocales = SharedMultilang.prototype.setHiddenLocales;
            SharedMultilang.prototype.addClickAndCaretToField.call(this);
        },

        initElement: function () {
            this.$element = this.$el.find('[name="' + this.name + '"]');
            if (this.mode === 'edit') {
                this.$element.on('change', function () {
                    const index = (this.params.options || []).indexOf(this.$element.val());
                    if (index > -1) {
                        this.langFieldNameList.forEach(name => {
                            const options = this.model.getFieldParam(this.name, `options${name.replace(this.name, '')}`) || [];
                            if (typeof options[index] !== 'undefined') {
                                this.$el.find(`[name="${name}"]`).val(options[index]);
                            }
                        });
                    }
                    this.trigger('change');
                }.bind(this));
            }
        },

        data() {
            let data = Dep.prototype.data.call(this);
            let fontSize = this.model.getFieldParam(this.name, 'fontSize');
            data.fontSize = fontSize ? fontSize + 'em' : '100%';
            data.hasLangValues = !!this.langFieldNameList.length;
            data.hideMainOption = this.hideMainOption;
            data.expandLocales = this.expandLocales || this.hideMainOption;
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
                    customLabel: typeof this.options.multilangLabels === 'object' ? this.options.multilangLabels[name] : this.options.customLabel
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

        validate: function () {
            for (var i in this.validations) {
                var method = 'validate' + Espo.Utils.upperCaseFirst(this.validations[i]);
                if (this[method].call(this)) {
                    return true;
                }
            }
            return false;
        },

        validateRequired() {
            let error = false;
            if (this.isRequired()) {
                let errorMainField = !this.model.get(this.name);
                if (errorMainField) {
                    let msg = this.translate('fieldIsRequired', 'messages').replace('{field}', this.translate(this.name, 'fields', this.model.name));
                    this.showValidationMessage(msg, '[name="' + this.name + '"].main-element');
                    this.trigger('customInvalid', this.name);
                }
                let errorMultiFields = false;
                this.langFieldNameList.forEach(name => {
                    if (!this.model.get(name)) {
                        let msg = this.translate('fieldIsRequired', 'messages').replace('{field}', this.translate(this.name, 'fields', this.model.name)
                            + " &#8250; " + name.slice(-4, -2).toLowerCase() + '_' + name.slice(-2).toUpperCase());
                        this.showValidationMessage(msg, '[name="' + name + '"].main-element');
                        this.trigger('customInvalid', name);
                        errorMultiFields = true;
                    }
                });
                error = errorMainField || errorMultiFields;
            }
            return error;
        },

        showValidationMessage(message, target) {
            SharedMultilang.prototype.showValidationMessage.call(this, message, target);
        },

        showRequiredSign() {
            Dep.prototype.showRequiredSign.call(this);
            this.langFieldNameList.forEach(name => this.$el.find(`[data-name=${name}] .required-sign`).show(), this);
        },

        hideRequiredSign() {
            Dep.prototype.hideRequiredSign.call(this);
            this.langFieldNameList.forEach(name => this.$el.find(`[data-name=${name}] .required-sign`).hide(), this);
        },

        getLangFieldNameList() {
            let inputLanguageList = this.getConfig().get('isMultilangActive') ? this.getConfig().get('inputLanguageList').filter(lang => !this.hiddenLocales.includes(lang)) : [];
            return Array.isArray(inputLanguageList) ? inputLanguageList.map(lang => this.getInputLangName(lang)) : [];
        },

        getInputLangName(lang) {
            return lang.split('_').reduce((prev, curr) => prev + Espo.utils.upperCaseFirst(curr.toLowerCase()), this.name);
        }

    })
);

