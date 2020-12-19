import { useState, useEffect } from 'react';
// import AutoComplete from './AutoComplete';
import chapterAndVerse from 'chapter-and-verse/js/cv';
import { getPassage } from "../utils/helper";
import { Hint } from 'react-autocomplete-hint';


const BOOKS = 'Genesis, Exodus, Leviticus, Numbers, Deuteronomy, Joshua, Judges, Ruth, 1 Samuel, 2 Samuel, 1 Kings, 2 Kings, 1 Chronicles, 2 Chronicles, Ezra, Nehemiah, Esther, Job, Psalms, Proverbs, Ecclesiastes, Song of Solomon, Isaiah, Jeremiah, Lamentations, Ezekiel, Daniel, Hosea, Joel, Amos, Obadiah, Jonah, Micah, Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, Malachi, Matthew, Mark, Luke, John, Acts, Romans, 1 Corinthians, 2 Corinthians, Galatians, Ephesians, Philippians, Colossians, 1 Thessalonians, 2 Thessalonians, 1 Timothy, 2 Timothy, Titus, Philemon, Hebrews, James, 1 Peter, 2 Peter, 1 John, 2 John, 3 John, Jude, Revelation'

function BibleVersePicker() {
    const books = BOOKS.split(',').map((book) => book.trim());
    const [bibleVerse, setBibleVerse] = useState('');
    const [errors, setErrors] = useState([]);
    const [content, setcontent] = useState('');

    useEffect(() => {
        const cv = chapterAndVerse(bibleVerse)
        if (cv.success) {
            setErrors([]);
            setcontent(getPassage(cv));
        } else {
            setErrors([cv.reason]);
        }
    }, [bibleVerse])

    return (
        <>
            <Hint allowTabFill={true} options={books}>
                <input
                    value={bibleVerse}
                    onChange={e => setBibleVerse(e.target.value)}
                    placeholder={'Ex: Gen 1:1, Genesis 1:1-5, Genesis 1, Genesis'} />
            </Hint>
            {/* <AutoComplete items={books} value={bibleVerse} onInput={(event) => setBibleVerse(event.target.value)}/> */}
            <small>{errors.map((e, i) => (<p key={i} >{e}</p>))}</small>
            <div
                style={{ textAlign: 'justify', margin: '0 auto 0 auto', width: '80vw' }}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </>
    )
}

export default BibleVersePicker;