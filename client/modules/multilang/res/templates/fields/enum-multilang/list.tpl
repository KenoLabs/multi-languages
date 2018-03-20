{{#if isNotEmpty}}<div id="main-field">{{translateOption value scope=scope field=name translatedOptions=translatedOptions}}</div>{{/if}}
{{#if valueList}}
    <div id="multilang-labels" class="hidden">
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