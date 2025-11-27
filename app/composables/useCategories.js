import { ref } from 'vue'

const categories = ref([])

export const useCategories = () => {
  const loadCategories = async () => {
    try {
      const data = await $fetch('/api/categories')
      categories.value = data
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const createCategory = async (category) => {
    try {
      const newCategory = await $fetch('/api/categories', {
        method: 'POST',
        body: category
      })
      categories.value.push(newCategory)
    } catch (error) {
      console.error('Failed to create category:', error)
    }
  }

  const updateCategory = async (id, updatedCategory) => {
    try {
      const result = await $fetch('/api/categories', {
        method: 'PUT',
        body: { ...updatedCategory, id }
      })
      const index = categories.value.findIndex(c => c.id === id)
      if (index !== -1) {
        categories.value[index] = result
      }
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  const deleteCategory = async (id) => {
    try {
      await $fetch(`/api/categories?id=${id}`, {
        method: 'DELETE'
      })
      categories.value = categories.value.filter(c => c.id !== id)
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  return {
    categories,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
}
