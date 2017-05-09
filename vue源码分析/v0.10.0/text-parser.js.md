# text-parser.js 分析

```js
var openChar  = '{',
    endChar   = '}',
    ESCAPE_RE  = /[-.*+?^${}()|[\]\/\\]/g,
    BINDING_RE = buildInterpolationRegex()
```

```js
function buildInterpolationRegex () {
    var open = escapeRegex(openChar),
        end  = escapeRegex(endChar)
    return new RegExp(open + open + open + '?(.+?)' + end + '?' + end + end)
}

function escapeRegex (str) {
    return str.replace(ESCAPE_RE, '\\$&')
}
```

```js
function parse (text) {
    if (!BINDING_RE.test(text)) return null
    var m, i, token, match, tokens = []
    /* jshint boss: true */
    while (m = text.match(BINDING_RE)) {
        i = m.index
        if (i > 0) tokens.push(text.slice(0, i))
        token = { key: m[1].trim() }
        match = m[0]
        token.html =
            match.charAt(2) === openChar &&
            match.charAt(match.length - 3) === endChar
        tokens.push(token)
        text = text.slice(i + m[0].length)
    }
    if (text.length) tokens.push(text)
    return tokens
}
```

```js
function parseAttr (attr) {
    var tokens = parse(attr)
    if (!tokens) return null
    if (tokens.length === 1) return tokens[0].key
    var res = [], token
    for (var i = 0, l = tokens.length; i < l; i++) {
        token = tokens[i]
        res.push(
            token.key
                ? ('(' + token.key + ')')
                : ('"' + token + '"')
        )
    }
    return res.join('+')
}
```
