<div class="main-field{{#if hideMainOption}} hidden{{/if}}" style="cursor: pointer">
	{{#if isNotEmpty}}{{value}}{{else}}{{translate 'None'}}{{/if}}
	{{#if hasLangValues}}<span class="caret"></span>{{/if}}
</div>
{{#if valueList}}
    <div class="multilang-labels{{#unless expandLocales}} hidden{{/unless}}">
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