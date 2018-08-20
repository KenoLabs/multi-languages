<div data-field="{{name}}">
    {{#unless isPlain}}
        {{#if useIframe}}
        <iframe data-name="{{name}}" frameborder="0"  style="width: 100%;" class="hidden" scrolling="no"></iframe>
        {{else}}
        <div class="html-container" data-name="{{name}}">{{{value}}}</div>
        {{/if}}
    {{else}}
    <div class="plain complex-text hidden" data-name="{{name}}">{{complexText value}}</div>
    {{/unless}}
</div>
{{#if valueList}}
<div class="multilang-labels hidden">
    {{#each valueList}}
    <div data-field="{{name}}">
        <label class="control-label" data-name="{{name}}">
            <span class="label-text">{{#if customLabel}}{{customLabel}}{{else}}{{translate ../../name category='fields' scope=../../scope}}{{/if}} &rsaquo; {{shortLang}}</span>
        </label>
        <div>
            {{#unless ../isPlain}}
                {{#if ../useIframe}}
                <iframe data-name="{{name}}" frameborder="0"  style="width: 100%;" class="hidden" scrolling="no"></iframe>
                {{else}}
                <div class="html-container" data-name="{{name}}">{{{value}}}</div>
                {{/if}}
            {{else}}
            <div class="plain complex-text hidden" data-name="{{name}}">{{complexText value}}</div>
            {{/unless}}
        </div>
    </div>
    {{/each}}
</div>
{{/if}}