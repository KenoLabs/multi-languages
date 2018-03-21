<div class="main-field" style="cursor: pointer">{{#unless isEmpty}}{{{value}}}{{else}}{{translate 'None'}}{{/unless}}<span class="caret"></span></div>
{{#if valueList}}
    <div class="multilang-labels hidden">
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