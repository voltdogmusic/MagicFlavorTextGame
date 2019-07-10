import React, {Component} from 'react';
import BSModal from "./BSModal";

class MagicFlavorTextGame extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cardArrObj: [],
            flavorTextQuestionStr: '',
            correctAnswerCardNameStr: '',
            questionAnswered: false,
            correctnessStr: '',
            page: 5,
            questionNumber: 0,
            score: 0,
            possibleAnswerStr: '',
            imageToRender: <img></img>,
            possibleAnswerArrayStr: [],
            show: false,
        };

    }

    componentWillMount() {
        this.hitApi();
    }

    async hitApi() {

        //Grab our cards from the API, filter for english flavor text
        const respVar = await fetch(`https://api.scryfall.com/cards?page=${this.state.page}`);
        const jsonVar = await respVar.json();
        const filterLangAndTextArr =
            jsonVar.data
                .filter(i => i.lang === 'en')
                .filter(i => i.flavor_text !== null)
                .filter(i => i.flavor_text !== undefined);
        const cardArrObjLocal = filterLangAndTextArr;

        console.log(filterLangAndTextArr);

        //Grab the card names from the card array and shuffle them in a possible answer array,
        //this array will be displayed to the screen as the possible answers
        let possibleAnswerArrayStrLocal = [];
        //cardArrObjLocal.length -> 4
        for (let i = 0; i < cardArrObjLocal.length; i++) {
            possibleAnswerArrayStrLocal[i] = cardArrObjLocal[i].name
        }
        this.shuffleArray(possibleAnswerArrayStrLocal);

        this.setState(
            {
                possibleAnswerArrayStr: possibleAnswerArrayStrLocal,
                cardArrObj: cardArrObjLocal,
                flavorTextQuestionStr: cardArrObjLocal[this.state.questionNumber].flavor_text,
                correctAnswerCardNameStr: cardArrObjLocal[this.state.questionNumber].name,
            });
    }

    render() {

        const {
            flavorTextQuestionStr,
            score,
            imageToRender,
            questionAnswered,
            correctnessStr,
            possibleAnswerArrayStr
        } = this.state;

        return (
            <div className='magicFlavorTextGameReturnDiv'>

                <div className='flavorTextQuestionStr'>
                    {flavorTextQuestionStr}
                </div>

                <div className='superwrapper'>
                    <div className='wrapper'>
                        <form className="form">
                            {possibleAnswerArrayStr.map(i =>
                                <div className='inputGroup' id={`inputGroup${i}`} key={i}>
                                    <input onClick={this.handleAnswerSubmit(i)}
                                           id={`radio${i}`}
                                           name={i}
                                           type="radio"
                                    />
                                    <label id={`label${i}`} htmlFor={`radio${i}`}> {i} </label>
                                </div>)}
                        </form>
                    </div>
                </div>

                {questionAnswered &&
                <div className='incorrect'>
                    {correctnessStr}
                </div>
                }

                <div className='yourScore'>
                    {`Your score: ${score}`}
                </div>

                <BSModal
                    show={this.state.show}
                    onHide={this.handleModalClose}
                    imageToRender={imageToRender}
                />
            </div>

        );
    }

    //https://medium.freecodecamp.org/reactjs-pass-parameters-to-event-handlers-ca1f5c422b9
    handleAnswerSubmit = (i) => (event) => {

        this.setState(
            {
                questionAnswered: true,
                possibleAnswerStr: event.currentTarget.name
            },
            () => {

                //if answer is correct
                if (this.state.possibleAnswerStr === this.state.correctAnswerCardNameStr) {

                    document.getElementById(`inputGroup${i}`).classList.add("blueFade");
                    document.getElementById(`inputGroup${i}`).classList.add("blueFade2");
                    document.getElementById(`inputGroup${i}`).classList.add("textWhite");
                    document.getElementById(`inputGroup${i}`).classList.add("checkMark");

                    this.handleModalShow();

                    this.setState({
                        imageToRender: <img
                            src={this.state.cardArrObj[this.state.questionNumber].image_uris.png}
                            className="image"></img>,
                        correctnessStr: "Correct!",
                        score: this.state.score + 1
                    }, () => {
                        this.setState((state) => ({
                            questionNumber: state.questionNumber + 1,
                            questionAnswered: false
                        }), () => {
                            this.getNextQuestion()
                        });
                    });

                    //if answer is wrong
                } else {


                    document.getElementById(`label${i}`).innerHTML = "Try again, Planeswalker";
                    setTimeout(
                        ()=>{document.getElementById(`label${i}`).innerHTML = `${i}`;}
                        , 700);


                    this.setState({
                        correctnessStr: "Try again, Planeswalker",
                        score: this.state.score - 1,
                        possibleAnswerStr: ''
                    });
                }
            }
        );
    };

    handleModalClose = () => {
        this.setState({show: false});
    }

    handleModalShow = () => {
        this.setState({show: true});
    }

    getNextQuestion() {
        //if we are not at the last question before a needed page turn (aka hitting the api again with a new page number), get the next question
        if (this.state.cardArrObj.length !== this.state.questionNumber) {
            this.setState({
                flavorTextQuestionStr: this.state.cardArrObj[this.state.questionNumber].flavor_text,
                correctAnswerCardNameStr: this.state.cardArrObj[this.state.questionNumber].name,
            })
        }
    }

    async componentDidUpdate() {

        //if we are at the last question, hit the api with a new page number

        // if (this.state.cardArrObj.length === this.state.questionNumber) {
        if (this.state.cardArrObj.length === this.state.questionNumber) {
            this.setState((state) => (
                    {
                        page: state.page + 1,
                        questionNumber: 0
                    }),
                () => {
                    this.hitApi();
                }
            );
        }
    }

    shuffleArray(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
}

export default MagicFlavorTextGame;

//ToDo:
//add music player
//add signature + social media links (made by VOLT DOG)
//add styling
//add tutorial modal

//Big Problems:


//Smaller Problems:


//Nice to add:
//more congratulatory/negatives for correct/wrong answers
//music and sound
//music player with forward and back buttons (2 dubsteps from doom)
//change page to 0
//loading screen

//Maybe add:
//display only four answers, grey out selected answers
//could store a list of prev answers and then never display them again








