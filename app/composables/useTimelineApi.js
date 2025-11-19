import { ref, computed } from 'vue'

// Mock Data
const days = ref([
  {
    id: 1,
    event_id: 1,
    date: '2024-10-26',
    title: 'Day 1: Opening & Keynotes',
    items: [
      { id: 101, start_time: '09:30', end_time: '10:30', title: 'Opening Ceremony', description: 'กล่าวเปิดงาน', location: 'Main Hall', icon: '🎤' },
      { id: 102, start_time: '08:30', end_time: '09:30', title: 'Registration', description: 'ลงทะเบียน', location: 'Lobby', icon: '📝' },
    ]
  }
])

export const useTimelineApi = () => {
  
  // Helper function: เรียงลำดับ Item ตามเวลา
  const sortItems = (items) => {
    return items.sort((a, b) => a.start_time.localeCompare(b.start_time))
  }

  // 1. ดึงข้อมูล (Computed) พร้อมเรียงลำดับเสมอ
  const getTimelineByEventId = (eventId) => {
    return computed(() => {
      const filteredDays = days.value
        .filter(d => d.event_id === Number(eventId))
        .sort((a, b) => new Date(a.date) - new Date(b.date)) // เรียงวัน
      
      // เรียงกิจกรรมในแต่ละวันด้วย
      filteredDays.forEach(day => {
        if (day.items) sortItems(day.items)
      })
      
      return filteredDays
    })
  }

  const addDay = (dayData) => {
    const newId = Math.max(0, ...days.value.map(d => d.id)) + 1
    days.value.push({ ...dayData, id: newId, items: [] })
  }

  const deleteDay = (dayId) => {
    days.value = days.value.filter(d => d.id !== dayId)
  }

  const addItem = (dayId, itemData) => {
    const dayIndex = days.value.findIndex(d => d.id === dayId)
    if (dayIndex !== -1) {
      const newId = Math.floor(Math.random() * 100000)
      days.value[dayIndex].items.push({ ...itemData, id: newId })
      // เรียงเวลาทันทีที่เพิ่ม
      sortItems(days.value[dayIndex].items)
    }
  }

  const updateItem = (dayId, updatedItem) => {
    const day = days.value.find(d => d.id === dayId)
    if (day) {
      const idx = day.items.findIndex(i => i.id === updatedItem.id)
      if (idx !== -1) {
        day.items[idx] = updatedItem
        // ⭐️ เรียงเวลาใหม่ทันทีที่แก้ไข (เผื่อแก้เวลา)
        sortItems(day.items)
      }
    }
  }

  const deleteItem = (dayId, itemId) => {
    const day = days.value.find(d => d.id === dayId)
    if (day) {
      day.items = day.items.filter(i => i.id !== itemId)
    }
  }

  return {
    days, // export ไว้เผื่อ debug แต่หลักๆ ใช้ getTimelineByEventId
    getTimelineByEventId,
    addDay,
    deleteDay,
    addItem,
    updateItem,
    deleteItem
  }
}