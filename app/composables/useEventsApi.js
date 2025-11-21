// app/composables/useEventsApi.js
import { ref } from 'vue'

const events = ref([])
const pending = ref(false)
let initialized = false

const defaultEvent = {
  id: 0,
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  client_name: '',
  location: '',
  total_budget: 0,
  venue_name: '',
  venue_url: '',
  accommodation_name: '',
  accommodation_url: '',
  drive_link: '',
}

export const useEventsApi = () => {
  
  // 1. ดึงข้อมูล (GET) จาก DB จริง
  const fetchEvents = async () => {
    if (initialized) return 
    pending.value = true
    try {
      const data = await $fetch('/api/events') 
      events.value = data.map(e => ({
        ...defaultEvent,
        ...e 
      })) 
      initialized = true
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      pending.value = false
    }
  }

  // 2. สร้างข้อมูล (POST) ลง DB จริง
  const createEvent = async (eventData) => {
    pending.value = true
    try {
      const newEvent = await $fetch('/api/events', {
        method: 'POST',
        body: eventData
      })
      
      events.value.unshift({ ...defaultEvent, ...newEvent })
      alert('บันทึกข้อมูลสำเร็จ!')
      
    } catch (error) {
      console.error('Create error:', error)
      alert('เกิดข้อผิดพลาดในการบันทึก')
    } finally {
      pending.value = false
    }
  }
  
  // 3. แก้ไขข้อมูล (PUT) ลง DB จริง
  const updateEvent = async (id, eventData) => {
    pending.value = true
    try {
      // ส่งข้อมูลไปอัปเดตที่ Server
      const updated = await $fetch('/api/events', {
        method: 'PUT',
        body: { id, ...eventData }
      })

      // อัปเดตหน้าจอ
      const index = events.value.findIndex(e => e.id === id)
      if (index !== -1) {
        events.value[index] = { ...events.value[index], ...updated }
      }
      alert('อัปเดตข้อมูลสำเร็จ!')

    } catch (error) {
      console.error('Update error:', error)
      alert('เกิดข้อผิดพลาดในการแก้ไข')
    } finally {
      pending.value = false
    }
  }

  // 4. ลบข้อมูล (DELETE) ออกจาก DB จริง
  const deleteEvent = async (id) => {
    pending.value = true
    try {
      // ส่งคำสั่งลบไปที่ Server
      await $fetch('/api/events', {
        method: 'DELETE',
        query: { id }
      })

      // ลบออกจากหน้าจอ
      events.value = events.value.filter(e => e.id !== id)
      alert('ลบข้อมูลสำเร็จ!')

    } catch (error) {
      console.error('Delete error:', error)
      alert('เกิดข้อผิดพลาดในการลบ')
    } finally {
      pending.value = false
    }
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