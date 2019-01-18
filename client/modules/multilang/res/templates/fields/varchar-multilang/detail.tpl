<div class="main-field{{#if hideMainOption}} hidden{{/if}}">{{#if isNotEmpty}}{{value}}{{else}}{{translate 'None'}}{{/if}}</div>
{{#if valueList}}
    <div class="multilang-labels{{#unless expandLocales}} hidden{{/unless}}">
    {{#each valueList}}
    <label class="control-label" data-name="{{name}}">
        <span class="label-text">{{#if customLabel}}{{customLabel}}{{else}}{{translate ../../name category='fields' scope=../../scope}}{{/if}} &rsaquo; {{shortLang}}</span>
    </label>
    <div>{{#if isNotEmpty}}{{value}}{{else}}{{translate 'None'}}{{/if}}</div>
    {{/each}}
    </div>
{{/if}}