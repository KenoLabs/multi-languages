{{#if isNotEmpty}}
<div class="main-field" style="cursor: pointer">
	{{translateOption value scope=scope field=name translatedOptions=translatedOptions}}
	{{#if hasLangValues}}<span class="caret"></span>{{/if}}
</div>
{{/if}}
{{#if valueList}}
    <div class="multilang-labels hidden">
    {{#each valueList}}
        {{#if isNotEmpty}}
        <div>
            <label class="control-label" data-name="{{name}}">
                <span class="label-text">{{shortLang}}:</span>
            </label>
            <span>{{translateOption value scope=scope field=name translatedOptions=translatedOptions}}</span>
        </div>
        {{/if}}
    {{/each}}
    </div>
{{/if}}