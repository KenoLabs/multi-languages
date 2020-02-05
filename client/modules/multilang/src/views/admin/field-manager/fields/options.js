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

Espo.define('multilang:views/admin/field-manager/fields/options', 'class-replace!multilang:views/admin/field-manager/fields/options',
    Dep => Dep.extend({

        setup() {
            Dep.prototype.setup.call(this);

            if (this.getConfig().get('isMultilangActive')) {
                this.setMultilanguageParams();

                this.listenTo(this.model, 'change:isMultilang', () => {
                    this.setMultilanguageParams();
                    this.reRender();
                });
            }
        },

        afterRender() {
            Dep.prototype.afterRender.call(this);

            this.updateReadOnlyElements();
        },

        setMultilanguageParams() {
            this.setTranslatedOptions();
            this.setColorOptions();
        },

        setTranslatedOptions() {
            this.translatedOptions = {};

            (this.model.get(this.name) || []).forEach(value => {
                ['', ...(this.getConfig().get('inputLanguageList') || []).map(lang => this.getMultilangName(lang, ''))]
                    .forEach(suffix => {
                        const translatesKey = `translatedOptions${suffix}`;
                        const fieldName = this.model.get('multilangField') || this.model.get('name');
                        const nameKey = `${fieldName}${suffix}`;

                        this[translatesKey] = this[translatesKey] || {};
                        this[translatesKey][value] = this.getLanguage().translateOption(value, nameKey, this.options.scope);

                        this.model.fetchedAttributes[translatesKey] = this[translatesKey];
                    });
            });
        },

        setColorOptions() {
            this.optionColors = {};

            ['', ...(this.getConfig().get('inputLanguageList') || []).map(lang => this.getMultilangName(lang, ''))]
                .forEach(suffix => {
                    const colorsKey = `optionColors${suffix}`;
                    const fieldName = this.model.get('multilangField') || this.model.get('name');
                    const nameKey = `${fieldName}${suffix}`;
                    const path = ['entityDefs', this.options.scope, 'fields', nameKey, 'optionColors'];

                    this[colorsKey] = this.getMetadata().get(path) || {};
                });
        },

        updateReadOnlyElements() {
            if (this.model.get('hideMultilang')) {
                //remove actions with options
                this.$el.find('a[data-action="removeValue"]').remove();
                this.$el.find('.array-control-container').remove();
                this.$el.find(`[data-name="${this.name}"] input`).attr({disabled: 'disabled'});

                //remove colours selection
                this.$el.find(`[data-name="${this.name}"] input[name="coloredValue"]`).get().forEach(item => {
                    item._jscLinkedInstance.showOnClick = false;
                });

                //remove sortable
                this.$list.sortable('destroy');
            }
        },

        getTranslationContainer(value, valueInternal, translatedValue, valueSanitized) {
            let resultHtml = Dep.prototype.getTranslationContainer.call(this, value, valueInternal, translatedValue, valueSanitized);

            const inputLanguageList = this.getConfig().get('inputLanguageList') || [];
            if (this.getConfig().get('isMultilangActive') && inputLanguageList.length
                && (this.model.get('isMultilang') || this.model.has('hideMultilang'))
            ) {
                inputLanguageList.forEach(lang => {
                    if (!this.model.get('hideMultilang') || this.model.get('multilangLocale') === lang) {
                        const translatesKey = this.getMultilangName(lang, 'translatedOptions');
                        translatedValue = this[translatesKey][value] || translatedValue;
                        resultHtml += this.getLangTranslation(value, valueInternal, translatedValue, lang);
                    }
                });
            }

            return resultHtml;
        },

        getLangTranslation(value, valueInternal, translatedValue, lang) {
            const colorsKey = this.getMultilangName(lang, 'optionColors');
            const coloredValue = this[colorsKey][value] || this.defaultColor;
            const name = this.getMultilangName(lang, this.name);

            return `
                <div class="pull-left" style="width: 92%; display: inline-block;"  data-name="${name}">
                    <input name="coloredValue" data-value="${valueInternal}" class="role form-control input-sm pull-right" value="${coloredValue}">
                    <input name="translatedValue" data-value="${valueInternal}" class="role form-control input-sm pull-right" value="${translatedValue}">
                    <span class="lang-option pull-right">${lang} &#8250;</span>
                </div>`;
        },

        getMultilangName(lang, base) {
            lang = lang || this.model.get('multilangLocale');
            base = typeof base === 'string' ? base : this.name;

            return lang.split('_').reduce((prev, curr) => prev + Espo.Utils.upperCaseFirst(curr.toLowerCase()), base);
        },

        fetch() {
            const data = Espo.Utils.cloneDeep(Dep.prototype.fetch.call(this));

            if (this.getConfig().get('isMultilangActive')) {
                this.modifyDataWithMultilanguage(data);
            }

            return data;
        },

        modifyDataWithMultilanguage(data) {
            //for main multilang field
            if (this.model.get('isMultilang')) {
                (data[this.name] || []).forEach(value => {
                    (this.getConfig().get('inputLanguageList') || []).forEach(lang => {
                        const suffix = this.getMultilangName(lang, '');
                        const translatesKey = `translatedOptions${suffix}`;

                        data[translatesKey] = data[translatesKey] || {};
                        data[translatesKey][value] = this.getTranslatedOption(value, `options${suffix}`);
                    });
                });

                if (data.optionColors) {
                    (data[this.name] || []).forEach(value => {
                        (this.getConfig().get('inputLanguageList') || []).forEach(lang => {
                            const suffix = this.getMultilangName(lang, '');
                            const colorsKey = `optionColors${suffix}`;

                            data[colorsKey] = data[colorsKey] || {};
                            data[colorsKey][value] = this.getColoredOption(value, `options${suffix}`);
                        });
                    });
                }
            }

            // for multilang locales
            if (this.model.get('hideMultilang')) {
                data.translatedOptions = {};
                (data[this.name] || []).forEach(value => {
                    data.translatedOptions[value] = this.getTranslatedOption(value, this.getMultilangName());
                });

                if (data.optionColors) {
                    (data[this.name] || []).forEach(value => {
                        data.optionColors[value] = this.getColoredOption(value, this.getMultilangName());
                    });
                }
            }

            return data;
        }

    })
);
