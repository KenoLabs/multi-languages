<div data-field="{{name}}" class="{{#if hideMainOption}}hidden{{/if}}">
    {{#if isNotEmpty}}<span class="complex-text">{{complexText value}}</span>{{else}}{{translate 'None'}}{{/if}}
</div>
{{#if valueList}}
    <div class="multilang-labels{{#unless expandLocales}} hidden{{/unless}}">
    {{#each valueList}}
    <div data-field="{{name}}">
        <label class="control-label" data-name="{{name}}">
            <span class="label-text">{{#if customLabel}}{{customLabel}}{{else}}{{translate ../../name category='fields' scope=../../scope}}{{/if}} &rsaquo; {{shortLang}}</span>
        </label>
        <div>{{#if isNotEmpty}}<span class="complex-text">{{complexText value}}</span>{{else}}{{translate 'None'}}{{/if}}</div>
    </div>
    {{/each}}
    </div>
{{/if}}