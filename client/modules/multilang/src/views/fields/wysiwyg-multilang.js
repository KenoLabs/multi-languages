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

Espo.define('multilang:views/fields/wysiwyg-multilang', ['views/fields/wysiwyg', 'views/fields/text', 'multilang:views/fields/shared-multilang'],
    (Dep, TextField, SharedMultilang) => Dep.extend({

        listTemplate: 'multilang:fields/wysiwyg-multilang/list',

        detailTemplate: 'multilang:fields/wysiwyg-multilang/detail',

        editTemplate: 'multilang:fields/wysiwyg-multilang/edit',

        langFieldNameList: [],

        hiddenLocales: [],

        setup() {
            TextField.prototype.setup.call(this);

            if ('height' in this.params) {
                this.height = this.params.height;
            }

            if ('minHeight' in this.params) {
                this.minHeight = this.params.minHeight;
            }

            this.toolbar = this.params.toolbar || [
                ['style', ['style']],
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['table', ['table', 'link', 'picture', 'hr']],
                ['misc',['codeview', 'fullscreen']]
            ];

            this.listenTo(this.model, 'change:isHtml', function (model) {
                if (this.mode === 'edit') {
                    if (this.isRendered()) {
                        if (!model.has('isHtml') || model.get('isHtml')) {
                            let value = this.plainToHtml(this.model.get(this.name));
                            this.model.set(this.name, value);
                            this.enableWysiwygMode(this.name);
                            this.langFieldNameList.forEach(name => {
                                let value = this.plainToHtml(this.model.get(name));
                                this.model.set(name, value);
                                this.enableWysiwygMode(name);
                            });
                        } else {
                            let value = this.htmlToPlain(this.model.get(this.name));
                            this.model.set(this.name, value);
                            this.disableWysiwygMode(this.name);
                            this.langFieldNameList.forEach(name => {
                                let value = this.htmlToPlain(this.model.get(name));
                                this.model.set(name, value);
                                this.disableWysiwygMode(name);
                            });
                        }
                    }
                }
                if (this.mode === 'detail') {
                    if (this.isRendered()) {
                        this.reRender();
                    }
                }
            }.bind(this));

            this.once('remove', function () {
                if (this.$summernote) {
                    this.$summernote.summernote('destroy');
                }
                this.langFieldNameList.forEach(name => {
                    let summernote = this.$el.find(`.summernote[data-name="${name}"]`);
                    if (summernote) {
                        summernote.summernote('destroy');
                    }
                });
            });

            this.on('inline-edit-off', function () {
                if (this.$summernote) {
                    this.$el.find(`.summernote[data-name="${this.name}"] + .note-editor`).popover('destroy');
                    this.$summernote.summernote('destroy');
                }
                this.langFieldNameList.forEach(name => {
                    let summernote = this.$el.find(`.summernote[data-name="${name}"]`);
                    if (summernote) {
                        this.$el.find(`.summernote[data-name="${name}"] + .note-editor`).popover('destroy');
                        summernote.summernote('destroy');
                    }
                });

            });

            this.once('remove', function () {
                $(window).off('resize.' + this.cid);
            }.bind(this));

            this.hiddenLocales = this.options.hiddenLocales || this.model.getFieldParam(this.name, 'hiddenLocales') || this.hiddenLocales;

            let inputLanguageList = this.getConfig().get('isMultilangActive') ? this.getConfig().get('inputLanguageList').filter(lang => !this.hiddenLocales.includes(lang)) : [];
            this.langFieldNameList = Array.isArray(inputLanguageList) ? inputLanguageList.map(lang => this.getInputLangName(lang)) : [];

            if (this.model.isNew() && this.defs.params && this.defs.params.default) {
                let data = {};
                this.langFieldNameList.forEach(name => data[name] = this.defs.params.default, this);
                this.model.set(data);
            }

            this.events[`focusout .summernote[data-name="${this.name}"] + .note-editor`] = function (e) {
                this.langFieldNameList.forEach(item => {
                    let summernote = this.$el.find(`.summernote[data-name="${item}"]`);
                    let value = summernote.summernote('code');
                    if (!value || !value.replace(/<\/?p>|<br>/g, '')) {
                        summernote.summernote('code', this.$summernote.summernote('code'));
                    }
                });
            }.bind(this);

            this.events[`focusout [name="${this.name}"]`] = function (e) {
                let mainField = $(e.currentTarget);
                this.langFieldNameList.forEach(item => {
                    let secondaryField = this.$el.find(`[name="${item}"]`);
                    if (!secondaryField.val()) {
                        secondaryField.val(mainField.val());
                    }
                });
            }.bind(this);

            this.on('customInvalid', function (name) {
                let label = this.getCellElement().find('.control-label[data-name="'+ name + '"]');
                let input = this.getCellElement().find(`.summernote[data-name="${name}"] + .note-editor`);
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

            SharedMultilang.prototype.addClickAndCaretToField.call(this);
        },

        data() {
            let data = Dep.prototype.data.call(this);
            data.valueList = this.langFieldNameList.map(name => {
                let value = this.model.get(name);
                return {
                    name: name,
                    value: this.sanitizeHtml(this.getTextValueForDisplay(value)),
                    isNotEmpty: value !== null && value !== '',
                    shortLang: name.slice(-4, -2).toLowerCase() + '_' + name.slice(-2).toUpperCase(),
                    customLabel: typeof this.options.multilangLabels === 'object' ? this.options.multilangLabels[name] : this.options.customLabel
                }
            }, this);

            return data;
        },

        getValueForEdit: function (name) {
            let value = this.model.get(name) || '';
            return this.sanitizeHtml(value);
        },

        afterRender: function () {
            TextField.prototype.afterRender.call(this);

            if (this.mode === 'edit') {
                this.$summernote = this.$el.find(`.summernote[data-name="${this.name}"]`);
            }

            let language = this.getConfig().get('language');

            if (!(language in $.summernote.lang)) {
                $.summernote.lang[language] = this.getLanguage().translate('summernote', 'sets');
            }

            if (this.mode === 'edit') {
                if (!this.model.has('isHtml') || this.model.get('isHtml')) {
                    this.enableWysiwygMode(this.name);
                } else {
                    this.$element.removeClass('hidden');
                }
            }

            if (this.mode === 'detail') {
                if (!this.model.has('isHtml') || this.model.get('isHtml')) {
                    if (!this.useIframe) {
                        this.$element = this.$el.find(`.html-container[data-name="${this.name}"]`);
                    } else {
                        this.$el.find(`iframe[data-name="${this.name}"]`).removeClass('hidden');

                        let $iframe = this.$el.find(`iframe[data-name="${this.name}"]`);

                        let iframeElement = this.iframe = $iframe.get(0);
                        if (!iframeElement) return;

                        $iframe.load(function () {
                            $iframe.contents().find('a').attr('target', '_blank');
                        });

                        let documentElement = iframeElement.contentWindow.document;

                        let body = this.sanitizeHtml(this.model.get(this.name) || '');

                        let linkElement = iframeElement.contentWindow.document.createElement('link');
                        linkElement.type = 'text/css';
                        linkElement.rel = 'stylesheet';
                        linkElement.href = this.getBasePath() + this.getThemeManager().getIframeStylesheet();

                        body = linkElement.outerHTML + body;

                        documentElement.write(body);
                        documentElement.close();

                        let $document = $(documentElement);

                        let increaseHeightStep = 10;
                        let processIncreaseHeight = function (iteration) {
                            iteration = iteration || 0;

                            if (iteration > 20) {
                                return;
                            }

                            iteration ++;

                            if (iframeElement.scrollHeight < $document.height()) {
                                let height = iframeElement.scrollHeight + increaseHeightStep;
                                iframeElement.style.height = height + 'px';
                                processIncreaseHeight(iteration);
                            }
                        };

                        let processHeight = function (isOnLoad) {
                            if (!isOnLoad) {
                                $iframe.css({
                                    overflowY: 'hidden',
                                    overflowX: 'hidden'
                                });
                                $iframe.attr('scrolling', 'no');

                                iframeElement.style.height = '0px';
                            } else {
                                if (iframeElement.scrollHeight >= $document.height()) {
                                    return;
                                }
                            }

                            let $body = $iframe.contents().find('html body');
                            let height = $body.height();
                            if (height === 0) {
                                height = $body.children(0).height() + 100;
                            }

                            iframeElement.style.height = height + 'px';

                            processIncreaseHeight();

                            if (!isOnLoad) {
                                $iframe.css({
                                    overflowY: 'hidden',
                                    overflowX: 'scroll'
                                });
                                $iframe.attr('scrolling', 'yes');
                            }
                        };

                        $iframe.css({
                            visibility: 'hidden'
                        });
                        setTimeout(function () {
                            processHeight();
                            $iframe.css({
                                visibility: 'visible'
                            });
                            $iframe.load(function () {
                                processHeight(true);
                            });
                        }, 40);

                        $(window).off('resize.' + this.cid);
                        $(window).on('resize.' + this.cid, function() {
                            processHeight();
                        }.bind(this));
                    }
                } else {
                    this.$el.find(`.plain[data-name="${this.name}"]`).removeClass('hidden');
                }
            }

            this.langFieldNameList.forEach(name => {
                if (this.mode === 'edit') {
                    let text = this.getTextValueForDisplay(this.model.get(name));
                    if (text) {
                        this.$el.find(`[name="${name}"]`).val(text);
                    }
                }

                if (this.mode === 'edit') {
                    if (!this.model.has('isHtml') || this.model.get('isHtml')) {
                        this.enableWysiwygMode(name);
                    } else {
                        this.$el.find(`[name="${name}"]`).removeClass('hidden');
                    }
                }

                if (this.mode === 'detail') {
                    if (!this.model.has('isHtml') || this.model.get('isHtml')) {
                        if (this.useIframe) {
                            this.$el.find(`iframe[data-name="${name}"]`).removeClass('hidden');

                            let $iframe = this.$el.find(`iframe[data-name="${name}"]`);

                            let iframeElement = this.iframe = $iframe.get(0);
                            if (!iframeElement) return;

                            $iframe.load(function () {
                                $iframe.contents().find('a').attr('target', '_blank');
                            });

                            let documentElement = iframeElement.contentWindow.document;

                            let body = this.sanitizeHtml(this.model.get(name) || '');

                            let linkElement = iframeElement.contentWindow.document.createElement('link');
                            linkElement.type = 'text/css';
                            linkElement.rel = 'stylesheet';
                            linkElement.href = this.getBasePath() + this.getThemeManager().getIframeStylesheet();

                            body = linkElement.outerHTML + body;

                            documentElement.write(body);
                            documentElement.close();

                            let $document = $(documentElement);

                            let increaseHeightStep = 10;
                            let processIncreaseHeight = function (iteration) {
                                iteration = iteration || 0;

                                if (iteration > 20) {
                                    return;
                                }

                                iteration ++;

                                if (iframeElement.scrollHeight < $document.height()) {
                                    let height = iframeElement.scrollHeight + increaseHeightStep;
                                    iframeElement.style.height = height + 'px';
                                    processIncreaseHeight(iteration);
                                }
                            };

                            let processHeight = function (isOnLoad) {
                                if (!isOnLoad) {
                                    $iframe.css({
                                        overflowY: 'hidden',
                                        overflowX: 'hidden'
                                    });
                                    $iframe.attr('scrolling', 'no');

                                    iframeElement.style.height = '0px';
                                } else {
                                    if (iframeElement.scrollHeight >= $document.height()) {
                                        return;
                                    }
                                }

                                let $body = $iframe.contents().find('html body');
                                let height = $body.height();
                                if (height === 0) {
                                    height = $body.children(0).height() + 100;
                                }

                                iframeElement.style.height = height + 'px';

                                processIncreaseHeight();

                                if (!isOnLoad) {
                                    $iframe.css({
                                        overflowY: 'hidden',
                                        overflowX: 'scroll'
                                    });
                                    $iframe.attr('scrolling', 'yes');
                                }
                            };

                            $iframe.css({
                                visibility: 'hidden'
                            });
                            setTimeout(function () {
                                processHeight();
                                $iframe.css({
                                    visibility: 'visible'
                                });
                                $iframe.load(function () {
                                    processHeight(true);
                                });
                            }, 40);

                            $(window).off('resize.' + this.cid);
                            $(window).on('resize.' + this.cid, function() {
                                processHeight();
                            }.bind(this));
                        }
                    } else {
                        this.$el.find(`.plain[data-name="${name}"]`).removeClass('hidden');
                    }
                }
            });

        },

        enableWysiwygMode: function (name) {
            let element = this.$el.find(`[name="${name}"]`);
            let summernote = this.$el.find(`.summernote[data-name="${name}"]`);

            if (!element) {
                return;
            }

            element.addClass('hidden');
            summernote.removeClass('hidden');

            let contents = this.getValueForEdit(name);

            summernote.html(contents);

            summernote.find('style').remove();
            summernote.find('link[ref="stylesheet"]').remove();

            let options = {
                lang: this.getConfig().get('language'),
                callbacks: {
                    onImageUpload: function (files) {
                        let file = files[0];
                        this.notify('Uploading...');
                        this.getModelFactory().create('Attachment', function (attachment) {
                            let fileReader = new FileReader();
                            fileReader.onload = function (e) {
                                attachment.set('name', file.name);
                                attachment.set('type', file.type);
                                attachment.set('role', 'Inline Attachment');
                                attachment.set('global', true);
                                attachment.set('size', file.size);
                                attachment.set('relatedType', this.model.name);
                                attachment.set('file', e.target.result);
                                attachment.set('field', name);

                                attachment.once('sync', function () {
                                    let url = '?entryPoint=attachment&id=' + attachment.id;
                                    summernote.summernote('insertImage', url);
                                    this.notify(false);
                                }, this);
                                attachment.save();
                            }.bind(this);
                            fileReader.readAsDataURL(file);
                        }, this);
                    }.bind(this),
                    onBlur: function () {
                        this.trigger('change')
                    }.bind(this),
                },
                toolbar: this.toolbar
            };

            if (this.height) {
                options.height = this.height;
            }

            if (this.minHeight) {
                options.minHeight = this.minHeight;
            }

            summernote.summernote(options);
        },

        disableWysiwygMode(name) {
            let element = this.$el.find(`[name="${name}"]`);
            let summernote = this.$el.find(`.summernote[data-name="${name}"]`);

            if (summernote) {
                summernote.summernote('destroy');
                summernote.addClass('hidden');
            }
            element.removeClass('hidden');
        },

        fetch() {
            let data = Dep.prototype.fetch.call(this);
            this.langFieldNameList.forEach(name => {
                let element = this.$el.find(`[name="${name}"]`);
                let summernote = this.$el.find(`.summernote[data-name="${name}"]`);

                if (!this.model.has('isHtml') || this.model.get('isHtml')) {
                    data[name] = summernote.summernote('code');
                } else {
                    data[name] = element.val();
                }

                if (this.model.has('isHtml')) {
                    if (this.model.get('isHtml')) {
                        data[name + 'Plain'] = this.htmlToPlain(data[name]);
                    } else {
                        data[name + 'Plain'] = data[name];
                    }
                }
            });
            return data;
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

        validateRequired() {
            let error = false;
            if (this.isRequired()) {
                let errorMainField = false;
                let value = this.model.get(this.name);
                if (!value || !value.replace(/<\/?p>|<br>/g, '')) {
                    errorMainField = true;
                }
                if (errorMainField) {
                    let msg = this.translate('fieldIsRequired', 'messages').replace('{field}', this.translate(this.name, 'fields', this.model.name));
                    this.showValidationMessage(msg, `.summernote[data-name="${this.name}"] + .note-editor`);
                    this.trigger('customInvalid', this.name);
                }
                let errorMultiFields = false;
                this.langFieldNameList.forEach(name => {
                    let value = this.model.get(name);
                    if (!value || !value.replace(/<\/?p>|<br>/g, '')) {
                        let msg = this.translate('fieldIsRequired', 'messages').replace('{field}', this.translate(this.name, 'fields', this.model.name)
                            + " › " + name.slice(-4, -2).toLowerCase() + '_' + name.slice(-2).toUpperCase());
                        this.showValidationMessage(msg, `.summernote[data-name="${name}"] + .note-editor`);
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

        getTextValueForDisplay(text) {
            if (text && (this.mode == 'detail' || this.mode == 'list')) {
                let isCut = false;

                if (text.length > this.detailMaxLength) {
                    text = text.substr(0, this.detailMaxLength);
                    isCut = true;
                }

                let nlCount = (text.match(/\n/g) || []).length;
                if (nlCount > this.detailMaxNewLineCount) {
                    let a = text.split('\n').slice(0, this.detailMaxNewLineCount);
                    text = a.join('\n');
                    isCut = true;
                }

                if (isCut) {
                    text += ' ...\n[#see-more-text]';
                }
            }
            return text || '';
        }

    })
);
