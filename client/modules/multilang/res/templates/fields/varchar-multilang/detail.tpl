<div>{{#if isNotEmpty}}{{value}}{{else}}{{translate 'None'}}{{/if}}</div>
{{#each valueList}}
    <label class="control-label" data-name="{{name}}">
        <span class="label-text">{{#if customLabel}}{{customLabel}}{{else}}{{translate ../../name category='fields' scope=../../scope}}{{/if}} &rsaquo; {{shortLang}}</span>
    </label>
    <div>{{#if isNotEmpty}}{{value}}{{else}}{{translate 'None'}}{{/if}}</div>
{{/each}}