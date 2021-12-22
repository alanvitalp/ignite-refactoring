import { Component, useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

type FoodData = {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

type DashboardProps = {
  foods: FoodData[]
  editingFood: FoodData;
  modalOpen: boolean;
  editModalOpen: boolean;
}

export default function Dashboard (props: DashboardProps) {
  const [editingFood, setEditingFood] = useState<FoodData>(props.editingFood)
  const [foods, setFoods] = useState<FoodData[]>(props.foods);
  const [modalOpen, setModalOpen] = useState<boolean>(props.modalOpen);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(props.editModalOpen);


  useEffect(() => {
    async function fetchFoods () {
      const response = await api.get<FoodData[]>('/foods');
      setFoods(response.data);
    }

    fetchFoods();
    
  }, [])

  const handleAddFood = async (food: FoodData) => {
    try {
      const response = await api.post<FoodData>('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  console.log(foods);

  const handleUpdateFood = async (food: FoodData) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: any) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food: FoodData) => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  }

  const handleEditFood = (food: FoodData) => {
    setEditingFood(food);
    setEditModalOpen(true);
  }


  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}