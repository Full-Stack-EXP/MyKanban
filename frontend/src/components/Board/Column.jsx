import React from 'react';
import './Column.css';
import Card from './Card.jsx';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const Column = ({ column, openModal, onAddCard, onDeleteColumn }) => {

    const cards = (column && column.cards) ? column.cards : [];
    const columnName = (column && column.name) ? column.name : 'Loading...';

        const { setNodeRef } = useDroppable({
            id: column.id,
        });

    return (
        <div className="column">
            <div className="column-header">
                <h3>{columnName}</h3>
                <button onClick={() => onDeleteColumn(column.id)} className="delete-column-button">&times;</button>
            </div>

            <div ref={setNodeRef} className="card-list">
                <SortableContext items={cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
                    {cards.map(card => (
                        <Card
                            key={card.id}
                            card={card}
                            openModal={openModal}
                            onDeleteColumn={onDeleteColumn}
                        />
                    ))}
                </SortableContext>
            </div>
            <button onClick={() => onAddCard(column.id)} className="add-card-button">+ Add Card</button>
        </div>
    );
};

export default Column;