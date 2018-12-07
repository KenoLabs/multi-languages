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

Espo.define('multilang:views/admin/input-language', 'views/settings/record/edit',
    Dep => Dep.extend({

        layoutName: 'inputLanguage',

        setup: function () {
            Dep.prototype.setup.call(this);

            this.listenTo(this.model, 'after:save', function () {
                Espo.Ui.success(this.translate('successAndReload', 'messages', 'Global').replace('{value}', 2));
                setTimeout(function () {
                    window.location.reload(true);
                }, 2000);
            }.bind(this));
        },

    })
);
