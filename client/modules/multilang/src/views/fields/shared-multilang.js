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

Espo.define('multilang:views/fields/shared-multilang', [], function () {

    var SharedMultilang = function () {
    };

    _.extend(SharedMultilang.prototype, {

        addClickAndCaretToField() {
            if (this.langFieldNameList.length) {
                this.listenTo(this, 'after:render', function () {
                    if (this.mode === 'edit') {
                        this.getLabelElement().find('.caret').remove();
                        this.getLabelElement().css('cursor', 'default');
                    } else if (this.mode === 'detail') {
                        if (!this.getLabelElement().find('.caret').length) {
                            this.getLabelElement().append(' <span class="caret"></span>');
                            this.getLabelElement().css('cursor', 'pointer');
                        }
                    } else if (this.mode === 'list') {
                        this.$el.find('.main-field').click(function () {
                            if (this.$el.find('.multilang-labels').hasClass('hidden')) {
                                this.$el.find('.multilang-labels').removeClass('hidden');
                                this.$el.find('.caret').addClass('caret-up')
                            } else {
                                this.$el.find('.multilang-labels').addClass('hidden');
                                this.$el.find('.caret').removeClass('caret-up')
                            }
                        }.bind(this));
                    }
                }, this);
                this.listenToOnce(this, 'after:render', function () {
                    if (this.mode === 'detail') {
                        this.getLabelElement().click(function () {
                            if (this.$el.find('.multilang-labels').hasClass('hidden')) {
                                this.$el.find('.multilang-labels').removeClass('hidden');
                                this.$el.parent().find('.caret').addClass('caret-up')
                            } else {
                                this.$el.find('.multilang-labels').addClass('hidden');
                                this.$el.parent().find('.caret').removeClass('caret-up')
                            }
                        }.bind(this));
                    }
                }, this);
            }
        }
    });

    return SharedMultilang;
});