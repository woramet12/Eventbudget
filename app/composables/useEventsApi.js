import { ref } from 'vue'

const events = ref([])
const pending = ref(false)
let initialized = false

// ⭐️ สร้าง Default object ให้ตรงกับ DB
const defaultEvent = {
  id: 0,
  name: 'No Name',
  description: '',
  start_date: '',
  end_date: '',
  client_name: '',
  location: '',
  total_budget: null,
  venue_name: '',
  venue_url: '',
  accommodation_name: '',
  accommodation_url: '',
  drive_link: '',
}

export const useEventsApi = () => {
  
  const fetchEvents = async () => {
    if (initialized) return 
    pending.value = true
    try {
      const data = await $fetch('/api/events') 
      events.value = data.map(e => ({
        ...defaultEvent, // ⭐️ ใช้ Default object
        ...e 
      })) 
      initialized = true
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      pending.value = false
    }
  }

  // ⭐️ ฟังก์ชัน CRUD ตอนนี้จะรับ data ที่ตรงกับ DB เป๊ะๆ
  const createEvent = async (eventData) => {
    const newEvent = { 
      ...eventData, 
      id: Math.max(0, ...events.value.map(e => e.id)) + 1 
    }
    events.value.push(newEvent)
    alert('เพิ่มอีเว้นต์สำเร็จ! (จำลอง)')
    return newEvent
  }
  
  const updateEvent = async (id, eventData) => {
    const index = events.value.findIndex(e => e.id === id)
    if (index !== -1) {
      events.value[index] = { ...events.value[index], ...eventData }
      alert('อัปเดตข้อมูลสำเร็จ! (จำลอง)')
    }
  }

  const deleteEvent = async (id) => {
    events.value = events.value.filter(e => e.id !== id)
    alert('ลบข้อมูลสำเร็จ! (จำลอง)')
  }

  const getEventById = (id) => {
    const event = events.value.find(e => e.id === Number(id))
    return ref(event ? { ...defaultEvent, ...event } : null)
  }

  return {
    events, pending, fetchEvents, createEvent,
    updateEvent, deleteEvent, getEventById,
  }
}