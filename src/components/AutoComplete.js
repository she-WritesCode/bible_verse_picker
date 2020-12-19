import { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import getCaretCoordinates from '../assets/scripts/autocomplete';
import '../App.css';

class AutoComplete extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.state.standardItems = ["hello", "world"];
        this.state.id = `input-${Math.random() * 1000}`;
        this.state.inputValue = props.value;
        this.state.searchMatch = [];
        this.state.selectedIndex = 0;
        this.state.clickedChooseItem = false;
        this.state.wordIndex = 0;

        this.inputRef = createRef()

        this.handleInput = this.handleInput.bind(this);
        this.highlightWord = this.highlightWord.bind(this);
        this.setWord = this.setWord.bind(this);
        this.moveDown = this.moveDown.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.selectItem = this.selectItem.bind(this);
        this.chooseItem = this.chooseItem.bind(this);
        this.focusout = this.focusout.bind(this);
        this.focus = this.focus.bind(this);
    }



    // get inputValue() {
    //   return this.props.value;
    // }

    // set inputValue(newValue: string) {
    //   this.$emit("input", newValue);
    // }

    handleInput(event) {
        this.focus();
        if (!!event.target) {
            console.log("Handle Input >>>>", this.state.searchMatch);
            this.setState({ inputValue: event.target.value })
            const caret = getCaretCoordinates(event.target, event.target.selectionEnd);

            if (this.state.searchMatch.length > 0) {
                const element = this.inputRef.current;

                if (element[0]) {
                    // @ts-ignore
                    element[0].style.top = caret.top + 40 + "px";
                    // @ts-ignore
                    element[0].style.left = caret.left + "px";
                }
            }
        }
    }

    get listToSearch() {
        if (typeof this.props.items !== "undefined" && this.props.items.length > 0) {
            return this.props.items;
        } else {
            return this.state.standardItems;
        }
    }

    get currentWord() {
        return this.state.inputValue.replace(/(\r\n|\n|\r)/gm, " ").split(" ")[
            this.state.wordIndex
        ];
    }
    get inputSplitted() {
        return this.state.inputValue.replace(/(\r\n|\n|\r)/gm, " ").split(" ");
    }

    highlightWord(word) {
        const regex = new RegExp("(" + this.currentWord + ")", "gi");
        return word.replace(regex, "<mark>$1</mark>");
    }
    setWord(word) {
        const currentWords = this.state.inputValue
            .replace(/(\r\n|\n|\r)/gm, "__br__ ")
            .split(" ");
        currentWords[this.state.wordIndex] = currentWords[this.state.wordIndex].replace(
            this.currentWord,
            word + " ",
        );
        this.setState({
            wordIndex: this.state.wordIndex + 1,
            inputValue: currentWords.join(" ").replace(/__br__\s/g, "\n")
        })
    }
    moveDown() {
        if (this.state.selectedIndex < this.state.searchMatch.length - 1) {
            this.setState({ selectedIndex: this.state.selectedIndex + 1 })
        }
    }
    moveUp() {
        if (this.state.selectedIndex !== -1) {
            this.setState({ selectedIndex: this.state.selectedIndex - 1 })
        }
    }

    selectItem(index, e) {
        this.setState({ selectedIndex: index })
        this.chooseItem(e);
    }

    chooseItem(e) {
        this.setState({ clickedChooseItem: true })

        if (this.state.selectedIndex !== -1 && this.state.searchMatch.length > 0) {
            if (e) {
                e.preventDefault();
            }
            this.setWord(this.state.searchMatch[this.state.selectedIndex]);

            this.setState({ selectedIndex: -1 })
        }
    }
    focusout(e) {
        setTimeout(() => {
            if (!this.state.clickedChooseItem) {
                this.setState({
                    selectedIndex: -1,
                    searchMatch: [],
                })
            }
            this.setState({ clickedChooseItem: false })
        }, 100);
    }

    focus() {
        this.setState({ searchMatch: [] })
        if (this.currentWord !== "") {
            const searchMatch = this.listToSearch.filter(
                (el) => el.toLowerCase().indexOf(this.currentWord.toLowerCase()) >= 0,
            );
            this.setState({
                searchMatch,
            });
        }
        if (
            this.state.searchMatch.length === 1 &&
            this.currentWord === this.state.searchMatch[0]
        ) {
            this.setState({ searchMatch: [] })
        }
        console.log("ON Focus >>", this.state.searchMatch);
    }

    handleKeyDown(event) {
        const enterKey = event.charCode === 13
        const tabKey = event.charCode === 9
        const downKey = event.charCode === 40
        const upKey = event.charCode === 38

        if (enterKey || tabKey) {
            this.chooseItem(event);
        } else if (downKey) {
            this.moveDown();
        } else if (upKey) {
            this.moveUp();
        }
    }

    inputBox() {
        return (
            <>
                <input
                    id={this.state.id}
                    onInput={(event) => this.handleInput(event)}
                    ref={this.inputRef}
                    rows={this.props.rows}
                    cols={this.props.cols}
                    className="autocomplete-input"
                    placeholder={this.props.placeholder}
                    onBlur={(event) => this.focusout(event)}
                    onFocus={this.focus}
                    onKeyDown={this.handleKeyDown}
                    value={this.state.inputValue}
                    type="text"
                />
            </>
        )
    }
    textAreaBox() {
        return (
            <>
                <textarea
                    id={this.state.id}
                    onInput={(event) => this.handleInput(event)}
                    ref={this.inputRef}
                    rows={this.props.rows}
                    cols={this.props.cols}
                    className="autocomplete-input"
                    placeholder={this.props.placeholder}
                    onBlur={(event) => this.focusout(event)}
                    onFocus={this.focus}
                    onKeyDown={this.handleKeyDown}
                    value={this.state.inputValue}
                    type="text"
                >
                </textarea>
            </>
        )
    }
    render() {
        return (
            <>
                {(this.props.textarea) ? this.textAreaBox() : this.inputBox()}
                {
                    (this.state.searchMatch.length > 0) &&
                    <ul className={`autocomplete-list ${[this.state.id + '-list']}`}  >
                        {this.state.searchMatch.map((result, index) => {
                            return (
                                <li
                                    className={{ active: this.state.selectedIndex === index }}
                                    key={index}
                                    onClick={(event) => { this.selectItem(index, event); this.chooseItem(event) }}
                                    dangerouslySetInnerHTML={{ __html: this.highlightWord(result) }}
                                ></li>
                            )
                        })}

                    </ul>
                }
            </>
        );
    }
}

AutoComplete.defaultProps = {
    items: [],
    placeholder: 'auto complete',
    className: '',
    value: '',
    textarea: false,
    rows: 5,
    // cols: 5,
};

AutoComplete.propTypes = {
    items: PropTypes.array,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.string.isRequired,
    textarea: PropTypes.bool,
    rows: PropTypes.number,
    cols: PropTypes.number,
};

export default AutoComplete