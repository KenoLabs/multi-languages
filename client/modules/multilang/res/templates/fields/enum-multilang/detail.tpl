<div class="main-field">{{#if isNotEmpty}}<span style="font-size: {{fontSize}};">{{translateOption value scope=scope field=name translatedOptions=translatedOptions}}</span>{{else}}{{translate 'None'}}{{/if}}</div>
{{#if valueList}}
    <div class="multilang-labels hidden">
    {{#each valueList}}
        <label class="control-label" data-name="{{name}}">
            <span class="label-text">{{#if customLabel}}{{customLabel}}{{else}}{{translate ../../name category='fields' scope=../../scope}}{{/if}} &rsaquo; {{shortLang}}</span>
        </label>
        <div>{{#if isNotEmpty}}<span style="font-size: {{../../fontSize}};">{{translateOption value scope=scope field=name translatedOptions=translatedOptions}}</span>{{else}}{{translate 'None'}}{{/if}}</div>
    {{/each}}
    </div>
{{/if}}