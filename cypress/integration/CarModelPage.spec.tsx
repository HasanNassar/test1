import * as React from 'react'
import {mount} from '@cypress/react'
import { format, addDays } from 'date-fns'

describe('The Car model Page', () => {
  // remove .only for all tests

    // Check car filters
    it.only('checks the car price depending on the dates', () => {
        const today = new Date()
        const dayStart = 2
        const dayDifference = 10
        const fromDate = addDays(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30, 0), dayStart)
        const toDate = addDays(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30, 0), dayStart + dayDifference)

        // Start from the cars listing page
        cy.visit('dubai/cars')
        cy.wait(1000);
    
        // Find the first car card and click it
        cy.get('[data-cy=car-card]:first').click()
        cy.wait(1000);

        // Date selection
        cy.get('[data-cy=select-dates]').click()
        cy.wait(1000);
        cy.get('[data-cy=fromDate]').click()
        cy.wait(500);      
        cy.get(`[data-cy=${format(fromDate, "MMMMdd")}]`).click()
        cy.wait(500);
        cy.get(`[data-cy=${format(toDate, "MMMMdd")}]`).click()
        cy.wait(500);
        cy.get('[data-cy=select]').click()
        cy.wait(500);
        cy.get('[data-cy=close-time-selector]').click()
        
        cy.get('[data-cy=dailyPrice]').then(($text) => {
            const dailyAmunt = $text.text()
            cy.wait(500);
            cy.get('[data-cy=totalPrice]').should(($text2) => {
                const totalAmount = $text2.text()
                expect(+totalAmount).to.eq(+dailyAmunt * dayDifference)
            })
          })
      })
  })
