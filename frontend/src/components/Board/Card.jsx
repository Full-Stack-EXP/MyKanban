import React from 'react';
import './Card.css';

const Card = ({ card, openModal }) => {

    const cardTitle = (card && card.title) ? card.title : 'Untitled Card';
    const cardDescription = (card && card.description) ? card.description : '';

    return (
        <div
            className="card"
            data-card-id={card && card.id}
            onClick={() => openModal(card)}
        >
            <h4>{cardTitle}</h4>

            {cardDescription && <p>{cardDescription.substring(0, 100)}{cardDescription.length > 100 ? '...' : ''}</p>}
        </div>
    );
};

export default Card;