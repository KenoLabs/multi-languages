<div class="main-field">{{#unless isEmpty}}<span style="font-size: {{fontSize}};">{{{value}}}</span>{{else}}{{translate 'None'}}{{/unless}}</div>
{{#if valueList}}
    <div class="multilang-labels hidden">
    {{#each valueList}}
    <label class="control-label" data-name="{{name}}">
        <span class="label-text">{{#if customLabel}}{{customLabel}}{{else}}{{translate ../../name category='fields' scope=../../scope}}{{/if}} &rsaquo; {{shortLang}}</span>
    </label>
        <div>{{#unless isEmpty}}<span style="font-size: {{../../fontSize}};">{{{value}}}</span>{{else}}{{translate 'None'}}{{/unless}}</div>
    {{/each}}
    </div>
{{/if}}