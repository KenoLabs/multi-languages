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

Espo.define('multilang:views/fields/array-multilang', ['views/fields/array', 'multilang:views/fields/shared-multilang'],
    (Dep, SharedMultilang) => Dep.extend({

        allTranslatedOptions : {},

        listTemplate: 'multilang:fields/array-multilang/list',

        detailTemplate: 'multilang:fields/array-multilang/detail',

        editTemplate: 'multilang:fields/array-multilang/edit',

        langFieldNameList: [],

        hideMainOption: false,

        hiddenLocales: [],

        _timeouts: {},

        areDestroyed: {},

        events: {
            'click [data-action="removeValue"]': function (e) {
                let name = $(e.currentTarget).data('name');
                let value = $(e.currentTarget).data('value').toString();
                this.removeValue(value, name);
            },
            'click [data-action="showAddModal"]': function (e) {
                let name = $(e.currentTarget).data('name');
                let value = this.fetchFromDom()[name] || [];
                let options = (this.model.getFieldParam(this.name, `options${name.replace(this.name, '')}`) || []).filter(item => value.indexOf(item) < 0);
                let translatedOptions = (this.allTranslatedOptions[`options${name.replace(this.name, '')}`] || {});

                this.createView('addModal', 'views/modals/array-field-add', {
                    options: options,
                    translatedOptions: translatedOptions
                }, function (view) {
                    view.render();
                    this.listenToOnce(view, 'add', function (item) {
                        this.addValue(item, name);
                        view.close();
                    }.bind(this));
                }.bind(this));
            }
        },

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

            this.addNumberOfOptionsValidation();

            this.on('customInvalid', function (name) {
                let label = this.getCellElement().find('.control-label[data-name="'+ name + '"]');
                let input = this.getCellElement().find('.form-control[data-name="'+ name + '"]');
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
            let value = this.model.get(this.name) || [];
            let data = Dep.prototype.data.call(this);
            data.itemHtmlList = value.map(item => this.getItemHtml(item, this.name));
            data.isEmpty = value.length === 0;
            data.hasLangValues = !!this.langFieldNameList.length;
            data.hideMainOption = this.hideMainOption;
            data.expandLocales = !!this.hiddenLocales.length || this.hideMainOption;
            data.valueList = this.langFieldNameList.map(name => {
                let value = this.model.get(name) || [];
                let translatedOptions = (this.allTranslatedOptions[`options${name.replace(this.name, '')}`] || {});
                let options = this.model.getFieldParam(this.name, `options${name.replace(this.name, '')}`);
                return {
                    itemHtmlList: value.map(item => this.getItemHtml(item, name)),
                    hasOptions: options ? true : false,
                    selected: value,
                    translatedOptions: translatedOptions,
                    isEmpty: value.length === 0,
                    name: name,
                    value: value.map(val => val in translatedOptions ? translatedOptions[val] : val).join(', '),
                    shortLang: name.slice(-4, -2).toLowerCase() + '_' + name.slice(-2).toUpperCase(),
                    customLabel: typeof this.options.multilangLabels === 'object' ? this.options.multilangLabels[name] : this.options.customLabel
                }
            }, this);
            return data;
        },

        getValueForDisplay() {
            return (this.model.get(this.name) || []).map(function (item) {
                if (this.translatedOptions != null) {
                    if (item in this.translatedOptions) {
                        return this.getHelper().stripTags(this.translatedOptions[item]);
                    }
                }
                return this.getHelper().stripTags(item);
            }, this).join(', ');
        },

        afterRender() {
            if (this.mode == 'edit') {
                let that = this;
                this.$list = this.$el.find('.list-group');
                let $select = this.$el.find('.select');

                if ($select.length) {
                    $select.on('keypress', function (e) {
                        if (e.keyCode == 13) {
                            let value = $(this).val();
                            if (that.noEmptyString && value === '') {
                                return;
                            }
                            let name = $(this).data('name');
                            that.addValue(value, name);
                            $(this).val('');
                        }
                    });
                }

                this.$list.sortable({
                    stop: function () {
                        this.fetchFromDom();
                        this.trigger('change');
                    }.bind(this)
                });
            }

            if (this.mode == 'search') {
                this.renderSearch();
            }
        },

        addValue(value, name) {
            name = this.getHelper().stripTags(name);
            let values = this.fetchFromDom();
            let modelValue = values[name] || [];
            if (modelValue.indexOf(value) === -1) {
                let html = this.getItemHtml(value, name);
                this.$list.filter(`[data-name="${name}"]`).append(html);
                modelValue.push(value);
                values[name] = modelValue;
                this.model.set(values);
                this.trigger('change');
            }
        },

        removeValue(value, name) {
            name = this.getHelper().stripTags(name);
            let valueSanitized = this.getHelper().stripTags(value);
            let valueInternal = valueSanitized.replace(/"/g, '-quote-').replace(/\\/g, '-backslash-');
            let modelValue = this.model.get(name) || [];
            this.$list.filter(`[data-name="${name}"]`).children(`[data-value="${valueInternal}"]`).remove();
            var index = modelValue.indexOf(value);
            modelValue.splice(index, 1);
            let data = {};
            data[name] = modelValue;
            this.model.set(data);
            this.trigger('change');
        },

        getItemHtml(value, name) {
            name = name || this.name;
            let translatedOptions = this.allTranslatedOptions[`options${name.replace(this.name, '')}`] || {};
            if (translatedOptions != null) {
                for (var item in translatedOptions) {
                    if (translatedOptions[item] === value) {
                        value = item;
                        break;
                    }
                }
            }

            value = value.toString();

            let valueSanitized = this.getHelper().stripTags(value);
            let valueInternal = valueSanitized.replace(/"/g, '-quote-').replace(/\\/g, '-backslash-');

            let label = valueSanitized.replace(/"/g, '&quot;').replace(/\\/g, '&bsol;');
            if (translatedOptions) {
                label = ((value in translatedOptions) ? translatedOptions[value] : label);
            }

            return `
                <div class="list-group-item" data-value="${valueInternal}" data-name="${name}" style="cursor: default;">
                    ${label}&nbsp;
                    <a href="javascript:" class="pull-right" data-value="${valueInternal}" data-name="${name}" data-action="removeValue"><span class="fas fa-times"></a>
                </div>`;
        },

        fetchFromDom() {
            let data = {};
            data[this.name] = [];
            this.langFieldNameList.forEach(item => data[item] = []);
            this.$el.find('.list-group .list-group-item').each(function (i, el) {
                let name = $(el).data('name').toString();
                let value = $(el).data('value').toString().replace(/-quote-/g, '"').replace(/-backslash-/g, '\\');
                data[name].push(value);
            });
            return data;
        },

        fetch() {
            return this.fetchFromDom();
        },

        validate: function () {
            for (let i in this.validations) {
                let method = 'validate' + Espo.Utils.upperCaseFirst(this.validations[i]);
                if (this[method].call(this)) {
                    return true;
                }
            }
            return false;
        },

        addNumberOfOptionsValidation() {
            this.validations = Espo.Utils.clone(this.validations);
            if (!this.validations.includes('numberOfOptions')) {
                this.validations.push('numberOfOptions');
            } else {
                this.validations.splice(this.validations.indexOf('numberOfOptions'), 1);
            }
        },

        validateNumberOfOptions() {
            let error = false;
            this.langFieldNameList.some(lang => {
                if (this.model.get(this.name).length !== this.model.get(lang).length) {
                    let msg = this.translate('sameNumberOptions', 'messages');
                    this.showValidationMessage(msg);
                    this.trigger('invalid');
                    return error = true;
                }
            });
            return error;
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
                    this.showValidationMessage(msg, '[data-name="' + this.name + '"].main-element');
                    this.trigger('customInvalid', this.name);
                }
                let errorMultiFields = false;
                this.langFieldNameList.forEach(name => {
                    if (!this.model.get(name)|| this.model.get(name).length === 0) {
                        let msg = this.translate('fieldIsRequired', 'messages').replace('{field}', this.translate(this.name, 'fields', this.model.name)
                            + " › " + name.slice(-4, -2).toLowerCase() + '_' + name.slice(-2).toUpperCase());
                        this.showValidationMessage(msg, '[data-name="' + name + '"].main-element');
                        this.trigger('customInvalid', name);
                        errorMultiFields = true;
                    }
                });
                error = errorMainField || errorMultiFields;
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
        },

        getLangFieldNameList() {
            let inputLanguageList = this.getConfig().get('isMultilangActive') ? this.getConfig().get('inputLanguageList').filter(lang => !this.hiddenLocales.includes(lang)) : [];
            return Array.isArray(inputLanguageList) ? inputLanguageList.map(lang => this.getInputLangName(lang)) : [];
        },

        showValidationMessage: function (message, target) {
            target = target || '.array-control-container';
            SharedMultilang.prototype.showValidationMessage.call(this, message, target);
        },
    })
);


