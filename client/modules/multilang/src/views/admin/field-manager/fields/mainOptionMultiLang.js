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

Espo.define('multilang:views/admin/field-manager/fields/mainOptionMultiLang', 'views/admin/field-manager/fields/options',
    Dep => Dep.extend({

        setup: function () {
            Dep.prototype.setup.call(this);

            this.translatedOptions = {};
            var list = this.model.get(this.name) || [];
            list.forEach(function (value) {
                this.translatedOptions[value] = this.translateMultilangOption(value, this.name, this.options.field, this.options.scope);
            }, this);
            this.events['click [data-action="removeValue"]'] = function (e) {
                var value = $(e.currentTarget).data('value').toString();
                this.removeValue(value);
                this.getParentView().fieldList.forEach(function (field) {
                    this.getParentView().getView(field).trigger('removeValueFromOptions', value);
                }, this);
            };
        },

        fetch: function () {
            var data = Dep.prototype.fetch.call(this) || {};

            data.translatedOptions = {};
            data.translatedOptions[this.name] = {};
            (data[this.name] || []).forEach(function (value) {
                var valueSanitized = this.getHelper().stripTags(value).replace(/"/g, '&quot;');
                data.translatedOptions[this.name][value] = this.$el.find('input[name="translatedValue"][data-value="' + valueSanitized + '"]').val() || value;
                data.translatedOptions[this.name][value] = data.translatedOptions[this.name][value].toString();

            }, this);

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

        afterRender: function () {
            if (this.mode === 'edit') {
                this.$list = this.$el.find('.list-group');
                var $select = this.$select = this.$el.find('.select');

                if (!this.params.options) {
                    $select.on('keypress', function (e) {
                        if (e.keyCode === 13) {
                            var value = $select.val().toString();
                            if (this.noEmptyString) {
                                if (value === '') {
                                    return;
                                }
                            }
                            this.addValue(value);
                            this.getParentView().fieldList.forEach(function (field) {
                                this.getParentView().getView(field).trigger('addValueToOptions', value);
                            }, this);
                            $select.val('');
                        }
                    }.bind(this));
                }

                this.$list.sortable({
                    stop: function () {
                        this.fetchFromDom();
                        this.trigger('change');
                    }.bind(this)
                });
            }

            if (this.mode === 'search') {
                this.renderSearch();
            }
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