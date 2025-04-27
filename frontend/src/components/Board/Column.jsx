import React from 'react';
import './Column.css';
import Card from './Card.jsx';

const Column = ({ column, openModal, onAddCard }) => {

    const cards = (column && column.cards) ? column.cards : [];
    const columnName = (column && column.name) ? column.name : 'Loading...';

    return (
        <div className="column">
            <h3>{columnName}</h3>

            <div className="card-list">
                {cards.map(card => (
                    <Card
                        key={card.id}
                        card={card}
                        openModal={openModal}
                    />
                ))}
            </div>
            <button onClick={() => onAddCard(column.id)} className="add-card-button">+ Add Card</button>
        </div>
    );
};

export default Column;