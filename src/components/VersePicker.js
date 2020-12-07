import { useState, useEffect } from 'react';
import chapterAndVerse from 'chapter-and-verse/js/cv';
import { getPassage } from "../utils/helper";

const BOOKS = 'Genesis, Exodus, Leviticus, Numbers, Deuteronomy, Joshua, Judges, Ruth, 1 Samuel, 2 Samuel, 1 Kings, 2 Kings, 1 Chronicles, 2 Chronicles, Ezra, Nehemiah, Esther, Job, Psalms, Proverbs, Ecclesiastes, Song of Solomon, Isaiah, Jeremiah, Lamentations, Ezekiel, Daniel, Hosea, Joel, Amos, Obadiah, Jonah, Micah, Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, Malachi, Matthew, Mark, Luke, John, Acts, Romans, 1 Corinthians, 2 Corinthians, Galatians, Ephesians, Philippians, Colossians, 1 Thessalonians, 2 Thessalonians, 1 Timothy, 2 Timothy, Titus, Philemon, Hebrews, James, 1 Peter, 2 Peter, 1 John, 2 John, 3 John, Jude, Revelation'

function VersePicker() {
    const books = BOOKS.split(',').map((book) => book.trim());
    const [book, setbook] = useState(books[0]);
    const [chapterList, setchapterList] = useState([1]);
    const [chapter, setchapter] = useState(1);
    const [verse, setverse] = useState('');
    const [bibleCv, setbibleCv] = useState(chapterAndVerse(book));
    const [content, setcontent] = useState(getPassage(bibleCv));
    const [errors, seterrors] = useState([]);

    useEffect(() => {
        const cv = chapterAndVerse(book)
        if (cv.success) setbibleCv(cv);
        const chapterLength = cv.book.chapters;
        setchapterList([...Array(chapterLength + 1).keys()].slice(1));
    }, [book]);


    useEffect(() => {
        if (errors.length === 0) {
            const text = getPassage(bibleCv)
            setcontent(text);
        }
    }, [bibleCv, errors]);

    function handleVerseChange(value) {
        // TODO: valid: 1,2,3 // DONE: valid: 1-5 // TODO(Probaly): valid: 1-5, 23 // regex: [0-9],?[0-9]*| [0-9]-[0-9]
        const cv = chapterAndVerse(`${book} ${chapter}${value ? ':' + value : ''}`);
        setbibleCv(cv.success ? cv : bibleCv);
        seterrors(cv.success ? [] : [`invalid verse due to ${cv.reason}`]);
        setverse(value);
    }


    return (
        <div>
            <div className="flex">
                <div>
                    <label>Book</label>
                    <select value={book} onChange={(event) => setbook(event.target.value)} placeholder="Book">
                        <option></option>
                        {books.map((book, i) => (<option key={i} value={book}>{book}</option>))}
                    </select>
                </div>

                <div>
                    <label>Chapter</label>
                    <select value={chapter} placeholder="chapter" onChange={(event) => setchapter(event.target.value)}>
                        <option></option>
                        {chapterList.map((chapter, i) => (<option key={i} value={chapter}>{chapter}</option>))}
                    </select>
                </div>

                <div>
                    <label>Verses (eg: 1-5)</label>
                    <input type="text" value={verse} placeholder="Verse" onInput={(event) => handleVerseChange(event.target.value)} />
                    <br /><small>{errors.map((e, i) => (<p key={i} >{e}</p>))}</small>
                </div>

            </div>

            <div style={{ whiteSpace: 'pre' }}>{content}</div>

        </div>
    );
}

export default VersePicker;

/*
{
  "book": {
    "id": "Dan",
    "name": "Daniel",
    "testament": "O",
    "start": "dan",
    "abbr": ["da", "dn"],
    "chapters": 12,
    "versesPerChapter": [21, 49, 30, 37, 31, 28, 28, 27, 27, 21, 45, 13]
  },
  "success": true,
  "reason": "matches book.id",
  "chapter": 4,
  "from": 1,
  "to": 3
}
*/
