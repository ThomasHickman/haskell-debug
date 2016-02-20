import atomAPI = require("atom");
import HaskellDebug = require("./HaskellDebug");

function hightlightLine(line: number, colRange: number){
    var range = new atomAPI.Range([line, colRange[0]], [line, colRange[1]]);
    var editor = atom.workspace.getActiveTextEditor();

    var marker = editor.markBufferRange(range, {invalidate: 'never'})
    editor.decorateMarker(marker, {
        type: "highlight",
        class: "highlight-green"
    })
    editor.decorateMarker(marker, {
        type: "line-number",
        class: "highlight-green"
    })
    editor.decorateMarker(marker, {
        type: "gutter",
        class: "highlight-green"
    })
    //editor.decorateMarker(marker, {})
}

var currentDebug: HaskellDebug;

atom.commands.add("atom-text-editor[data-grammar='source haskell']", "haskell:debug", () => {

})
