<div id="main-field">{{#if isNotEmpty}}{{value}}{{else}}{{translate 'None'}}{{/if}}</div>
{{#if valueList}}
    <div id="multilang-labels" class="hidden">
    {{#each valueList}}
    <div>
        <label class="control-label" data-name="{{name}}">
            <span class="label-text">{{shortLang}}:</span>
        </label>
        <span>{{#if isNotEmpty}}{{value}}{{else}}{{translate 'None'}}{{/if}}</span>
    </div>
    {{/each}}
    </div>
{{/if}}