<div class="main-field">
    {{#unless isPlain}}
        {{#if useIframe}}
        <iframe data-name="{{name}}" frameborder="0"  style="width: 100%; overflow-x: hidden; overflow-y: hidden;" class="hidden"></iframe>
        {{else}}
    {{#if isNotEmpty}}<div class="html-container" data-name="{{name}}">{{{value}}}</div>{{else}}{{translate 'None'}}{{/if}}
        {{/if}}
    {{else}}
    {{#if isNotEmpty}}<div class="plain complex-text hidden" data-name="{{name}}">{{complexText value}}</div>{{else}}{{translate 'None'}}{{/if}}
    {{/unless}}
</div>
{{#if valueList}}
<div class="multilang-labels hidden">
    {{#each valueList}}
        <label class="control-label" data-name="{{name}}">
            <span class="label-text">{{#if customLabel}}{{customLabel}}{{else}}{{translate ../../name category='fields' scope=../../scope}}{{/if}} &rsaquo; {{shortLang}}</span>
        </label>
        <div class="lang-field" data-field="{{name}}">
            {{#unless ../isPlain}}
                {{#if ../useIframe}}
                <iframe data-name="{{name}}" frameborder="0"  style="width: 100%; overflow-x: hidden; overflow-y: hidden;" class="hidden"></iframe>
                {{else}}
            {{#if isNotEmpty}}<div class="html-container" data-name="{{name}}">{{{value}}}</div>{{else}}{{translate 'None'}}{{/if}}
                {{/if}}
            {{else}}
            {{#if isNotEmpty}}<div class="plain complex-text hidden" data-name="{{name}}">{{complexText value}}</div>{{else}}{{translate 'None'}}{{/if}}
            {{/unless}}
        </div>
    {{/each}}
</div>
{{/if}}