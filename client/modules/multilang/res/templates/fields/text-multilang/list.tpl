<div class="main-field" style="cursor: pointer" data-field="{{name}}">
    {{#if isNotEmpty}}<span class="complex-text">{{complexText value}}</span>{{/if}}
    {{#if hasLangValues}}<span class="caret"></span>{{/if}}
</div>
{{#if valueList}}
    <div class="multilang-labels hidden">
    {{#each valueList}}
    <div data-field="{{name}}">
        <label class="control-label" data-name="{{name}}">
            <span class="label-text">{{shortLang}}:</span>
        </label>
        <span>{{#if isNotEmpty}}<span class="complex-text">{{complexText value}}</span>{{else}}{{translate 'None'}}{{/if}}</span>
    </div>
    {{/each}}
    </div>
{{/if}}
