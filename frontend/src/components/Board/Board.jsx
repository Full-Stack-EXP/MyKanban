import React, { useState, useEffect } from 'react';
import Column from './Column';
import './Board.css';
import CardModal from './CardModal.jsx';
import { updateCardAxios, deleteCardAxios, createColumnAxios, createCardAxios } from '../../api';


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
                // Ensure the initial data set also triggers a render
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
        console.log('Attempting to save card with ID:', selectedCard?.id);
        if (!selectedCard) {
            console.error("Attempted to save card, but no card is selected.");
            return;
        }
        try {
            const savedCard = await updateCardAxios(selectedCard.id, updatedCardData);
            console.log('Card saved successfully:', savedCard);

            setColumns(currentColumns => {
                // Create a new array of columns
                return currentColumns.map(column => {
                    // If this is the column containing the saved card
                    if (column.id === savedCard.columnId) {
                        // Create a new column object
                        return {
                            ...column,
                            // Create a new cards array with the updated card
                            cards: column.cards.map(card => {
                                if (card.id === savedCard.id) {
                                    return savedCard;
                                }
                                return card;
                            })
                        };
                    }
                    // Return other columns unchanged
                    return column;
                });
            });
            closeModal();
        } catch (error) {
            console.error('Error saving card:', error);
        }
    };

    const handleDeleteCard = async () => {
        console.log('Attempting to delete card with ID:', selectedCard?.id);
         if (!selectedCard) {
             console.error("Attempted to delete card, but no card is selected.");
             return;
         }
         try {
             await deleteCardAxios(selectedCard.id);
             console.log('Card deleted successfully:', selectedCard.id);

             setColumns(currentColumns => {
                 // Create a new array of columns
                 return currentColumns.map(column => {
                     // If this is the column from which the card was deleted
                     if (column.id === selectedCard.columnId) {
                         // Create a new column object
                         return {
                             ...column,
                             // Create a new cards array without the deleted card
                             cards: column.cards.filter(card => card.id !== selectedCard.id)
                         };
                     }
                     // Return other columns unchanged
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
                // Correctly update state by creating a new array
                setColumns(currentColumns => [...currentColumns, newColumn]);
            } catch (error) {
                console.error('Error creating column:', error);
            }
        } else {
            console.log('Column creation cancelled or name was empty.');
        }
    };

    const handleAddCard = async (columnId) => {
        console.log('handleAddCard triggered for column:', columnId);
        const cardTitle = prompt("Enter card title:");
        console.log('Card title entered:', cardTitle);
        const cardDescription = prompt("Enter card description (optional):");
        console.log('Card description entered:', cardDescription);

        if (cardTitle && cardTitle.trim()) {
             console.log('Card title is valid, preparing data...');
            try {
                 const newCardData = {
                     title: cardTitle.trim(),
                     description: cardDescription ? cardDescription.trim() : '',
                     columnId: columnId,
                 };
                 console.log('Prepared card data:', newCardData);

                 console.log('Attempting to create card via API...');
                 const createdCard = await createCardAxios(newCardData);
                 console.log('API call to create card finished.');

                 console.log('Card created successfully:', createdCard);

                 setColumns(currentColumns => {
                     console.log('Updating columns state with new card...');
                      // Create a new array of columns
                      const updatedColumns = currentColumns.map(column => {
                          // If this is the column where the new card was added
                          if (column.id === columnId) {
                               // Create a new column object
                               return {
                                  ...column,
                                  // Create a new cards array with the new card added
                                  cards: [...(column.cards || []), createdCard]
                              };
                          }
                          // Return other columns unchanged
                          return column;
                      });
                      console.log('State update finished.');
                      return updatedColumns;
                  });
                console.log('SetColumns triggered.');

            } catch (error) {
                console.error('Error caught during card creation:', error);
            }
        } else {
             console.log('Card creation cancelled or title was empty.');
        }
        console.log('handleAddCard function finished.');
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
                        key={column.id} // Ensure column.id is unique and stable
                        column={column}
                        openModal={openModal}
                        onAddCard={handleAddCard}
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