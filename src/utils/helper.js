export function range(min, max) {
    var len = max - min + 1;
    var arr = new Array(len);
    for (var i = 0; i < len; i++) {
        arr[i] = min + i;
    }
    return arr;
}

export function getPassage(bibleCv) {
    const bible = require(`../bible-kjv/${bibleCv.book.name.replace(" ", "")}.json`)
    const currentChapter = bible.chapters.find((chap) => Number(chap.chapter) === bibleCv.chapter);
    if (currentChapter) {
        let selectedVerses = [];
        if (bibleCv.from === null && bibleCv.to === null) {
            selectedVerses = (bibleCv.from) ? [bibleCv.from] : range(1, bibleCv.book.versesPerChapter[bibleCv.chapter - 1])
        } else if (bibleCv.from === bibleCv.to) {
            selectedVerses = (bibleCv.from) ? [bibleCv.from] : [1]
        } else {
            selectedVerses = range(bibleCv.from, bibleCv.to);
        }

        let text = "";
        text = selectedVerses.map((selectedVerse) => {
            return `${selectedVerse}. ${currentChapter.verses.find((vers) => Number(vers.verse) === selectedVerse).text}<br/>`;
        });
        text = text.join("");
        return text;
    }
    return "";
}