/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      fontFamily: {
        // แนะนำให้ไปเพิ่ม Google Fonts (เช่น 'Inter' หรือ 'Prompt') ใน nuxt.config.ts ด้วย
        sans: ['"Inter"', '"Prompt"', 'sans-serif'],
      },
      colors: {
        'base-bg': '#F8FAFC', // Slate-50: พื้นหลังที่ดูสะอาดตากว่า
        'base-card': '#FFFFFF',
        'base-border': '#E2E8F0', // Slate-200
        'accent': {
          DEFAULT: '#F97316', // Orange-500: สีส้มที่ดูทันสมัยขึ้น (ลดความจัดจ้านลงเล็กน้อย)
          'hover': '#EA580C', // Orange-600
          'soft': '#FFF7ED',  // Orange-50
        },
        'text-primary': '#1E293B',   // Slate-800: เข้มแต่ไม่ดำสนิท
        'text-secondary': '#64748B', // Slate-500: อ่านง่ายสบายตา
        'text-tertiary': '#94A3B8',  // Slate-400
        'danger': { 
          DEFAULT: '#EF4444', 
          'hover': '#DC2626',
        },
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        'hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}