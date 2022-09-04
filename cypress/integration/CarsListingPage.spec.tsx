import * as React from 'react'
import {mount} from '@cypress/react'

describe('The Cars Listing Page', () => {
  // remove .only for all tests

    // Check car filters
    it.only('successfully selects Filter parameters, and the URL contains it properly', () => {
        
      cy.visit('dubai/cars')
      cy.wait(500);

      // open data
      cy.get('[data-cy=filter-button]').click()
      cy.wait(500);      

      // Filter CarType
      cy.get('[data-cy=filter-cartype-crossover]').click()
      cy.wait(500);

      // Filter CarSize
      cy.get('[data-cy=filter-carsize-4]').click()
      cy.wait(500);
      
      // Apply filters
      cy.wait(500);
      cy.get('[data-cy=apply-filter-button]').click()
     
      // Validate URL
      cy.url().should('include', `carType=crossover`) 
      cy.url().should('include', `minSeats=4`)       
    })


    // Check car link
    it('should navigate to the first Car page and check if it correct', () => {
        // Start from the cars listing page
        cy.visit('dubai/cars')
    
        // Find the first car card and click it
        cy.get('[data-cy=car-card]:first').invoke('attr', 'data-cy-id').then((elem) => {
            const carID = elem
            cy.wait(1000);
            cy.get('[data-cy=car-card]:first').click()
            cy.wait(1000);

            // The new url should include carID
            cy.url().should('include', carID)
        })
        
      })

  })

  