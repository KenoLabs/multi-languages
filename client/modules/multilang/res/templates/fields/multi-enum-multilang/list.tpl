<div id="main-field">{{#unless isEmpty}}{{{value}}}{{else}}{{translate 'None'}}{{/unless}}</div>
{{#if valueList}}
    <div id="multilang-labels" class="hidden">
    {{#each valueList}}
    <div>
        <label class="control-label" data-name="{{name}}">
            <span class="label-text">{{shortLang}}:</span>
        </label>
        <span>{{#unless isEmpty}}{{{value}}}{{else}}{{translate 'None'}}{{/unless}}</span>
    </div>
    {{/each}}
    </div>
{{/if}}