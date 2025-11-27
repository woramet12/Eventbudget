import { ref } from 'vue'

// Mock Data with Colors
const initialCategories = [
  { id: 1, name: 'Food', icon: '🍔', color: '#ff9e70' },
  { id: 2, name: 'Transport', icon: '🚗', color: '#95a4fc' },
  { id: 3, name: 'Shopping', icon: '🛍️', color: '#ff8fa3' },
  { id: 4, name: 'Entertainment', icon: '🎉', color: '#c780e8' },
  { id: 5, name: 'Bills', icon: '🧾', color: '#4ade80' },
]

const categories = ref([...initialCategories])

export const useCategories = () => {
  const loadCategories = async () => {
    // In a real app, fetch from API here
    // categories.value = await fetch('/api/categories')
    if (categories.value.length === 0) {
        categories.value = [...initialCategories]
    }
  }

  const createCategory = (category) => {
    const newId = Math.max(0, ...categories.value.map(c => c.id)) + 1
    categories.value.push({ ...category, id: newId })
  }

  const updateCategory = (id, updatedCategory) => {
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value[index] = { ...updatedCategory, id }
    }
  }

  const deleteCategory = (id) => {
    categories.value = categories.value.filter(c => c.id !== id)
  }

  return {
    categories,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
}
