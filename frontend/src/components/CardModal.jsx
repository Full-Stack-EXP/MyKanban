import React, { useState, useEffect } from 'react';
import './CardModal.css';

const CardModal = ({ isOpen, card, onClose, onSave, onDelete }) => {

    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');

    useEffect(() => {
        if (card) {
            setEditedTitle(card.title || '');
            setEditedDescription(card.description || '');
        } else {
             setEditedTitle('');
             setEditedDescription('');
        }
    }, [card]);

    if (!isOpen) {
        return null;
    }

    if (!card) {
         console.error("CardModal is open but no card data was passed.");
         return null;
    }

    const handleSave = () => {
        onSave({
            title: editedTitle,
            description: editedDescription,
        });
    };

    const handleDelete = () => {
        onDelete();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>&times;</button>

                 <h3>{editedTitle || 'Untitled Card'}</h3>
                 <p>{editedDescription || 'No description provided.'}</p>

                <div>
                    <label htmlFor="modal-title">Title:</label>
                    <input
                        type="text"
                        id="modal-title"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="modal-description">Description:</label>
                    <textarea
                        id="modal-description"
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                    />
                </div>

                <div className="modal-actions">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default CardModal;