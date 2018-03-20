<div data-field="{{name}}">
    {{#if isNotEmpty}}<span class="complex-text">{{complexText value}}</span>{{else}}{{translate 'None'}}{{/if}}
</div>
{{#if valueList}}
    <div id="multilang-labels" class="hidden">
    {{#each valueList}}
    <div data-field="{{name}}">
        <label class="control-label" data-name="{{name}}">
            <span class="label-text">{{#if customLabel}}{{customLabel}}{{else}}{{translate ../../name category='fields' scope=../../scope}}{{/if}} &rsaquo; {{shortLang}}</span>
        </label>
        <div>{{#if isNotEmpty}}<span class="complex-text">{{complexText value}}</span>{{else}}{{translate 'None'}}{{/if}}</div>
    </div>
    {{/each}}
    </div>
{{/if}}