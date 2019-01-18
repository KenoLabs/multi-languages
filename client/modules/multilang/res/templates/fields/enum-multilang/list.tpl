<div class="main-field{{#if hideMainOption}} hidden{{/if}}" style="cursor: pointer;">
    {{#if isNotEmpty}}<span style="font-size: {{fontSize}};">{{translateOption value scope=scope field=name translatedOptions=translatedOptions}}</span>{{else}}{{translate 'None'}}{{/if}}
	{{#if hasLangValues}}<span class="caret"></span>{{/if}}
</div>
{{#if valueList}}
    <div class="multilang-labels{{#unless expandLocales}} hidden{{/unless}}">
    {{#each valueList}}
        <div>
            <label class="control-label" data-name="{{name}}">
                <span class="label-text">{{shortLang}}:</span>
            </label>
            {{#if isNotEmpty}}<span style="font-size: {{fontSize}};">{{translateOption value scope=scope field=name translatedOptions=translatedOptions}}</span>{{else}}{{translate 'None'}}{{/if}}
        </div>
    {{/each}}
    </div>
{{/if}}