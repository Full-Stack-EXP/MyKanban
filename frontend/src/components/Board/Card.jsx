import React from 'react';
import './Card.css';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Card = ({ card, openModal }) => {
    const cardTitle = (card && card.title) ? card.title : 'Untitled Card';
    const cardDescription = (card && card.description) ? card.description : '';

    const {
        atributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({id: card.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...atributes}
            {...listeners}
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