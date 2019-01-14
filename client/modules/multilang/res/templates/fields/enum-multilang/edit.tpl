<select name="{{name}}" class="form-control main-element{{#if hideMainOption}} hidden{{/if}}">
    {{options params.options value scope=scope field=name translatedOptions=translatedOptions}}
</select>
{{#each valueList}}
    <label class="control-label" data-name="{{name}}">
        <span class="label-text">{{#if customLabel}}{{customLabel}}{{else}}{{translate ../../name category='fields' scope=../../scope}}{{/if}} &rsaquo; {{shortLang}}</span>
        <span class="required-sign"> *</span>
    </label>
    <select name="{{name}}" class="form-control main-element">
        {{options params.options value scope=scope field=name translatedOptions=translatedOptions}}
    </select>
{{/each}}
<style>
    .control-label.multilang-error-label {
        color: #a94442;
    }

    .form-control.multilang-error-form-control {
        border-color: #a94442;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    }

    .form-control.multilang-error-form-control:focus {
        border-color: #843534;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483;
        -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483;
    }
</style>