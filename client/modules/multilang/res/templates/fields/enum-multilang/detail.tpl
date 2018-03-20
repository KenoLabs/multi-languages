<div id="main-field">{{#if isNotEmpty}}{{translateOption value scope=scope field=name translatedOptions=translatedOptions}}{{else}}{{translate 'None'}}{{/if}}</div>
{{#if valueList}}
    <div id="multilang-labels" class="hidden">
    {{#each valueList}}
        <label class="control-label" data-name="{{name}}">
            <span class="label-text">{{#if customLabel}}{{customLabel}}{{else}}{{translate ../../name category='fields' scope=../../scope}}{{/if}} &rsaquo; {{shortLang}}</span>
        </label>
        <div>{{#if isNotEmpty}}{{translateOption value scope=scope field=name translatedOptions=translatedOptions}}{{else}}{{translate 'None'}}{{/if}}</div>
    {{/each}}
    </div>
{{/if}}