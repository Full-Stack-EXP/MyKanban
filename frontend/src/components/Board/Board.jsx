import React, { useState, useEffect } from 'react';
import Column from './Column';
import './Board.css';
import CardModal from '../CardModal.jsx';
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
        // --- NEW LOG: Log the ID being used for save ---
        console.log('Attempting to save card with ID:', selectedCard?.id);
        // --- END NEW LOG ---
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
        // --- NEW LOG: Log the ID being used for delete ---
        console.log('Attempting to delete card with ID:', selectedCard?.id);
        // --- END NEW LOG ---
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

    const handleAddCard = async (columnId) => {
        console.log('handleAddCard triggered for column:', columnId); // <-- LOG 1

        const cardTitle = prompt("Enter card title:");
        console.log('Card title entered:', cardTitle); // <-- LOG 2

        const cardDescription = prompt("Enter card description (optional):");
        console.log('Card description entered:', cardDescription); // <-- LOG 3


        if (cardTitle && cardTitle.trim()) {
             console.log('Card title is valid, preparing data...'); // <-- LOG 4
            try {
                 const newCardData = {
                     title: cardTitle.trim(),
                     description: cardDescription ? cardDescription.trim() : '',
                     columnId: columnId,
                 };
                 console.log('Prepared card data:', newCardData); // <-- LOG 5

                 console.log('Attempting to create card via API...'); // <-- LOG 6
                 const createdCard = await createCardAxios(newCardData); // network request is initiated
                 console.log('API call to create card finished.'); // <-- LOG 7 (appears if the API call succeeds)

                 console.log('Card created successfully:', createdCard); // <-- LOG 8 (appears after successful API call)

                 setColumns(currentColumns => {
                     console.log('Updating columns state with new card...'); // <-- LOG 9 (Before state update logic)
                     // ... state update logic ...
                      const updatedColumns = currentColumns.map(column => {
                          if (column.id === columnId) {
                               return {
                                  ...column,
                                  cards: [...(column.cards || []), createdCard]
                              };
                          }
                          return column;
                      });
                      console.log('State update finished.'); // <-- LOG 10 (after state update logic, before setColumns returns)
                      return updatedColumns; // the actual state update happens after this function returns
                  });
                console.log('SetColumns triggered.'); // <-- LOG 11 (after setColumns is called)

            } catch (error) {
                console.error('Error caught during card creation:', error); // <-- LOG (if an error is caught)
            }
        } else {
             console.log('Card creation cancelled or title was empty.'); // <-- LOG (if title was empty)
        }
        console.log('handleAddCard function finished.'); // <-- LOG 12 (at the very end)
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