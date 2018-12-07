<div class="main-field" style="cursor: pointer" data-field="{{name}}">
    {{#if isNotEmpty}}<span class="complex-text">{{complexText valueWithoutTags}}</span>{{else}}{{translate 'None'}}{{/if}}
    <span class="caret"></span>
</div>
{{#if valueList}}
<div class="multilang-labels hidden">
    {{#each valueList}}
    <div class="lang-field" data-field="{{name}}">
        <label class="control-label" data-name="{{name}}">
            <span class="label-text">{{shortLang}}:</span>
        </label>
        <span>{{#if isNotEmpty}}<span class="complex-text">{{complexText valueWithoutTags}}</span>{{else}}{{translate 'None'}}{{/if}}</span>
    </div>
    {{/each}}
</div>
{{/if}}
