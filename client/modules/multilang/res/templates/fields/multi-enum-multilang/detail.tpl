<div id="main-field">{{#unless isEmpty}}{{{value}}}{{else}}{{translate 'None'}}{{/unless}}</div>
{{#if valueList}}
    <div id="multilang-labels" class="hidden">
    {{#each valueList}}
    <label class="control-label" data-name="{{name}}">
        <span class="label-text">{{#if customLabel}}{{customLabel}}{{else}}{{translate ../../name category='fields' scope=../../scope}}{{/if}} &rsaquo; {{shortLang}}</span>
    </label>
    <div>{{#unless isEmpty}}{{{value}}}{{else}}{{translate 'None'}}{{/unless}}</div>
    {{/each}}
    </div>
{{/if}}