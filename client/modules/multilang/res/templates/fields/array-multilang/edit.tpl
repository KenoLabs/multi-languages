<div class="link-container list-group" data-name="{{name}}">
    {{#each itemHtmlList}}
        {{{./this}}}
    {{/each}}
</div>
<div class="array-control-container">
    {{#if hasOptions}}
        <button class="btn btn-default btn-block" type="button" data-action="showAddModal" data-name="{{../name}}">{{translate 'Add'}}</button>
    {{else}}
        <input class="main-element form-control select" type="text" data-name="{{../name}}" autocomplete="off" placeholder="{{#if this.options}}{{translate 'Select'}}{{else}}{{translate 'typeAndPressEnter' category='messages'}}{{/if}}">
    {{/if}}
</div>

{{#each valueList}}
    <label class="control-label" data-name="{{name}}">
        <span class="label-text">{{#if customLabel}}{{customLabel}}{{else}}{{translate ../../name category='fields' scope=../../scope}}{{/if}} &rsaquo; {{shortLang}}</span>
        <span class="required-sign"> *</span>
    </label>

    <div class="link-container list-group" data-name="{{name}}">
        {{#each itemHtmlList}}
            {{{./this}}}
        {{/each}}
    </div>
    <div class="array-control-container">
        {{#if hasOptions}}
            <button class="btn btn-default btn-block" type="button" data-action="showAddModal" data-name="{{../name}}">{{translate 'Add'}}</button>
        {{else}}
            <input class="main-element form-control select" type="text" data-name="{{../name}}" autocomplete="off" placeholder="{{#if this.options}}{{translate 'Select'}}{{else}}{{translate 'typeAndPressEnter' category='messages'}}{{/if}}">
        {{/if}}
    </div>
{{/each}}
<style>
    .control-label.multilang-error-label {
        color: #a94442;
    }

    .form-control.multilang-error-form-control {
        border-color: #a94442;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    }

    .form-control.multilang-error-form-control:focus {
        border-color: #843534;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483;
        -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483;
    }
</style>