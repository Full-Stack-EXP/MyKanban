import React, { useState, useEffect } from 'react';
import Column from './Column';
import Card from './Card.jsx';
import './Board.css';
import CardModal from './CardModal.jsx';
import { updateCardAxios, deleteCardAxios, createColumnAxios, createCardAxios, deleteColumnAxios } from '../../api';

import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay 
} from '@dnd-kit/core';
import {
    arrayMove, 
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

const Board = () => {
    const [columns, setColumns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const [activeId, setActiveId] = useState(null);


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

    // Define sensors for drag interactions
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Start drag after 5px displacement
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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

    const handleDeleteColumn = async (columnId) => {
        console.log('Attempting to delete column with ID:', columnId);
        const isConfirmed = window.confirm("Are you sure you want to delete this column and all its cards?");
        if (!isConfirmed) {
            console.log('Column deletion cancelled by user.');
            return;
        }
        try {
            await deleteColumnAxios(columnId);
            console.log('Column deleted successfully:', columnId);
            setColumns(currentColumns => currentColumns.filter(column => column.id !== columnId));
        } catch (error) {
            console.error('Error deleting column:', error);
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
                      const updatedColumns = currentColumns.map(column => {
                          if (column.id === columnId) {
                               return {
                                  ...column,
                                  cards: [...(column.cards || []), createdCard]
                              };
                          }
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

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        setActiveId(null);

        if (!over) {
            return;
        }

        const activeId = active.id;
        const overId = over.id;

        const startColumnId = columns.find(column => column.cards.some(card => card.id === activeId))?.id;
        const endColumnId = columns.find(column => column.id === overId || column.cards.some(card => card.id === overId))?.id;

        if (!startColumnId || !endColumnId) {
            return;
        }

        const startColumn = columns.find(column => column.id === startColumnId);
        const endColumn = columns.find(column => column.id === endColumnId);

        if (!startColumn || !endColumn) {
             return;
        }

        const startCardIndex = startColumn.cards.findIndex(card => card.id === activeId);
        const endCardIndex = overId === endColumnId
            ? endColumn.cards.length
            : endColumn.cards.findIndex(card => card.id === overId);

        if (startColumnId === endColumnId) {
             const newCards = arrayMove(startColumn.cards, startCardIndex, endCardIndex);

             setColumns(currentColumns =>
                 currentColumns.map(column =>
                     column.id === startColumnId ? { ...column, cards: newCards } : column
                 )
             );
        } else { 

            setColumns(currentColumns => {
                const newColumns = currentColumns.map(column => {
                    if (column.id === startColumnId) {
                        return {
                            ...column,
                            cards: column.cards.filter(card => card.id !== activeId)
                        };
                    } else if (column.id === endColumnId) {
                        const cardToMove = startColumn.cards[startCardIndex];
                        const updatedCards = [...column.cards];
                        updatedCards.splice(endCardIndex, 0, {
                             ...cardToMove,
                             columnId: endColumnId 
                        });
                        return {
                            ...column,
                            cards: updatedCards
                        };
                    }
                    return column;
                });
                 return newColumns;
            });


             const cardToMove = startColumn.cards[startCardIndex];
             try {
                  console.log(`Card ${activeId} moved to column ${endColumnId} at index ${endCardIndex}`);
             } catch (apiError) {
                  console.error('Error updating card position via API:', apiError);
             }
        }
    };

    const activeCard = activeId ? columns.flatMap(column => column.cards).find(card => card.id === activeId) : null;


    if (isLoading) {
        return <div>Loading board...</div>;
    }

    if (error) {
        return <div>Error loading board: {error.message}</div>;
    }

    return (
        <div className="board-container">
            <h2>Kanban Board</h2>
            <DndContext
                sensors={sensors} 
                collisionDetection={closestCorners} 
                onDragStart={handleDragStart} 
                onDragEnd={handleDragEnd} 
            >
                <div className="columns-container">
                    {columns.map(column => (
                        <Column
                            key={column.id}
                            column={column}
                            openModal={openModal}
                            onAddCard={handleAddCard}
                            onDeleteColumn={handleDeleteColumn}
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

                <DragOverlay>
                    {activeId && activeCard ? (
                        <Card card={activeCard} openModal={() => {}} />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default Board;