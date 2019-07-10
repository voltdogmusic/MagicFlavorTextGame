import {Modal} from "react-bootstrap";
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

const BSModal = ({show, onHide, imageToRender}) => {
    return ReactDOM.createPortal (
        <div>
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Excellent choice, Planeswalker</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div>{imageToRender}</div>
                </Modal.Body>
            </Modal>
        </div>, document.getElementById('portal-root')
    );
};

export default BSModal;





//this classes props = {state or functions from MagicFlavorTextGame parent}
// react-bootstrap modal classes props = {this classes props}

//because you named the props sent in from the parent, the ref to the function
//this.handleModalClose was named to onHide, by me
//then, because react-bootstrap has their own prop naming convention
//you have to pass in that prop (my onHide) to their onHide prop

