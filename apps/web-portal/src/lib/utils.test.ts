import { describe, it, expect } from 'vitest'
import { cn, formatDate } from './utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge classes and handle tailwind overrides', () => {
      expect(cn('p-4 text-center', 'p-8')).toBe('text-center p-8')
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
    })

    it('should handle conditional classes', () => {
      expect(cn('base-class', true && 'truthy-class', false && 'falsy-class')).toBe('base-class truthy-class')
    })

    it('should handle arrays and objects', () => {
      expect(cn(['class1', 'class2'])).toBe('class1 class2')
      expect(cn({ 'class1': true, 'class2': false })).toBe('class1')
    })
  })

  describe('formatDate', () => {
    it('should format a timestamp correctly', () => {
      const timestamp = new Date(2023, 0, 15).getTime()
      expect(formatDate(timestamp)).toBe('January 15, 2023')
    })

    it('should format a date string correctly', () => {
      // Creating an ISO string for a specific date in UTC
      const dateString = '2023-12-25T12:00:00.000Z'
      // Depending on the local timezone, this could fall on Dec 25 or possibly Dec 24/26.
      // So we can check if it contains the month and year, or we can use local date string.
      // Using a local date string representation ensures it evaluates exactly to the date we created.
      const localString = new Date(2023, 11, 25).toString()
      expect(formatDate(localString)).toBe('December 25, 2023')
    })
  })
})
