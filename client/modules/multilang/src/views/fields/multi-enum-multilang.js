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

Espo.define('multilang:views/fields/multi-enum-multilang', ['views/fields/multi-enum', 'multilang:views/fields/shared-multilang'],
    (Dep, SharedMultilang) => Dep.extend({

        allTranslatedOptions : {},

        langFieldNameList: [],

        listTemplate: 'multilang:fields/multi-enum-multilang/list',

        editTemplate: 'multilang:fields/multi-enum-multilang/edit',

        detailTemplate: 'multilang:fields/multi-enum-multilang/detail',

        hideMainOption: false,

        hiddenLocales: [],

        _timeouts: {},

        areDestroyed: {},

        setup() {
            Dep.prototype.setup.call(this);

            this.allTranslatedOptions = this.translate(this.name, 'options', this.model.name) || {};

            this.translatedOptions = this.allTranslatedOptions['options'];

            this.hiddenLocales = this.options.hiddenLocales || this.model.getFieldParam(this.name, 'hiddenLocales') || this.hiddenLocales;

            this.langFieldNameList = this.getLangFieldNameList();

            if (this.model.isNew() && this.defs.params && this.defs.params.default) {
                let data = {};
                this.langFieldNameList.forEach(name => data[name] = this.defs.params.default, this);
                this.model.set(data);
            }

            this.on('customInvalid', function (name) {
                let label = this.getCellElement().find('.control-label[data-name="'+ name + '"]');
                let input = this.getCellElement().find('[data-name="'+ name + '"].selectize-input');
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

        data() {
            let data = Dep.prototype.data.call(this);
            let fontSize = this.model.getFieldParam(this.name, 'fontSize');
            data.fontSize = fontSize ? fontSize + 'em' : '100%';
            data.hasLangValues = !!this.langFieldNameList.length;
            data.hideMainOption = this.hideMainOption;
            data.expandLocales = !!this.hiddenLocales.length || this.hideMainOption;
            data.valueList = this.langFieldNameList.map(name => {
                let value = this.model.get(name) || [];
                let translatedOptions = (this.allTranslatedOptions[`options${name.replace(this.name, '')}`] || {});
                return {
                    name: name,
                    shortLang: name.slice(-4, -2).toLowerCase() + '_' + name.slice(-2).toUpperCase(),
                    customLabel: typeof this.options.multilangLabels === 'object' ? this.options.multilangLabels[name] : this.options.customLabel,
                    value: value.map(val => val in translatedOptions ? translatedOptions[val] : val).join(', '),
                    isEmpty: value.length === 0,
                }
            }, this);
            return data;
        },

        afterRender() {
            if (this.mode == 'edit') {
                this.$element = this.$el.find('[name="' + this.name + '"]');
                this.$element.val(this.selected.join(':,:'));

                let data = [];
                (this.params.options || []).forEach(function (value) {
                    var label = this.getLanguage().translateOption(value, this.name, this.scope);
                    if (this.translatedOptions) {
                        if (value in this.translatedOptions) {
                            label = this.translatedOptions[value];
                        }
                    }
                    data.push({
                        value: value,
                        label: label
                    });
                }, this);

                this.$element.selectize({
                    options: data,
                    delimiter: ':,:',
                    labelField: 'label',
                    valueField: 'value',
                    highlight: false,
                    searchField: ['label'],
                    plugins: ['remove_button', 'drag_drop'],
                    score: function (search) {
                        var score = this.getScoreFunction(search);
                        search = search.toLowerCase();
                        return function (item) {
                            if (item.label.toLowerCase().indexOf(search) === 0) {
                                return score(item);
                            }
                            return 0;
                        };
                    }
                });

                this.$element.next().find('.selectize-input').attr('data-name', this.name);

                this.$element.on('change', function () {
                    this.trigger('change');
                }.bind(this));

                this.langFieldNameList.forEach(name => {
                    let element = this.$el.find('[name="' + name + '"]');
                    element.val((this.model.get(name) || []).join(':,:'));

                    let data = [];
                    let translatedOptions = (this.allTranslatedOptions[`options${name.replace(this.name, '')}`] || {});
                    (this.model.getFieldParam(this.name, `options${name.replace(this.name, '')}`) || []).forEach(value => {
                        data.push({
                            value: value,
                            label: value in translatedOptions ? translatedOptions[value] : value
                        });
                    });

                    element.selectize({
                        options: data,
                        delimiter: ':,:',
                        labelField: 'label',
                        valueField: 'value',
                        highlight: false,
                        searchField: ['label'],
                        plugins: ['remove_button', 'drag_drop'],
                        score: function (search) {
                            var score = this.getScoreFunction(search);
                            search = search.toLowerCase();
                            return function (item) {
                                if (item.label.toLowerCase().indexOf(search) === 0) {
                                    return score(item);
                                }
                                return 0;
                            };
                        }
                    });

                    element.next().find('.selectize-input').attr('data-name', name);

                    element.on('change', function () {
                        this.trigger('change');
                    }.bind(this));
                }, this);
            }

            if (this.mode == 'search') {
                this.renderSearch();
            }
        },

        fetch: function () {
            var list = this.$element.val().split(':,:');
            if (list.length == 1 && list[0] == '') {
                list = [];
            }
            var data = {};
            data[this.name] = list;

            this.langFieldNameList.forEach(name => {
                let list = this.$el.find(`[name="${name}"]`).val().split(':,:');
                if (list.length == 1 && list[0] == '') {
                    list = [];
                }
                data[name] = list;
            });

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
                let errorMainField = false;
                if (!this.model.get(this.name) || this.model.get(this.name).length === 0) {
                    errorMainField = true;
                }
                if (errorMainField) {
                    let msg = this.translate('fieldIsRequired', 'messages').replace('{field}', this.translate(this.name, 'fields', this.model.name));
                    this.showValidationMessage(msg, '[data-name="' + this.name + '"].selectize-input');
                    this.trigger('customInvalid', this.name);
                }
                let errorMultiFields = false;
                this.langFieldNameList.forEach(name => {
                    if (!this.model.get(name) || this.model.get(name).length === 0) {
                        let msg = this.translate('fieldIsRequired', 'messages').replace('{field}', this.translate(this.name, 'fields', this.model.name)
                            + " › " + name.slice(-4, -2).toLowerCase() + '_' + name.slice(-2).toUpperCase());
                        this.showValidationMessage(msg, '[data-name="' + name + '"].selectize-input');
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
