<div class="main-field{{#if hideMainOption}} hidden{{/if}}" style="cursor: pointer;">
    {{#unless isEmpty}}<span style="font-size: {{fontSize}};">{{{value}}}</span>{{else}}{{translate 'None'}}{{/unless}}
	{{#if hasLangValues}}<span class="caret"></span>{{/if}}
</div>
{{#if valueList}}
    <div class="multilang-labels{{#unless expandLocales}} hidden{{/unless}}">
    {{#each valueList}}
    <div>
        <label class="control-label" data-name="{{name}}">
            <span class="label-text">{{shortLang}}:</span>
        </label>
        {{#unless isEmpty}}<span style="font-size: {{../fontSize}};">{{{value}}}</span>{{else}}{{translate 'None'}}{{/unless}}
    </div>
    {{/each}}
    </div>
{{/if}}