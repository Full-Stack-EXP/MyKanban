import React, { useState, useEffect } from 'react';
import Column from './Column';
import './Board.css';
import CardModal from '../CardModal.jsx';
import { updateCardAxios, deleteCardAxios, createColumnAxios } from '../../api';


const Board = () => {
    const [columns, setColumns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        const fetchColumns = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/columns');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setColumns(data);

            } catch (error) {
                console.error("Error fetching columns:", error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchColumns();

    }, []);

    const openModal = (cardData) => {
        setSelectedCard(cardData);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedCard(null);
        setIsModalOpen(false);
    };

    const handleSaveCard = async (updatedCardData) => {
        if (!selectedCard) {
            console.error("Attempted to save card, but no card is selected.");
            return;
        }
        try {
            const savedCard = await updateCardAxios(selectedCard.id, updatedCardData);
            console.log('Card saved successfully:', savedCard);
            setColumns(currentColumns => {
                return currentColumns.map(column => {
                    if (column.id === savedCard.columnId) {
                        return {
                            ...column,
                            cards: column.cards.map(card => {
                                if (card.id === savedCard.id) {
                                    return savedCard;
                                }
                                return card;
                            })
                        };
                    }
                    return column;
                });
            });
            closeModal();
        } catch (error) {
            console.error('Error saving card:', error);
        }
    };

    const handleDeleteCard = async () => {
         if (!selectedCard) {
             console.error("Attempted to delete card, but no card is selected.");
             return;
         }
         try {
             await deleteCardAxios(selectedCard.id);
             console.log('Card deleted successfully:', selectedCard.id);
             setColumns(currentColumns => {
                 return currentColumns.map(column => {
                     if (column.id === selectedCard.columnId) {
                         return {
                             ...column,
                             cards: column.cards.filter(card => card.id !== selectedCard.id)
                         };
                     }
                     return column;
                 });
             });
             closeModal();
         } catch (error) {
             console.error('Error deleting card:', error);
         }
    };

    const handleAddColumn = async () => {
        const columnName = prompt("Enter the name for the new column:");

        if (columnName && columnName.trim()) {
            try {
                const newColumn = await createColumnAxios(columnName.trim());

                console.log('Column created successfully:', newColumn);

                setColumns(currentColumns => [...currentColumns, newColumn]);

            } catch (error) {
                console.error('Error creating column:', error);
            }
        } else {
            console.log('Column creation cancelled or name was empty.');
        }
    };


    if (isLoading) {
        return <div>Loading board...</div>;
    }

    if (error) {
        return <div>Error loading board: {error.message}</div>;
    }

    return (
        <div className="board-container">
            <h2>Kanban Board</h2>
            <div className="columns-container">
                {columns.map(column => (
                    <Column
                        key={column.id}
                        column={column}
                        openModal={openModal}
                    />
                ))}
            </div>

            <button onClick={handleAddColumn} className="add-column-button">+ Add New Column</button>

            <CardModal
                isOpen={isModalOpen}
                card={selectedCard}
                onClose={closeModal}
                onSave={handleSaveCard}
                onDelete={handleDeleteCard}
            />

        </div>
    );
};

export default Board;