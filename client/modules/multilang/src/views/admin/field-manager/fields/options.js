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

        afterRender() {
            Dep.prototype.afterRender.call(this);

            this.updateReadOnlyElements();
        },

        updateReadOnlyElements() {
            if (this.model.get('hideMultilang')) {
                $('a[data-action="removeValue"]').remove();
                $('.array-control-container').remove();
            }
        },

        getTranslationContainer(value, valueInternal, translatedValue, valueSanitized) {
            let resultHtml = Dep.prototype.getTranslationContainer.call(this, value, valueInternal, translatedValue, valueSanitized);

            const inputLanguageList = this.getConfig().get('inputLanguageList') || [];
            if (this.getConfig().get('isMultilangActive') && inputLanguageList.length) {
                inputLanguageList.forEach(lang => {
                    if (!this.model.get('hideMutltilang') || this.model.get('multilangLocale') === lang) {
                        resultHtml += this.getLangTranslation(value, valueInternal, translatedValue, lang);
                    }
                });
            }

            return resultHtml;
        },

        getLangTranslation(value, valueInternal, translatedValue, lang) {
            const coloredValue = this.optionColors[value] || this.defaultColor;
            return `
                <div class="pull-left" style="width: 92%; display: inline-block;">
                    <input name="coloredValue" data-value="${valueInternal}" class="role form-control input-sm pull-right" value="${coloredValue}">
                    <input name="translatedValue" data-value="${valueInternal}" class="role form-control input-sm pull-right" value="${translatedValue}">
                    <span class="lang-option pull-right">${lang} &#8250;</span>
                </div>`;
        }

    })
);
